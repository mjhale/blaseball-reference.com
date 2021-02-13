import apiFetcher from "lib/api-fetcher";
import globby from "globby";
import { SitemapStream, streamToPromise } from "sitemap";

import { NextApiRequest, NextApiResponse } from "next";

function getPageRoute(page: string): string {
  const path = page
    .replace("pages", "")
    .replace(".js", "")
    .replace(".tsx", "")
    .replace(".mdx", "");
  const route = path === "/index" ? "" : path;

  return route;
}

export default async function generateSitemap(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const players = await apiFetcher("/players/players.json");
    const teams = await apiFetcher("/teams.json");

    const smStream = new SitemapStream({
      hostname: "https://" + req.headers.host,
    });

    const pages = await globby([
      "pages/**/*{.tsx,.js,.mdx}",
      "!pages/_*{.tsx,.js}",
      "!pages/api",
      "!pages/players/[playerSlug].js",
      "!pages/teams/[teamSlug].js",
      "!pages/teams/[teamSlug]/schedule.js",
    ]);

    const playerSlugs =
      players.map((player) => ({ slug: `/players/${player.slug}` })) || [];
    const teamSlugs =
      teams.map((team) => ({ slug: `/teams/${team.slug}` })) || [];

    pages.map((page) => {
      smStream.write({
        url: getPageRoute(page),
        lastmod: Date.now(),
        changefreq: "daily",
        priority: 0.8,
      });
    });

    for (const player of playerSlugs) {
      smStream.write({
        url: player.slug,
        lastmod: Date.now(),
        changefreq: "hourly",
        priority: 0.6,
      });
    }

    for (const team of teamSlugs) {
      smStream.write({
        url: team.slug,
        lastmod: Date.now(),
        changefreq: "hourly",
        priority: 0.6,
      });

      smStream.write({
        url: `${team.slug}/schedule`,
        lastmod: Date.now(),
        changefreq: "hourly",
        priority: 0.4,
      });
    }

    smStream.end();

    const sitemap = await streamToPromise(smStream).then((sm) => sm.toString());

    res.setHeader("Content-Type", "text/xml");
    res.setHeader("Cache-Control", "max-age=86400, public");
    res.write(sitemap);
    res.end();
  } catch (e) {
    console.error(e);
    res.statusCode = 500;
    res.end();
  }
}
