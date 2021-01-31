export default interface Team {
  team_id: string;
  location: string;
  nickname: string;
  full_name: string;
  team_abbreviation: string;
  url_slug: string;
  current_team_status: string;
  valid_from: string;
  valid_until: string;
  gameday_from: string;
  season_from: string;
  division: string;
  division_id: string;
  league: string;
  league_id: string;
  tournament_name: string;
  modifications: string[];
  team_main_color: string;
  team_secondary_color: string;
  team_slogan: string;
  team_emoji: string;
}

export interface BlaseballApiTeam {
  id: string;
  lineup: Array<string>;
  rotation: Array<string>;
  bullpen: Array<string>;
  bench: Array<string>;
  seasAttr: Array<string>;
  permAttr: Array<string>;
  fullName: string;
  location: string;
  mainColor: string;
  nickname: string;
  secondaryColor: string;
  shorthand: string;
  emoji: string;
  slogan: string;
  shameRuns: number;
  totalShames: number;
  totalShamings: number;
  seasonShames: number;
  seasonShamings: number;
  championships: number;
  weekAttr: Array<string>;
  gameAttr: Array<string>;
  rotationSlot: number;
  teamSpirit: number;
  card: number;
  slug: string;
}
