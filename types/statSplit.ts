import { BattingStats } from "types/battingStats";
import { PitchingStats } from "types/pitchingStats";
import Team from "types/team";

export default interface StatSplit {
  stat: BattingStats | PitchingStats;
  player: {
    id: string;
    fullName: string;
  };
  team: Team;
}
