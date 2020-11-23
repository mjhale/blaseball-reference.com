import apiFetcher from "lib/api-fetcher";
import { GetStaticProps } from "next";
import useSWR from "swr";

import Head from "next/head";
import { Box, Heading } from "@chakra-ui/react";
import Layout from "components/Layout";
import Standings from "components/Standings";

export default function StandingsPage(props) {
  const { data: leaguesAndDivisions, error: leaguesAndDivisionsError } = useSWR(
    "/leaguesAndDivisions.json",
    undefined,
    {
      initialData: props.leaguesAndDivisions,
    }
  );

  const { data: standings, error: standingsError } = useSWR(
    "/standings/standings.json",
    undefined,
    {
      initialData: props.standings,
    }
  );

  const { data: teams, error: teamsError } = useSWR("/teams.json", undefined, {
    initialData: props.teams,
  });

  return (
    <>
      <Head>
        <title>Blaseball Standings - Blaseball-Reference.com</title>
        <meta
          property="og:title"
          content="Blaseball Standings - Blaseball-Reference.com"
          key="og:title"
        />
        <meta
          name="description"
          property="og:description"
          content="Get the latest Blaseball standings from across the league. Follow your favorite team through the current season!"
        />
      </Head>
      <Layout>
        <Heading as="h1" mb={4} size="lg">
          Blaseball Standings
        </Heading>
        {standingsError || leaguesAndDivisionsError ? (
          <Box mb={4}>
            Sorry, we're currently having a siesta and couldn't load the latest
            standings.
          </Box>
        ) : null}
        <Standings
          leaguesAndDivisions={leaguesAndDivisions}
          standings={standings}
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
  let leaguesAndDivisions = null;
  let standings = null;
  let teams = null;

  try {
    leaguesAndDivisions = await apiFetcher("/leaguesAndDivisions.json");
    standings = await apiFetcher("/standings/standings.json");
    teams = await apiFetcher("/teams.json");
  } catch (error) {
    console.log(error);
  }

  return {
    props: {
      leaguesAndDivisions,
      preview,
      standings,
      teams,
    },
    revalidate: 900,
  };
};
