import buildSeasonList from "utils/buildSeasonList";
import { dbApiFetcher } from "lib/api-fetcher";
import {
  getSplitViewFromSlugWithApiConfig,
  translateLeaderViewToSlug,
} from "utils/slugHelpers";
import { useApiConfigContext } from "context/ApiConfig";
import * as React from "react";
import { useRouter } from "next/router";
import useSWR from "swr";

import ApiConfig from "types/apiConfig";
import { GetStaticPaths, GetStaticProps } from "next";
import TeamStats from "types/teamStats";

import ApiUsageHelper from "components/ApiUsageHelper";
import { Box, Flex, Skeleton, Stack } from "@chakra-ui/react";
import ErrorPage from "next/error";
import Head from "next/head";
import Layout from "components/Layout";
import StatsNavigation from "components/StatsNavigation";
import SplitViewSelect from "components/SplitViewSelect";
import TeamBattingStatTable from "components/TeamBattingStatTable";

type TeamHittingStatsProps = {
  teamStats: TeamStats[];
};

export default function TeamHittingStats(props: TeamHittingStatsProps) {
  const apiConfig: ApiConfig = useApiConfigContext();
  const [, setIsLoading] = React.useState(false);
  const router = useRouter();

  const leaderView = getSplitViewFromSlugWithApiConfig({
    apiConfig,
    viewSlug: router.query.hittingViewSlug,
  });
  const [selectedView, setSelectedView] = React.useState(leaderView);

  const {
    data: teamStats,
    error: teamStatsError,
    isValidating: teamStatsIsValidating,
  } = useSWR(
    () =>
      selectedView != null
        ? `/stats/teams?group=hitting&type=season&season=${selectedView}`
        : null,
    dbApiFetcher,
    {
      fallbackData: props.teamStats,
    }
  );

  React.useEffect(() => {
    if (apiConfig !== undefined) {
      setSelectedView(leaderView);
    }
  }, [apiConfig, leaderView]);

  React.useEffect(() => {
    if (router.query.hittingViewSlug != null) {
      setIsLoading(false);
    }
  }, [router.query.hittingViewSlug]);

  const handleSelectChange = (
    evt: React.FormEvent<HTMLSelectElement>
  ): void => {
    evt.preventDefault();
    setSelectedView(evt.currentTarget.value);
    setIsLoading(true);

    router.push(
      `/stats/team/${translateLeaderViewToSlug(evt.currentTarget.value)}`
    );
  };

  if (!router.isFallback && teamStats == null && !teamStatsIsValidating) {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <>
      <Head>
        <title>Team Hitting Stats - Blaseball-Reference.com</title>
        <meta
          property="og:title"
          content={`Team Hitting Stats - Blaseball-Reference.com`}
          key="og:title"
        />
        <meta
          name="description"
          property="og:description"
          content={`Hitting stats for every team in Blaseball.`}
        />
      </Head>
      <Layout>
        {teamStatsError ? (
          <Box>
            Sorry, we're currently having a siesta and are unable to provide you
            the requested data.
          </Box>
        ) : (
          <>
            <StatsNavigation group="team" statType="hitting" />

            <SplitViewSelect
              handleSelectChange={handleSelectChange}
              selectedView={selectedView}
            />

            <StatsTable
              teamStats={teamStats}
              teamStatsIsValidating={teamStatsIsValidating}
              selectedView={selectedView}
            />

            <Flex justifyContent="center" mt={6}>
              <ApiUsageHelper
                apiCalls={[
                  `${process.env.NEXT_PUBLIC_DATABLASE_API}/config`,
                  `${process.env.NEXT_PUBLIC_DATABLASE_API}/stats/teams?group=hitting&type=season&season=${selectedView}`,
                ]}
              />
            </Flex>
          </>
        )}
      </Layout>
    </>
  );
}

type StatsTableProps = {
  teamStats: TeamStats[];
  teamStatsIsValidating: boolean;
  selectedView: string | null;
};

function StatsTable({
  teamStats,
  teamStatsIsValidating,
  selectedView,
}: StatsTableProps) {
  if (!teamStats && !teamStatsIsValidating) {
    return null;
  }

  if (teamStatsIsValidating) {
    return (
      <Stack>
        <Skeleton height="20px" />
        <Skeleton height="20px" />
        <Skeleton height="20px" />
      </Stack>
    );
  }

  const hittingStats: TeamStats | null = teamStats
    ? teamStats.find((statGroup) => statGroup.group === "hitting")
    : null;

  return (
    <Box mb={4}>
      <TeamBattingStatTable
        battingStats={hittingStats}
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
      params.hittingViewSlug !== undefined
        ? String(params.hittingViewSlug)
        : undefined,
  });

  try {
    teamStats = await dbApiFetcher(
      `/stats/teams?type=season&season=${splitView}&group=hitting`
    );
  } catch (error) {
    console.log(error);
  }

  return {
    props: {
      preview,
      teamStats,
    },
    revalidate: 2700,
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
      ["/stats/team", ...viewList.map((view) => `/stats/team/${view}`)] || [],
    fallback: false,
  };
};
