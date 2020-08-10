import jsonData from "data/players/players.json";

import Head from "next/head";
import { Heading, Text } from "@chakra-ui/core";
import Layout from "components/Layout";
import PlayerList from "components/PlayerList";

export default function PlayersPage({ players }) {
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
        <PlayerList players={players} />
      </Layout>
    </>
  );
}

export async function getStaticProps({ params, preview = false }) {
  const data = jsonData;
  const groupedByLastName = data.reduce((accumulator, player) => {
    const lastName = player.name.split(" ").pop();
    const group = lastName[0].toLocaleLowerCase();

    if (!accumulator[group]) {
      accumulator[group] = { group, children: [player] };
    } else {
      accumulator[group].children.push(player);
    }

    return accumulator;
  }, {});

  return {
    props: {
      players: groupedByLastName,
      preview,
    },
  };
}
