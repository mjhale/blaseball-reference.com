export default interface Player {
  aliases: ReadonlyArray<string>;
  id: string;
  currentTeamId: string;
  currentTeamName: string;
  debutDay: number;
  debutGameId: string;
  debutSeason: number;
  debutTeamId: string;
  debutTeamName: string;
  isIncinerated: boolean;
  incineratedGameDay: number | null;
  incineratedGameId: string | null;
  incineratedGameSeason: number | null;
  lastGameDay: number;
  lastGameId: string;
  lastGameSeason: number;
  name: string;
  position: "lineup" | "rotation";
  slug: string;
  armor: string;
  bat: string;
  blood: number;
  ritual: string;
}
