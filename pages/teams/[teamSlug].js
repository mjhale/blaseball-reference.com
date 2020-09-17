import apiFetcher from "lib/api-fetcher";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";

import { Box, Heading, Link, Select, Skeleton, Stack } from "@chakra-ui/core";
import ErrorPage from "next/error";
import Head from "next/head";
import Layout from "components/Layout";
import NextLink from "next/link";
import TeamBattingStatTable from "components/TeamBattingStatTable";
import TeamHistory from "components/TeamHistory";
import TeamPitchingStatTable from "components/TeamPitchingStatTable";

export default function Team(props) {
  const router = useRouter();

  const { data: teamDetailsAndPlayerStats, error } = useSWR(
    `/teams/${router.query.teamSlug}/playerStats.json`,
    apiFetcher,
    {
      initialData: props.teamDetailsAndPlayerStats,
    }
  );

  if (!router.isFallback && !props.teamDetailsAndPlayerStats) {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <>
      <Head>
        <title>
          {teamDetailsAndPlayerStats.fullName} Stats - Blaseball-Reference.com
        </title>
        <meta
          property="og:title"
          content={`${teamDetailsAndPlayerStats.fullName} Stats - Blaseball-Reference.com`}
          key="title"
        />
      </Head>
      <Layout>
        {error ? (
          <Box>
            Sorry, we're currently having a siesta and are unable to provide you
            the latest team information.
          </Box>
        ) : null}
        <Heading as="h1" mb={2} size="lg">
          {teamDetailsAndPlayerStats.fullName}
        </Heading>
        <TeamHistory teamDetails={teamDetailsAndPlayerStats} />
        <Heading as="h2" mb={2} size="md">
          Team Pages
        </Heading>
        <Box mb={2}>
          <NextLink
            href="/teams/[teamSlug]/schedule"
            as={`/teams/${router.query.teamSlug}/schedule`}
            passHref
          >
            <Link fontSize="md" textDecoration="underline">
              Season Schedule
            </Link>
          </NextLink>
        </Box>
        <TeamStats
          team={teamDetailsAndPlayerStats}
          teamPlayerStats={teamDetailsAndPlayerStats}
        />
      </Layout>
    </>
  );
}

function TeamStats({ team, teamPlayerStats }) {
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [seasonList, setSeasonList] = useState([]);

  useEffect(() => {
    setSeasonList([
      ...(teamPlayerStats?.battingStats?.seasons
        ? Object.keys(teamPlayerStats.battingStats.seasons).sort(
            (a, b) => Number(a) - Number(b)
          )
        : []),
    ]);
  }, [team.fullName]);

  useEffect(() => {
    if (seasonList.length > 0) {
      setSelectedSeason(seasonList[seasonList.length - 1]);
    }
  }, [seasonList]);

  const handleSelectChange = (evt) => {
    setSelectedSeason(evt.target.value);
  };

  if (
    !teamPlayerStats ||
    !teamPlayerStats?.battingStats?.seasons ||
    !teamPlayerStats?.pitchingStats?.seasons ||
    !Object.hasOwnProperty.call(
      teamPlayerStats.battingStats.seasons,
      selectedSeason
    ) ||
    !Object.hasOwnProperty.call(
      teamPlayerStats.pitchingStats.seasons,
      selectedSeason
    )
  ) {
    return (
      <>
        <Select
          fontSize={{ base: "lg", md: "md" }}
          isDisabled={true}
          maxWidth="2xs"
          mb={4}
          placeholder="Loading..."
          size="md"
        />
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
      <Box mb={2}>
        <Heading as="h2" size="md">
          Player Stats
        </Heading>
      </Box>

      <Select
        fontSize={{ base: "lg", md: "md" }}
        maxWidth="2xs"
        mb={4}
        onChange={handleSelectChange}
        size="md"
        value={selectedSeason}
      >
        {seasonList.map((season) => (
          <option key={season} value={season}>
            {`Season ${Number(season) + 1}`}
          </option>
        ))}
      </Select>

      <Box mb={2}>
        <Heading as="h3" size="sm">
          Team Batting
        </Heading>
        <TeamBattingStatTable
          battingStats={teamPlayerStats.battingStats}
          season={selectedSeason}
          statTargetName={team.fullName}
        />
      </Box>
      <Box mb={4}>
        <Heading as="h3" size="sm">
          Team Pitching
        </Heading>
        <TeamPitchingStatTable
          pitchingStats={teamPlayerStats.pitchingStats}
          season={selectedSeason}
          statTargetName={team.fullName}
        />
      </Box>
    </>
  );
}

export async function getStaticProps({ params, preview = false }) {
  const teamDetailsAndPlayerStats = await apiFetcher(
    `/teams/${params.teamSlug}/playerStats.json`
  );

  return {
    props: {
      teamDetailsAndPlayerStats,
      preview,
    },
    revalidate: 60,
  };
}

export async function getStaticPaths() {
  const teams = await apiFetcher("/teams.json");
  const paths = teams.map((team) => `/teams/${team.slug}`) || [];

  return {
    paths,
    fallback: false,
  };
}
