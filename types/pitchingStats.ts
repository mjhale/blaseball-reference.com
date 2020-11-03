export default interface PlayerPitchingStats {
  careerPostseason: PitchingStats;
  careerSeason: PitchingStats;
  id: string;
  name: string;
  postseasons: { [seasonNumber: string]: PitchingStats };
  seasons: { [seasonNumber: string]: PitchingStats };
  slug: string;
}

export interface PitchingStats {
  appearances: number;
  battersFaced: number;
  basesOnBalls: number;
  basesOnBallsPerNine: number;
  earnedRuns: number;
  earnedRunAverage: number;
  flyouts: number;
  groundouts: number;
  hitByPitches: number;
  hitsAllowed: number;
  hitsAllowedPerNine: number;
  homeRuns: number;
  homeRunsPerNine: number;
  inningsPitched: number;
  losses: number;
  name?: string;
  outsRecorded: number;
  pitchCount: number;
  qualityStarts: number;
  season: number;
  shutouts: number;
  slug?: string;
  strikeouts: number;
  strikeoutToWalkRatio: number;
  strikeoutsPerNine: number;
  strikeoutRate: number;
  team: string | null;
  teamName: string | null;
  walksAndHitsPerInningPitched: number;
  walkRate: number;
  winningPercentage: number;
  wins: number;
}
