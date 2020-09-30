import apiFetcher from "lib/api-fetcher";
import { useEffect, useState } from "react";
import useSWR from "swr";
import useForbiddenKnowledge from "hooks/useForbiddenKnowledge";

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
} from "@chakra-ui/core";
import ForbiddenKnowledgeToggle from "components/ForbiddenKnowledgeToggle";
import Head from "next/head";
import Layout from "components/Layout";
import NextLink from "next/link";
import { WeatherIcon, WeatherName } from "components/weather";

export default function SchedulePage(props) {
  const { data: schedule, error: scheduleError } = useSWR(
    "/gameResults.json",
    undefined,
    {
      errorRetryCount: 5,
    }
  );

  const { data: teams, error: teamsError } = useSWR("/teams.json", undefined, {
    errorRetryCount: 5,
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

function DailySchedule({ schedule, teams }) {
  const [dayList, setDayList] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [seasonList, setSeasonList] = useState([]);

  useEffect(() => {
    setSeasonList([
      ...(schedule
        ? Object.keys(schedule).sort((a, b) => Number(a) - Number(b))
        : []),
    ]);
  }, [schedule]);

  useEffect(() => {
    if (seasonList?.length > 0) {
      setSelectedSeason(seasonList[seasonList.length - 1]);
    }
  }, [seasonList]);

  useEffect(() => {
    setDayList([
      ...(schedule && Object.hasOwnProperty.call(schedule, selectedSeason)
        ? Object.keys(schedule[selectedSeason]).sort(
            (a, b) => Number(a) - Number(b)
          )
        : []),
    ]);
  }, [selectedSeason]);

  useEffect(() => {
    if (dayList?.length > 0) {
      let lastDayWithCompletedGames = dayList.length - 1;

      for (const day of dayList) {
        let hasActiveGames = false;

        for (const game of schedule[selectedSeason][day]) {
          if (game.gameComplete === false) {
            hasActiveGames = true;
            lastDayWithCompletedGames = day;
            break;
          }
        }

        if (hasActiveGames === true) {
          break;
        }
      }

      setSelectedDay(lastDayWithCompletedGames);
    }
  }, [dayList]);

  const [showForbiddenKnowledge] = useForbiddenKnowledge();

  const handleSeasonSelectChange = (evt) => {
    setSelectedSeason(evt.target.value);
  };

  const handleDaySelectChange = (evt) => {
    setSelectedDay(evt.target.value);
  };

  const handleNextDayClick = (evt) => {
    if (selectedDay + 1 <= dayList[dayList.length - 1]) {
      setSelectedDay(selectedDay + 1);
    }
  };

  const handlePreviousDayClick = (evt) => {
    if (selectedDay - 1 >= dayList[0]) {
      setSelectedDay(selectedDay - 1);
    }
  };

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
      <Flex border="1px solid" borderColor="gray.500" flexDirection="column">
        {selectedDaySchedule.map((game) => {
          const awayTeam = teams.find((team) => team.id === game.awayTeam);
          const homeTeam = teams.find((team) => team.id === game.homeTeam);

          return (
            <Flex
              alignItems="center"
              borderBottom="1px solid"
              borderBottomColor="gray.200"
              direction={{ base: "column", lg: "row" }}
              justifyContent="space-between"
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
                color="gray.600"
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
                        {awayTeam.shorthand} {game.awayScore},{" "}
                        {homeTeam.shorthand} {game.homeScore}
                        <VisuallyHidden>view game in Reblase</VisuallyHidden>
                      </Link>
                    </NextLink>
                  </>
                ) : null}
              </Box>
              <Flex
                color="gray.600"
                display={{ base: "none", md: "flex" }}
                justifyContent="flex-start"
                flex="2 1 0%"
                flexWrap="wrap"
                fontSize="sm"
              >
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
              </Flex>
              {visibleOnSite || showForbiddenKnowledge ? (
                <Flex alignItems="center" flex="1 1 0%" mt={{ base: 2, lg: 0 }}>
                  <WeatherIcon for={game.weather} />
                  <Text
                    color="gray.600"
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

function TeamBlock({ team }) {
  return (
    <Box width={{ base: 32, md: 40 }}>
      <Box display="inline-block" verticalAlign="middle">
        <Flex alignItems="center">
          <Circle
            background={team.mainColor}
            height={{ base: 6, md: 8 }}
            mr={{ base: 1, md: 2 }}
            width={{ base: 6, md: 8 }}
          >
            <Text as="span" fontSize={{ base: "xs", md: "2xl" }} role="emoji">
              {String.fromCodePoint(team.emoji)}
            </Text>
          </Circle>
          <Box
            fontSize={{ base: "sm", md: "md" }}
            fontWeight="bold"
            whiteSpace="nowrap"
          >
            <NextLink
              href="/teams/[teamSlug]/schedule"
              as={`/teams/${team.slug}/schedule`}
              passHref
            >
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

export async function getStaticProps() {
  let teams = null;

  try {
    teams = await apiFetcher("/teams.json");
  } catch (error) {
    console.log(error);
  }

  return {
    props: {
      teams,
    },
    revalidate: 9000,
  };
}
