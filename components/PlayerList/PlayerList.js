import Link from "next/link";

export default function PlayerList({ players }) {
  return (
    <>
      {players.map((player) => {
        return (
          <div key={player._id}>
            <Link href="players/[playerId]" as={`players/${player._id}`}>
              <a>{player.name}</a>
            </Link>
          </div>
        );
      })}
    </>
  );
}
