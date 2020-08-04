import jsonData from "data/teams.json";
import { useRouter } from "next/router";

import ErrorPage from "next/error";
import Layout from "components/Layout";
import TeamHistory from "components/TeamHistory";

export default function Team({ team }) {
  const router = useRouter();

  if (!router.isFallback && !team?._id) {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <Layout>
      <TeamHistory team={team} />
    </Layout>
  );
}

export async function getStaticProps({ params, preview = false }) {
  const data = jsonData;
  const team = data.find((team) => team._id === params.teamId);

  return {
    props: {
      team,
      preview,
    },
  };
}

export async function getStaticPaths() {
  const data = jsonData;
  const paths = data.map((team) => `/teams/${team._id}`) || [];

  return {
    paths,
    fallback: false,
  };
}
