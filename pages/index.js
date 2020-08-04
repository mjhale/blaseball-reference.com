import Head from "next/head";
import Layout from "components/Layout";

export default function Home() {
  return (
    <>
      <Head>
        <title>
          Blaseball Stats, Scores, History, and More - Blaseball-Reference.com
        </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <h1>Blaseball Stats, Scores, and History</h1>
        <p>
          The complete source for current and historical blaseball players,
          teams, scores, leaders, umps, blessings, and curses.
        </p>
      </Layout>
    </>
  );
}
