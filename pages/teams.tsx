import { dbApiFetcher } from "lib/api-fetcher";

import { GetStaticProps } from "next";
import Team from "types/team";

import ApiUsageHelper from "components/ApiUsageHelper";
import { Box, Flex, Heading, Stack } from "@chakra-ui/react";
import Head from "next/head";
import Layout from "components/Layout";
import TeamCardList from "components/TeamCardList";

type Props = {
  teams: Team[];
};

export default function Teams(props: Props) {
  const { teams } = props;

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
          {teams == null ? (
            <Box>
              {
                "Sorry, we're currently having a siesta and couldn't load team information."
              }
            </Box>
          ) : (
            <TeamCardList teams={teams} />
          )}
        </Stack>

        <Flex justifyContent="center" mt={6}>
          <ApiUsageHelper
            apiCalls={[`${process.env.NEXT_PUBLIC_DATABLASE_API}/teams`]}
          />
        </Flex>
      </Layout>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ preview = false }) => {
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
    revalidate: 2700,
  };
};
