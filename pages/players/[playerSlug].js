import fs from "fs";
import path from "path";
import players from "data/players/players.json";
import { useRouter } from "next/router";

import BattingStatTable from "components/BattingStatTable";
import { Box, Heading, Text } from "@chakra-ui/core";
import ErrorPage from "next/error";
import Head from "next/head";
import Layout from "components/Layout";
import PitchingStatTable from "components/PitchingStatTable";

export default function PlayerPage({ player, positionStats }) {
  const router = useRouter();

  if (!router.isFallback && !player?.slug) {
    return <ErrorPage statusCode={404} />;
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
        <Heading as="h1" size="lg">
          {player.name}
        </Heading>

        <Box fontSize="sm" mt={2} mb={4}>
          {player.aliases.length > 0 && (
            <Text my={1}>
              Aliases:{" "}
              {player.aliases.map((alias, index) => (
                <React.Fragment key={index}>
                  {alias}
                  {index < player.aliases.length - 1 && ", "}
                </React.Fragment>
              ))}
            </Text>
          )}

          <Text my={1}>Team: {player.currentTeamName}</Text>

          {(player.position === "rotation" ||
            player.position === "bullpen") && (
            <Text my={1}>Position: Pitcher</Text>
          )}

          {(player.position === "lineup" || player.position === "bench") && (
            <Text my={1}>Position: Fielder</Text>
          )}

          <Text my={1}>
            Debut: Season {Number(player.debutSeason) + 1}, Day{" "}
            {player.debutDay + 1}*
          </Text>
          {player.isIncinerated && (
            <Text my={1}>
              Last Game: Season {Number(player.lastGameSeason) + 1}, Day{" "}
              {player.lastGameDay + 1}
            </Text>
          )}
        </Box>

        {(player.position === "rotation" || player.position === "bullpen") && (
          <Box my={4}>
            <Heading as="h2" size="md">
              Standard Pitching
            </Heading>
            <PitchingStatTable pitchingStats={positionStats} />

            {Object.keys(positionStats.postseasons).length > 0 && (
              <Box my={4}>
                <Heading as="h2" size="md">
                  Postseason Pitching
                </Heading>
                <PitchingStatTable
                  isPostseason={true}
                  pitchingStats={positionStats}
                />
              </Box>
            )}
          </Box>
        )}

        {(player.position === "lineup" || player.position === "bench") && (
          <Box my={4}>
            <Heading as="h2" size="md">
              Standard Batting
            </Heading>
            <BattingStatTable battingStats={positionStats} />

            {Object.keys(positionStats.postseasons).length > 0 && (
              <Box my={4}>
                <Heading as="h2" size="md">
                  Postseason Batting
                </Heading>
                <BattingStatTable
                  isPostseason={true}
                  battingStats={positionStats}
                />
              </Box>
            )}
          </Box>
        )}

        <Box my={4}>
          <Text color="gray.500" fontSize="xs">
            * Based on incomplete or earliest recorded data
          </Text>
        </Box>
      </Layout>
    </>
  );
}

export async function getStaticProps({ params, preview = false }) {
  const player = players.find((player) => player.slug === params.playerSlug);
  const playerPositionGroup = ["rotation", "bullpen"].includes(player.position)
    ? "pitching"
    : "batting";
  const playerPositionStatsFolder = path.join(
    process.cwd(),
    "data",
    playerPositionGroup,
    params.playerSlug
  );
  let positionStats = JSON.parse(
    fs.readFileSync(`${playerPositionStatsFolder}/summary.json`, "utf8")
  );

  return {
    props: {
      player,
      positionStats,
      preview,
    },
  };
}

export async function getStaticPaths() {
  const paths = players.map((player) => `/players/${player.slug}`) || [];

  return {
    paths,
    fallback: false,
  };
}
