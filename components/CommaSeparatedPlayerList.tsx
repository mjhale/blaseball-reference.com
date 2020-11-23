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
          key={player.id}
        >
          <NextLink href={`/players/${player.slug}`} passHref>
            <Link>{player.name}</Link>
          </NextLink>
        </ListItem>
      ))}
    </List>
  );
}
