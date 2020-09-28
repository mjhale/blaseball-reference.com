import { Box, Flex, Link, Text, VisuallyHidden } from "@chakra-ui/core";
import NextLink from "next/link";

export default function LeaderTable({ category, leaders, teams }) {
  return (
    <Flex border="1px solid" borderColor="gray.300" flexDirection="column">
      <Box
        bgColor="gray.100"
        borderBottom="1px"
        borderBottomColor="gray.200"
        fontWeight="medium"
        p="1"
        textAlign="center"
      >
        {category.name}
      </Box>
      {leaders &&
        leaders.map((leader, index) => {
          const leaderTeam = teams.find((team) => team.id === leader.team);

          return (
            <Flex
              _hover={{ bgColor: "hsl(35, 100%, 95%)" }}
              flexDirection="row"
              fontSize="sm"
              justifyContent="space-between"
              key={leader.playerId}
              py={1}
              px={2}
            >
              <Box>
                <Text
                  as="div"
                  display="inline-block"
                  minWidth={5}
                  mr={1}
                  textAlign="right"
                >
                  {index === 0 && <>{index + 1}.</>}

                  {index !== 0 &&
                    index > 0 &&
                    leaders[index - 1].value !== leaders[index].value && (
                      <>{index + 1}. </>
                    )}
                </Text>
                <NextLink
                  href="/players/[playerSlug]"
                  as={`/players/${leader.playerSlug}`}
                  passHref
                >
                  <Link>
                    {leader.playerName}
                    <VisuallyHidden>player information</VisuallyHidden>
                  </Link>
                </NextLink>
                {leaderTeam ? (
                  <>
                    <Text as="span" ml={1}>
                      (
                    </Text>
                    <NextLink
                      href="/teams/[teamSlug]"
                      as={`/teams/${leaderTeam.slug}`}
                      passHref
                    >
                      <Link>
                        {leaderTeam.shorthand}
                        <VisuallyHidden>team information</VisuallyHidden>
                      </Link>
                    </NextLink>
                    <Text as="span">)</Text>
                  </>
                ) : null}
              </Box>
              <Box>
                {Number.isSafeInteger(leader.value)
                  ? leader.value
                  : Number.parseFloat(leader.value).toFixed(3)}
              </Box>
            </Flex>
          );
        })}
    </Flex>
  );
}
