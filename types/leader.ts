export default interface Leader {
  player_id: string;
  player_name: string;
  url_slug: string;
  team_id: string;
  team: string;
  value: number;
  rank: number;
  stat: string;
  season?: number;
}

export interface LeaderCategory {
  leaderCategory: string;
  leaders: Leader[];
}

export interface LeaderColumn {
  id: string;
  label: string;
  labelBrief: string;
  dataField: string;
  description: string;
  formula: string;
}

export interface LeaderGroup {
  leaderCategories: LeaderCategory[];
  season: number;
  statGroup: "hitting" | "pitching";
}
