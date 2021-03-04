import buildSeasonList from "utils/buildSeasonList";
import { dbApiFetcher } from "lib/api-fetcher";
import { NextApiRequest, NextApiResponse } from "next";
import globby from "globby";
import { SitemapStream, streamToPromise } from "sitemap";
import { translateLeaderViewToSlug } from "utils/slugHelpers";

import ApiConfig from "types/apiConfig";
import Player from "types/player";
import Team from "types/team";

function getPageRoute(page: string): string {
  const path = page
    .replace("pages", "")
    .replace(".js", "")
    .replace(".tsx", "")
    .replace(".mdx", "");
  const route = path === "/index" ? "/" : path;

  return route;
}

export default async function generateSitemap(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const apiConfig: ApiConfig = await dbApiFetcher("/config");
    const players: Player[] = await dbApiFetcher("/players");
    const teams: Team[] = await dbApiFetcher("/teams");

    const minSeason =
      apiConfig != null ? apiConfig.seasons?.minSeason : undefined;
    const maxSeason =
      apiConfig != null ? apiConfig.seasons?.maxSeason : undefined;
    const seasonList = buildSeasonList({ minSeason, maxSeason });

    const viewList = seasonList
      ? seasonList.map((view) => translateLeaderViewToSlug(view))
      : [];

    const smStream = new SitemapStream({
      hostname: "https://" + req.headers.host,
    });

    const pages = await globby([
      "pages/**/*{.tsx,.js,.mdx}",
      "!pages/_*{.tsx,.js}",
      "!pages/api",
      "!pages/players/[playerSlug].tsx",
      "!pages/leaders/[[...viewSlug]].tsx",
      "!pages/teams/[teamSlug].tsx",
      "!pages/teams/[teamSlug]/schedule.tsx",
    ]);

    const playerSlugs =
      players.map((player) => `/players/${player.url_slug}`) || [];
    const teamSlugs = teams.map((team) => `/teams/${team.url_slug}`) || [];
    const leaderSlugs = [
      "/leaders",
      "/leaders/career",
      ...viewList.map((view) => `/leaders/${view}`),
    ];

    for (const page of pages) {
      const pageSlug = getPageRoute(page);
      console.log(pageSlug);

      smStream.write({
        url: pageSlug,
        lastmod: Date.now(),
        changefreq: "daily",
        priority: 0.8,
      });
    }

    for (const leaderSlug of leaderSlugs) {
      smStream.write({
        url: leaderSlug,
        lastmod: Date.now(),
        changefreq: "hourly",
        priority: 0.8,
      });
    }

    for (const playerSlug of playerSlugs) {
      smStream.write({
        url: playerSlug,
        lastmod: Date.now(),
        changefreq: "hourly",
        priority: 0.6,
      });
    }

    for (const teamSlug of teamSlugs) {
      smStream.write({
        url: teamSlug,
        lastmod: Date.now(),
        changefreq: "hourly",
        priority: 0.6,
      });

      smStream.write({
        url: `${teamSlug}/schedule`,
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
