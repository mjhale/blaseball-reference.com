import jsonData from "data/teams.json";

import Head from "next/head";
import Heading from "components/Heading";
import Layout from "components/Layout";
import TeamCardList from "components/TeamCardList";

export default function Teams({ teams }) {
  return (
    <>
      <Head>
        <title>Blaseball Teams - Blaseball-Reference.com</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Heading>Active Blaseball Franchises</Heading>
        <TeamCardList teams={teams} />
      </Layout>
    </>
  );
}

export async function getStaticProps({ params, preview = false }) {
  const data = jsonData;

  return {
    props: {
      teams: data,
      preview,
    },
  };
}
