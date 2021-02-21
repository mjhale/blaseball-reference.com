import apiFetcher, { dbApiFetcher } from "lib/api-fetcher";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import useSWR from "swr";

import { GetStaticPaths } from "next";
import Team from "types/team";

import { Heading } from "@chakra-ui/react";
import ErrorPage from "next/error";
import Head from "next/head";
import Layout from "components/Layout";
import TeamSchedule from "components/TeamSchedule";

type Props = {
  schedule: any;
  seasonStartDates: any;
  team: Team;
  teams: Team[];
};

export default function TeamSchedulePage(props: Props) {
  const router = useRouter();

  const { data: schedule, error: scheduleError } = useSWR(
    `/teams/${router.query.teamSlug}/schedule.json`,
    undefined,
    {
      initialData: props.schedule,
    }
  );
  const { data: seasonStartDates, error: seasonStartDatesError } = useSWR(
    "/seasonStartDates.json",
    undefined,
    {
      initialData: props.seasonStartDates,
    }
  );
  const { data: team, error: teamError } = useSWR(
    `/teams/${router.query.teamSlug}/details.json`,
    undefined,
    {
      initialData: props.team,
    }
  );

  const { data: teams, error: teamsError } = useSWR(`/teams.json`, undefined, {
    initialData: props.teams,
  });

  if (!router.isFallback && !team) {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <>
      <Head>
        <title>{team.full_name} Schedule - Blaseball-Reference.com</title>
        <meta
          property="og:title"
          content={`${team.full_name} Schedule - Blaseball-Reference.com`}
          key="og:title"
        />
        <meta
          name="description"
          property="og:description"
          content={`The full ${team.full_name} game schedule for current and past Blaseball season.`}
        />
      </Head>
      <Layout>
        <Heading as="h1" mb={4} size="lg">
          {team.full_name} Schedule
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

export const getStaticProps: GetStaticProps = async ({
  params,
  preview = false,
}) => {
  let schedule = null;
  let seasonStartDates = null;
  let team = null;
  let teams = null;

  try {
    schedule = await apiFetcher(`/teams/${params.teamSlug}/schedule.json`);
  } catch (error) {
    console.log(error);
  }

  try {
    seasonStartDates = await apiFetcher("/seasonStartDates.json");
  } catch (error) {
    console.log(error);
  }

  try {
    team = await dbApiFetcher(`/teams/${params.teamSlug}`);
  } catch (error) {
    console.log(error);
  }

  try {
    teams = await dbApiFetcher("/teams");
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
    revalidate: 2700,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  let teams: Team[];

  try {
    teams = await dbApiFetcher("/teams");
  } catch (error) {
    console.log(error);
  }

  return {
    paths: teams.map((team) => `/teams/${team.url_slug}/schedule`) || [],
    fallback: false,
  };
};
