// Derive API view ids from URL slugs
export function getLeaderViewFromSlug(slug: string): string {
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
