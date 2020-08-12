import fs from "fs";
import path from "path";
import teams from "data/teams.json";
import { useRouter } from "next/router";

import { Box, Heading } from "@chakra-ui/core";
import ErrorPage from "next/error";
import Head from "next/head";
import Layout from "components/Layout";
import TeamBattingStatTable from "components/TeamBattingStatTable";
import TeamHistory from "components/TeamHistory";
import TeamPitchingStatTable from "components/TeamPitchingStatTable";

export default function Team({ team }) {
  const router = useRouter();

  if (!router.isFallback && !team?.slug) {
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
      </Layout>
    </>
  );
}

export async function getStaticProps({ params, preview = false }) {
  const teamFolder = path.join(process.cwd(), "data", "teams", params.teamSlug);
  let team = JSON.parse(
    fs.readFileSync(`${teamFolder}/playerStats.json`, "utf8")
  );

  return {
    props: {
      team,
      preview,
    },
  };
}

export async function getStaticPaths() {
  const paths = teams.map((team) => `/teams/${team.slug}`) || [];

  return {
    paths,
    fallback: false,
  };
}
