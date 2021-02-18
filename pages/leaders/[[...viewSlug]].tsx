import buildSeasonList from "utils/buildSeasonList";
import { dbApiFetcher } from "lib/api-fetcher";
import {
  getLeaderViewFromSlug,
  translateLeaderViewToSlug,
} from "utils/slugHelpers";
import { useApiConfigContext } from "context/ApiConfig";
import * as React from "react";
import { useRouter } from "next/router";
import useSWR from "swr";

import ApiConfig from "types/apiConfig";
import { GetStaticPaths, GetStaticProps } from "next";
import Leader from "types/leader";
import PlayerStats from "types/playerStats";
import Team from "types/team";

import Head from "next/head";
import { Box, Heading } from "@chakra-ui/react";
import Layout from "components/Layout";
import LeaderView from "components/LeaderView";
import SplitViewSelect from "components/SplitViewSelect";

type Props = {
  leaders: Leader[];
  teams: Team[];
};

export default function LeadersPage(props: Props) {
  const apiConfig: ApiConfig = useApiConfigContext();
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const leaderView = getLeaderView({
    apiConfig,
    viewSlug: router.query.viewSlug,
  });

  // @TODO: Include the allTime stat leader endpoint
  const {
    data: leaders,
    error: leadersError,
    isValidating: isLeadersValidating,
    mutate: mutateLeaders,
  } = useSWR(
    leaderView != null
      ? `/stats/leaders?group=hitting,pitching&season=${leaderView}`
      : null,
    dbApiFetcher,
    {
      initialData: props.leaders,
    }
  );
  const { data: teams, error: teamsError } = useSWR("/teams", dbApiFetcher, {
    initialData: props.teams,
  });

  const [selectedView, setSelectedView] = React.useState(leaderView);

  React.useEffect(() => {
    if (apiConfig !== undefined) {
      setSelectedView(leaderView);
    }
  }, [apiConfig, leaderView]);

  React.useEffect(() => {
    if (router.query.viewSlug != null) {
      // mutateLeaders();
      setIsLoading(false);
    }
  }, [router.query.viewSlug]);

  const handleSelectChange = (
    evt: React.FormEvent<HTMLSelectElement>
  ): void => {
    evt.preventDefault();
    setSelectedView(evt.currentTarget.value);

    setIsLoading(true);

    router.push(
      `/leaders/${translateLeaderViewToSlug(evt.currentTarget.value)}`
      // undefined,
      // { shallow: true }
    );
  };

  return (
    <>
      <Head>
        <title>Blaseball Leaders & Records - Blaseball-Reference.com</title>
        <meta
          property="og:title"
          content="Blaseball Leaders & Records - Blaseball-Reference.com"
          key="og:title"
        />
        <meta
          name="description"
          property="og:description"
          content="Get the latest blaseball player rankings. See who leads the league in batting average, home runs, strikeouts, and more."
        />
      </Head>
      <Layout>
        <Heading as="h1" mb={4} size="lg">
          Blaseball Stat Leaders
        </Heading>

        {leadersError || teamsError ? (
          <Box mb={4}>
            {
              "Sorry, we're currently having a siesta and are unable to provide the latest stat leader information."
            }
          </Box>
        ) : null}

        <SplitViewSelect
          handleSelectChange={handleSelectChange}
          selectedView={selectedView}
        />

        <LeaderView
          isLoading={isLoading}
          isLeadersValidating={isLeadersValidating}
          leaders={leaders}
          selectedView={selectedView}
          teams={teams}
        />
      </Layout>
    </>
  );
}

// Get the correct leader view based on the current route
function getLeaderView({
  apiConfig,
  viewSlug,
}: {
  apiConfig: ApiConfig;
  viewSlug: string | string[];
}) {
  // Once the apiConfig context has been loaded, the view should be set as:
  // - The `maxSeason` on the `/leaders` page
  // - Derived from the slug on `/leaders/:viewSlug` pages
  return apiConfig !== undefined
    ? viewSlug == undefined
      ? String(apiConfig.seasons.maxSeason)
      : getLeaderViewFromSlug(String(viewSlug))
    : null;
}

export const getStaticProps: GetStaticProps = async ({
  params,
  preview = false,
}) => {
  let apiConfig: ApiConfig | null = null;
  let leaders: PlayerStats[] | null = null;
  let teams: Team[] | null = null;

  try {
    apiConfig = await dbApiFetcher("/config");
  } catch (error) {
    console.log(error);
  }

  const leaderView = getLeaderView({
    apiConfig,
    viewSlug:
      params.viewSlug !== undefined ? String(params.viewSlug) : undefined,
  });

  try {
    leaders = await dbApiFetcher(
      `/stats/leaders?group=hitting,pitching&season=${leaderView}`
    );
  } catch (error) {
    console.log(error);
  }

  try {
    teams = await dbApiFetcher("/teams");
  } catch (error) {
    console.log(error);
  }

  return {
    props: {
      preview,
      leaders,
      teams,
    },
    revalidate: 900,
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
    paths: ["/leaders", ...viewList.map((view) => `/leaders/${view}`)] || [],
    fallback: false,
  };
};
