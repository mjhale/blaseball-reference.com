import Game from "types/game";

export default interface ChroniclerGame {
  gameId: string;
  startTime: string;
  endTime: string;
  data: Game;
}
