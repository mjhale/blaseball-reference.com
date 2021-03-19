import { dbApiFetcher } from "lib/api-fetcher";
import { useApiConfigContext } from "context/ApiConfig";
import * as React from "react";
import { useRouter } from "next/router";
import useSWR from "swr";

import ApiConfig from "types/apiConfig";
import { GetStaticPaths, GetStaticProps } from "next";
import PlayerStats from "types/playerStats";
import Team from "types/team";

import { Box, Flex, Heading, Link, Skeleton, Stack } from "@chakra-ui/react";
import ErrorPage from "next/error";
import Head from "next/head";
import Layout from "components/Layout";
import NextLink from "next/link";
import TeamBattingStatTable from "components/TeamBattingStatTable";
import TeamHistory from "components/TeamHistory";
import TeamPitchingStatTable from "components/TeamPitchingStatTable";
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
            <TeamPlayerStats
              playerStats={playerStats}
              playerStatsIsValidating={playerStatsIsValidating}
              playerPostseasonStats={playerPostseasonStats}
              playerPostseasonStatsIsValidating={
                playerPostseasonStatsIsValidating
              }
              selectedView={selectedView}
              team={team}
              teamIsValidating={teamIsValidating}
            />
          </>
        )}
      </Layout>
    </>
  );
}

type TeamDetailsProps = {
  team: Team | null;
  teamIsValidating: boolean;
};

function TeamDetails({ team, teamIsValidating }: TeamDetailsProps) {
  const router = useRouter();

  if (team == null && teamIsValidating) {
    return (
      <>
        <Skeleton height="20px" mb={4} width="2xs" />
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
      <Heading as="h1" mb={2} size="lg">
        {team.full_name}
      </Heading>
      <TeamHistory teamDetails={team} />
      <Heading as="h2" mb={2} size="md">
        Team Pages
      </Heading>
      <Flex mb={2}>
        <NextLink href={`/teams/${router.query.teamSlug}/schedule`} passHref>
          <Link fontSize="md" textDecoration="underline">
            Season Schedule
          </Link>
        </NextLink>
        <Box mx={1}>-</Box>
        <NextLink
          href={`${process.env.NEXT_PUBLIC_BLASEBALL_WIKI_URL}/${team.team_id}`}
          passHref
        >
          <Link fontSize="md" isExternal textDecoration="underline">
            Blaseball Wiki
          </Link>
        </NextLink>
      </Flex>
    </>
  );
}

type TeamPlayerStatsProps = {
  playerStats: PlayerStats[];
  playerStatsIsValidating: boolean;
  playerPostseasonStats: PlayerStats[];
  playerPostseasonStatsIsValidating: boolean;
  selectedView: string | null;
  team: Team;
  teamIsValidating: boolean;
};

function TeamPlayerStats({
  playerStats,
  playerStatsIsValidating,
  playerPostseasonStats,
  playerPostseasonStatsIsValidating,
  selectedView,
  team,
  teamIsValidating,
}: TeamPlayerStatsProps) {
  if (
    (team == null && !teamIsValidating) ||
    (!playerStats &&
      !playerStatsIsValidating &&
      !playerPostseasonStats &&
      !playerPostseasonStatsIsValidating)
  ) {
    return null;
  }

  if (
    (team == null && teamIsValidating) ||
    playerStatsIsValidating ||
    playerPostseasonStatsIsValidating
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

  return (
    <>
      <Box mb={4}>
        <TeamPitchingStatTable
          pitchingStats={pitchingStats}
          splitView={selectedView}
          statTargetName={team.full_name}
        />
      </Box>

      {postseasonPitchingStats && postseasonPitchingStats.totalSplits > 0 ? (
        <Box mb={4}>
          <TeamPitchingStatTable
            isPostseason={true}
            pitchingStats={postseasonPitchingStats}
            splitView={selectedView}
            statTargetName={team.full_name}
          />
        </Box>
      ) : null}

      <Box mb={4}>
        <TeamBattingStatTable
          battingStats={battingStats}
          splitView={selectedView}
          statTargetName={team.full_name}
        />
      </Box>

      {postseasonBattingStats && postseasonBattingStats.totalSplits > 0 ? (
        <Box>
          <TeamBattingStatTable
            battingStats={postseasonBattingStats}
            isPostseason={true}
            splitView={selectedView}
            statTargetName={team.full_name}
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
