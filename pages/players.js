import apiFetcher from "lib/api-fetcher";
import useSWR from "swr";

import Head from "next/head";
import { Box, Heading, Text } from "@chakra-ui/core";
import Layout from "components/Layout";
import PlayerList from "components/PlayerList";

export default function PlayersPage(props) {
  const { data, error } = useSWR("/players/players.json", apiFetcher, {
    initialData: props.players,
  });

  return (
    <>
      <Head>
        <title>
          Blaseball Encyclopedia of Players - Blaseball-Reference.com
        </title>
        <meta
          property="og:title"
          content="Blaseball Encyclopedia of Players - Blaseball-Reference.com"
          key="title"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Heading as="h1" size="lg">
          Encyclopedia of Blaseball Players
        </Heading>
        <Text>
          Search the Blaseball encyclopedia of players by the first letter of
          the player's last name.
        </Text>
        {error ? (
          <Box>
            Sorry, we're currently having a siesta and couldn't load player
            information.
          </Box>
        ) : (
          <PlayerList players={data} />
        )}
      </Layout>
    </>
  );
}

export async function getStaticProps({ params, preview = false }) {
  const players = await apiFetcher("/players/players.json");

  return {
    props: {
      players: players,
      preview,
    },
    revalidate: 60,
  };
}
