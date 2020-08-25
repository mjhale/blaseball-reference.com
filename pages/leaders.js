import apiFetcher from "lib/api-fetcher";
import useSWR from "swr";

import Head from "next/head";
import { Box, Heading, Grid } from "@chakra-ui/core";
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
  const { data: seasons, error: seasonsError } = useSWR(
    "/leaders/bySeason.json",
    apiFetcher,
    {
      initialData: props.seasons,
    }
  );
  const currentSeason = seasons ? Object.keys(seasons).sort().pop() : null;
  const currentSeasonLeaders = currentSeason ? seasons[currentSeason] : null;

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
        <Heading as="h1" size="lg" mb={4}>
          Blaseball Stat Leaders
        </Heading>

        {categoriesError || seasonsError ? (
          <Box>
            Sorry, we're currently having a siesta and couldn't load stat leader
            information.
          </Box>
        ) : null}

        {categories && currentSeasonLeaders ? (
          <>
            <Heading as="h2" size="md" mb={2}>
              Current Season Batting
            </Heading>
            {currentSeasonLeaders?.batting && (
              <Grid
                templateColumns={{
                  sm: "repeat(1, 1fr)",
                  md: "repeat(2, 1fr)",
                  lg: "repeat(4, 1fr)",
                }}
                gap={2}
                mb={4}
              >
                {Object.keys(currentSeasonLeaders.batting).map((category) => (
                  <LeaderTable
                    category={categories.find((c) => c.id === category)}
                    leaders={currentSeasonLeaders.batting[category]}
                  />
                ))}
              </Grid>
            )}
            <Heading as="h2" size="md" mb={2}>
              Current Season Pitching
            </Heading>
            {currentSeasonLeaders?.pitching && (
              <Grid
                templateColumns={{
                  sm: "repeat(1, 1fr)",
                  md: "repeat(2, 1fr)",
                  lg: "repeat(4, 1fr)",
                }}
                gap={2}
                mb={4}
              >
                {Object.keys(currentSeasonLeaders.pitching).map((category) => (
                  <LeaderTable
                    category={categories.find((c) => c.id === category)}
                    leaders={currentSeasonLeaders.pitching[category]}
                    key={category}
                  />
                ))}
              </Grid>
            )}
          </>
        ) : null}
      </Layout>
    </>
  );
}

export async function getStaticProps({ params, preview = false }) {
  const categories = await apiFetcher("/leaders/categories.json");
  const seasons = await apiFetcher("/leaders/bySeason.json");

  return {
    props: {
      categories: categories,
      seasons: seasons,
      preview,
    },
    revalidate: 60,
  };
}
