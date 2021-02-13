type DivisionId = string;
type TeamId = string;

export default interface Subleague {
  divisions: DivisionId[];
  id: string;
  name: string;
  teams: TeamId[];
}
