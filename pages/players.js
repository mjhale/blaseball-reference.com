import Head from "next/head";
import Layout from "components/Layout";
import PlayerList from "components/PlayerList";

import jsonData from "data/players.json";

export default function Players({ players }) {
  return (
    <>
      <Head>
        <title>Blaseball Players - Blaseball-Reference.com</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <h1>Blaseball Players</h1>
        <PlayerList players={players} />
      </Layout>
    </>
  );
}

export async function getStaticProps({ params, preview = false }) {
  const data = jsonData;

  return {
    props: {
      players: data,
      preview,
    },
  };
}
