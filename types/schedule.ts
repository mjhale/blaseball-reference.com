import Game from "types/game";

export default interface Schedule {
  [seasonNumber: string]: {
    [dayNumber: string]: Array<Game>;
  };
}
