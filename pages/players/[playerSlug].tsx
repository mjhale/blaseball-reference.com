import { dbApiFetcher } from "lib/api-fetcher";
import { useRouter } from "next/router";

import { GetStaticPaths, GetStaticProps } from "next";
import Player from "types/player";
import PlayerStats from "types/playerStats";
import Team from "types/team";

import ApiUsageHelper from "components/ApiUsageHelper";
import { Box, Heading, Flex, Link, Text } from "@chakra-ui/react";
import Error from "components/Error";
import Head from "next/head";
import Layout from "components/Layout";
import NextLink from "next/link";
import PlayerBattingStatTable from "components/PlayerBattingStatTable";
import PlayerPitchingStatTable from "components/PlayerPitchingStatTable";

type Props = {
  careerPostseasonStats: PlayerStats[];
  careerStats: PlayerStats[];
  player: Player | null;
  postseasonStats: PlayerStats[];
  stats: PlayerStats[];
  team: Team | null;
};

export default function PlayerPage(props: Props) {
  const {
    careerPostseasonStats,
    careerStats,
    player,
    postseasonStats,
    stats,
    team,
  } = props;

  const router = useRouter();

  return (
    <>
      <Head>
        <title>
          {`${player?.player_name ?? "Player"} Stats -
          Blaseball-Reference.com`}
        </title>
        <meta
          property="og:title"
          content={`${
            player?.player_name ?? "Player"
          } Stats - Blaseball-Reference.com`}
          key="og:title"
        />
        <meta
          name="description"
          property="og:description"
          content={`${
            player?.player_name ?? "Player"
          } history and position statistics in Blaseball.`}
        />
      </Head>
      <Layout>
        {player === null ? (
          <Error />
        ) : (
          <>
            <PlayerDetails player={player} team={team} />
            <PlayerStatTables
              careerPostseasonStats={careerPostseasonStats}
              careerStats={careerStats}
              player={player}
              postseasonStats={postseasonStats}
              stats={stats}
            />

            <Flex justifyContent="center" mt={6}>
              <ApiUsageHelper
                apiCalls={[
                  `${process.env.NEXT_PUBLIC_DATABLASE_API}/config`,
                  `${process.env.NEXT_PUBLIC_DATABLASE_API}/players/${router.query.playerSlug}`,
                  `${process.env.NEXT_PUBLIC_DATABLASE_API}/stats?group=pitching,hitting&type=season&gameType=R&playerId=${player?.player_id}`,
                  `${process.env.NEXT_PUBLIC_DATABLASE_API}/stats?group=pitching,hitting&type=season&gameType=P&playerId=${player?.player_id}`,
                  `${process.env.NEXT_PUBLIC_DATABLASE_API}/stats?group=pitching,hitting&type=career&gameType=R&playerId=${player?.player_id}`,
                  `${process.env.NEXT_PUBLIC_DATABLASE_API}/stats?group=pitching,hitting&type=career&gameType=P&playerId=${player?.player_id}`,
                ]}
              />
            </Flex>
          </>
        )}
      </Layout>
    </>
  );
}

type PlayerDetailsProps = {
  player: Player;
  team: Team | null;
};

function PlayerDetails({ player, team }: PlayerDetailsProps) {
  return (
    <>
      <Heading as="h1" size="lg">
        {player.player_name}
        {player.deceased ? (
          <>
            {" "}
            {/* eslint-disable-next-line jsx-a11y/accessible-emoji */}
            <Text aria-label="incinerated" as="span" fontSize="xl" role="img">
              🔥
            </Text>
          </>
        ) : null}
      </Heading>

      <Box fontSize="sm" mt={2} mb={4}>
        {team !== null ? (
          <Text my={1}>
            Team:{" "}
            <Link
              href={`/teams/${team.url_slug}`}
              as={NextLink}
              prefetch={false}
              textDecoration="underline"
            >
              {team.full_name}
            </Link>
          </Text>
        ) : null}

        {["PITCHER", "BULLPEN"].includes(player.position_type) ? (
          <Text my={1}>Position: Pitcher</Text>
        ) : (
          <Text my={1}>Position: Fielder</Text>
        )}

        <Text my={1}>
          Debut: Season {player.debut_season + 1}, Day{" "}
          {player.debut_gameday + 1}
          {/* Add asterisk for season 2 debuts due to missing data */}
          {player.debut_season === 2 ? "*" : null}
        </Text>

        {player.incineration_season !== null &&
        player.incineration_gameday !== null ? (
          <Text my={1}>
            Last Game: Season {Number(player.incineration_season) + 1}, Day{" "}
            {player.incineration_gameday + 1}
          </Text>
        ) : null}

        {player.bat ? <Text my={1}>Bat: {player.bat}</Text> : null}

        {player.ritual ? <Text my={1}>Ritual: {player.ritual}</Text> : null}
      </Box>
      <Heading as="h2" mb={2} size="md">
        Player Pages
      </Heading>
      <Flex mb={2}>
        <Link
          href={`${process.env.NEXT_PUBLIC_BLASEBALL_WIKI}/UUID:${player.player_id}`}
          as={NextLink}
          fontSize="md"
          isExternal
          textDecoration="underline"
        >
          Blaseball Wiki
        </Link>
      </Flex>
    </>
  );
}

type PlayerStatTablesProps = {
  stats: PlayerStats[] | null;
  postseasonStats: PlayerStats[] | null;
  careerStats: PlayerStats[] | null;
  careerPostseasonStats: PlayerStats[] | null;
  player: Player;
};

function PlayerStatTables({
  careerPostseasonStats,
  careerStats,
  player,
  postseasonStats,
  stats,
}: PlayerStatTablesProps) {
  if (!stats && !postseasonStats && !careerStats && !careerPostseasonStats) {
    return null;
  }

  const battingStats: PlayerStats | null = stats
    ? stats.find((statGroup) => statGroup.group === "hitting")
    : null;
  const pitchingStats: PlayerStats | null = stats
    ? stats.find((statGroup) => statGroup.group === "pitching")
    : null;
  const postseasonBattingStats: PlayerStats | null = postseasonStats
    ? postseasonStats.find((statGroup) => statGroup.group === "hitting")
    : null;
  const postseasonPitchingStats: PlayerStats | null = postseasonStats
    ? postseasonStats.find((statGroup) => statGroup.group === "pitching")
    : null;

  const careerBattingStats: PlayerStats | null = careerStats
    ? careerStats.find((statGroup) => statGroup.group === "hitting")
    : null;
  const careerPitchingStats: PlayerStats | null = stats
    ? careerStats.find((statGroup) => statGroup.group === "pitching")
    : null;
  const careerPostseasonBattingStats: PlayerStats | null = careerPostseasonStats
    ? careerPostseasonStats.find((statGroup) => statGroup.group === "hitting")
    : null;
  const careerPostseasonPitchingStats: PlayerStats | null =
    careerPostseasonStats
      ? careerPostseasonStats.find(
          (statGroup) => statGroup.group === "pitching"
        )
      : null;

  return (
    <>
      {battingStats && battingStats.totalSplits > 0 ? (
        <Box my={4}>
          <PlayerBattingStatTable
            battingStats={battingStats}
            careerBattingStats={careerBattingStats}
            statTargetName={player.player_name}
          />
        </Box>
      ) : null}

      {pitchingStats && pitchingStats.totalSplits > 0 ? (
        <Box my={4}>
          <PlayerPitchingStatTable
            pitchingStats={pitchingStats}
            careerPitchingStats={careerPitchingStats}
            statTargetName={player.player_name}
          />
        </Box>
      ) : null}

      {postseasonBattingStats && postseasonBattingStats.totalSplits > 0 ? (
        <Box my={4}>
          <PlayerBattingStatTable
            battingStats={postseasonBattingStats}
            careerBattingStats={careerPostseasonBattingStats}
            isPostseason={true}
            statTargetName={player.player_name}
          />
        </Box>
      ) : null}

      {postseasonPitchingStats && postseasonPitchingStats.totalSplits > 0 ? (
        <Box my={4}>
          <PlayerPitchingStatTable
            pitchingStats={postseasonPitchingStats}
            careerPitchingStats={careerPostseasonPitchingStats}
            isPostseason={true}
            statTargetName={player.player_name}
          />
        </Box>
      ) : null}
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({
  params,
  preview = false,
}) => {
  let player: Player | null = null;
  let team: Team | null = null;
  let stats: PlayerStats[] = null;
  let postseasonStats: PlayerStats[] = null;
  let careerStats: PlayerStats[] = null;
  let careerPostseasonStats: PlayerStats[] = null;

  try {
    player = await dbApiFetcher(`/players/${params.playerSlug}`);
  } catch (error) {
    console.log(error);
  }

  try {
    if (player?.team_id != null) {
      team = await dbApiFetcher(`/teams/${player.team_id}`);
    }
  } catch (error) {
    console.log(error);
  }

  try {
    if (player?.player_id != null) {
      [stats, postseasonStats, careerStats, careerPostseasonStats] =
        await Promise.all([
          dbApiFetcher(
            `/stats?group=pitching,hitting&type=season&gameType=R&playerId=${player.player_id}`
          ),
          dbApiFetcher(
            `/stats?group=pitching,hitting&type=season&gameType=P&playerId=${player.player_id}`
          ),
          dbApiFetcher(
            `/stats?group=pitching,hitting&type=career&gameType=R&playerId=${player.player_id}`
          ),
          dbApiFetcher(
            `/stats?group=pitching,hitting&type=career&gameType=P&playerId=${player.player_id}`
          ),
        ]);
    }
  } catch (error) {
    console.log(error);
  }

  return {
    props: {
      careerPostseasonStats,
      careerStats,
      player,
      postseasonStats,
      preview,
      stats,
      team,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  let players: Player[] | undefined;

  try {
    players = await dbApiFetcher("/players?fields=url_slug");
  } catch (error) {
    console.log(error);
  }

  const playerPaths = players
    .filter((player) =>
      player ? Object.prototype.hasOwnProperty.call(player, "url_slug") : false
    )
    .map((player) => `/players/${player.url_slug}`);

  return {
    paths: playerPaths || [],
    fallback: false,
  };
};
