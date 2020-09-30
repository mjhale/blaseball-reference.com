import Color from "tinycolor2";
import { useEffect, useMemo, useState } from "react";
import useForbiddenKnowledge from "hooks/useForbiddenKnowledge";

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
} from "@chakra-ui/core";
import ForbiddenKnowledgeToggle from "components/ForbiddenKnowledgeToggle";
import NextLink from "next/link";
import { WeatherIcon, WeatherName } from "../weather";

export default function TeamSchedule({
  schedule,
  seasonStartDates,
  team,
  teams,
}) {
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [seasonList, setSeasonList] = useState([]);
  const [
    showForbiddenKnowledge,
    setShowForbiddenKnowledge,
  ] = useForbiddenKnowledge();

  const handleSeasonSelectChange = (evt) => {
    setSelectedSeason(evt.target.value);
  };

  useEffect(() => {
    setSeasonList([
      ...(schedule
        ? Object.keys(schedule).sort((a, b) => Number(a) - Number(b))
        : []),
    ]);
  }, [team]);

  useEffect(() => {
    if (seasonList?.length > 0) {
      setSelectedSeason(seasonList[seasonList.length - 1]);
    }
  }, [seasonList]);

  // Group games into daily buckets (e.g., Aug. 1, games 1-12; Aug. 2, games 13-36; ...))
  const selectedSeasonScheduleByDate = useMemo(() => {
    if (selectedSeason === null || !seasonStartDates) {
      return;
    }

    const seasonStartDate = new Date(`${seasonStartDates[selectedSeason]} UTC`);
    const gamesByDay = [];

    let previousGameHasStarted = false;
    let currGameDate = seasonStartDate;
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
  }, [team, seasonStartDates, selectedSeason]);

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
}) {
  const homeGameBackgroundColor =
    Color(team.mainColor).getLuminance() < 0.9
      ? team.mainColor
      : team.secondaryColor;
  const hasDarkHomeGameBackgroundColor = Color(
    homeGameBackgroundColor
  ).isDark();
  const homeGameFontColor = hasDarkHomeGameBackgroundColor ? "white" : null;

  return (
    <>
      {dailySchedule.map((day) => (
        <Box key={[day.startingDate.toString(), team.id].toString()} mb={4}>
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
                const isHomeDay = day.gamesByHour[hour][0].homeTeam === team.id;
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
                        isHomeDay ? homeGameBackgroundColor : "gray.50"
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
                        const isHomeTeam = game.homeTeam === team.id;
                        const isWinningTeam = isHomeTeam
                          ? game.homeScore > game.awayScore
                          : game.awayScore > game.homeScore;
                        const opposingTeam = teams.find(
                          (team) =>
                            team.id ===
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
                              background={opposingTeam.mainColor}
                              border="1px solid"
                              borderColor="gray.500"
                              height={{ base: 6, md: 12 }}
                              mb={2}
                              width={{ base: 6, md: 12 }}
                            >
                              <Text
                                as="span"
                                fontSize={{ base: "sm", md: "2xl" }}
                                role="emoji"
                              >
                                {String.fromCodePoint(opposingTeam.emoji)}
                              </Text>
                            </Circle>
                            <Box
                              fontSize="sm"
                              fontWeight="bold"
                              textAlign="center"
                            >
                              {game.homeTeam === team.id ? (
                                <>
                                  vs.{" "}
                                  <NextLink
                                    href="/teams/[teamSlug]/schedule"
                                    as={`/teams/${opposingTeam.slug}/schedule`}
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
                                    href="/teams/[teamSlug]/schedule"
                                    as={`/teams/${opposingTeam.slug}/schedule`}
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

function TeamDailyScheduleKey({ team }) {
  const homeGameBackgroundColor =
    Color(team.mainColor).getLuminance() < 0.9
      ? team.mainColor
      : team.secondaryColor;
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
