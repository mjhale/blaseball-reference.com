import apiFetcher from "lib/api-fetcher";
import { GetStaticProps } from "next";
import useSWR from "swr";

import Head from "next/head";
import { Box, Heading } from "@chakra-ui/react";
import Layout from "components/Layout";
import LeaderView from "components/LeaderView";

export default function LeadersPage(props) {
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

        <LeaderView categories={categories} leaders={leaders} teams={teams} />
      </Layout>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({
  params,
  preview = false,
}) => {
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
