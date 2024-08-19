import apiFetcher, { dbApiFetcher } from "lib/api-fetcher";
import buildSeasonList from "utils/buildSeasonList";
import * as React from "react";
import { useRouter } from "next/router";
import {
  getSplitViewFromSlugWithApiConfig,
  translateLeaderViewToSlug,
} from "utils/slugHelpers";

import ApiConfig from "types/apiConfig";
import Chronicler from "types/chronicler";
import ChroniclerGame from "types/chroniclerGame";
import { GetStaticPaths, GetStaticProps } from "next";
import Team from "types/team";

import ErrorPage from "next/error";
import Head from "next/head";
import { Heading } from "@chakra-ui/react";
import Layout from "components/Layout";
import TeamDetails from "components/TeamDetails";
import TeamSchedule from "components/TeamSchedule";
import SeasonStartDates from "types/seasonStartDates";
import SplitViewSelect from "components/SplitViewSelect";

type Props = {
  apiConfig: ApiConfig;
  schedule: ChroniclerGame[];
  seasonStartDates: SeasonStartDates;
  team: Team;
  teams: Team[];
};

export default function TeamSchedulePage(props: Props) {
  const { apiConfig, schedule, seasonStartDates, team, teams } = props;
  const router = useRouter();

  const splitView = getSplitViewFromSlugWithApiConfig({
    apiConfig,
    viewSlug: router.query.viewSlug,
  });
  const [selectedView, setSelectedView] = React.useState(splitView);

  const handleSelectChange = (
    evt: React.FormEvent<HTMLSelectElement>
  ): void => {
    evt.preventDefault();
    setSelectedView(evt.currentTarget.value);
    router.push(
      `/teams/${router.query.teamSlug}/schedule/${translateLeaderViewToSlug(
        evt.currentTarget.value
      )}`
    );
  };

  if (!team) {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <>
      <Head>
        <title>
          {isNaN(parseFloat(splitView))
            ? `${team.full_name} Schedule - Blaseball-Reference.com`
            : `${team.full_name} Schedule for Season ${Number(splitView) + 1} - Blaseball-Reference.com`}
        </title>
        <meta
          property="og:title"
          content={
            isNaN(parseFloat(splitView))
              ? `${team.full_name} Schedule - Blaseball-Reference.com`
              : `${team.full_name} Schedule for Season ${Number(splitView) + 1} - Blaseball-Reference.com`
          }
          key="og:title"
        />
        <meta
          name="description"
          property="og:description"
          content={`View ${team.full_name}'s complete game schedule for current and past Blaseball season.`}
        />
      </Head>
      <Layout>
        <TeamDetails team={team} />
        <Heading as="h2" mb={4} size="md">
          Season Schedule
        </Heading>
        <SplitViewSelect
          apiConfig={apiConfig}
          handleSelectChange={handleSelectChange}
          selectedView={selectedView}
        />
        <TeamSchedule
          schedule={schedule}
          seasonStartDates={seasonStartDates}
          selectedSeason={
            splitView != null ? Number(splitView) : apiConfig.seasons.maxSeason
          }
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
  let apiConfig: ApiConfig | null = null;
  let maxSeason: number;
  let schedule: Chronicler<ChroniclerGame[]> | null = null;
  let seasonStartDates: SeasonStartDates | null = null;
  let team: Team | null = null;
  let teams: Team[] | null = null;

  try {
    apiConfig = await dbApiFetcher("/config");
    maxSeason = apiConfig.seasons?.maxSeason;
  } catch (error) {
    console.log(error);
  }

  const splitView = getSplitViewFromSlugWithApiConfig({
    apiConfig,
    viewSlug: params.viewSlug,
  });

  try {
    [seasonStartDates, team, teams] = await Promise.all([
      apiFetcher("/seasonStartDates.json"),
      dbApiFetcher(`/teams/${params.teamSlug}`),
      dbApiFetcher("/teams"),
    ]);
  } catch (error) {
    console.log(error);
  }

  try {
    if (team?.team_id != null && maxSeason != null) {
      schedule = await fetch(
        `${process.env.NEXT_PUBLIC_CHRONICLER_API}/v1/games?season=${
          splitView != null ? splitView : maxSeason
        }&team=${team.team_id}&order=asc`
      )
        .then((r) => r.json())
        .then((data) => data.data);
    }
  } catch (error) {
    console.log(error);
  }

  return {
    props: {
      apiConfig,
      preview,
      schedule,
      seasonStartDates,
      team,
      teams,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  let apiConfig: ApiConfig | null = null;
  let teams: Team[];

  try {
    apiConfig = await dbApiFetcher("/config");
  } catch (error) {
    console.log(error);
  }

  try {
    teams = await dbApiFetcher("/teams");
  } catch (error) {
    console.log(error);
    throw error;
  }

  const minSeason =
    apiConfig != null ? apiConfig.seasons?.minSeason : undefined;
  const maxSeason =
    apiConfig != null ? apiConfig.seasons?.maxSeason : undefined;
  const seasonList = buildSeasonList({ minSeason, maxSeason });

  const viewList = seasonList
    ? seasonList.map((view) => translateLeaderViewToSlug(view))
    : [];

  const teamBaseSchedulePaths = teams.map((team) => ({
    params: { teamSlug: team.url_slug, viewSlug: undefined },
  }));

  const teamViewSchedulePaths = teams
    .map((team) =>
      viewList.map((view) => ({
        params: { teamSlug: team.url_slug, viewSlug: [view] },
      }))
    )
    .flat();

  return {
    paths: [...teamBaseSchedulePaths, ...teamViewSchedulePaths] || [],
    fallback: false,
  };
};
