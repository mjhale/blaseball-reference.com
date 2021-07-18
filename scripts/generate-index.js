/* eslint-disable @typescript-eslint/no-var-requires */
const algoliasearch = require("algoliasearch");
const fetch = require("@zeit/fetch-retry")(require("node-fetch"));
const renderTeamEmoji = require("../utils/renderTeamEmoji.js").default;

export default async function apiFetcher(endpoint) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_DATABLASE_API}${endpoint}`
  );

  return res.json();
}

async function generate() {
  if (!process.env.ALGOLIA_ADMIN_KEY) {
    throw new Error("Missing environment variable for 'ALGOLIA_ADMIN_KEY'");
  }

  const players = await apiFetcher("/players");
  const teams = await apiFetcher("/teams");

  const client = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
    process.env.ALGOLIA_ADMIN_KEY
  );
  const index = client.initIndex(process.env.NEXT_PUBLIC_ALGOLIA_INDEX);
  const indexRecords = [];

  for (const player of players) {
    indexRecords.push({
      aliases: [
        // @TODO: Re-add aliases once Datablase API adds support
        // ...player.aliases,
        ...(player.deceased === true ? ["incinerated", "🔥"] : []),
      ],
      anchor: `/players/${player.url_slug}`,
      data: player,
      objectID: player.player_id,
      title: player.player_name,
      type: "players",
      uuid: player.player_id,
    });
  }

  for (const team of teams) {
    indexRecords.push({
      aliases: [team.nickname, renderTeamEmoji(team.team_emoji)],
      anchor: `/teams/${team.url_slug}`,
      data: team,
      objectID: team.team_id,
      title: team.full_name,
      type: "teams",
      uuid: team.team_id,
    });
  }

  index
    .saveObjects(indexRecords)
    .then(({ objectIDs }) => {
      console.log(`Generated search index for ${objectIDs.length} objects`);
    })
    .catch((error) => {
      console.log("Unable to generate search index:");
      console.log(error);
    });
}

generate();
