import apiFetcher from "lib/api-fetcher";
import { useRouter } from "next/router";
import useSWR from "swr";

import BattingStatTable from "components/BattingStatTable";
import { Box, Heading, Text } from "@chakra-ui/core";
import ErrorPage from "next/error";
import Head from "next/head";
import Layout from "components/Layout";
import PitchingStatTable from "components/PitchingStatTable";

export default function PlayerPage(props) {
  const router = useRouter();

  const { data: player, error: playerError } = useSWR(
    `/players/${router.query.playerSlug}/details.json`,
    apiFetcher,
    {
      initialData: props.player,
    }
  );
  const { data: battingStats, error: battingStatsError } = useSWR(
    `/batting/${router.query.playerSlug}/summary.json`,
    apiFetcher,
    {
      initialData: props.battingStats,
      onErrorRetry: (error, key, option, revalidate, { retryCount }) => {
        if (error.status === 403 || error.status === 404) return;
        if (retryCount >= 10) return;
        setTimeout(() => revalidate({ retryCount: retryCount + 1 }), 5000);
      },
    }
  );
  const { data: pitchingStats, error: pitchingStatsError } = useSWR(
    `/pitching/${router.query.playerSlug}/summary.json`,
    apiFetcher,
    {
      initialData: props.pitchingStats,
      onErrorRetry: (error, key, option, revalidate, { retryCount }) => {
        if (error.status === 403 || error.status === 404) return;
        if (retryCount >= 10) return;
        setTimeout(() => revalidate({ retryCount: retryCount + 1 }), 5000);
      },
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
        <link rel="icon" href="/favicon.ico" />
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
              battingStatsError={battingStatsError}
              pitchingStats={pitchingStats}
              pitchingStatsError={pitchingStatsError}
            />
          </>
        )}
      </Layout>
    </>
  );
}

function PlayerStats({
  battingStats,
  battingStatsError,
  pitchingStats,
  pitchingStatsError,
}) {
  return (
    <>
      {pitchingStats && !pitchingStatsError ? (
        <Box my={4}>
          <Heading as="h2" size="md">
            Standard Pitching
          </Heading>
          <PitchingStatTable pitchingStats={pitchingStats} />

          {Object.keys(pitchingStats.postseasons).length > 0 && (
            <Box my={4}>
              <Heading as="h2" size="md">
                Postseason Pitching
              </Heading>
              <PitchingStatTable
                isPostseason={true}
                pitchingStats={pitchingStats}
              />
            </Box>
          )}
        </Box>
      ) : null}

      {battingStats && !battingStatsError ? (
        <Box my={4}>
          <Heading as="h2" size="md">
            Standard Batting
          </Heading>
          <BattingStatTable battingStats={battingStats} />

          {Object.keys(battingStats.postseasons).length > 0 && (
            <Box my={4}>
              <Heading as="h2" size="md">
                Postseason Batting
              </Heading>
              <BattingStatTable
                isPostseason={true}
                battingStats={battingStats}
              />
            </Box>
          )}
        </Box>
      ) : null}
    </>
  );
}

export async function getStaticProps({ params, preview = false }) {
  let battingStats;
  let pitchingStats;
  const player = await apiFetcher(`/players/${params.playerSlug}/details.json`);

  try {
    battingStats = await apiFetcher(
      `/batting/${params.playerSlug}/summary.json`
    );
  } catch {
    battingStats = null;
  }

  try {
    pitchingStats = await apiFetcher(
      `/pitching/${params.playerSlug}/summary.json`
    );
  } catch {
    pitchingStats = null;
  }

  return {
    props: {
      battingStats,
      player,
      pitchingStats,
      preview,
    },
    revalidate: 60,
  };
}

export async function getStaticPaths() {
  const players = await apiFetcher("/players/players.json");
  const paths = players.map((player) => `/players/${player.slug}`) || [];

  return {
    paths,
    fallback: false,
  };
}
