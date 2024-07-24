// eslint-disable-next-line @typescript-eslint/no-var-requires
const fetch = require("@zeit/fetch-retry")(require("node-fetch"));

module.exports = {
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  // Build redirect lists for player IDs and team IDs
  redirects: async () => {
    const players = await getPlayers();
    const playerRedirects = players.map((player) => {
      return {
        source: `/players/${player.player_id}`,
        destination: `/players/${player.url_slug}`,
        permanent: false,
      };
    });

    const teams = await getTeams();
    const teamRedirects = teams.map((team) => {
      return {
        source: `/teams/${team.team_id}`,
        destination: `/teams/${team.url_slug}`,
        permanent: false,
      };
    });

    return [
      ...(Array.isArray(playerRedirects) && playerRedirects.length > 0
        ? playerRedirects
        : []),
      ...(Array.isArray(teamRedirects) && teamRedirects.length > 0
        ? teamRedirects
        : []),
    ];
  },
  rewrites: async () => {
    return [
      {
        source: "/sitemap.xml",
        destination: "/api/sitemap",
      },
    ];
  },
  webpack: (config, { dev, isServer }) => {
    if (!dev && isServer) {
      const originalEntry = config.entry;

      config.entry = async () => {
        const entries = { ...(await originalEntry()) };

        // These scripts can import components from the app and use ES modules
        entries["./scripts/generate-index"] = "./scripts/generate-index";

        return entries;
      };
    }

    return config;
  },
};

async function getPlayers() {
  let players = [];

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_DATABLASE_API}/players`
    );
    players = await response.json();
  } catch (error) {
    console.log(error);
  }

  return players;
}

async function getTeams() {
  let teams = [];

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_DATABLASE_API}/teams`
    );
    teams = await response.json();
  } catch (error) {
    console.log(error);
  }

  return teams;
}
