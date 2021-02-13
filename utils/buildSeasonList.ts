export default function buildSeasonList({
  minSeason,
  maxSeason,
}: {
  minSeason: number | null;
  maxSeason: number | null;
}): number[] {
  if (minSeason == null || maxSeason == null) {
    return [];
  }

  const dropdownSeasonList = [];

  for (let season = maxSeason; season >= minSeason; season--) {
    dropdownSeasonList.push(season);
  }

  return dropdownSeasonList;
}
