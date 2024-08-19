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
import { LeaderGroup } from "types/leader";
import PlayerStats from "types/playerStats";
import Team from "types/team";

import ApiUsageHelper from "components/ApiUsageHelper";
import { Flex, Heading } from "@chakra-ui/react";
import Head from "next/head";
import Layout from "components/Layout";
import LeaderView from "components/LeaderView";
import SplitViewSelect from "components/SplitViewSelect";

type Props = {
  apiConfig: ApiConfig;
  leaders: LeaderGroup[];
  teams: Team[];
};

export default function LeadersPage(props: Props) {
  const { apiConfig, leaders, teams } = props;
  const router = useRouter();

  const leaderView = getSplitViewFromSlugWithApiConfig({
    apiConfig,
    viewSlug: router.query.viewSlug,
  });
  const [selectedView, setSelectedView] = React.useState(leaderView);

  const handleSelectChange = (
    evt: React.FormEvent<HTMLSelectElement>
  ): void => {
    evt.preventDefault();
    setSelectedView(evt.currentTarget.value);
    router.push(
      `/leaders/${translateLeaderViewToSlug(evt.currentTarget.value)}`
    );
  };

  return (
    <>
      <Head>
        <title>
          {`${
            isNaN(parseFloat(leaderView))
              ? "Career Blaseball Leaders & Records"
              : `Blaseball Leaders & Records for Season ${Number(leaderView) + 1}`
          } - Blaseball-Reference.com`}
        </title>
        <meta
          property="og:title"
          content={`${
            isNaN(parseFloat(leaderView))
              ? "Career Blaseball Leaders & Records"
              : `Blaseball Leaders & Records for Season ${Number(leaderView) + 1}`
          } - Blaseball-Reference.com`}
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

        <SplitViewSelect
          apiConfig={apiConfig}
          extraSelectOptions={[{ key: "career", content: "Career" }]}
          handleSelectChange={handleSelectChange}
          selectedView={selectedView}
        />

        <LeaderView
          apiConfig={apiConfig}
          leaders={leaders}
          selectedView={selectedView}
          teams={teams}
        />

        <Flex justifyContent="center" mt={6}>
          <ApiUsageHelper
            apiCalls={[
              `${process.env.NEXT_PUBLIC_DATABLASE_API}/config`,
              `${process.env.NEXT_PUBLIC_DATABLASE_API}/teams`,
              leaderView === "career"
                ? `${process.env.NEXT_PUBLIC_DATABLASE_API}/stats/leaders?group=hitting,pitching&type=career`
                : `${process.env.NEXT_PUBLIC_DATABLASE_API}/stats/leaders?group=hitting,pitching&season=${leaderView}`,
            ]}
          />
        </Flex>
      </Layout>
    </>
  );
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

  const leaderView = getSplitViewFromSlugWithApiConfig({
    apiConfig,
    viewSlug:
      params.viewSlug !== undefined ? String(params.viewSlug) : undefined,
  });

  try {
    if (leaderView === "career") {
      leaders = await dbApiFetcher(
        `/stats/leaders?group=hitting,pitching&type=career`
      );
    } else {
      leaders = await dbApiFetcher(
        `/stats/leaders?group=hitting,pitching&season=${leaderView}`
      );
    }
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
      apiConfig,
      preview,
      leaders,
      teams,
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
        "/leaders",
        "/leaders/career",
        ...viewList.map((view) => `/leaders/${view}`),
      ] || [],
    fallback: false,
  };
};
