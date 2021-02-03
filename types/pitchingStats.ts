import Team from "types/team";

export default interface PlayerPitchingStats {
  group: "pitching";
  type: "career" | "season";
  totalSplits: number;
  splits: Array<{
    season?: number;
    stat: PitchingStats;
    player: {
      id: string;
      fullName: string;
    };
    team: Team;
  }>;
}

export interface PitchingStats {
  games: number;
  wins: number;
  losses: number;
  win_pct: number;
  pitch_count: number;
  batters_faced: number;
  outs_recorded: number;
  innings: number;
  runs_allowed: number;
  shutouts: number;
  quality_starts: number;
  strikeouts: number;
  walks: number;
  home_runs_allowed: number;
  hits_allowed: number;
  hit_by_pitches: number;
  earned_run_average: number;
  walks_per_9: number;
  hits_per_9: number;
  strikeouts_per_9: number;
  home_runs_per_9: number;
  whip: number;
  strikeouts_per_walk: number;
}
