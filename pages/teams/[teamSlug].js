import apiFetcher from "lib/api-fetcher";
import { useRouter } from "next/router";
import useSWR from "swr";

import { Box, Heading } from "@chakra-ui/core";
import ErrorPage from "next/error";
import Head from "next/head";
import Layout from "components/Layout";
import TeamBattingStatTable from "components/TeamBattingStatTable";
import TeamHistory from "components/TeamHistory";
import TeamPitchingStatTable from "components/TeamPitchingStatTable";

export default function Team(props) {
  const router = useRouter();

  const { data: team, error } = useSWR(
    `/teams/${router.query.teamSlug}/playerStats.json`,
    apiFetcher,
    {
      initialData: props.team,
    }
  );

  if (!router.isFallback && !props.team) {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <>
      <Head>
        <title>{team.fullName} Stats - Blaseball-Reference.com</title>
        <meta
          property="og:title"
          content={`${team.fullName} Stats - Blaseball-Reference.com`}
          key="title"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        {error ? (
          <Box>
            Sorry, we're currently having a siesta and couldn't load team
            information.
          </Box>
        ) : !team ? (
          <Box>Loading team details...</Box>
        ) : (
          <>
            <TeamHistory team={team} />
            <Box my={2}>
              <Heading as="h2" size="md">
                Current Season Stats
              </Heading>
            </Box>
            <Box my={2}>
              <Heading as="h3" size="sm">
                Team Batting
              </Heading>
              <TeamBattingStatTable battingStats={team.battingStats} />
            </Box>
            <Box my={2}>
              <Heading as="h3" size="sm">
                Team Pitching
              </Heading>
              <TeamPitchingStatTable pitchingStats={team.pitchingStats} />
            </Box>
          </>
        )}
      </Layout>
    </>
  );
}

export async function getStaticProps({ params, preview = false }) {
  const team = await apiFetcher(`/teams/${params.teamSlug}/playerStats.json`);

  return {
    props: {
      team,
      preview,
    },
    revalidate: 60,
  };
}

export async function getStaticPaths() {
  const teams = await apiFetcher("/teams/teams.json");
  const paths = teams.map((team) => `/teams/${team.slug}`) || [];

  return {
    paths,
    fallback: false,
  };
}
