import { Box, Divider, Heading, Link, Text } from "@chakra-ui/core";
import NextLink from "next/link";

function groupPlayersByLastName(players) {
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

export default function PlayerList({ players }) {
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
            <React.Fragment key={alphabeticGroup}>
              <Box my={4}>
                <Divider mb={2} />
                <Heading as="h2" size="md">
                  {alphabeticGroup.toLocaleUpperCase()}
                </Heading>
                {playersInAlphabeticGroup.map((player, index) => {
                  return (
                    <React.Fragment key={player.id}>
                      <NextLink
                        href="players/[playerId]"
                        as={`players/${player.slug}`}
                        passHref
                      >
                        <Link>{player.name}</Link>
                      </NextLink>
                      {player.isIncinerated && (
                        <Text
                          ariaLabel="incinerated"
                          as="span"
                          fontSize="lg"
                          role="emoji"
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
