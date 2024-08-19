import { dbApiFetcher } from "lib/api-fetcher";
import buildSeasonList from "utils/buildSeasonList";
import * as React from "react";
import { useRouter } from "next/router";
import {
  getSplitViewFromSlugWithApiConfig,
  translateLeaderViewToSlug,
} from "utils/slugHelpers";

import ApiConfig from "types/apiConfig";
import { GetStaticPaths, GetStaticProps } from "next";
import PlayerStats from "types/playerStats";
import Team from "types/team";
import TeamPlayerStats from "types/teamPlayerStats";

import ApiUsageHelper from "components/ApiUsageHelper";
import { Box, Flex, Heading } from "@chakra-ui/react";
import ErrorPage from "next/error";
import Head from "next/head";
import Layout from "components/Layout";
import TeamPlayerBattingStatTable from "components/TeamPlayerBattingStatTable";
import TeamDetails from "components/TeamDetails";
import TeamPlayerPitchingStatTable from "components/TeamPlayerPitchingStatTable";
import SplitViewSelect from "components/SplitViewSelect";

type TeamDetailsAndSeasonStatsProps = {
  apiConfig: ApiConfig;
  playerStats: PlayerStats[];
  playerPostseasonStats: PlayerStats[];
  team: Team;
  teamStats: TeamPlayerStats[];
  teamPostseasonStats: TeamPlayerStats[];
};

export default function TeamDetailsAndSeasonStats(
  props: TeamDetailsAndSeasonStatsProps
) {
  const {
    apiConfig,
    playerStats,
    playerPostseasonStats,
    team,
    teamStats,
    teamPostseasonStats,
  } = props;
  const router = useRouter();

  const splitView = getSplitViewFromSlugWithApiConfig({
    apiConfig,
    viewSlug: router.query.viewSlug,
  });
  const [selectedView, setSelectedView] = React.useState(splitView);

  const handleSelectChange = (
    evt: React.FormEvent<HTMLSelectElement>
  ): void => {
    evt.preventDefault();
    setSelectedView(evt.currentTarget.value);
    router.push(
      `/teams/${router.query.teamSlug}/stats/${translateLeaderViewToSlug(
        evt.currentTarget.value
      )}`
    );
  };

  if (team == null) {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <>
      <Head>
        <title>
          {isNaN(parseFloat(splitView))
            ? `${team.full_name} Stats - Blaseball-Reference.com`
            : `${team.full_name} Stats for Season ${Number(splitView) + 1} - Blaseball-Reference.com`}
        </title>
        <meta
          property="og:title"
          content={
            isNaN(parseFloat(splitView))
              ? `${team.full_name} Stats - Blaseball-Reference.com`
              : `${team.full_name} Stats for Season ${Number(splitView) + 1} - Blaseball-Reference.com`
          }
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
        <TeamDetails team={team} />
        <Box mb={2}>
          <Heading as="h2" size="md">
            Player Stats
          </Heading>
        </Box>
        <SplitViewSelect
          apiConfig={apiConfig}
          selectedView={selectedView}
          handleSelectChange={handleSelectChange}
        />
        <TeamPlayerStatTables
          playerStats={playerStats}
          playerPostseasonStats={playerPostseasonStats}
          selectedView={selectedView}
          team={team}
          teamStats={teamStats}
          teamPostseasonStats={teamPostseasonStats}
        />

        <Flex justifyContent="center" mt={6}>
          <ApiUsageHelper
            apiCalls={[
              `${process.env.NEXT_PUBLIC_DATABLASE_API}/config`,
              `${process.env.NEXT_PUBLIC_DATABLASE_API}/teams/${router.query.teamSlug}`,
              `${process.env.NEXT_PUBLIC_DATABLASE_API}/stats?group=hitting,pitching&type=season&season=${selectedView}&teamId=${team?.team_id}`,
              `${process.env.NEXT_PUBLIC_DATABLASE_API}/stats?group=hitting,pitching&type=season&season=${selectedView}&gameType=P&teamId=${team?.team_id}`,
              `${process.env.NEXT_PUBLIC_DATABLASE_API}/stats/teams?group=hitting,pitching&type=season&season=${selectedView}&teamId=${team?.team_id}`,
              `${process.env.NEXT_PUBLIC_DATABLASE_API}/stats/teams?group=hitting,pitching&type=season&season=${selectedView}&gameType=P&teamId=${team?.team_id}`,
            ]}
          />
        </Flex>
      </Layout>
    </>
  );
}

type TeamPlayerStatTablesProps = {
  playerStats: PlayerStats[];
  playerPostseasonStats: PlayerStats[];
  selectedView: string | null;
  team: Team;
  teamStats: TeamPlayerStats[];
  teamPostseasonStats: TeamPlayerStats[];
};

function TeamPlayerStatTables({
  playerStats,
  playerPostseasonStats,
  selectedView,
  team,
  teamStats,
  teamPostseasonStats,
}: TeamPlayerStatTablesProps) {
  if (
    team == null ||
    (!playerStats &&
      !playerPostseasonStats &&
      !teamStats &&
      !teamPostseasonStats)
  ) {
    return null;
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
  let maxSeason: number;
  let apiConfig: ApiConfig | null = null;
  let playerStats: PlayerStats[] | null = null;
  let playerPostseasonStats: PlayerStats[] | null = null;
  let teamStats: TeamPlayerStats[] | null = null;
  let teamPostseasonStats: TeamPlayerStats[] | null = null;

  try {
    apiConfig = await dbApiFetcher("/config");
    maxSeason = apiConfig.seasons?.maxSeason;
  } catch (error) {
    console.log(error);
  }

  const splitView = getSplitViewFromSlugWithApiConfig({
    apiConfig,
    viewSlug: params.viewSlug,
  });

  try {
    team = await dbApiFetcher(`/teams/${params.teamSlug}`);
  } catch (error) {
    console.log(error);
  }

  try {
    if (team?.team_id != null && (maxSeason != null || splitView != null)) {
      [playerStats, playerPostseasonStats, teamStats, teamPostseasonStats] =
        await Promise.all([
          dbApiFetcher(
            `/stats?group=hitting,pitching&type=season&season=${splitView != null ? splitView : maxSeason}&teamId=${team.team_id}`
          ),
          dbApiFetcher(
            `/stats?group=hitting,pitching&type=season&season=${splitView != null ? splitView : maxSeason}&gameType=P&teamId=${team.team_id}`
          ),
          dbApiFetcher(
            `/stats/teams?group=hitting,pitching&type=season&season=${splitView != null ? splitView : maxSeason}&teamId=${team.team_id}`
          ),
          dbApiFetcher(
            `/stats/teams?group=hitting,pitching&type=season&season=${splitView != null ? splitView : maxSeason}&gameType=P&teamId=${team.team_id}`
          ),
        ]);
    }
  } catch (error) {
    console.log(error);
  }

  return {
    props: {
      apiConfig,
      playerStats,
      playerPostseasonStats,
      preview,
      team,
      teamStats,
      teamPostseasonStats,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  let apiConfig: ApiConfig | null = null;
  let teams: Team[] | null = null;

  try {
    apiConfig = await dbApiFetcher("/config");
  } catch (error) {
    console.log(error);
  }

  try {
    teams = await dbApiFetcher("/teams");
  } catch (error) {
    console.log(error);
  }

  const minSeason =
    apiConfig != null ? apiConfig.seasons?.minSeason : undefined;
  const maxSeason =
    apiConfig != null ? apiConfig.seasons?.maxSeason : undefined;
  const seasonList = buildSeasonList({ minSeason, maxSeason });

  const viewList = seasonList
    ? seasonList.map((view) => translateLeaderViewToSlug(view))
    : [];

  const teamBaseStatsPaths = teams.map((team) => ({
    params: { teamSlug: team.url_slug, viewSlug: undefined },
  }));

  const teamViewStatsPaths = teams
    .map((team) =>
      viewList.map((view) => ({
        params: { teamSlug: team.url_slug, viewSlug: [view] },
      }))
    )
    .flat();

  return {
    paths: [...teamBaseStatsPaths, ...teamViewStatsPaths] || [],
    fallback: false,
  };
};
