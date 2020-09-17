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
    apiFetcher,
    {
      initialData: props.schedule,
    }
  );

  const { data: seasonStartDates, error: seasonStartDatesError } = useSWR(
    "/seasonStartDates.json",
    apiFetcher,
    {
      initialData: props.seasonStartDates,
    }
  );

  const { data: team, error: teamError } = useSWR(
    `/teams/${router.query.teamSlug}/details.json`,
    apiFetcher,
    {
      initialData: props.team,
    }
  );

  const { data: teams, error: teamsError } = useSWR(`/teams.json`, apiFetcher, {
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
          key="title"
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
  const schedule = await apiFetcher(`/teams/${params.teamSlug}/schedule.json`);
  const seasonStartDates = await apiFetcher("/seasonStartDates.json");
  const team = await apiFetcher(`/teams/${params.teamSlug}/details.json`);
  const teams = await apiFetcher("/teams.json");

  return {
    props: {
      preview,
      schedule,
      seasonStartDates,
      team,
      teams,
    },
    revalidate: 60,
  };
}

export async function getStaticPaths() {
  const teams = await apiFetcher("/teams.json");
  const paths = teams.map((team) => `/teams/${team.slug}/schedule`) || [];

  return {
    paths,
    fallback: false,
  };
}
