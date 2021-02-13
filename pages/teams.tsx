import { dbApiFetcher } from "lib/api-fetcher";
import useSWR from "swr";

import { GetStaticProps } from "next";
import Team from "types/team";

import Head from "next/head";
import { Box, Heading, Stack } from "@chakra-ui/react";
import Layout from "components/Layout";
import TeamCardList from "components/TeamCardList";

type Props = {
  teams: Team[];
};

export default function Teams(props: Props) {
  const { data, error } = useSWR("/teams", dbApiFetcher, {
    initialData: props.teams,
  });

  return (
    <>
      <Head>
        <title>Blaseball Teams - Blaseball-Reference.com</title>
        <meta
          property="og:title"
          content="Blaseball Teams -  Blaseball-Reference.com"
          key="og:title"
        />
        <meta
          name="description"
          property="og:description"
          content="Comprehensive scores, standings, stats, and more for every Blaseball team."
        />
      </Head>
      <Layout>
        <Stack spacing={4}>
          <Heading as="h1" size="lg">
            Active Blaseball Franchises
          </Heading>
          {error ? (
            <Box>
              {
                "Sorry, we're currently having a siesta and couldn't load team information."
              }
            </Box>
          ) : (
            <TeamCardList teams={data} />
          )}
        </Stack>
      </Layout>
    </>
  );
}

// export async function getStaticProps({ params, preview = false }) {
export const getStaticProps: GetStaticProps = async ({
  params,
  preview = false,
}) => {
  let teams = null;

  try {
    teams = await dbApiFetcher("/teams");
  } catch (error) {
    console.log(error);
  }

  return {
    props: {
      teams,
      preview,
    },
    revalidate: 900,
  };
};
