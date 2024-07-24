import apiFetcher, { dbApiFetcher } from "lib/api-fetcher";
import buildSeasonList from "utils/buildSeasonList";
import * as React from "react";
import { useApiConfigContext } from "context/ApiConfig";
import { useRouter } from "next/router";
import useSWR from "swr";

import ApiConfig from "types/apiConfig";
import Chronicler from "types/chronicler";
import ChroniclerGame from "types/chroniclerGame";
import { GetStaticPaths, GetStaticProps } from "next";
import Team from "types/team";

import ErrorPage from "next/error";
import Head from "next/head";
import { Heading, Flex, Select } from "@chakra-ui/react";
import Layout from "components/Layout";
import TeamDetails from "components/TeamDetails";
import TeamSchedule from "components/TeamSchedule";
import SeasonStartDates from "types/seasonStartDates";

type Props = {
  schedule: Chronicler<ChroniclerGame>;
  seasonStartDates: SeasonStartDates;
  team: Team;
  teams: Team[];
};

export default function TeamSchedulePage(props: Props) {
  const apiConfig: ApiConfig = useApiConfigContext();
  const router = useRouter();

  const [seasonList, setSeasonList] = React.useState<number[]>([]);
  const [selectedSeason, setSelectedSeason] = React.useState<number>(null);

  const { seasonStartDates, team, teams } = props;

  const { data: { data: schedule } = {}, isValidating: scheduleIsValidating } =
    useSWR<Chronicler<ChroniclerGame>>(
      () =>
        apiConfig?.seasons?.maxSeason != null && team?.team_id != null
          ? `${process.env.NEXT_PUBLIC_CHRONICLER_API}/v1/games?season=${
              selectedSeason ?? apiConfig.seasons.maxSeason
            }&team=${team.team_id}&order=asc`
          : null,
      undefined
    );

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

  if (!router.isFallback && !team) {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <>
      <Head>
        <title>{team.full_name} Schedule - Blaseball-Reference.com</title>
        <meta
          property="og:title"
          content={`${team.full_name} Schedule - Blaseball-Reference.com`}
          key="og:title"
        />
        <meta
          name="description"
          property="og:description"
          content={`The full ${team.full_name} game schedule for current and past Blaseball season.`}
        />
      </Head>
      <Layout>
        <TeamDetails team={team} />
        <Heading as="h2" mb={4} size="md">
          Season Schedule
        </Heading>
        <SeasonSelect
          scheduleIsValidating={scheduleIsValidating}
          seasonList={seasonList}
          selectedSeason={selectedSeason}
          setSelectedSeason={setSelectedSeason}
        />
        <TeamSchedule
          schedule={schedule}
          scheduleIsValidating={scheduleIsValidating}
          seasonStartDates={seasonStartDates}
          selectedSeason={selectedSeason}
          team={team}
          teams={teams}
        />
      </Layout>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({
  params,
  preview = false,
}) => {
  let seasonStartDates: SeasonStartDates;
  let team: Team;
  let teams: Team[];

  try {
    seasonStartDates = await apiFetcher("/seasonStartDates.json");
    team = await dbApiFetcher(`/teams/${params.teamSlug}`);
    teams = await dbApiFetcher("/teams");
  } catch (error) {
    console.log(error);
    throw error;
  }

  return {
    props: {
      preview,
      seasonStartDates,
      team,
      teams,
    },
    revalidate: 1800,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  let teams: Team[];

  try {
    teams = await dbApiFetcher("/teams");
  } catch (error) {
    console.log(error);
    throw error;
  }

  return {
    paths: teams.map((team) => `/teams/${team.url_slug}/schedule`) || [],
    fallback: false,
  };
};

type SeasonSelectProps = {
  scheduleIsValidating: boolean;
  seasonList: number[];
  selectedSeason: number;
  setSelectedSeason: React.Dispatch<React.SetStateAction<number>>;
};

function SeasonSelect(props: SeasonSelectProps) {
  const { seasonList, selectedSeason, setSelectedSeason } = props;

  const handleSeasonSelectChange = (
    evt: React.FormEvent<HTMLSelectElement>
  ): void => {
    evt.preventDefault();
    setSelectedSeason(Number(evt.currentTarget.value));
  };

  if (selectedSeason === null || seasonList == null) {
    return <SeasonSelectLoading />;
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
    </Flex>
  );
}

function SeasonSelectLoading() {
  return (
    <Flex mb={4}>
      <Select
        isDisabled={true}
        fontSize={{ base: "lg", md: "md" }}
        maxWidth="2xs"
        placeholder="Loading..."
        size="md"
      />
    </Flex>
  );
}
