const algoliasearch = require("algoliasearch");
const apiFetcher = require("lib/api-fetcher");

async function generate() {
  if (!process.env.ALGOLIA_ADMIN_KEY) {
    throw new Error("Missing environment variable for 'ALGOLIA_ADMIN_KEY'");
  }

  const players = await apiFetcher("/players/players.json");
  const teams = await apiFetcher("/teams/teams.json");

  const client = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
    process.env.ALGOLIA_ADMIN_KEY
  );
  const index = client.initIndex(process.env.NEXT_PUBLIC_ALGOLIA_INDEX);
  const indexRecords = [];

  for (const player of players) {
    indexRecords.push({
      aliases: [
        ...player.aliases,
        ...(player.isIncinerated === true ? ["incinerated", "🔥"] : []),
      ],
      anchor: `/players/${player.slug}`,
      data: player,
      objectID: player.id,
      title: player.name,
      type: "players",
      uuid: player.id,
    });
  }

  for (const team of teams) {
    indexRecords.push({
      aliases: [team.shorthand, String.fromCodePoint(team.emoji)],
      anchor: `/teams/${team.slug}`,
      data: team,
      objectID: team.id,
      title: team.fullName,
      type: "teams",
      uuid: team.id,
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
