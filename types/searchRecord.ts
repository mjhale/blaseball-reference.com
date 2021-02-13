import Player from "types/player";
import Team from "types/team";

export default interface SearchRecord {
  objectID: string;
  title: string;
  aliases: string[];
  uuid: string;
  anchor: string;
  data: Player | Team;
  type: "players" | "teams";
  _highlightResult: {
    title: {
      aliases: string[];
      fullyHighlighted: boolean;
      matchLevel: "full" | "none";
      matchedWords: string[];
      value: string;
    };
    uuid: {
      matchLevel: "full" | "none";
      matchedWords: string[];
      value: string;
    };
  };
}
