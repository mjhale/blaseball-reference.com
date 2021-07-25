import Game from "types/game";

export default interface DailySchedule {
  dayOfMonth: number;
  startingDate: Date | null;
  gamesByHourOfDay: {
    [hour: number]: Array<Game & { visibleOnSite: boolean }>;
  };
}
