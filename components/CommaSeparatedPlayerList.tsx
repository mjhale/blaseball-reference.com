import Player from "types/player";

import NextLink from "next/link";
import { Link, List, ListItem } from "@chakra-ui/react";

export default function CommaSeparatedPlayerList({
  players,
}: {
  players: Player[];
}) {
  return (
    <List lineHeight={{ base: "tall", md: "base" }}>
      {players.map((player) => (
        <ListItem
          _notFirst={{
            _before: {
              content: "', '",
            },
          }}
          display="inline"
          key={player.player_id}
        >
          <Link href={`/players/${player.url_slug}`} as={NextLink}>
            {player.player_name}
          </Link>
        </ListItem>
      ))}
    </List>
  );
}
