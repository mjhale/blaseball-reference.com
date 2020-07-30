import Head from "next/head";
import Layout from "components/Layout";

import styles from "styles/Home.module.css";

export default function Home() {
  return (
    <>
      <Head>
        <title>
          Blaseball Stats, Scores, History, and More - Blaseball-Reference.com
        </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout></Layout>
    </>
  );
}
