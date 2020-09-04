import apiFetcher from "lib/api-fetcher";
import useSWR from "swr";

import Head from "next/head";
import { Heading, Stack } from "@chakra-ui/core";
import Layout from "components/Layout";
import StandingsTable from "components/StandingsTable";

export default function StandingsPage(props) {
  const { data: leaguesAndDivisions, leaguesAndDivisionsError } = useSWR(
    "/leaguesAndDivisions.json",
    apiFetcher,
    {
      initialData: props.leaguesAndDivisions,
    }
  );

  const { data: standings, standingsError } = useSWR(
    "/standings/standings.json",
    apiFetcher,
    {
      initialData: props.standings,
    }
  );

  const currentSeason = Object.keys(standings).sort().pop();

  return (
    <>
      <Head>
        <title>Blaseball Standings - Blaseball-Reference.com</title>
        <meta
          property="og:title"
          content="Blaseball Standings - Blaseball-Reference.com"
          key="title"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Stack spacing={4}>
          <Heading as="h1" size="lg">
            Current Standings
          </Heading>
          {standingsError || leaguesAndDivisionsError ? (
            <Box>
              Sorry, we're currently having a siesta and couldn't load team
              information.
            </Box>
          ) : (
            leaguesAndDivisions.divisions.map((division) => (
              <React.Fragment key={division.id}>
                <StandingsTable
                  division={division}
                  divisions={leaguesAndDivisions.divisions}
                  standings={standings[currentSeason][division.id]}
                />
              </React.Fragment>
            ))
          )}
        </Stack>
      </Layout>
    </>
  );
}

export async function getStaticProps({ params, preview = false }) {
  const standings = await apiFetcher("/standings/standings.json");
  const leaguesAndDivisions = await apiFetcher("/leaguesAndDivisions.json");

  return {
    props: {
      leaguesAndDivisions,
      standings,
      preview,
    },
    revalidate: 60,
  };
}
