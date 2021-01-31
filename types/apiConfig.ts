export default interface ApiConfig {
  seasons: {
    minSeason: number;
    maxSeason: number;
  };
  gameTypes: Array<{ label: string; value: string }>;
  columns: {
    [statGroup: string]: Array<{
      id: string;
      label: string;
      labelBrief: string;
      dataField: string;
      description: string;
      formula: string;
    }>;
  };
  defaults: {
    gameType: string;
    season: number;
    statType: string;
  };
}
