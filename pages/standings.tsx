import apiFetcher from "lib/api-fetcher";
import { GetStaticProps } from "next";
import { Fragment, useEffect, useState } from "react";
import useSWR from "swr";

import Head from "next/head";
import { Box, Heading, Select, Skeleton, Stack } from "@chakra-ui/core";
import Layout from "components/Layout";
import StandingsTable from "components/StandingsTable";

export default function StandingsPage(props) {
  const { data: leaguesAndDivisions, error: leaguesAndDivisionsError } = useSWR(
    "/leaguesAndDivisions.json",
    undefined,
    {
      initialData: props.leaguesAndDivisions,
    }
  );

  const { data: standings, error: standingsError } = useSWR(
    "/standings/standings.json",
    undefined,
    {
      initialData: props.standings,
    }
  );

  const { data: teams, error: teamsError } = useSWR("/teams.json", undefined, {
    initialData: props.teams,
  });

  return (
    <>
      <Head>
        <title>Blaseball Standings - Blaseball-Reference.com</title>
        <meta
          property="og:title"
          content="Blaseball Standings - Blaseball-Reference.com"
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
        {standingsError || leaguesAndDivisionsError ? (
          <Box mb={4}>
            Sorry, we're currently having a siesta and couldn't load the latest
            standings.
          </Box>
        ) : null}
        <Standings
          leaguesAndDivisions={leaguesAndDivisions}
          standings={standings}
          teams={teams}
        />
      </Layout>
    </>
  );
}

function Standings({ leaguesAndDivisions, standings, teams }) {
  const sortedSeasonList = () =>
    standings
      ? Object.keys(standings).sort((a, b) => Number(a) - Number(b))
      : [];
  const mostRecentSeason = () => sortedSeasonList().pop();

  const [selectedSeason, setSelectedSeason] = useState(mostRecentSeason());
  const [seasonList, setSeasonList] = useState(sortedSeasonList());

  useEffect(() => {
    setSeasonList(sortedSeasonList);
  }, [JSON.stringify(sortedSeasonList)]);

  useEffect(() => {
    if (seasonList.length > 0) {
      setSelectedSeason(seasonList[seasonList.length - 1]);
    }
  }, [JSON.stringify(seasonList)]);

  const handleSelectChange = (evt) => {
    setSelectedSeason(evt.target.value);
  };

  if (
    !leaguesAndDivisions ||
    !Object.hasOwnProperty.call(standings, selectedSeason) ||
    !standings
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

      {Object.entries(standings[selectedSeason]).map(
        ([divisionId, divisionTeams]) => {
          const division = leaguesAndDivisions.seasons[
            selectedSeason
          ].divisions.find((division) => division.id === divisionId);
          const seasonDivisions =
            leaguesAndDivisions.seasons[selectedSeason].divisions;

          return (
            <Fragment key={`${selectedSeason}-${divisionId}`}>
              <StandingsTable
                division={division}
                divisions={seasonDivisions}
                season={selectedSeason}
                standings={standings[selectedSeason][divisionId]}
                teams={teams}
              />
            </Fragment>
          );
        }
      )}
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({
  params,
  preview = false,
}) => {
  let leaguesAndDivisions = null;
  let standings = null;
  let teams = null;

  try {
    leaguesAndDivisions = await apiFetcher("/leaguesAndDivisions.json");
    standings = await apiFetcher("/standings/standings.json");
    teams = await apiFetcher("/teams.json");
  } catch (error) {
    console.log(error);
  }

  return {
    props: {
      leaguesAndDivisions,
      preview,
      standings,
      teams,
    },
    revalidate: 900,
  };
};
