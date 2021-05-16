import { dbApiFetcher } from "lib/api-fetcher";
import { GetStaticProps } from "next";
import useSWR from "swr";

import Player from "types/player";

import ApiUsageHelper from "components/ApiUsageHelper";
import Error from "components/Error";
import { Flex, Heading, Text } from "@chakra-ui/react";
import Head from "next/head";
import Layout from "components/Layout";
import PlayerList from "components/PlayerList";

type Props = {
  players: Player[] | null;
};

export default function PlayersPage(props: Props) {
  const { data, error } = useSWR("/players", dbApiFetcher, {
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
        {error != null ? (
          <Error />
        ) : (
          <>
            <Heading as="h1" size="lg">
              Encyclopedia of Blaseball Players
            </Heading>

            <Text>
              Search the Blaseball encyclopedia of players by the first letter
              of the player's last name.
            </Text>

            <PlayerList players={data} />

            <Flex justifyContent="center" mt={6}>
              <ApiUsageHelper
                apiCalls={[
                  `${process.env.NEXT_PUBLIC_DATABLASE_API_URL}/players`,
                ]}
              />
            </Flex>
          </>
        )}
      </Layout>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ preview = false }) => {
  let players: Player[] | null = null;

  try {
    players = await dbApiFetcher("/players");
  } catch (error) {
    console.log(error);
  }

  return {
    props: {
      players,
      preview,
    },
    revalidate: 2700,
  };
};
