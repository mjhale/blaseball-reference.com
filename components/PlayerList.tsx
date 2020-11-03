import { Fragment } from "react";
import Player from "types/player";

import { Box, Divider, Heading, Link, Text } from "@chakra-ui/core";
import NextLink from "next/link";

function groupPlayersByLastName(
  players: Player[]
): { [alphabeticGroup: string]: { group: string; children: Player[] } } {
  return players.reduce((accumulator, player) => {
    const lastName = player.name.split(" ").pop();
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
            let aLastName = a.name
              .split(" ")
              .slice(-1)
              .pop()
              .toLocaleLowerCase();
            let bLastName = b.name
              .split(" ")
              .slice(-1)
              .pop()
              .toLocaleLowerCase();

            return aLastName.localeCompare(bLastName);
          });

          return (
            <Fragment key={alphabeticGroup}>
              <Box my={4}>
                <Divider mb={2} />
                <Heading as="h2" size="md">
                  {alphabeticGroup.toLocaleUpperCase()}
                </Heading>
                {playersInAlphabeticGroup.map((player, index) => {
                  return (
                    <Fragment key={player.id}>
                      <NextLink
                        href="players/[playerSlug]"
                        as={`players/${player.slug}`}
                        passHref
                      >
                        <Link>{player.name}</Link>
                      </NextLink>
                      {player.isIncinerated && (
                        <Text
                          aria-label="incinerated"
                          as="span"
                          fontSize="lg"
                          role="emoji"
                        >
                          🔥
                        </Text>
                      )}
                      {index < playersInAlphabeticGroup.length - 1 && ", "}
                    </Fragment>
                  );
                })}
              </Box>
            </Fragment>
          );
        })}
    </>
  );
}
