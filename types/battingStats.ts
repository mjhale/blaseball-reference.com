export default interface PlayerBattingStats {
  careerPostseason: BattingStats;
  careerSeason: BattingStats;
  id: string;
  name: string;
  postseasons: { [seasonNumber: string]: BattingStats };
  seasons: { [seasonNumber: string]: BattingStats };
  slug: string;
}

export interface BattingStats {
  appearances: number;
  atBats: number;
  atBatsWithRunnersInScoringPosition: number;
  basesOnBalls: number;
  battingAverage: number;
  battingAverageWithRunnersInScoringPosition: number;
  caughtStealing: number;
  doublesHit: number;
  groundIntoDoublePlays: number;
  hitByPitches: number;
  hits: number;
  hitsWithRunnersInScoringPosition: number;
  homeRunsHit: number;
  name?: string;
  onBasePercentage: number;
  onBasePlusSlugging: number;
  plateAppearances: number;
  runsBattedIn: number;
  runsScored: number;
  sacrificeBunts: number;
  sacrificeFlies: number;
  season: number;
  slug?: string;
  sluggingPercentage: number;
  stolenBases: number;
  strikeouts: number;
  team: string | null;
  teamName: string | null;
  totalBases: number;
  triplesHit: number;
  quadruplesHit: number;
}
