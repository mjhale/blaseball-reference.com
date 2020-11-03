export default interface LeaderCategory {
  abbreviation: string;
  id: string;
  name: string;
  sort: "asc" | "desc";
  minimumPlateAppearancesPerTeamGame?: number;
  type: "batting" | "pitching";
}
