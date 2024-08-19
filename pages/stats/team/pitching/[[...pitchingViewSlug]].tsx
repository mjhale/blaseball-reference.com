import buildSeasonList from "utils/buildSeasonList";
import { dbApiFetcher } from "lib/api-fetcher";
import {
  getSplitViewFromSlugWithApiConfig,
  translateLeaderViewToSlug,
} from "utils/slugHelpers";
import * as React from "react";
import { useRouter } from "next/router";

import ApiConfig from "types/apiConfig";
import { GetStaticPaths, GetStaticProps } from "next";
import TeamStats from "types/teamStats";

import ApiUsageHelper from "components/ApiUsageHelper";
import { Box, Flex } from "@chakra-ui/react";
import ErrorPage from "next/error";
import Head from "next/head";
import Layout from "components/Layout";
import StatsNavigation from "components/StatsNavigation";
import SplitViewSelect from "components/SplitViewSelect";
import TeamPitchingStatTable from "components/TeamPitchingStatTable";

type TeamPitchingStatsProps = {
  apiConfig: ApiConfig;
  teamStats: TeamStats[];
};

export default function TeamPitchingStats(props: TeamPitchingStatsProps) {
  const { apiConfig, teamStats } = props;
  const router = useRouter();

  const leaderView = getSplitViewFromSlugWithApiConfig({
    apiConfig,
    viewSlug: router.query.pitchingViewSlug,
  });
  const [selectedView, setSelectedView] = React.useState(leaderView);

  const handleSelectChange = (
    evt: React.FormEvent<HTMLSelectElement>
  ): void => {
    evt.preventDefault();
    setSelectedView(evt.currentTarget.value);
    router.push(
      `/stats/team/pitching/${translateLeaderViewToSlug(
        evt.currentTarget.value
      )}`
    );
  };

  if (!router.isFallback && teamStats == null) {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <>
      <Head>
        <title>Team Pitching Stats - Blaseball-Reference.com</title>
        <meta
          property="og:title"
          content={`Team Pitching Stats - Blaseball-Reference.com`}
          key="og:title"
        />
        <meta
          name="description"
          property="og:description"
          content={`Pitching stats for every team in Blaseball.`}
        />
      </Head>
      <Layout>
        <StatsNavigation group="team" statType="pitching" />

        <SplitViewSelect
          apiConfig={apiConfig}
          handleSelectChange={handleSelectChange}
          selectedView={selectedView}
        />

        <StatsTable selectedView={selectedView} teamStats={teamStats} />

        <Flex justifyContent="center" mt={6}>
          <ApiUsageHelper
            apiCalls={[
              `${process.env.NEXT_PUBLIC_DATABLASE_API}/config`,
              `${process.env.NEXT_PUBLIC_DATABLASE_API}/stats/teams?group=pitching&type=season&season=${selectedView}`,
            ]}
          />
        </Flex>
      </Layout>
    </>
  );
}

type StatsTableProps = {
  teamStats: TeamStats[];
  selectedView: string | null;
};

function StatsTable({ teamStats, selectedView }: StatsTableProps) {
  if (!teamStats) {
    return null;
  }

  const pitchingStats: TeamStats | null = teamStats
    ? teamStats.find((statGroup) => statGroup.group === "pitching")
    : null;

  return (
    <Box mb={4}>
      <TeamPitchingStatTable
        pitchingStats={pitchingStats}
        splitView={selectedView}
        statTargetName="All Teams"
      />
    </Box>
  );
}

export const getStaticProps: GetStaticProps = async ({
  params,
  preview = false,
}) => {
  let apiConfig: ApiConfig | null = null;
  let teamStats: TeamStats[] | null = null;

  try {
    apiConfig = await dbApiFetcher("/config");
  } catch (error) {
    console.log(error);
  }

  const splitView = getSplitViewFromSlugWithApiConfig({
    apiConfig,
    viewSlug:
      params.pitchingViewSlug !== undefined
        ? String(params.pitchingViewSlug)
        : undefined,
  });

  try {
    teamStats = await dbApiFetcher(
      `/stats/teams?type=season&season=${splitView}&group=pitching`
    );
  } catch (error) {
    console.log(error);
  }

  return {
    props: {
      apiConfig,
      preview,
      teamStats,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  let apiConfig: ApiConfig | null = null;

  try {
    apiConfig = await dbApiFetcher("/config");
  } catch (error) {
    console.log(error);
  }

  const minSeason =
    apiConfig != null ? apiConfig.seasons?.minSeason : undefined;
  const maxSeason =
    apiConfig != null ? apiConfig.seasons?.maxSeason : undefined;
  const seasonList = buildSeasonList({ minSeason, maxSeason });

  const viewList = seasonList
    ? seasonList.map((view) => translateLeaderViewToSlug(view))
    : [];

  return {
    paths:
      [
        "/stats/team/pitching",
        ...viewList.map((view) => `/stats/team/pitching/${view}`),
      ] || [],
    fallback: false,
  };
};
