export interface BattingStats {
  batting_average: number;
  on_base_percentage: number;
  slugging: number;
  plate_appearances: number;
  at_bats: number;
  hits: number;
  walks: number;
  singles: number;
  doubles: number;
  triples: number;
  quadruples: number;
  home_runs: number;
  runs_batted_in: number;
  strikeouts: number;
  sacrifice_bunts: number;
  sacrifice_flies: number;
  at_bats_risp: number;
  hits_risp: number;
  batting_average_risp: number | null;
  on_base_slugging: number | null;
  total_bases: number;
  hit_by_pitches: number;
  ground_outs: number;
  flyouts: number;
  gidp: number;
}
