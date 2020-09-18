import apiFetcher from "lib/api-fetcher";
import { useRouter } from "next/router";
import useSWR from "swr";

import BattingStatTable from "components/BattingStatTable";
import { Box, Heading, Select, Text } from "@chakra-ui/core";
import ErrorPage from "next/error";
import Head from "next/head";
import Layout from "components/Layout";
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

  if (!router.isFallback && !props.player) {
    return <ErrorPage statusCode={404} />;
  }

  if (playerError) {
    return (
      <Box>
        Sorry, we're currently having a siesta and couldn't load player
        information.
      </Box>
    );
  }

  return (
    <>
      <Head>
        <title>{player.name} Stats - Blaseball-Reference.com</title>
        <meta
          property="og:title"
          content={`${player.name} Stats - Blaseball-Reference.com`}
          key="title"
        />
      </Head>
      <Layout>
        {!player ? (
          <Box>Loading...</Box>
        ) : (
          <>
            <Heading as="h1" size="lg">
              {player.name}{" "}
              {player.isIncinerated ? (
                <Text
                  ariaLabel="incinerated"
                  as="span"
                  fontSize="xl"
                  role="emoji"
                >
                  🔥
                </Text>
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

              <Text my={1}>Team: {player.currentTeamName}</Text>

              {player.position === "rotation" ||
              player.position === "bullpen" ? (
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

              {player.ritual ? (
                <Text my={1}>Ritual: {player.ritual}</Text>
              ) : null}
            </Box>
            <PlayerStats
              battingStats={battingStats}
              pitchingStats={pitchingStats}
              player={player}
            />
          </>
        )}
      </Layout>
    </>
  );
}

function PlayerStats({ battingStats, pitchingStats, player }) {
  if (!battingStats && !pitchingStats) {
    return null;
  }

  return (
    <>
      <Heading as="h2" mb={4} size="md">
        Player Stats
      </Heading>

      {pitchingStats ? (
        <Box my={4}>
          <Heading as="h3" size="md">
            Standard Pitching
          </Heading>
          <PitchingStatTable
            pitchingStats={pitchingStats}
            statTargetName={player.name}
          />

          {Object.keys(pitchingStats.postseasons).length > 0 && (
            <Box my={4}>
              <Heading as="h3" size="md">
                Postseason Pitching
              </Heading>
              <PitchingStatTable
                isPostseason={true}
                pitchingStats={pitchingStats}
                statTargetName={player.name}
              />
            </Box>
          )}
        </Box>
      ) : null}

      {battingStats ? (
        <Box my={4}>
          <Heading as="h3" size="md">
            Standard Batting
          </Heading>
          <BattingStatTable
            battingStats={battingStats}
            statTargetName={player.name}
          />

          {Object.keys(battingStats.postseasons).length > 0 && (
            <Box my={4}>
              <Heading as="h3" size="md">
                Postseason Batting
              </Heading>
              <BattingStatTable
                battingStats={battingStats}
                isPostseason={true}
                statTargetName={player.name}
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

  try {
    player = await apiFetcher(`/players/${params.playerSlug}/details.json`);
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
    },
    revalidate: 180,
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
    fallback: false,
  };
}
