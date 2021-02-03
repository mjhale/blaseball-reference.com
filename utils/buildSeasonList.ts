export default function buildSeasonList({ minSeason, maxSeason }) {
  if (minSeason == null || maxSeason == null) {
    return [];
  }

  let dropdownSeasonList = [];

  for (let season = maxSeason; season >= minSeason; season--) {
    dropdownSeasonList.push(season);
  }

  return dropdownSeasonList;
}
