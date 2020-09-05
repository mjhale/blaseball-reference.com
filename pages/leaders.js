import apiFetcher from "lib/api-fetcher";
import { useEffect, useState } from "react";
import useSWR from "swr";

import Head from "next/head";
import { Box, Heading, Grid, Select, Skeleton, Stack } from "@chakra-ui/core";
import Layout from "components/Layout";
import LeaderTable from "components/LeaderTable";

export default function LeadersPage(props) {
  const { data: categories, error: categoriesError } = useSWR(
    "/leaders/categories.json",
    apiFetcher,
    {
      initialData: props.categories,
    }
  );
  const { data: leadersBySeason, error: leadersBySeasonError } = useSWR(
    "/leaders/bySeason.json",
    apiFetcher,
    {
      initialData: props.leadersBySeason,
    }
  );
  const { data: teams, error: teamsError } = useSWR("/teams.json", apiFetcher, {
    initialData: props.teams,
  });

  return (
    <>
      <Head>
        <title>Blaseball Leaders & Records - Blaseball-Reference.com</title>
        <meta
          property="og:title"
          content="Blaseball Leaders & Records - Blaseball-Reference.com"
          key="title"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Heading as="h1" mb={4} size="lg">
          Blaseball Stat Leaders
        </Heading>

        {categoriesError || leadersBySeasonError || teamsError ? (
          <Box mb={4}>
            Sorry, we're currently having a siesta and are unable to provide the
            latest stat leader information.
          </Box>
        ) : null}

        <LeaderTables
          categories={categories}
          leadersBySeason={leadersBySeason}
          teams={teams}
        />
      </Layout>
    </>
  );
}

function LeaderTables({ categories, leadersBySeason, teams }) {
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [seasonList, setSeasonList] = useState([]);

  useEffect(() => {
    setSeasonList([
      ...(leadersBySeason
        ? Object.keys(leadersBySeason).sort((a, b) => Number(a) - Number(b))
        : []),
    ]);
  }, [leadersBySeason]);

  useEffect(() => {
    if (seasonList.length > 0) {
      setSelectedSeason(seasonList[seasonList.length - 1]);
    }
  }, [seasonList]);

  const handleSelectChange = (evt) => {
    setSelectedSeason(evt.target.value);
  };

  if (
    !categories ||
    !Object.hasOwnProperty.call(leadersBySeason, selectedSeason) ||
    !teams
  ) {
    return (
      <>
        <Select
          isDisabled={true}
          fontSize={{ base: "lg", md: "md" }}
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

      {leadersBySeason[selectedSeason].batting ? (
        <>
          <Heading as="h2" size="md" mb={2}>
            Season {Number(selectedSeason) + 1} Batting
          </Heading>
          <Grid
            templateColumns={{
              base: "repeat(1, 1fr)",
              md: "repeat(2, 1fr)",
              lg: "repeat(4, 1fr)",
            }}
            gap={2}
            mb={4}
          >
            {Object.keys(leadersBySeason[selectedSeason].batting).map(
              (category) => (
                <LeaderTable
                  category={categories.find((c) => c.id === category)}
                  leaders={leadersBySeason[selectedSeason].batting[category]}
                  key={category}
                  teams={teams}
                />
              )
            )}
          </Grid>
        </>
      ) : null}

      {leadersBySeason[selectedSeason].pitching ? (
        <>
          <Heading as="h2" size="md" mb={2}>
            Season {Number(selectedSeason) + 1} Pitching
          </Heading>
          <Grid
            templateColumns={{
              base: "repeat(1, 1fr)",
              md: "repeat(2, 1fr)",
              lg: "repeat(4, 1fr)",
            }}
            gap={2}
            mb={4}
          >
            {Object.keys(leadersBySeason[selectedSeason].pitching).map(
              (category) => (
                <LeaderTable
                  category={categories.find((c) => c.id === category)}
                  leaders={leadersBySeason[selectedSeason].pitching[category]}
                  key={category}
                  teams={teams}
                />
              )
            )}
          </Grid>
        </>
      ) : null}
    </>
  );
}

export async function getStaticProps({ params, preview = false }) {
  const categories = await apiFetcher("/leaders/categories.json");
  const leadersBySeason = await apiFetcher("/leaders/bySeason.json");
  const teams = await apiFetcher("/teams.json");

  return {
    props: {
      categories,
      preview,
      leadersBySeason,
      teams,
    },
    revalidate: 60,
  };
}
