import apiFetcher from "lib/api-fetcher";
import useSWR from "swr";

import Head from "next/head";
import { Heading, Stack } from "@chakra-ui/core";
import Layout from "components/Layout";
import TeamCardList from "components/TeamCardList";

export default function Teams(props) {
  const { data, error } = useSWR("/teams/teams.json", apiFetcher, {
    initialData: props.teams,
  });

  return (
    <>
      <Head>
        <title>Blaseball Teams - Blaseball-Reference.com</title>
        <meta
          property="og:title"
          content="Blaseball Teams -  Blaseball-Reference.com"
          key="title"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Stack spacing={4}>
          <Heading as="h1" size="lg">
            Active Blaseball Franchises
          </Heading>
          {error ? (
            <Box>
              Sorry, we're currently having a siesta and couldn't load team
              information.
            </Box>
          ) : (
            <TeamCardList teams={data} />
          )}
        </Stack>
      </Layout>
    </>
  );
}

export async function getStaticProps({ params, preview = false }) {
  const teams = await apiFetcher("/teams/teams.json");

  return {
    props: {
      teams: teams,
      preview,
    },
    revalidate: 60,
  };
}
