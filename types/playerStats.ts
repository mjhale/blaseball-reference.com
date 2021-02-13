import { BattingStats } from "types/battingStats";
import { PitchingStats } from "types/pitchingStats";
import Team from "types/team";

export default interface PlayerStats {
  group: "hitting" | "pitching";
  type: "career" | "season";
  totalSplits: number;
  splits: Array<{
    season?: number;
    stat: BattingStats & PitchingStats;
    player: {
      id: string;
      fullName: string;
    };
    team: Team;
  }>;
}
