import apiFetcher from "lib/api-fetcher";
import { useRouter } from "next/router";
import useSWR from "swr";

import BattingStatTable from "components/BattingStatTable";
import {
  Box,
  Heading,
  Flex,
  Link,
  Skeleton,
  Stack,
  Text,
} from "@chakra-ui/core";
import Head from "next/head";
import Layout from "components/Layout";
import NextLink from "next/link";
import PitchingStatTable from "components/PitchingStatTable";

export default function PlayerPage(props) {
  const router = useRouter();

  const { data: player, error: playerError } = useSWR(
    `/players/${router.query.playerSlug}/details.json`,
    undefined,
    {
      errorRetryCount: 5,
      initialData: props.player,
    }
  );
  const { data: battingStats, error: battingStatsError } = useSWR(
    `/batting/${router.query.playerSlug}/summary.json`,
    undefined,
    {
      errorRetryCount: 0,
      initialData: props.battingStats,
      revalidateOnFocus: false,
    }
  );
  const { data: pitchingStats, error: pitchingStatsError } = useSWR(
    `/pitching/${router.query.playerSlug}/summary.json`,
    undefined,
    {
      errorRetryCount: 0,
      initialData: props.pitchingStats,
      revalidateOnFocus: false,
    }
  );
  const { data: teams, error: teamsError } = useSWR(`/teams.json`, undefined, {
    errorRetryCount: 5,
    initialData: props.teams,
    revalidateOnFocus: false,
  });

  return (
    <>
      <Head>
        <title>
          {player ? player.name : "Player"} Stats - Blaseball-Reference.com
        </title>
        <meta
          property="og:title"
          content={`${
            player ? player.name : "Player"
          } Stats - Blaseball-Reference.com`}
          key="og:title"
        />
        <meta
          name="description"
          property="og:description"
          content={`${
            player ? player.name : "Player"
          } history and position statistics in Blaseball.`}
        />
      </Head>
      <Layout>
        {(router.isFallback && !player) || !teams ? (
          <>
            <Skeleton height="40px" mb={4} width="2xs" />
            <Stack>
              <Skeleton height="20px" />
              <Skeleton height="20px" />
              <Skeleton height="20px" />
            </Stack>
          </>
        ) : (
          <PlayerDetails
            battingStats={battingStats}
            pitchingStats={pitchingStats}
            player={player}
            teams={teams}
          />
        )}
      </Layout>
    </>
  );
}

function PlayerDetails({ battingStats, pitchingStats, player, teams }) {
  const currentTeam = teams.find((team) => team.id === player.currentTeamId);

  return (
    <>
      <Heading as="h1" size="lg">
        {player.name}
        {player.isIncinerated ? (
          <>
            {" "}
            <Text ariaLabel="incinerated" as="span" fontSize="xl" role="emoji">
              🔥
            </Text>
          </>
        ) : null}
      </Heading>

      <Box fontSize="sm" mt={2} mb={4}>
        {player.aliases.length > 0 ? (
          <Text my={1}>
            Aliases:{" "}
            {player.aliases.map((alias, index) => (
              <React.Fragment key={index}>
                {alias}
                {index < player.aliases.length - 1 && ", "}
              </React.Fragment>
            ))}
          </Text>
        ) : null}

        {currentTeam ? (
          <Text my={1}>
            Team:{" "}
            <NextLink
              href="/teams/[teamSlug]"
              as={`/teams/${currentTeam.slug}`}
              passHref
            >
              <Link textDecoration="underline">{currentTeam.fullName}</Link>
            </NextLink>
          </Text>
        ) : null}

        {player.position === "rotation" || player.position === "bullpen" ? (
          <Text my={1}>Position: Pitcher</Text>
        ) : (
          <Text my={1}>Position: Fielder</Text>
        )}

        <Text my={1}>
          Debut: Season {Number(player.debutSeason) + 1}, Day{" "}
          {player.debutDay + 1}
          {Number(player.debutSeason) + 1 === 2 ? "*" : null}
        </Text>
        {player.isIncinerated ? (
          <Text my={1}>
            Last Game: Season {Number(player.lastGameSeason) + 1}, Day{" "}
            {player.lastGameDay + 1}
          </Text>
        ) : null}

        {player.bat ? <Text my={1}>Bat: {player.bat}</Text> : null}

        {player.ritual ? <Text my={1}>Ritual: {player.ritual}</Text> : null}
      </Box>
      <Heading as="h2" mb={2} size="md">
        Player Pages
      </Heading>
      <Flex mb={2}>
        <NextLink
          href={`${process.env.NEXT_PUBLIC_BLASEBALL_WIKI_URL}/${player.id}`}
          passHref
        >
          <Link fontSize="md" isExternal textDecoration="underline">
            Blaseball Wiki
          </Link>
        </NextLink>
      </Flex>
      <PlayerStats
        battingStats={battingStats}
        pitchingStats={pitchingStats}
        player={player}
        teams={teams}
      />
    </>
  );
}

function PlayerStats({ battingStats, pitchingStats, player, teams }) {
  if (!battingStats && !pitchingStats) {
    return null;
  }

  return (
    <>
      {pitchingStats ? (
        <Box my={4}>
          <PitchingStatTable
            pitchingStats={pitchingStats}
            statTargetName={player.name}
            teams={teams}
          />

          {Object.keys(pitchingStats.postseasons).length > 0 && (
            <Box my={4}>
              <PitchingStatTable
                isPostseason={true}
                pitchingStats={pitchingStats}
                statTargetName={player.name}
                teams={teams}
              />
            </Box>
          )}
        </Box>
      ) : null}

      {battingStats ? (
        <Box my={4}>
          <BattingStatTable
            battingStats={battingStats}
            statTargetName={player.name}
            teams={teams}
          />

          {Object.keys(battingStats.postseasons).length > 0 && (
            <Box my={4}>
              <BattingStatTable
                battingStats={battingStats}
                isPostseason={true}
                statTargetName={player.name}
                teams={teams}
              />
            </Box>
          )}
        </Box>
      ) : null}
    </>
  );
}

export async function getStaticProps({ params, preview = false }) {
  let battingStats = null;
  let pitchingStats = null;
  let player = null;
  let teams = null;

  try {
    player = await apiFetcher(`/players/${params.playerSlug}/details.json`);
    teams = await apiFetcher("/teams.json");
  } catch (error) {
    console.log(error);
  }

  try {
    battingStats = await apiFetcher(
      `/batting/${params.playerSlug}/summary.json`
    );
    pitchingStats = await apiFetcher(
      `/pitching/${params.playerSlug}/summary.json`
    );
  } catch (_error) {
    /**
     * Some players will never have batting or pitching stats available, so
     * any fetch errors should be ignored for the timebeing
     */
  }

  return {
    props: {
      battingStats,
      player,
      pitchingStats,
      preview,
      teams,
    },
    revalidate: 900,
  };
}

export async function getStaticPaths() {
  let players;

  try {
    players = await apiFetcher("/players/players.json");
  } catch (error) {
    console.log(error);
  }

  return {
    paths: players.map((player) => `/players/${player.slug}`) || [],
    fallback: true,
  };
}
