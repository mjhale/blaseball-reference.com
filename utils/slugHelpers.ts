import ApiConfig from "types/apiConfig";

// Derive API view from URL slugs
export function getSplitViewFromSlug(slug: string): string {
  // Slugs `season-1`, `season-2`, .. should be translated to `0`, `1`, ..
  const seasonMatch: Array<string> | null = slug.match(/season-(\d+)/);
  if (seasonMatch !== null) {
    return String(Number(seasonMatch[1]) - 1);
  }

  // The `career` slug is represented as `allTime` in the API
  if (slug === "career") {
    return "career";
  }

  return slug;
}

// Derive API view from URL slugs with API config as context
export function getSplitViewFromSlugWithApiConfig({
  apiConfig,
  viewSlug,
}: {
  apiConfig: ApiConfig;
  viewSlug: string | string[];
}) {
  // Once the apiConfig context has been loaded, the view should be set as:
  // - The `maxSeason` on the `/leaders` page
  // - Derived from the slug on `/leaders/:viewSlug` pages
  return apiConfig !== undefined
    ? viewSlug == undefined
      ? String(apiConfig.seasons.maxSeason)
      : getSplitViewFromSlug(String(viewSlug))
    : null;
}

// Translate API view ids to URL slugs
export function translateLeaderViewToSlug(
  view: string | number
): string | number {
  // Leaders views of '0', '1', '2' should be translated to 'season-1', ..
  if (!Number.isNaN(Number(view))) {
    return `season-${Number(view) + 1}`;
  }

  // The 'allTime' view should be represented as 'career'
  if (view === "allTime") {
    return "career";
  }

  return view;
}
