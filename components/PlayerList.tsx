import * as React from "react";

import Player from "types/player";

import { Box, Divider, Heading, Link, Text } from "@chakra-ui/react";
import NextLink from "next/link";

function groupPlayersByLastName(players: Player[]): {
  [alphabeticGroup: string]: { group: string; children: Player[] };
} {
  return players.reduce((accumulator, player) => {
    const splitName = player.player_name.split(" ");
    // Use second word of name unless there is only one word available
    const groupNameSegment = splitName.length > 1 ? splitName[1] : splitName[0];
    // Take first letter of selected name segment, falling back to '?' when impossible
    const group = groupNameSegment?.[0].toLocaleLowerCase() ?? "?";

    if (!accumulator[group]) {
      accumulator[group] = { group, children: [player] };
    } else {
      accumulator[group].children.push(player);
    }

    return accumulator;
  }, {});
}

export default function PlayerList({ players }: { players: Player[] }) {
  const playersGroupedByLastName = groupPlayersByLastName(players);

  return (
    <>
      {Object.keys(playersGroupedByLastName)
        .sort()
        .map((alphabeticGroup) => {
          const playersInAlphabeticGroup = playersGroupedByLastName[
            alphabeticGroup
          ].children.sort((a, b) => {
            const aGroupNameSegment = a.player_name
              .split(" ")
              .slice(0, 2)
              .pop()
              .toLocaleLowerCase();
            const bGroupNameSegment = b.player_name
              .split(" ")
              .slice(0, 2)
              .pop()
              .toLocaleLowerCase();

            return aGroupNameSegment.localeCompare(bGroupNameSegment);
          });

          return (
            <React.Fragment key={alphabeticGroup}>
              <Box my={4}>
                <Divider mb={2} />
                <Heading as="h2" size="md">
                  {alphabeticGroup.toLocaleUpperCase()}
                </Heading>
                {playersInAlphabeticGroup.map((player, index) => {
                  return (
                    <React.Fragment key={player.player_id}>
                      <Link href={`players/${player.url_slug}`} as={NextLink}>
                        {player.player_name}
                      </Link>
                      {player.deceased && (
                        // eslint-disable-next-line jsx-a11y/accessible-emoji
                        <Text
                          aria-label="incinerated"
                          as="span"
                          fontSize="lg"
                          role="img"
                        >
                          🔥
                        </Text>
                      )}
                      {index < playersInAlphabeticGroup.length - 1 && ", "}
                    </React.Fragment>
                  );
                })}
              </Box>
            </React.Fragment>
          );
        })}
    </>
  );
}
