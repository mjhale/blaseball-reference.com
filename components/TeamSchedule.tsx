import Color from "tinycolor2";
import * as React from "react";
import renderTeamEmoji from "utils/renderTeamEmoji";
import useForbiddenKnowledge from "hooks/useForbiddenKnowledge";

import Schedule from "types/schedule";
import SeasonStartDates from "types/seasonStartDates";
import Team from "types/team";

import {
  Box,
  Circle,
  Flex,
  Heading,
  Link,
  Select,
  SimpleGrid,
  Skeleton,
  Stack,
  Square,
  Text,
  VisuallyHidden,
  useColorModeValue,
  useColorMode,
} from "@chakra-ui/react";
import ForbiddenKnowledgeToggle from "components/ForbiddenKnowledgeToggle";
import NextLink from "next/link";
import { WeatherIcon, WeatherName } from "components/Weather";

type TeamScheduleProps = {
  schedule: Schedule;
  seasonStartDates: SeasonStartDates;
  team: Team;
  teams: Team[];
};

export default function TeamSchedule({
  schedule,
  seasonStartDates,
  team,
  teams,
}: TeamScheduleProps) {
  const [selectedSeason, setSelectedSeason] = React.useState(null);
  const [seasonList, setSeasonList] = React.useState([]);
  const [
    showForbiddenKnowledge,
    setShowForbiddenKnowledge,
  ] = useForbiddenKnowledge();

  const handleSeasonSelectChange = (
    evt: React.FormEvent<HTMLSelectElement>
  ): void => {
    evt.preventDefault();
    setSelectedSeason(evt.currentTarget.value);
  };

  React.useEffect(() => {
    setSeasonList([
      ...(schedule
        ? Object.keys(schedule).sort((a, b) => Number(a) - Number(b))
        : []),
    ]);
  }, [team.team_id]);

  React.useEffect(() => {
    if (seasonList?.length > 0) {
      setSelectedSeason(seasonList[seasonList.length - 1]);
    }
  }, [JSON.stringify(seasonList)]);

  // Group games into daily buckets (e.g., Aug. 1, games 1-12; Aug. 2, games 13-36; ...))
  const selectedSeasonScheduleByDate = React.useMemo(() => {
    if (selectedSeason === null || !seasonStartDates) {
      return;
    }

    const seasonStartDate = new Date(`${seasonStartDates[selectedSeason]} UTC`);
    const gamesByDay = [];

    let previousGameHasStarted = false;
    const currGameDate = seasonStartDate;
    for (const day in schedule[selectedSeason]) {
      // Get real world day and hour for current game day
      const currDay = currGameDate.getDate();
      const currHour = currGameDate.getHours();

      // Find real world day bucket if it exists
      const currDayGames = gamesByDay.find(
        (dayGames) => dayGames.day === currDay
      );

      const currHourGames = schedule[selectedSeason][day].map((game) => {
        const visibleOnSite = previousGameHasStarted || game.gameStart;
        previousGameHasStarted = !!game.gameStart;

        return {
          ...game,
          visibleOnSite,
        };
      });

      if (!currDayGames) {
        gamesByDay.push({
          day: currDay,
          startingDate: new Date(currGameDate),
          gamesByHour: {
            [currHour]: currHourGames,
          },
        });
      } else {
        currDayGames.gamesByHour = {
          ...currDayGames.gamesByHour,
          [currHour]: currHourGames,
        };
      }

      // At the end of the regular season, assign future postseason games into real world's next date
      // - Also preset the start of the postseason time
      if (Number(day) + 1 === 99) {
        currGameDate.setDate(currDay + 1);
        currGameDate.setUTCHours(13);
        continue;
      }

      // Increment real world hour by one
      // - Increments the day by one if the hour exceeds 24
      currGameDate.setHours(currHour + 1);
    }

    return gamesByDay;
  }, [team.team_id, JSON.stringify(seasonStartDates), selectedSeason]);

  // Loading skeleton
  if (!selectedSeason || !selectedSeasonScheduleByDate) {
    return (
      <>
        <Select
          fontSize={{ base: "lg", md: "md" }}
          isDisabled={true}
          maxWidth="2xs"
          mb={4}
          placeholder="Loading..."
          size="md"
        />
        <Stack>
          <Skeleton height="20px" />
          <Skeleton height="20px" />
          <Skeleton height="20px" />
        </Stack>
      </>
    );
  }

  return (
    <>
      <Flex mb={4}>
        <Select
          fontSize={{ base: "lg", md: "md" }}
          maxWidth="2xs"
          onChange={handleSeasonSelectChange}
          size="md"
          value={selectedSeason}
        >
          {seasonList.map((season) => (
            <option key={season} value={season}>{`Season ${
              Number(season) + 1
            }`}</option>
          ))}
        </Select>
      </Flex>
      <TeamDailySchedule
        dailySchedule={selectedSeasonScheduleByDate}
        showForbiddenKnowledge={showForbiddenKnowledge}
        team={team}
        teams={teams}
      />
      <TeamDailyScheduleKey team={team} />
      <ForbiddenKnowledgeToggle />
    </>
  );
}

function TeamDailySchedule({
  dailySchedule,
  showForbiddenKnowledge,
  team,
  teams,
}: {
  dailySchedule: any;
  showForbiddenKnowledge: boolean;
  team: Team;
  teams: Team[];
}) {
  const homeGameBackgroundColor =
    Color(team.team_main_color).getLuminance() < 0.9
      ? team.team_main_color
      : team.team_secondary_color;
  const hasDarkHomeGameBackgroundColor = Color(
    homeGameBackgroundColor
  ).isDark();
  const colorMode = useColorMode().colorMode;
  let homeGameFontColor = null;
  if (hasDarkHomeGameBackgroundColor) {
    homeGameFontColor = "white";
  } else if (colorMode === "dark") {
    homeGameFontColor = "gray.900";
  }

  return (
    <>
      {dailySchedule.map((day) => (
        <Box
          key={[day.startingDate.toString(), team.team_id].toString()}
          mb={4}
        >
          <Heading as="h2" mb={4} size="md">
            {day.startingDate.toLocaleString(undefined, {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </Heading>
          <SimpleGrid
            backgroundColor="black"
            borderRight="1px solid"
            borderBottom="1px solid"
            borderColor="black"
            columns={{ base: 3, md: 6 }}
          >
            {Object.keys(day.gamesByHour)
              .sort((a, b) => Number(a) - Number(b))
              .map((hour) => {
                const dayStartingTime = new Date(day.startingDate);
                dayStartingTime.setHours(Number(hour));

                if (
                  Array.isArray(day.gamesByHour[hour]) &&
                  day.gamesByHour[hour].length === 0
                ) {
                  return null;
                }

                // Use first game to determine day cell's background and game day
                const isHomeDay =
                  day.gamesByHour[hour][0].homeTeam === team.team_id;
                const currGameDay = day.gamesByHour[hour][0].day;

                return (
                  <Box
                    backgroundColor="white"
                    borderLeft="1px solid"
                    borderTop="1px solid"
                    borderColor="black"
                    key={currGameDay}
                  >
                    <Box
                      background={
                        isHomeDay ? homeGameBackgroundColor : useColorModeValue("gray.50", "gray.700")
                      }
                      color={isHomeDay ? homeGameFontColor : null}
                      height="full"
                      minHeight={{ base: "auto", md: 40 }}
                      padding={{ base: 2, md: 4 }}
                    >
                      <Flex mb={2} fontSize="sm" justifyContent="space-between">
                        <Box>{Number(currGameDay) + 1}</Box>

                        <Box>
                          {dayStartingTime.toLocaleString(undefined, {
                            hour: "numeric",
                            hour12: true,
                          })}
                        </Box>
                      </Flex>
                      {day.gamesByHour[hour].map((game) => {
                        const isHomeTeam = game.homeTeam === team.team_id;
                        const isWinningTeam = isHomeTeam
                          ? game.homeScore > game.awayScore
                          : game.awayScore > game.homeScore;
                        const opposingTeam = teams.find(
                          (team) =>
                            team.team_id ===
                            (isHomeTeam ? game.awayTeam : game.homeTeam)
                        );

                        return (
                          <Flex
                            alignItems="center"
                            direction="column"
                            justifyContent="center"
                            key={game.id}
                          >
                            <Circle
                              background={opposingTeam.team_main_color}
                              border="1px solid"
                              borderColor="gray.500"
                              mb={2}
                              size={{ base: 6, md: 12 }}
                            >
                              <Text
                                as="span"
                                fontSize={{ base: "sm", md: "2xl" }}
                                role="img"
                              >
                                {renderTeamEmoji(opposingTeam.team_emoji)}
                              </Text>
                            </Circle>
                            <Box
                              fontSize="sm"
                              fontWeight="bold"
                              textAlign="center"
                            >
                              {game.homeTeam === team.team_id ? (
                                <>
                                  vs.{" "}
                                  <NextLink
                                    href={`/teams/${opposingTeam.url_slug}/schedule`}
                                    passHref
                                  >
                                    <Link>
                                      {opposingTeam.nickname}{" "}
                                      <VisuallyHidden>
                                        team schedule
                                      </VisuallyHidden>
                                    </Link>
                                  </NextLink>
                                </>
                              ) : (
                                <>
                                  @{" "}
                                  <NextLink
                                    href={`/teams/${opposingTeam.url_slug}/schedule`}
                                    passHref
                                  >
                                    <Link>
                                      {opposingTeam.nickname}{" "}
                                      <VisuallyHidden>
                                        team schedule
                                      </VisuallyHidden>
                                    </Link>
                                  </NextLink>
                                </>
                              )}
                            </Box>
                            {game.gameComplete ? (
                              <Box fontSize="sm" textAlign="center">
                                <Text as="span" fontWeight="bold">
                                  {isWinningTeam ? "W" : "L"},{" "}
                                </Text>
                                <NextLink
                                  href={`${process.env.NEXT_PUBLIC_REBLASE_URL}/game/${game.id}`}
                                  passHref
                                >
                                  <Link isExternal>
                                    {game.awayScore} - {game.homeScore}
                                    <VisuallyHidden>
                                      view game in Reblase
                                    </VisuallyHidden>
                                  </Link>
                                </NextLink>
                              </Box>
                            ) : null}
                            {game.visibleOnSite || showForbiddenKnowledge ? (
                              <Flex
                                alignItems="center"
                                fontSize={{ base: "xs", md: "sm" }}
                                mt={{ base: 2, md: 3 }}
                              >
                                <WeatherIcon for={game.weather} />
                                <Box ml={1}>
                                  <WeatherName for={game.weather} />
                                </Box>
                              </Flex>
                            ) : null}
                          </Flex>
                        );
                      })}
                    </Box>
                  </Box>
                );
              })}
          </SimpleGrid>
        </Box>
      ))}
    </>
  );
}

function TeamDailyScheduleKey({ team }: { team: Team }) {
  const homeGameBackgroundColor =
    Color(team.team_main_color).getLuminance() < 0.9
      ? team.team_main_color
      : team.team_secondary_color;
  const formattedUserTimezone = Intl.DateTimeFormat(undefined, {
    timeZoneName: "short",
  })
    .formatToParts(new Date())
    .find((part) => part.type == "timeZoneName").value;

  return (
    <Flex
      alignItems={{ base: "center", md: "normal" }}
      direction={{ base: "column", md: "row" }}
      fontSize="sm"
      justifyContent={{ base: "normal", md: "space-between" }}
    >
      <Box mb={{ base: 2, md: 0 }}>
        All times {formattedUserTimezone}. Subject to change.
      </Box>
      <Flex direction="row">
        <Flex direction="row" mr={2}>
          <Square
            background={homeGameBackgroundColor}
            border="1px solid"
            borderColor="gray.700"
            mr={1}
            size={6}
          />
          <Box>- Home</Box>
        </Flex>
        <Flex direction="row">
          <Square
            background="gray.50"
            border="1px solid"
            borderColor="gray.700"
            mr={1}
            size={6}
          />
          <Box>- Away</Box>
        </Flex>
      </Flex>
    </Flex>
  );
}
