import apiFetcher from "lib/api-fetcher";
import {
  getSlugFromLeaderView,
  translateLeaderViewToSlug,
} from "utils/slugHelpers";
import { GetStaticPaths, GetStaticProps } from "next";
import Leader from "types/leader";
import LeaderCategory from "types/leaderCategory";
import Team from "types/team";
import { useRouter } from "next/router";
import useSWR from "swr";

import Head from "next/head";
import { Box, Heading } from "@chakra-ui/react";
import Layout from "components/Layout";
import LeaderView from "components/LeaderView";

type Props = {
  categories: LeaderCategory[];
  leaders: Leader[];
  teams: Team[];
};

export default function LeadersPage(props: Props) {
  const router = useRouter();

  const { data: categories, error: categoriesError } = useSWR(
    "/leaders/categories.json",
    undefined,
    {
      initialData: props.categories,
    }
  );
  const { data: leaders, error: leadersError } = useSWR(
    "/leaders/leaders.json",
    undefined,
    {
      initialData: props.leaders,
    }
  );
  const { data: teams, error: teamsError } = useSWR("/teams.json", undefined, {
    initialData: props.teams,
  });

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

        {categoriesError || leadersError || teamsError ? (
          <Box mb={4}>
            Sorry, we're currently having a siesta and are unable to provide the
            latest stat leader information.
          </Box>
        ) : null}

        <LeaderView
          categories={categories}
          leaders={leaders}
          teams={teams}
          view={getSlugFromLeaderView(String(router.query.viewSlug))}
        />
      </Layout>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ preview = false }) => {
  let categories = null;
  let leaders = null;
  let teams = null;

  try {
    categories = await apiFetcher("/leaders/categories.json");
  } catch (error) {
    console.log(error);
  }

  try {
    leaders = await apiFetcher("/leaders/leaders.json");
  } catch (error) {
    console.log(error);
  }

  try {
    teams = await apiFetcher("/teams.json");
  } catch (error) {
    console.log(error);
  }

  return {
    props: {
      categories,
      preview,
      leaders,
      teams,
    },
    revalidate: 900,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  let leaders = null;

  try {
    leaders = await apiFetcher("/leaders/leaders.json");
  } catch (error) {
    console.log(error);
  }

  const viewList = leaders
    ? Object.keys(leaders).map((view) => translateLeaderViewToSlug(view))
    : [];

  return {
    paths: viewList.map((view) => `/leaders/${view}`) || [],
    fallback: false,
  };
};
