import Head from "next/head";
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
        <h1>Blaseball Stats, Scores, and History</h1>
        <p>
          The complete source for current and historical blaseball players,
          teams, scores, leaders, umps, blessings, and curses.
        </p>
      </Layout>
    </>
  );
}
