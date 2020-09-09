import apiFetcher from "lib/api-fetcher";
import Color from "tinycolor2";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";

import {
  Box,
  Circle,
  Flex,
  Heading,
  Select,
  SimpleGrid,
  Skeleton,
  Stack,
  Square,
  Text,
} from "@chakra-ui/core";
import ErrorPage from "next/error";
import Head from "next/head";
import Layout from "components/Layout";

export default function TeamSchedulePage(props) {
  const router = useRouter();

  const { data: schedule, error: scheduleError } = useSWR(
    `/teams/${router.query.teamSlug}/schedule.json`,
    apiFetcher,
    {
      initialData: props.schedule,
    }
  );

  const { data: seasonStartDates, error: seasonStartDatesError } = useSWR(
    "/seasonStartDates.json",
    apiFetcher,
    {
      initialData: props.seasonStartDates,
    }
  );

  const { data: team, error: teamError } = useSWR(
    `/teams/${router.query.teamSlug}/details.json`,
    apiFetcher,
    {
      initialData: props.team,
    }
  );

  const { data: teams, error: teamsError } = useSWR(`/teams.json`, apiFetcher, {
    initialData: props.teams,
  });

  if (!router.isFallback && !team) {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <>
      <Head>
        <title>{team.fullName} Schedule - Blaseball-Reference.com</title>
        <meta
          property="og:title"
          content={`${team.fullName} Schedule - Blaseball-Reference.com`}
          key="title"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Heading as="h1" mb={4} size="lg">
          {team.fullName} Schedule
        </Heading>
        <TeamSchedule
          schedule={schedule}
          seasonStartDates={seasonStartDates}
          team={team}
          teams={teams}
        />
      </Layout>
    </>
  );
}

function TeamSchedule({ schedule, seasonStartDates, team, teams }) {
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [seasonList, setSeasonList] = useState([]);

  const handleSeasonSelectChange = (evt) => {
    setSelectedSeason(evt.target.value);
  };

  useEffect(() => {
    setSeasonList([
      ...(schedule
        ? Object.keys(schedule).sort((a, b) => Number(a) - Number(b))
        : []),
    ]);
  }, [team.teamName]);

  useEffect(() => {
    if (seasonList?.length > 0) {
      setSelectedSeason(seasonList[seasonList.length - 1]);
    }
  }, [seasonList]);

  const selectedSeasonScheduleByDate = useMemo(() => {
    if (selectedSeason === null || !seasonStartDates) {
      return;
    }

    const seasonStartDate = new Date(`${seasonStartDates[selectedSeason]} UTC`);
    const gamesByDay = [];

    let currGameDate = seasonStartDate;
    for (const day in schedule[selectedSeason]) {
      const currDay = currGameDate.getDate();
      const currHour = currGameDate.getHours();

      const currDayGames = gamesByDay.find(
        (dayGames) => dayGames.day === currDay
      );

      if (!currDayGames) {
        gamesByDay.push({
          day: currDay,
          startingDate: new Date(currGameDate),
          gamesByHour: {
            [currHour]: schedule[selectedSeason][day],
          },
        });
      } else {
        currDayGames.gamesByHour = {
          ...currDayGames.gamesByHour,
          [currHour]: schedule[selectedSeason][day],
        };
      }

      currGameDate.setHours(currHour + 1);
    }

    return gamesByDay;
  }, [team.teamName, seasonStartDates, selectedSeason]);

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
            <option key={season} value={season}>
              {`Season ${Number(season) + 1}`}
            </option>
          ))}
        </Select>
      </Flex>
      <TeamDailySchedule
        dailySchedule={selectedSeasonScheduleByDate}
        season={selectedSeason}
        team={team}
        teams={teams}
      />
      <TeamDailyScheduleKey team={team} />
    </>
  );
}

function TeamDailySchedule({ dailySchedule, team, teams }) {
  const homeGameBackgroundColor = team.mainColor;
  const hasDarkHomeGameBackgroundColor = Color(
    homeGameBackgroundColor
  ).isDark();
  const homeGameFontColor = hasDarkHomeGameBackgroundColor ? "white" : null;

  return (
    <>
      {dailySchedule.map((day) => (
        <Box key={day.startingDate.toJSON()} mb={4}>
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
                    key={dayStartingTime.toString()}
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
                                <>vs. {opposingTeam.nickname}</>
                              ) : (
                                <>@ {opposingTeam.nickname}</>
                              )}
                            </Box>
                            {game.gameComplete ? (
                              <Box fontSize="sm" textAlign="center">
                                <Text as="span" fontWeight="bold">
                                  {isWinningTeam ? "W" : "L"},{" "}
                                </Text>
                                <Text as="span">
                                  {game.awayScore} - {game.homeScore}
                                </Text>
                              </Box>
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
            background={team.mainColor}
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

export async function getStaticProps({ params, preview = false }) {
  const schedule = await apiFetcher(`/teams/${params.teamSlug}/schedule.json`);
  const seasonStartDates = await apiFetcher("/seasonStartDates.json");
  const team = await apiFetcher(`/teams/${params.teamSlug}/details.json`);
  const teams = await apiFetcher("/teams.json");

  return {
    props: {
      preview,
      schedule,
      seasonStartDates,
      team,
      teams,
    },
    revalidate: 60,
  };
}

export async function getStaticPaths() {
  const teams = await apiFetcher("/teams.json");
  const paths = teams.map((team) => `/teams/${team.slug}/schedule`) || [];

  return {
    paths,
    fallback: false,
  };
}
