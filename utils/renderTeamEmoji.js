export default function renderTeamEmoji(teamEmoji) {
  return Number.isNaN(Number(teamEmoji))
    ? teamEmoji
    : String.fromCodePoint(teamEmoji);
}
