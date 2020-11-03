export default interface SearchRecord {
  objectID: string;
  title: string;
  aliases: string[];
  uuid: string;
  anchor: string;
  data: {};
  type: "players" | "teams";
}
