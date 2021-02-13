type TeamId = string;
type SubleagueId = string;

export default interface Division {
  id: string;
  name: string;
  subleague: SubleagueId;
  teams: TeamId;
}
