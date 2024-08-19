import buildSeasonList from "utils/buildSeasonList";
import apiFetcher, { dbApiFetcher } from "lib/api-fetcher";
import * as React from "react";
import { useRouter } from "next/router";
import {
  getSplitViewFromSlugWithApiConfig,
  translateLeaderViewToSlug,
} from "utils/slugHelpers";

import ApiConfig from "types/apiConfig";
import Division from "types/division";
import { GetStaticPaths, GetStaticProps } from "next";
import { SeasonStandings } from "types/standings";
import Subleague from "types/subleague";
import Team from "types/team";

import Head from "next/head";
import { Heading } from "@chakra-ui/react";
import Layout from "components/Layout";
import SplitViewSelect from "components/SplitViewSelect";
import StandingsTable from "components/StandingsTable";

type Props = {
  apiConfig: ApiConfig;
  leaguesAndDivisions: {
    divisions: Division[];
    subleagues: Subleague[];
  };
  standings: SeasonStandings;
  teams: Team[];
};

export default function StandingsPage(props: Props) {
  const { apiConfig, leaguesAndDivisions, standings, teams } = props;
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
      `/standings/${translateLeaderViewToSlug(evt.currentTarget.value)}`
    );
  };

  return (
    <>
      <Head>
        <title>
          {`${
            isNaN(parseFloat(splitView))
              ? "Blaseball Standings"
              : `Blaseball Standings for Season ${Number(splitView) + 1}`
          } - Blaseball-Reference.com`}
        </title>
        <meta
          property="og:title"
          content={`${
            isNaN(parseFloat(splitView))
              ? "Blaseball Standings"
              : `Blaseball Standings for Season ${Number(splitView) + 1}`
          } - Blaseball-Reference.com`}
          key="og:title"
        />
        <meta
          name="description"
          property="og:description"
          content="Get the latest Blaseball standings from across the league. Follow your favorite team through the current season!"
        />
      </Head>
      <Layout>
        <Heading as="h1" mb={4} size="lg">
          Blaseball Standings
        </Heading>

        <SplitViewSelect
          apiConfig={apiConfig}
          handleSelectChange={handleSelectChange}
          selectedView={selectedView}
        />

        {Object.entries(standings).map(([divisionId]) => {
          const division = leaguesAndDivisions.divisions.find(
            (division) => division.id === divisionId
          );
          const seasonDivisions = leaguesAndDivisions?.divisions;

          return (
            <React.Fragment key={`${selectedView}-${divisionId}`}>
              <StandingsTable
                division={division}
                divisions={seasonDivisions}
                season={selectedView}
                standings={standings[divisionId]}
                teams={teams}
              />
            </React.Fragment>
          );
        })}
      </Layout>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({
  params,
  preview = false,
}) => {
  let apiConfig: ApiConfig | null = null;
  let leaguesAndDivisions = null;
  let standings = null;
  let teams: Team[] | null = null;

  try {
    apiConfig = await dbApiFetcher("/config");
  } catch (error) {
    console.log(error);
  }

  const splitView = getSplitViewFromSlugWithApiConfig({
    apiConfig,
    viewSlug:
      params.viewSlug !== undefined ? String(params.viewSlug) : undefined,
  });

  try {
    [teams, leaguesAndDivisions, standings] = await Promise.all([
      dbApiFetcher("/teams"),
      // Retrieve and return only relevant season data from JSON payload
      apiFetcher("/leaguesAndDivisions.json").then(
        (json) => json.seasons[splitView.toString()]
      ),
      apiFetcher("/standings/standings.json").then(
        (json) => json[splitView.toString()]
      ),
    ]);
  } catch (error) {
    console.log(error);
  }

  return {
    props: {
      apiConfig,
      leaguesAndDivisions,
      preview,
      standings,
      teams,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  let apiConfig: ApiConfig | null = null;

  try {
    apiConfig = await dbApiFetcher("/config");
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

  return {
    paths:
      ["/standings", ...viewList.map((view) => `/standings/${view}`)] || [],
    fallback: false,
  };
};
