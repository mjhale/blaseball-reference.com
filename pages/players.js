import apiFetcher from "lib/api-fetcher";
import useSWR from "swr";

import Head from "next/head";
import { Box, Heading, Text } from "@chakra-ui/core";
import Layout from "components/Layout";
import PlayerList from "components/PlayerList";

export default function PlayersPage(props) {
  const { data, error } = useSWR("/players/players.json", undefined, {
    errorRetryCount: 5,
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
          key="og:title"
        />
        <meta
          name="description"
          property="og:description"
          content="A list of all current and historical blaseball players in alphabetical order."
        />
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
  let players = null;

  try {
    players = await apiFetcher("/players/players.json");
  } catch (error) {
    console.log(error);
  }

  return {
    props: {
      players: players,
      preview,
    },
    revalidate: 900,
  };
}
