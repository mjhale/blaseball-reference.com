import playersData from "data/players/players.json";
import teamsData from "data/teams.json";

import globby from "globby";
import { SitemapStream, streamToPromise } from "sitemap";

function getPageRoute(page) {
  const path = page.replace("pages", "").replace(".js", "").replace(".mdx", "");
  const route = path === "/index" ? "" : path;

  return route;
}

export default async function generateSitemap(req, res) {
  try {
    const smStream = new SitemapStream({
      hostname: "https://" + req.headers.host,
    });

    const pages = await globby([
      "pages/**/*{.js,.mdx}",
      "!pages/_*.js",
      "!pages/api",
      "!pages/players/[playerSlug].js",
      "!pages/teams/[teamSlug].js",
    ]);
    const players =
      playersData.map((player) => ({ slug: `/players/${player.slug}` })) || [];
    const teams =
      teamsData.map((team) => ({ slug: `/teams/${team.slug}` })) || [];

    pages.map((page) => {
      smStream.write({
        url: getPageRoute(page),
        lastmod: Date.now(),
      });
    });

    for (const player of players) {
      smStream.write({
        url: player.slug,
        lastmod: Date.now(),
      });
    }

    for (const team of teams) {
      smStream.write({
        url: team.slug,
        lastmod: Date.now(),
      });
    }

    smStream.end();

    const sitemap = await streamToPromise(smStream).then((sm) => sm.toString());

    res.setHeader("Content-Type", "text/xml");
    res.write(sitemap);
    res.end();
  } catch (e) {
    console.error(e);
    res.statusCode = 500;
    res.end();
  }
}
