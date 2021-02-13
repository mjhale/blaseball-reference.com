import * as React from "react";
import Player from "types/player";

import { Box, Divider, Heading, Link, Text } from "@chakra-ui/react";
import NextLink from "next/link";

function groupPlayersByLastName(
  players: Player[]
): { [alphabeticGroup: string]: { group: string; children: Player[] } } {
  return players.reduce((accumulator, player) => {
    const lastName = player.player_name.split(" ").pop();
    const group = lastName[0].toLocaleLowerCase();

    if (!accumulator[group]) {
      accumulator[group] = { group, children: [player] };
    } else {
      accumulator[group].children.push(player);
    }

    return accumulator;
  }, {});
}

export default function PlayerList({ players }: { players: Player[] }) {
  if (!players) {
    return <Box>Loading...</Box>;
  }

  const playersGroupedByLastName = groupPlayersByLastName(players);

  return (
    <>
      {Object.keys(playersGroupedByLastName)
        .sort()
        .map((alphabeticGroup) => {
          const playersInAlphabeticGroup = playersGroupedByLastName[
            alphabeticGroup
          ].children.sort((a, b) => {
            const aLastName = a.player_name
              .split(" ")
              .slice(-1)
              .pop()
              .toLocaleLowerCase();
            const bLastName = b.player_name
              .split(" ")
              .slice(-1)
              .pop()
              .toLocaleLowerCase();

            return aLastName.localeCompare(bLastName);
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
                      <NextLink href={`players/${player.url_slug}`} passHref>
                        <Link>{player.player_name}</Link>
                      </NextLink>
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
