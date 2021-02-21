import ApiConfig from "types/apiConfig";
import { dbApiFetcher } from "lib/api-fetcher";
import { GetStaticPaths, GetStaticProps } from "next";
import PlayerStats from "types/playerStats";
import Team from "types/team";
import { useApiConfigContext } from "context/ApiConfig";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";

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
  teamPlayerStats: PlayerStats;
};

export default function TeamDetailsAndStats(props: TeamDetailsAndStatsProps) {
  const apiConfig: ApiConfig = useApiConfigContext();
  const router = useRouter();

  const [selectedView, setSelectedView] = useState(null);

  const { data: team, error: teamError } = useSWR(
    `/teams/${router.query.teamSlug}`,
    dbApiFetcher,
    {
      initialData: props.team,
    }
  );

  const {
    data: teamPlayerStats,
    error: teamPlayerStatsError,
    isValidating: teamPlayerStatsIsValidating,
    mutate: mutateTeamPlayerStats,
  } = useSWR(
    () =>
      selectedView && team
        ? `/stats?group=hitting,pitching&type=season&season=${selectedView}&teamId=${team.team_id}`
        : null,
    dbApiFetcher,
    {
      initialData: props.teamPlayerStats,
      revalidateOnMount: true,
    }
  );

  useEffect(() => {
    if (apiConfig !== undefined) {
      setSelectedView(apiConfig.seasons?.maxSeason);
    }
  }, [apiConfig]);

  const handleSelectChange = (
    evt: React.FormEvent<HTMLSelectElement>
  ): void => {
    evt.preventDefault();
    setSelectedView(evt.currentTarget.value);
    mutateTeamPlayerStats();
  };

  if (!router.isFallback && !props.team) {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <>
      <Head>
        <title>{team.full_name} Stats - Blaseball-Reference.com</title>
        <meta
          property="og:title"
          content={`${team.full_name} Stats - Blaseball-Reference.com`}
          key="og:title"
        />
        <meta
          name="description"
          property="og:description"
          content={`Get the latest ${team.full_name} scores, stats, standings, and more.`}
        />
      </Head>
      <Layout>
        {teamError ? (
          <Box>
            Sorry, we're currently having a siesta and are unable to provide you
            the latest team information.
          </Box>
        ) : null}
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
          selectedView={selectedView}
          team={team}
          teamPlayerStats={teamPlayerStats}
          teamPlayerStatsIsValidating={teamPlayerStatsIsValidating}
        />
      </Layout>
    </>
  );
}

type TeamPlayerStatsProps = {
  selectedView: string | null;
  team: Team;
  teamPlayerStats: PlayerStats[];
  teamPlayerStatsIsValidating: boolean;
};

function TeamPlayerStats({
  selectedView,
  team,
  teamPlayerStats,
  teamPlayerStatsIsValidating,
}: TeamPlayerStatsProps) {
  if (!team || !teamPlayerStats || teamPlayerStatsIsValidating) {
    return (
      <Stack>
        <Skeleton height="20px" />
        <Skeleton height="20px" />
        <Skeleton height="20px" />
      </Stack>
    );
  }

  return (
    <>
      <Box mb={2}>
        <TeamBattingStatTable
          battingStats={teamPlayerStats.find(
            (statGroup) => statGroup.group === "hitting"
          )}
          splitView={selectedView}
          statTargetName={team.full_name}
        />
      </Box>

      <Box mb={4}>
        <TeamPitchingStatTable
          pitchingStats={teamPlayerStats.find(
            (statGroup) => statGroup.group === "pitching"
          )}
          splitView={selectedView}
          statTargetName={team.full_name}
        />
      </Box>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({
  params,
  preview = false,
}) => {
  let apiConfig: ApiConfig | null = null;
  let team: Team | null = null;
  let teamPlayerStats: PlayerStats[] | null = null;

  try {
    apiConfig = await dbApiFetcher("/config");
  } catch (error) {
    console.log(error);
  }

  try {
    team = await dbApiFetcher(`/teams/${params.teamSlug}`);
  } catch (error) {
    console.log(error);
  }

  try {
    if (apiConfig != null) {
      teamPlayerStats = await dbApiFetcher(
        `/stats?group=hitting,pitching&type=season&season=${apiConfig.seasons?.maxSeason}&teamId=${team.team_id}`
      );
    }
  } catch (error) {
    console.log(error);
  }

  return {
    props: {
      team,
      teamPlayerStats,
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
    fallback: false,
  };
};
