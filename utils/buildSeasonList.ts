export default function buildSeasonList({ minSeason, maxSeason }) {
  if (minSeason === undefined || maxSeason === undefined) {
    return [];
  }

  let dropdownSeasonList = [];

  for (let season = maxSeason; season >= minSeason; season--) {
    dropdownSeasonList.push(season);
  }

  return dropdownSeasonList;
}
