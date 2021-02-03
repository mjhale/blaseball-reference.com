import { dbApiFetcher } from "lib/api-fetcher";
import { GetStaticPaths, GetStaticProps } from "next";
import Player from "types/player";
import PlayerStats from "types/playerStats";
import Team from "types/team";
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
} from "@chakra-ui/react";
import Head from "next/head";
import Layout from "components/Layout";
import NextLink from "next/link";
import PitchingStatTable from "components/PitchingStatTable";

type PlayerPageProps = {
  player: Player | null;
  stats: PlayerStats | null;
  postseasonStats: PlayerStats | null;
  team: Team | null;
};

export default function PlayerPage(props: PlayerPageProps) {
  const router = useRouter();

  const { data: player, error: playerError } = useSWR(
    `/players/${router.query.playerSlug}`,
    dbApiFetcher,
    {
      initialData: props.player,
    }
  );
  const { data: stats, error: statsError } = useSWR(
    () =>
      player !== undefined
        ? `/stats?group=pitching,hitting&type=season&gameType=R&playerId=${player.player_id}`
        : null,
    dbApiFetcher,
    {
      initialData: props.stats,
    }
  );
  const { data: postseasonStats, error: postseasonStatsError } = useSWR(
    () =>
      player !== undefined
        ? `/stats?group=pitching,hitting&type=season&gameType=P&playerId=${player.player_id}`
        : null,
    dbApiFetcher,
    {
      initialData: props.postseasonStats,
    }
  );
  const { data: team, error: teamError } = useSWR(
    () => (player !== undefined ? `/teams/${player.team_id}` : null),
    dbApiFetcher,
    {
      initialData: props.team,
    }
  );

  return (
    <>
      <Head>
        <title>
          {player !== undefined ? player.player_name : "Player"} Stats -
          Blaseball-Reference.com
        </title>
        <meta
          property="og:title"
          content={`${
            player !== undefined ? player.player_name : "Player"
          } Stats - Blaseball-Reference.com`}
          key="og:title"
        />
        <meta
          name="description"
          property="og:description"
          content={`${
            player !== undefined ? player.player_name : "Player"
          } history and position statistics in Blaseball.`}
        />
      </Head>
      <Layout>
        <PlayerDetails
          player={player}
          postseasonStats={postseasonStats}
          stats={stats}
          team={team}
        />
      </Layout>
    </>
  );
}

type PlayerDetailsProps = {
  player: Player;
  postseasonStats: PlayerStats[];
  stats: PlayerStats[];
  team: Team;
};

function PlayerDetails({
  player,
  postseasonStats,
  stats,
  team,
}: PlayerDetailsProps) {
  if (!player || !postseasonStats || !stats) {
    return (
      <>
        <Skeleton height="40px" mb={4} width="2xs" />
        <Stack>
          <Skeleton height="20px" />
          <Skeleton height="20px" />
          <Skeleton height="20px" />
        </Stack>
      </>
    );
  }

  return (
    <>
      <Heading as="h1" size="lg">
        {player.player_name}
        {player.deceased ? (
          <>
            {" "}
            <Text aria-label="incinerated" as="span" fontSize="xl" role="emoji">
              🔥
            </Text>
          </>
        ) : null}
      </Heading>

      <Box fontSize="sm" mt={2} mb={4}>
        {/* @TODO: Re-add aliases once database API provides them
         {player.aliases.length > 0 ? (
          <Text my={1}>
            Aliases:{" "}
            {player.aliases.map((alias, index) => (
              <Fragment key={index}>
                {alias}
                {index < player.aliases.length - 1 && ", "}
              </Fragment>
            ))}
          </Text>
        ) : null} */}

        {team ? (
          <Text my={1}>
            Team:{" "}
            <NextLink href={`/teams/${team.url_slug}`} passHref>
              <Link textDecoration="underline">{team.full_name}</Link>
            </NextLink>
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
        <NextLink
          href={`${process.env.NEXT_PUBLIC_BLASEBALL_WIKI_URL}/${player.player_id}`}
          passHref
        >
          <Link fontSize="md" isExternal textDecoration="underline">
            Blaseball Wiki
          </Link>
        </NextLink>
      </Flex>
      <PlayerStatTables
        stats={stats}
        postseasonStats={postseasonStats}
        player={player}
      />
    </>
  );
}

type PlayerStatTablesProps = {
  player: Player;
  postseasonStats: PlayerStats[];
  stats: PlayerStats[];
};

function PlayerStatTables({
  postseasonStats,
  player,
  stats,
}: PlayerStatTablesProps) {
  if (!stats && !postseasonStats) {
    return null;
  }

  const battingStats: PlayerStats | undefined = stats.find((statGroup) => {
    if (statGroup.group === "hitting") {
      return true;
    }
  });
  const pitchingStats: PlayerStats | undefined = stats.find(
    (statGroup) => statGroup.group === "pitching"
  );
  const postseasonBattingStats: PlayerStats | undefined = postseasonStats.find(
    (statGroup) => statGroup.group === "hitting"
  );
  const postseasonPitchingStats: PlayerStats | undefined = postseasonStats.find(
    (statGroup) => statGroup.group === "pitching"
  );

  return (
    <>
      {pitchingStats && pitchingStats.totalSplits > 0 ? (
        <Box my={4}>
          <PitchingStatTable
            pitchingStats={pitchingStats}
            statTargetName={player.player_name}
          />
        </Box>
      ) : null}

      {postseasonPitchingStats && postseasonPitchingStats.totalSplits > 0 ? (
        <Box my={4}>
          <PitchingStatTable
            pitchingStats={postseasonPitchingStats}
            isPostseason={true}
            statTargetName={player.player_name}
          />
        </Box>
      ) : null}

      {battingStats && battingStats.totalSplits > 0 ? (
        <Box my={4}>
          <BattingStatTable
            battingStats={battingStats}
            statTargetName={player.player_name}
          />
        </Box>
      ) : null}

      {postseasonBattingStats && postseasonBattingStats.totalSplits > 0 ? (
        <Box my={4}>
          <BattingStatTable
            battingStats={postseasonBattingStats}
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
  let postseasonStats: PlayerStats[] | null = null;
  let team: Team | null = null;
  let stats: PlayerStats[] | null = null;

  try {
    player = await dbApiFetcher(`/players/${params.playerSlug}`);
  } catch (error) {
    console.log(error);
  }

  try {
    postseasonStats = await dbApiFetcher(
      `/stats?group=hitting,pitching&type=season&gameType=P&playerId=${player.player_id}`
    );
  } catch (error) {
    console.log(error);
  }

  try {
    if (player.team_id) {
      team = await dbApiFetcher(`/teams/${player.team_id}`);
    }
  } catch (error) {
    console.log(error);
  }

  try {
    stats = await dbApiFetcher(
      `/stats?group=hitting,pitching&type=season&playerId=${player.player_id}`
    );
  } catch (error) {
    console.log(error);
  }

  return {
    props: {
      player,
      postseasonStats,
      preview,
      team,
      stats,
    },
    revalidate: 900,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  let players: Player[] | undefined;

  try {
    players = await dbApiFetcher("/players");
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
    fallback: true,
  };
};
