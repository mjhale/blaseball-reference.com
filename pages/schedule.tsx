import { dbApiFetcher } from "lib/api-fetcher";
import renderTeamEmoji from "utils/renderTeamEmoji";
import * as React from "react";
import { useColorModeValue } from "@chakra-ui/react";
import useForbiddenKnowledge from "hooks/useForbiddenKnowledge";
import useSWR from "swr";

import { GetStaticProps } from "next";
import Schedule from "types/schedule";
import Team from "types/team";

import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import {
  Box,
  Circle,
  Flex,
  Heading,
  IconButton,
  Link,
  Select,
  Skeleton,
  Stack,
  Text,
  VisuallyHidden,
} from "@chakra-ui/react";
import ForbiddenKnowledgeToggle from "components/ForbiddenKnowledgeToggle";
import Head from "next/head";
import Layout from "components/Layout";
import NextLink from "next/link";
import { WeatherIcon, WeatherName } from "components/Weather";

type Props = {
  schedule: Schedule;
  teams: Team[];
};

export default function SchedulePage(props: Props) {
  const { data: schedule, error: scheduleError } = useSWR("/gameResults.json");

  const { data: teams, error: teamsError } = useSWR("/teams", dbApiFetcher, {
    initialData: props.teams,
  });

  return (
    <>
      <Head>
        <title>Blaseball Schedule - Blaseball-Reference.com</title>
        <meta
          property="og:title"
          content="Blaseball Schedule - Blaseball-Reference.com"
          key="og:title"
        />
        <meta
          name="description"
          property="og:description"
          content="Full schedule for the current season of Blaseball including probable pitchers."
        />
      </Head>
      <Layout>
        <Heading as="h1" mb={4} size="lg">
          League Schedule
        </Heading>
        <DailySchedule schedule={schedule} teams={teams} />
        <ForbiddenKnowledgeToggle />
      </Layout>
    </>
  );
}

function DailySchedule({
  schedule,
  teams,
}: {
  schedule: Schedule;
  teams: Team[];
}) {
  const sortedSeasonList = () =>
    schedule ? Object.keys(schedule).sort((a, b) => Number(a) - Number(b)) : [];
  const mostRecentSeason = () => sortedSeasonList().pop();

  // List of days in a selected season
  const [dayList, setDayList] = React.useState([]);
  // The selected day to view in the selected season
  const [selectedDay, setSelectedDay] = React.useState(null);
  // The selected season
  const [selectedSeason, setSelectedSeason] = React.useState(null);
  // A list of seasons found in the schedule
  const [seasonList, setSeasonList] = React.useState([]);

  React.useEffect(() => {
    setSeasonList(sortedSeasonList);
  }, [JSON.stringify(sortedSeasonList())]);

  React.useEffect(() => {
    setSelectedSeason(mostRecentSeason());
  }, [JSON.stringify(seasonList)]);

  React.useEffect(() => {
    setDayList([
      ...(schedule && Object.hasOwnProperty.call(schedule, selectedSeason)
        ? Object.keys(schedule[selectedSeason]).sort(
            (a, b) => Number(a) - Number(b)
          )
        : []),
    ]);
  }, [selectedSeason]);

  /**
   * Find the last day in a season
   *
   * Because some seasons contain days with inaccurate gameComplete values, we
   * must iterate through all games to find the correct day with active games.
   */
  React.useEffect(() => {
    if (Array.isArray(dayList) && dayList.length > 0) {
      let lastDayWithCompletedGames;

      for (const day of dayList) {
        for (const game of schedule[selectedSeason][day]) {
          if (game.gameComplete === true) {
            lastDayWithCompletedGames = day;
            break;
          }
        }
      }

      setSelectedDay(lastDayWithCompletedGames);
    }
  }, [JSON.stringify(dayList)]);

  // Get forbidden knowledge setting in order to show or hide future weather events
  const [showForbiddenKnowledge] = useForbiddenKnowledge();

  const handleSeasonSelectChange = (
    evt: React.FormEvent<HTMLSelectElement>
  ): void => {
    evt.preventDefault();
    setSelectedSeason(evt.currentTarget.value);
  };

  const handleDaySelectChange = (
    evt: React.FormEvent<HTMLSelectElement>
  ): void => {
    evt.preventDefault();
    setSelectedDay(evt.currentTarget.value);
  };

  const handleNextDayClick = (): void => {
    if (selectedDay + 1 <= dayList[dayList.length - 1]) {
      setSelectedDay(Number(selectedDay) + 1);
    }
  };

  const handlePreviousDayClick = (): void => {
    if (selectedDay - 1 >= dayList[0]) {
      setSelectedDay(Number(selectedDay) - 1);
    }
  };

  const borderColor = useColorModeValue("gray.500", "gray.600");
  const borderInteriorSeparatorColor = useColorModeValue(
    "gray.100",
    "gray.700"
  );
  const secondaryFontColor = useColorModeValue("gray.600", "gray.400");

  if (
    !schedule ||
    !teams ||
    !Object.hasOwnProperty.call(schedule, selectedSeason) ||
    !Object.hasOwnProperty.call(schedule[selectedSeason], selectedDay)
  ) {
    return (
      <>
        <Flex mb={4}>
          <Select
            isDisabled={true}
            fontSize={{ base: "lg", md: "md" }}
            maxWidth="2xs"
            placeholder="Loading..."
            size="md"
          />
          <Select
            isDisabled={true}
            fontSize={{ base: "lg", md: "md" }}
            maxWidth="2xs"
            ml={{ base: 2, md: 4 }}
            placeholder="Loading..."
            size="md"
          />
        </Flex>
        <Skeleton height="20px" mb={4} width="2xs" />
        <Stack>
          <Skeleton height="20px" />
          <Skeleton height="20px" />
          <Skeleton height="20px" />
        </Stack>
      </>
    );
  }

  const selectedDaySchedule = schedule[selectedSeason][selectedDay];
  const formattedDay = Number(selectedDay) + 1;
  const formattedSeason = Number(selectedSeason) + 1;

  const previousDaySchedule =
    schedule[selectedSeason][String(Number(selectedDay) - 1)];
  const visibleOnSite =
    selectedDaySchedule.some((game) => game.gameStart) ||
    (previousDaySchedule && previousDaySchedule.some((game) => game.gameStart));

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
            <option key={season} value={season}>
              {`Season ${Number(season) + 1}`}
            </option>
          ))}
        </Select>
        <Select
          fontSize={{ base: "lg", md: "md" }}
          maxWidth="2xs"
          onChange={handleDaySelectChange}
          ml={{ base: 2, md: 4 }}
          size="md"
          value={selectedDay}
        >
          {dayList.map((day) => (
            <option key={day} value={day}>
              {`Day ${Number(day) + 1}`}
            </option>
          ))}
        </Select>
        <Flex ml={2}>
          <IconButton
            aria-label="Previous Day"
            fontSize="xl"
            icon={<ArrowBackIcon />}
            isDisabled={selectedDay - 1 < dayList[0]}
            onClick={handlePreviousDayClick}
          />
          <IconButton
            aria-label="Next Day"
            fontSize="xl"
            icon={<ArrowForwardIcon />}
            isDisabled={selectedDay + 1 > dayList[dayList.length - 1]}
            ml={1}
            onClick={handleNextDayClick}
          />
        </Flex>
      </Flex>

      <Heading as="h2" mb={4} size="md">
        Season {formattedSeason} Day {formattedDay}
      </Heading>
      <Flex border="1px solid" borderColor={borderColor} flexDirection="column">
        {selectedDaySchedule.map((game) => {
          const awayTeam = teams.find((team) => team.team_id === game.awayTeam);
          const homeTeam = teams.find((team) => team.team_id === game.homeTeam);

          return (
            <Flex
              _last={{
                borderBottom: 0,
              }}
              alignItems="center"
              borderBottom="1px"
              borderBottomColor={borderInteriorSeparatorColor}
              direction={{ base: "column", lg: "row" }}
              justifyContent="space-between"
              key={game.id}
              p={4}
            >
              <Flex
                alignItems="center"
                justifyContent="space-between"
                width={{ base: "full", md: "auto" }}
              >
                <TeamBlock team={awayTeam} />
                <Box
                  color="gray.500"
                  fontSize={{ base: "sm", md: "md" }}
                  fontStyle="italic"
                  mr={{ base: 2, md: 6 }}
                >
                  @
                </Box>
                <TeamBlock team={homeTeam} />
              </Flex>
              <Box
                color={secondaryFontColor}
                fontSize="sm"
                mt={{ base: 2, lg: 0 }}
                textAlign={{ base: "center", xl: "left" }}
                width="2xs"
              >
                {game.gameStart === true ? (
                  <>
                    <NextLink
                      href={`${process.env.NEXT_PUBLIC_REBLASE_URL}/game/${game.id}`}
                      passHref
                    >
                      <Link isExternal>
                        {awayTeam.nickname} {game.awayScore},{" "}
                        {homeTeam.nickname} {game.homeScore}
                        <VisuallyHidden>view game in Reblase</VisuallyHidden>
                      </Link>
                    </NextLink>
                  </>
                ) : null}
              </Box>
              <Flex
                color={secondaryFontColor}
                display={{ base: "none", md: "flex" }}
                justifyContent="flex-start"
                flex="2 1 0%"
                flexWrap="wrap"
                fontSize="sm"
              >
                {game.awayPitcherName.length > 0 &&
                game.homePitcherName.length > 0 ? (
                  <>
                    <Box>
                      {game.awayPitcherName}
                      {game.gameComplete
                        ? game.awayScore > game.homeScore
                          ? " (W)"
                          : " (L)"
                        : null}
                    </Box>
                    <Box mx={1}>vs.</Box>
                    <Box>
                      {game.homePitcherName}
                      {game.gameComplete
                        ? game.homeScore > game.awayScore
                          ? " (W)"
                          : " (L)"
                        : null}
                    </Box>
                  </>
                ) : null}
              </Flex>

              {visibleOnSite || showForbiddenKnowledge ? (
                <Flex alignItems="center" flex="1 1 0%" mt={{ base: 2, lg: 0 }}>
                  <WeatherIcon for={game.weather} />
                  <Text
                    color={secondaryFontColor}
                    display="inline-block"
                    fontSize={{ base: "xs", md: "sm" }}
                    ml={2}
                  >
                    <WeatherName for={game.weather} />
                  </Text>
                </Flex>
              ) : null}
            </Flex>
          );
        })}
      </Flex>
    </>
  );
}

function TeamBlock({ team }: { team: Team }) {
  return (
    <Box width={{ base: 32, md: 40 }}>
      <Box display="inline-block" verticalAlign="middle">
        <Flex alignItems="center">
          <Circle
            background={team.team_main_color}
            mr={{ base: 1, md: 2 }}
            size={{ base: 6, md: 8 }}
          >
            <Text as="span" fontSize={{ base: "xs", md: "2xl" }} role="img">
              {renderTeamEmoji(team.team_emoji)}
            </Text>
          </Circle>
          <Box
            fontSize={{ base: "sm", md: "md" }}
            fontWeight="bold"
            whiteSpace="nowrap"
          >
            <NextLink href={`/teams/${team.url_slug}/schedule`} passHref>
              <Link>
                {team.nickname}
                <VisuallyHidden>season schedule</VisuallyHidden>
              </Link>
            </NextLink>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  let teams = null;

  try {
    teams = await dbApiFetcher("/teams");
  } catch (error) {
    console.log(error);
  }

  return {
    props: {
      teams,
    },
    revalidate: 9000,
  };
};
