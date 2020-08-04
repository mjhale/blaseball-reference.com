import jsonData from "data/players.json";
import { useRouter } from "next/router";

import ErrorPage from "next/error";
import Layout from "components/Layout";

export default function Player({ player }) {
  const router = useRouter();

  if (!router.isFallback && !player?._id) {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <Layout>
      <h1>Player Name: {player.name}</h1>
      <dt>
        <li>Bats: Unknown</li>
        <li>Hits: Unknown</li>
      </dt>

      <h2>Career Summary</h2>
      <dt>
        <li>WAR: 94.8</li>
        <li>AB: 50</li>
        <li>H: 3249234</li>
        <li>HR: 324</li>
        <li>BA: 58</li>
      </dt>

      <h2>Batting Summary</h2>
      <table>
        <thead>
          <tr>
            <td>Season</td>
            <td>Team</td>
            <td>League</td>
            <td>Games</td>
            <td>At Bats</td>
            <td>Runs</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>MILS</td>
            <td>BL</td>
            <td>99</td>
            <td>393</td>
            <td>148</td>
          </tr>
        </tbody>
      </table>
    </Layout>
  );
}

export async function getStaticProps({ params, preview = false }) {
  const data = jsonData;
  const player = data.find((player) => player._id === params.playerId);

  return {
    props: {
      player,
      preview,
    },
  };
}

export async function getStaticPaths() {
  const data = jsonData;
  const paths = data.map((player) => `/players/${player._id}`) || [];

  return {
    paths,
    fallback: false,
  };
}
