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
    undefined,
    {
      errorRetryCount: 5,
      initialData: props.categories,
    }
  );
  const { data: leaders, error: leadersError } = useSWR(
    "/leaders/leaders.json",
    undefined,
    {
      errorRetryCount: 5,
      initialData: props.leaders,
    }
  );
  const { data: teams, error: teamsError } = useSWR("/teams.json", undefined, {
    errorRetryCount: 5,
    initialData: props.teams,
  });

  return (
    <>
      <Head>
        <title>Blaseball Leaders & Records - Blaseball-Reference.com</title>
        <meta
          property="og:title"
          content="Blaseball Leaders & Records - Blaseball-Reference.com"
          key="og:title"
        />
        <meta
          name="description"
          property="og:description"
          content="Get the latest blaseball player rankings. See who leads the league in batting average, home runs, strikeouts, and more."
        />
      </Head>
      <Layout>
        <Heading as="h1" mb={4} size="lg">
          Blaseball Stat Leaders
        </Heading>

        {categoriesError || leadersError || teamsError ? (
          <Box mb={4}>
            Sorry, we're currently having a siesta and are unable to provide the
            latest stat leader information.
          </Box>
        ) : null}

        <LeaderTables categories={categories} leaders={leaders} teams={teams} />
      </Layout>
    </>
  );
}

function LeaderTables({ categories, leaders, teams }) {
  const [selectedView, setSelectedView] = useState(null);
  const [seasonList, setSeasonList] = useState([]);

  useEffect(() => {
    setSeasonList([
      ...(leaders
        ? Object.keys(leaders)
            .filter((view) => Number(view))
            .sort((a, b) => Number(a) - Number(b))
        : []),
    ]);
  }, [leaders]);

  useEffect(() => {
    if (seasonList.length > 0) {
      const mostRecentSeason = seasonList
        .filter((view) => Number(view))
        .sort((a, b) => Number(a) - Number(b))
        .pop();
      setSelectedView(mostRecentSeason);
    }
  }, [seasonList]);

  const handleSelectChange = (evt) => {
    setSelectedView(evt.target.value);
  };

  if (
    !categories ||
    !Object.hasOwnProperty.call(leaders, selectedView) ||
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
        value={selectedView}
      >
        <option key="allTime" value="allTime">
          {`Career`}
        </option>
        {seasonList.map((season) => (
          <option key={season} value={season}>
            {`Season ${Number(season) + 1}`}
          </option>
        ))}
      </Select>

      {leaders[selectedView].batting ? (
        <>
          <Heading as="h2" size="md" mb={2}>
            {Number(selectedView) ? (
              <>Season {Number(selectedView) + 1} Batting</>
            ) : (
              <>Career Batting</>
            )}
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
            {Object.keys(leaders[selectedView].batting).map((category) => (
              <LeaderTable
                category={categories.find((c) => c.id === category)}
                leaders={leaders[selectedView].batting[category]}
                key={category}
                teams={teams}
              />
            ))}
          </Grid>
        </>
      ) : null}

      {leaders[selectedView].pitching ? (
        <>
          <Heading as="h2" size="md" mb={2}>
            {Number(selectedView) ? (
              <>Season {Number(selectedView) + 1} Pitching</>
            ) : (
              <>Career Pitching</>
            )}
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
            {Object.keys(leaders[selectedView].pitching).map((category) => (
              <LeaderTable
                category={categories.find((c) => c.id === category)}
                leaders={leaders[selectedView].pitching[category]}
                key={category}
                teams={teams}
              />
            ))}
          </Grid>
        </>
      ) : null}
    </>
  );
}

export async function getStaticProps({ params, preview = false }) {
  let categories = null;
  let leaders = null;
  let teams = null;

  try {
    categories = await apiFetcher("/leaders/categories.json");
    leaders = await apiFetcher("/leaders/leaders.json");
    teams = await apiFetcher("/teams.json");
  } catch (error) {
    console.log(error);
  }

  return {
    props: {
      categories,
      preview,
      leaders,
      teams,
    },
    revalidate: 900,
  };
}
