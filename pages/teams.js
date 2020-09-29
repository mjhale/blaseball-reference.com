import apiFetcher from "lib/api-fetcher";
import useSWR from "swr";

import Head from "next/head";
import { Heading, Stack } from "@chakra-ui/core";
import Layout from "components/Layout";
import TeamCardList from "components/TeamCardList";

export default function Teams(props) {
  const { data, error } = useSWR("/teams.json", undefined, {
    errorRetryCount: 5,
    initialData: props.teams,
  });

  return (
    <>
      <Head>
        <title>Blaseball Teams - Blaseball-Reference.com</title>
        <meta
          property="og:title"
          content="Blaseball Teams -  Blaseball-Reference.com"
          key="og:title"
        />
        <meta
          name="description"
          property="og:description"
          content="Comprehensive scores, standings, stats, and more for every Blaseball team."
        />
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
  let teams = null;

  try {
    teams = await apiFetcher("/teams.json");
  } catch (error) {
    console.log(error);
  }

  return {
    props: {
      teams,
      preview,
    },
    revalidate: 900,
  };
}
