import apiFetcher from "lib/api-fetcher";
import { useRouter } from "next/router";
import useSWR from "swr";

import { Heading } from "@chakra-ui/core";
import ErrorPage from "next/error";
import Head from "next/head";
import Layout from "components/Layout";
import TeamSchedule from "components/TeamSchedule";

export default function TeamSchedulePage(props) {
  const router = useRouter();

  const { data: schedule, error: scheduleError } = useSWR(
    `/teams/${router.query.teamSlug}/schedule.json`,
    undefined,
    {
      errorRetryCount: 5,
      initialData: props.schedule,
    }
  );

  const { data: seasonStartDates, error: seasonStartDatesError } = useSWR(
    "/seasonStartDates.json",
    undefined,
    {
      errorRetryCount: 5,
      initialData: props.seasonStartDates,
    }
  );

  const { data: team, error: teamError } = useSWR(
    `/teams/${router.query.teamSlug}/details.json`,
    undefined,
    {
      errorRetryCount: 5,
      initialData: props.team,
    }
  );

  const { data: teams, error: teamsError } = useSWR(`/teams.json`, undefined, {
    errorRetryCount: 5,
    initialData: props.teams,
  });

  if (!router.isFallback && !team) {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <>
      <Head>
        <title>{team.fullName} Schedule - Blaseball-Reference.com</title>
        <meta
          property="og:title"
          content={`${team.fullName} Schedule - Blaseball-Reference.com`}
          key="og:title"
        />
        <meta
          name="description"
          property="og:description"
          content={`The full ${team.fullName} game schedule for current and past Blaseball season.`}
        />
      </Head>
      <Layout>
        <Heading as="h1" mb={4} size="lg">
          {team.fullName} Schedule
        </Heading>
        <TeamSchedule
          schedule={schedule}
          seasonStartDates={seasonStartDates}
          team={team}
          teams={teams}
        />
      </Layout>
    </>
  );
}

export async function getStaticProps({ params, preview = false }) {
  let schedule = null;
  let seasonStartDates = null;
  let team = null;
  let teams = null;

  try {
    schedule = await apiFetcher(`/teams/${params.teamSlug}/schedule.json`);
    seasonStartDates = await apiFetcher("/seasonStartDates.json");
    team = await apiFetcher(`/teams/${params.teamSlug}/details.json`);
    teams = await apiFetcher("/teams.json");
  } catch (error) {
    console.log(error);
  }

  return {
    props: {
      preview,
      schedule,
      seasonStartDates,
      team,
      teams,
    },
    revalidate: 900,
  };
}

export async function getStaticPaths() {
  let teams;

  try {
    teams = await apiFetcher("/teams.json");
  } catch (error) {
    console.log(error);
  }

  return {
    paths: teams.map((team) => `/teams/${team.slug}/schedule`) || [],
    fallback: false,
  };
}
