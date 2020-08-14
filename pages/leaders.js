import jsonCategoryData from "data/leaders/categories.json";
import jsonSeasonData from "data/leaders/bySeason.json";

import Head from "next/head";
import { Heading, Grid, Spacing } from "@chakra-ui/core";
import Layout from "components/Layout";
import LeaderTable from "components/LeaderTable";

export default function LeadersPage({ categories, currentSeasonLeaders }) {
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
      </Layout>
    </>
  );
}

export async function getStaticProps({ params, preview = false }) {
  const categoriesData = jsonCategoryData;
  const seasonData = jsonSeasonData;

  const currentSeason = Object.keys(seasonData).sort().pop();
  const currentSeasonLeaders = seasonData[currentSeason];

  return {
    props: {
      categories: categoriesData,
      currentSeasonLeaders: currentSeasonLeaders,
      preview,
    },
  };
}
