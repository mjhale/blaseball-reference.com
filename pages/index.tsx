import { dbApiFetcher } from "lib/api-fetcher";
import * as React from "react";

import Player from "types/player";
import { GetStaticProps } from "next";

import { Box, Heading, Text } from "@chakra-ui/react";
import CommaSeparatedPlayerList from "components/CommaSeparatedPlayerList";
import Head from "next/head";
import Layout from "components/Layout";

type IndexPageProps = {
  deceasedPlayers: Player[];
  recentPlayers: Player[];
};

export default function IndexPage(props: IndexPageProps) {
  const { deceasedPlayers, recentPlayers } = props;

  return (
    <>
      <Head>
        <title>
          Blaseball Stats, Scores, History, and More - Blaseball-Reference.com
        </title>
        <meta
          property="og:title"
          content="Blaseball Stats, Scores, History, and More - Blaseball-Reference.com"
          key="og:title"
        />
        <meta
          name="description"
          property="og:description"
          content="The complete source for current and historical blaseball players,
            teams, scores, leaders, umps, blessings, and curses."
        />
      </Head>
      <Layout>
        <Box mb={4}>
          <Heading as="h1" mb={2} size="lg">
            Blaseball Stats, Scores, and History
          </Heading>
          <Text>
            The complete* source for current and historical blaseball players,
            teams, scores, leaders, umps, blessings, and curses.
          </Text>
        </Box>
        <Box mb={4}>
          <Heading as="h2" mb={2} size="md">
            Recent Debuts
          </Heading>
          <CommaSeparatedPlayerList players={recentPlayers} />
        </Box>
        <Box mb={4}>
          <Heading as="h2" mb={2} size="md">
            In Memoriam
          </Heading>
          <CommaSeparatedPlayerList players={deceasedPlayers} />
        </Box>
      </Layout>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  let deceasedPlayers = null;
  let recentPlayers = null;

  try {
    deceasedPlayers = await dbApiFetcher(
      "/players?fields=player_id,player_name,url_slug&playerPool=deceased&order=desc&sortField=incineration_season"
    );
  } catch (error) {
    console.log(error);
  }

  try {
    recentPlayers = await dbApiFetcher(
      "/players?fields=player_id,player_name,url_slug&limit=50"
    );
  } catch (error) {
    console.log(error);
  }

  return {
    props: {
      deceasedPlayers,
      recentPlayers,
    },
  };
};
