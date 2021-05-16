import { dbApiFetcher } from "lib/api-fetcher";
import { useApiConfigContext } from "context/ApiConfig";
import * as React from "react";
import { useRouter } from "next/router";
import useSWR from "swr";

import ApiConfig from "types/apiConfig";
import { GetStaticPaths, GetStaticProps } from "next";
import PlayerStats from "types/playerStats";
import Team from "types/team";
import TeamPlayerStats from "types/teamPlayerStats";

import ApiUsageHelper from "components/ApiUsageHelper";
import { Box, Flex, Heading, Skeleton, Stack } from "@chakra-ui/react";
import ErrorPage from "next/error";
import Head from "next/head";
import Layout from "components/Layout";
import TeamPlayerBattingStatTable from "components/TeamPlayerBattingStatTable";
import TeamDetails from "components/TeamDetails";
import TeamPlayerPitchingStatTable from "components/TeamPlayerPitchingStatTable";
import SplitViewSelect from "components/SplitViewSelect";

type TeamDetailsAndStatsProps = {
  team: Team;
};

export default function TeamDetailsAndStats(props: TeamDetailsAndStatsProps) {
  const apiConfig: ApiConfig = useApiConfigContext();
  const router = useRouter();

  const [selectedView, setSelectedView] = React.useState(null);

  const {
    data: team,
    error: teamError,
    isValidating: teamIsValidating,
  } = useSWR(() => `/teams/${router.query.teamSlug}`, dbApiFetcher, {
    initialData: props.team,
  });

  const { data: playerStats, isValidating: playerStatsIsValidating } = useSWR(
    () =>
      selectedView && team
        ? `/stats?group=hitting,pitching&type=season&season=${selectedView}&teamId=${team.team_id}`
        : null,
    dbApiFetcher
  );

  const {
    data: playerPostseasonStats,
    isValidating: playerPostseasonStatsIsValidating,
  } = useSWR(
    () =>
      selectedView && team
        ? `/stats?group=hitting,pitching&type=season&season=${selectedView}&gameType=P&teamId=${team.team_id}`
        : null,
    dbApiFetcher
  );

  const { data: teamStats, isValidating: teamStatsIsValidating } = useSWR(
    () =>
      selectedView && team
        ? `/stats/teams?group=hitting,pitching&type=season&season=${selectedView}&teamId=${team.team_id}`
        : null,
    dbApiFetcher
  );

  const {
    data: teamPostseasonStats,
    isValidating: teamPostseasonStatsIsValidating,
  } = useSWR(
    () =>
      selectedView && team
        ? `/stats/teams?group=hitting,pitching&type=season&season=${selectedView}&gameType=P&teamId=${team.team_id}`
        : null,
    dbApiFetcher
  );

  React.useEffect(() => {
    if (apiConfig !== undefined) {
      setSelectedView(apiConfig.seasons?.maxSeason);
    }
  }, [apiConfig]);

  const handleSelectChange = (
    evt: React.FormEvent<HTMLSelectElement>
  ): void => {
    evt.preventDefault();
    setSelectedView(evt.currentTarget.value);
  };

  if (!router.isFallback && team == null && !teamIsValidating) {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <>
      <Head>
        <title>
          {team != null ? team.full_name : "Team"} Stats -
          Blaseball-Reference.com
        </title>
        <meta
          property="og:title"
          content={`${
            team != null ? team.full_name : "Team"
          } Stats - Blaseball-Reference.com`}
          key="og:title"
        />
        <meta
          name="description"
          property="og:description"
          content={`Get the latest ${
            team != null ? team.full_name : "team"
          } scores, stats, standings, and more.`}
        />
      </Head>
      <Layout>
        {teamError ? (
          <Box>
            Sorry, we're currently having a siesta and are unable to provide you
            the latest team information.
          </Box>
        ) : (
          <>
            <TeamDetails team={team} teamIsValidating={teamIsValidating} />
            <Box mb={2}>
              <Heading as="h2" size="md">
                Player Stats
              </Heading>
            </Box>
            <SplitViewSelect
              selectedView={selectedView}
              handleSelectChange={handleSelectChange}
            />
            <TeamPlayerStatTables
              playerStats={playerStats}
              playerStatsIsValidating={playerStatsIsValidating}
              playerPostseasonStats={playerPostseasonStats}
              playerPostseasonStatsIsValidating={
                playerPostseasonStatsIsValidating
              }
              selectedView={selectedView}
              team={team}
              teamIsValidating={teamIsValidating}
              teamStats={teamStats}
              teamStatsIsValidating={teamStatsIsValidating}
              teamPostseasonStats={teamPostseasonStats}
              teamPostseasonStatsIsValidating={teamPostseasonStatsIsValidating}
            />

            <Flex justifyContent="center" mt={6}>
              <ApiUsageHelper
                apiCalls={[
                  `${process.env.NEXT_PUBLIC_DATABLASE_API_URL}/config`,
                  `${process.env.NEXT_PUBLIC_DATABLASE_API_URL}/teams/${router.query.teamSlug}`,
                  `${process.env.NEXT_PUBLIC_DATABLASE_API_URL}/stats?group=hitting,pitching&type=season&season=${selectedView}&teamId=${team?.team_id}`,
                  `${process.env.NEXT_PUBLIC_DATABLASE_API_URL}/stats?group=hitting,pitching&type=season&season=${selectedView}&gameType=P&teamId=${team?.team_id}`,
                  `${process.env.NEXT_PUBLIC_DATABLASE_API_URL}/stats/teams?group=hitting,pitching&type=season&season=${selectedView}&teamId=${team?.team_id}`,
                  `${process.env.NEXT_PUBLIC_DATABLASE_API_URL}/stats/teams?group=hitting,pitching&type=season&season=${selectedView}&gameType=P&teamId=${team?.team_id}`,
                ]}
              />
            </Flex>
          </>
        )}
      </Layout>
    </>
  );
}

type TeamPlayerStatTablesProps = {
  playerStats: PlayerStats[];
  playerStatsIsValidating: boolean;
  playerPostseasonStats: PlayerStats[];
  playerPostseasonStatsIsValidating: boolean;
  selectedView: string | null;
  team: Team;
  teamIsValidating: boolean;
  teamStats: TeamPlayerStats[];
  teamStatsIsValidating: boolean;
  teamPostseasonStats: TeamPlayerStats[];
  teamPostseasonStatsIsValidating: boolean;
};

function TeamPlayerStatTables({
  playerStats,
  playerStatsIsValidating,
  playerPostseasonStats,
  playerPostseasonStatsIsValidating,
  selectedView,
  team,
  teamIsValidating,
  teamStats,
  teamStatsIsValidating,
  teamPostseasonStats,
  teamPostseasonStatsIsValidating,
}: TeamPlayerStatTablesProps) {
  if (
    (team == null && !teamIsValidating) ||
    (!playerStats &&
      !playerStatsIsValidating &&
      !playerPostseasonStats &&
      !playerPostseasonStatsIsValidating &&
      !teamStats &&
      !teamStatsIsValidating &&
      !teamPostseasonStats &&
      !teamPostseasonStatsIsValidating)
  ) {
    return null;
  }

  if (
    (team == null && teamIsValidating) ||
    playerStatsIsValidating ||
    playerPostseasonStatsIsValidating ||
    teamStatsIsValidating ||
    teamPostseasonStatsIsValidating
  ) {
    return (
      <Stack>
        <Skeleton height="20px" />
        <Skeleton height="20px" />
        <Skeleton height="20px" />
      </Stack>
    );
  }

  const battingStats: PlayerStats | null = playerStats
    ? playerStats.find((statGroup) => statGroup.group === "hitting")
    : null;
  const pitchingStats: PlayerStats | null = playerStats
    ? playerStats.find((statGroup) => statGroup.group === "pitching")
    : null;
  const postseasonBattingStats: PlayerStats | null = playerPostseasonStats
    ? playerPostseasonStats.find((statGroup) => statGroup.group === "hitting")
    : null;
  const postseasonPitchingStats: PlayerStats | null = playerPostseasonStats
    ? playerPostseasonStats.find((statGroup) => statGroup.group === "pitching")
    : null;

  const teamBattingStats: TeamPlayerStats | null = teamStats
    ? teamStats.find((statGroup) => statGroup.group === "hitting")
    : null;
  const teamPitchingStats: TeamPlayerStats | null = teamStats
    ? teamStats.find((statGroup) => statGroup.group === "pitching")
    : null;
  const teamPostseasonBattingStats: TeamPlayerStats | null = teamPostseasonStats
    ? teamPostseasonStats.find((statGroup) => statGroup.group === "hitting")
    : null;
  const teamPostseasonPitchingStats: TeamPlayerStats | null =
    teamPostseasonStats
      ? teamPostseasonStats.find((statGroup) => statGroup.group === "pitching")
      : null;

  return (
    <>
      <Box mb={4}>
        <TeamPlayerBattingStatTable
          battingStats={battingStats}
          splitView={selectedView}
          statTargetName={team.full_name}
          teamBattingStats={teamBattingStats}
        />
      </Box>

      <Box mb={4}>
        <TeamPlayerPitchingStatTable
          pitchingStats={pitchingStats}
          splitView={selectedView}
          statTargetName={team.full_name}
          teamPitchingStats={teamPitchingStats}
        />
      </Box>

      {postseasonBattingStats && postseasonBattingStats.totalSplits > 0 ? (
        <Box mb={4}>
          <TeamPlayerBattingStatTable
            battingStats={postseasonBattingStats}
            isPostseason={true}
            splitView={selectedView}
            statTargetName={team.full_name}
            teamBattingStats={teamPostseasonBattingStats}
          />
        </Box>
      ) : null}

      {postseasonPitchingStats && postseasonPitchingStats.totalSplits > 0 ? (
        <Box>
          <TeamPlayerPitchingStatTable
            isPostseason={true}
            pitchingStats={postseasonPitchingStats}
            splitView={selectedView}
            statTargetName={team.full_name}
            teamPitchingStats={teamPostseasonPitchingStats}
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
  let team: Team | null = null;

  try {
    team = await dbApiFetcher(`/teams/${params.teamSlug}`);
  } catch (error) {
    console.log(error);
  }

  return {
    props: {
      team,
      preview,
    },
    revalidate: 2700,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  let teams: Team[] = null;

  try {
    teams = await dbApiFetcher("/teams");
  } catch (error) {
    console.log(error);
  }

  return {
    paths:
      Array.isArray(teams) && teams.length > 0
        ? teams.map((team) => `/teams/${team.url_slug}`)
        : [],
    fallback: true,
  };
};
