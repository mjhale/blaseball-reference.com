import apiFetcher from "lib/api-fetcher";
import { GetStaticProps } from "next";
import Player from "interfaces/player";
import { useMemo } from "react";
import useSWR from "swr";

import { Box, Heading, Text } from "@chakra-ui/core";
import CommaSeparatedPlayerList from "components/CommaSeparatedPlayerList";
import Head from "next/head";
import Layout from "components/Layout";
import UpcomingDates from "components/UpcomingDates";

function sortPlayersByDebut(players: Player[]): Player[] {
  let playersSortedByDebut: Player[];

  playersSortedByDebut = Array.isArray(players)
    ? [...players].sort((a, b) => {
        const aDebutGame = a.debutSeason * 1000 + a.debutDay;
        const bDebutGame = b.debutSeason * 1000 + b.debutDay;

        return bDebutGame - aDebutGame;
      })
    : [];

  return playersSortedByDebut;
}

function sortPlayersByIncineration(players: Player[]): Player[] {
  let playersSortedByIncineration: Player[];

  playersSortedByIncineration = Array.isArray(players)
    ? [...players]
        .filter(
          (player) =>
            Number.isInteger(player.incineratedGameSeason) &&
            Number.isInteger(player.incineratedGameDay)
        )
        .sort((a, b) => {
          const aIncinerationGame: number =
            a.incineratedGameSeason * 1000 + a.incineratedGameDay;
          const bIncinerationGame: number =
            b.incineratedGameSeason * 1000 + b.incineratedGameDay;

          return bIncinerationGame - aIncinerationGame;
        })
    : [];

  return playersSortedByIncineration;
}

type IndexPageProps = {
  players: Player[];
  seasonStartDates: Record<string, string>;
};

export default function IndexPage(props: IndexPageProps) {
  const { data: players, error: playersError } = useSWR(
    "/players/players.json",
    undefined,
    {
      errorRetryCount: 5,
      initialData: props.players,
    }
  );

  const { data: seasonStartDates, error: seasonStartDatesError } = useSWR(
    "/seasonStartDates.json",
    undefined,
    {
      errorRetryCount: 5,
      initialData: props.seasonStartDates,
    }
  );

  const recentPlayerDebuts = useMemo(
    () => sortPlayersByDebut(players).slice(0, 15),
    [players]
  );

  const recentPlayerIncinerations = useMemo(
    () => sortPlayersByIncineration(players),
    [players]
  );

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
            Upcoming Dates
          </Heading>
          <UpcomingDates seasonStartDates={seasonStartDates} />
        </Box>
        <Box mb={4}>
          <Heading as="h2" mb={2} size="md">
            Recent Debuts
          </Heading>
          <CommaSeparatedPlayerList players={recentPlayerDebuts} />
        </Box>
        <Box mb={4}>
          <Heading as="h2" mb={2} size="md">
            In Memoriam
          </Heading>
          <CommaSeparatedPlayerList players={recentPlayerIncinerations} />
        </Box>
      </Layout>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  let players = null;
  let seasonStartDates = null;

  try {
    players = await apiFetcher("/players/players.json");
    seasonStartDates = await apiFetcher("/seasonStartDates.json");
  } catch (error) {
    console.log(error);
  }

  return {
    props: {
      players,
      seasonStartDates,
    },
    revalidate: 900,
  };
};
