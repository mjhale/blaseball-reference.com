import Head from "next/head";
import { Box, Flex, Heading } from "@chakra-ui/core";

import Layout from "components/Layout";

export default function IndexPage() {
  return (
    <>
      <Head>
        <title>
          Blaseball Stats, Scores, History, and More - Blaseball-Reference.com
        </title>
        <meta
          property="og:title"
          content="Blaseball Stats, Scores, History, and More - Blaseball-Reference.com"
          key="title"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Heading as="h1" mb={4} size="lg">
          Blaseball Stats, Scores, and History
        </Heading>
        <Box mb={2}>
          The complete source for current and historical blaseball players,
          teams, scores, leaders, umps, blessings, and curses.
        </Box>
        <Box mb={2}>Launching soon.</Box>
      </Layout>
    </>
  );
}
