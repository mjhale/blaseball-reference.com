import { BattingStats } from "types/battingStats";
import { PitchingStats } from "types/pitchingStats";
import Team from "types/team";

export default interface TeamPlayerStats {
  group: "hitting" | "pitching";
  type: "season";
  totalSplits: number;
  splits: Array<{
    season?: number;
    stat: BattingStats & PitchingStats;
    team: Team;
  }>;
}
