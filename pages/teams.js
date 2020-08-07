import jsonData from "data/teams.json";

import Head from "next/head";
import { Heading, Stack } from "@chakra-ui/core";
import Layout from "components/Layout";
import TeamCardList from "components/TeamCardList";

export default function Teams({ teams }) {
  return (
    <>
      <Head>
        <title>Blaseball Teams - Blaseball-Reference.com</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Stack spacing={4}>
          <Heading as="h1" size="lg">
            Active Blaseball Franchises
          </Heading>
          <TeamCardList teams={teams} />
        </Stack>
      </Layout>
    </>
  );
}

export async function getStaticProps({ params, preview = false }) {
  const data = jsonData;

  return {
    props: {
      teams: data,
      preview,
    },
  };
}
