import buildSeasonList from "utils/buildSeasonList";
import { dbApiFetcher } from "lib/api-fetcher";
import renderTeamEmoji from "utils/renderTeamEmoji";
import * as React from "react";
import { useApiConfigContext } from "context/ApiConfig";
import { useColorModeValue } from "@chakra-ui/react";
import useForbiddenKnowledge from "hooks/useForbiddenKnowledge";
import useSWR from "swr";

import ApiConfig from "types/apiConfig";
import Chronicler from "types/chronicler";
import ChroniclerGame from "types/chroniclerGame";
import { GetStaticProps } from "next";
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
  schedule: Chronicler<ChroniclerGame>;
  teams: Team[];
};

export default function SchedulePage(props: Props) {
  const apiConfig: ApiConfig = useApiConfigContext();

  const [dayList, setDayList] = React.useState<number[]>([]);
  const [seasonList, setSeasonList] = React.useState<number[]>([]);
  const [selectedSeason, setSelectedSeason] = React.useState<number>(null);
  const [selectedDay, setSelectedDay] = React.useState<number>(null);

  const { data: { data: schedule } = {}, isValidating: scheduleIsValidating } =
    useSWR<Chronicler<ChroniclerGame>>(
      apiConfig != null
        ? `${process.env.NEXT_PUBLIC_CHRONICLER_API}/v1/games?season=${
            selectedSeason ?? apiConfig.seasons?.maxSeason
          }&order=asc`
        : null
    );

  const { data: teams } = useSWR<Team[]>("/teams", dbApiFetcher, {
    initialData: props.teams,
  });

  /**
   * Populate the season list with the Datablase API configuration response
   */
  React.useEffect(() => {
    setSeasonList(
      buildSeasonList({
        minSeason: apiConfig?.seasons?.minSeason,
        maxSeason: apiConfig?.seasons?.maxSeason,
      })
    );
  }, [apiConfig]);

  /**
   * Select the most recent season based on `seasonList`
   */
  React.useEffect(() => {
    if (selectedSeason === null && seasonList.length > 0) {
      setSelectedSeason(seasonList[0]);
    }
  }, [seasonList, selectedSeason]);

  /**
   * Create a list of days based on the day reported by the final game of a season
   */
  React.useEffect(() => {
    if (Array.isArray(schedule) && schedule.length > 0) {
      const finalGameDay = schedule[schedule.length - 1].data.day;

      setDayList(
        Array.from(
          {
            length: finalGameDay + 1,
          },
          (value, key) => key
        )
      );
    }
  }, [selectedSeason, schedule]);

  /**
   * Find the last active day in a season
   *
   * Because some seasons contain days with inaccurate gameComplete values, the
   * games should be searched in desc order, selecting the most recent game
   * marked as complete and using its day value.
   */
  React.useEffect(() => {
    if (schedule != null && Array.isArray(dayList) && dayList.length > 0) {
      let lastDayWithCompletedGames = 0;

      for (let i = schedule.length - 1; i > 0; i--) {
        const { data: game } = schedule[i];

        if (game.gameComplete === true) {
          lastDayWithCompletedGames = game.day;
          break;
        }
      }

      setSelectedDay(lastDayWithCompletedGames);
    }
  }, [dayList, schedule]);

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
          content="Full schedule for the current season of Blaseball, including probable pitchers and future weather."
        />
      </Head>
      <Layout>
        <Heading as="h1" mb={4} size="lg">
          League Schedule
        </Heading>
        <ScheduleSelect
          dayList={dayList}
          scheduleIsValidating={scheduleIsValidating}
          seasonList={seasonList}
          selectedDay={selectedDay}
          selectedSeason={selectedSeason}
          setSelectedDay={setSelectedDay}
          setSelectedSeason={setSelectedSeason}
        />
        <DailySchedule
          schedule={schedule}
          scheduleIsValidating={scheduleIsValidating}
          selectedDay={selectedDay}
          selectedSeason={selectedSeason}
          teams={teams}
        />
        <ForbiddenKnowledgeToggle />
      </Layout>
    </>
  );
}

type ScheduleSelectProps = {
  dayList: number[];
  scheduleIsValidating: boolean;
  seasonList: number[];
  selectedDay: number | null;
  selectedSeason: number | null;
  setSelectedDay: React.Dispatch<React.SetStateAction<number>>;
  setSelectedSeason: React.Dispatch<React.SetStateAction<number>>;
};

function ScheduleSelect(props: ScheduleSelectProps) {
  const {
    dayList,
    scheduleIsValidating,
    seasonList,
    selectedDay,
    selectedSeason,
    setSelectedDay,
    setSelectedSeason,
  } = props;

  const handleSeasonSelectChange = (
    evt: React.FormEvent<HTMLSelectElement>
  ): void => {
    evt.preventDefault();
    setSelectedSeason(Number(evt.currentTarget.value));
  };

  const handleDaySelectChange = (
    evt: React.FormEvent<HTMLSelectElement>
  ): void => {
    evt.preventDefault();
    setSelectedDay(Number(evt.currentTarget.value));
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

  if (selectedSeason === null || selectedDay === null || scheduleIsValidating) {
    return (
      <SeasonSelectLoading
        handleSeasonSelectChange={handleSeasonSelectChange}
        seasonList={seasonList}
        selectedDay={selectedDay}
        selectedSeason={selectedSeason}
      />
    );
  }

  return (
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
  );
}

function SeasonSelectLoading({
  handleSeasonSelectChange,
  seasonList,
  selectedDay,
  selectedSeason,
}: {
  handleSeasonSelectChange: (evt: React.FormEvent<HTMLSelectElement>) => void;
  seasonList: number[];
  selectedDay: number | null;
  selectedSeason: number | null;
}) {
  return (
    <Flex mb={4}>
      {seasonList.length === 0 ||
      selectedSeason === null ||
      selectedDay === null ? (
        <Select
          isDisabled={true}
          fontSize={{ base: "lg", md: "md" }}
          maxWidth="2xs"
          placeholder="Loading..."
          size="md"
        />
      ) : (
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
      )}
      <Select
        isDisabled={true}
        fontSize={{ base: "lg", md: "md" }}
        maxWidth="2xs"
        ml={{ base: 2, md: 4 }}
        placeholder="Loading..."
        size="md"
      />
      <Flex ml={2}>
        <IconButton
          aria-label="Previous Day"
          fontSize="xl"
          icon={<ArrowBackIcon />}
          isDisabled={true}
        />
        <IconButton
          aria-label="Next Day"
          fontSize="xl"
          icon={<ArrowForwardIcon />}
          isDisabled={true}
          ml={1}
        />
      </Flex>
    </Flex>
  );
}

function DailySchedule({
  schedule,
  scheduleIsValidating,
  selectedDay,
  selectedSeason,
  teams,
}: {
  schedule: ChroniclerGame[];
  scheduleIsValidating: boolean;
  selectedDay: number;
  selectedSeason: number;
  teams: Team[];
}) {
  // Get forbidden knowledge setting in order to show or hide future weather events
  const [showForbiddenKnowledge] = useForbiddenKnowledge();

  const borderColor = useColorModeValue("gray.500", "gray.600");
  const borderInteriorSeparatorColor = useColorModeValue(
    "gray.100",
    "gray.700"
  );
  const secondaryFontColor = useColorModeValue("gray.600", "gray.400");

  if (!schedule || !teams || scheduleIsValidating) {
    return (
      <>
        <Skeleton height="20px" mb={4} width="2xs" />
        <Stack>
          <Skeleton height="20px" />
          <Skeleton height="20px" />
          <Skeleton height="20px" />
        </Stack>
      </>
    );
  }

  const formattedDay = Number(selectedDay) + 1;
  const formattedSeason = Number(selectedSeason) + 1;

  const selectedDaySchedule = schedule?.filter(
    ({ data: game }) => game.day === selectedDay
  );
  const previousDaySchedule = schedule?.filter(
    ({ data: game }) => game.day === selectedDay - 1
  );
  const visibleOnSite =
    selectedDaySchedule.some(({ data: game }) => game.gameStart) ||
    (previousDaySchedule &&
      previousDaySchedule.some(({ data: game }) => game.gameStart));

  return (
    <>
      <Heading as="h2" mb={4} size="md">
        Season {formattedSeason} Day {formattedDay}
      </Heading>
      <Flex border="1px solid" borderColor={borderColor} flexDirection="column">
        {selectedDaySchedule.map(({ data: game }) => {
          const awayTeam = teams.find((team) => team.team_id === game.awayTeam);
          const homeTeam = teams.find((team) => team.team_id === game.homeTeam);

          // If teams are not populated in Datablase yet, skip rendering game
          if (awayTeam === undefined || homeTeam === undefined) {
            return null;
          }

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
                      href={`${process.env.NEXT_PUBLIC_REBLASE}/game/${game.id}`}
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
    revalidate: 14400,
  };
};
