/* eslint-disable @typescript-eslint/no-var-requires */
const fetch = require("@zeit/fetch-retry")(require("node-fetch"));
const { writeFileSync } = require("fs");

async function apiFetcher(endpoint) {
  const res = await fetch(
    `https://api.sibr.dev/datablase/v2${endpoint}`
  );

  return res.json();
}

async function generate() {
  const players = await apiFetcher("/players?fields=player_id,player_name,url_slug,deceased");
  const teams = await apiFetcher("/teams");

  const indexRecords = {
    'p': [],
    't': [],
  };

  for (const player of players) {
    indexRecords.p.push([
      player.url_slug,
      player.player_name,
      player.player_id,
    ]);
  }

  for (const team of teams) {
    indexRecords.t.push([
      team.url_slug,
      team.full_name,
      team.team_id,
    ]);
  }

  writeFileSync("./public/data/search-index.json", JSON.stringify(indexRecords))
}

generate();
