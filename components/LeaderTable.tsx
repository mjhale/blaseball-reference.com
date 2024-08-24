import { LeaderCategory, LeaderColumn } from "types/leader";
import Team from "types/team";
import { useColorModeValue } from "@chakra-ui/react";

import { Box, Flex, Link, Text, VisuallyHidden } from "@chakra-ui/react";
import NextLink from "next/link";

type Props = {
  columns: LeaderColumn[];
  leaderCategories: LeaderCategory[];
  teams: Team[];
};

export default function LeaderTable({
  columns,
  leaderCategories,
  teams,
}: Props) {
  const categoryHeadingBackgroundHeader = useColorModeValue(
    "gray.100",
    "gray.700"
  );
  const categoryTableBorderColor = useColorModeValue("gray.300", "gray.700");
  const categoryTableRowHover = useColorModeValue(
    "hsl(35, 100%, 95%)",
    "gray.700"
  );

  return (
    <>
      {leaderCategories.map((category) => {
        const column = columns.find(
          (column) => column.dataField === category.leaderCategory
        );

        return (
          <Flex
            border="1px solid"
            borderColor={categoryTableBorderColor}
            flexDirection="column"
            key={category.leaderCategory}
          >
            <Box
              bgColor={categoryHeadingBackgroundHeader}
              borderBottom="1px"
              borderBottomColor={categoryTableBorderColor}
              fontWeight="medium"
              p="1"
              textAlign="center"
            >
              {column ? column.label : category.leaderCategory}
            </Box>
            {category.leaders &&
              category.leaders.map((leader, index) => {
                // @TODO: Add expand option for leader categories to account for tie bumps
                if (index >= 10) {
                  return null;
                }

                const leaderTeam = teams.find(
                  (team) => team.team_id === leader.team_id
                );

                return (
                  <Flex
                    _hover={{ bgColor: categoryTableRowHover }}
                    flexDirection="row"
                    fontSize="sm"
                    justifyContent="space-between"
                    key={`${index}-${leader.rank}-${leader.player_id}`}
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
                        {leader.rank}
                      </Text>
                      <Link
                        href={`/players/${leader.player_id}`}
                        as={NextLink}
                        prefetch={false}
                      >
                        {leader.player_name}
                        <VisuallyHidden>player information</VisuallyHidden>
                      </Link>
                      {leaderTeam ? (
                        <>
                          <Text as="span" ml={1}>
                            (
                          </Text>
                          <Link
                            href={`/teams/${leaderTeam.url_slug}`}
                            as={NextLink}
                            prefetch={false}
                          >
                            {leaderTeam.team_abbreviation}
                            <VisuallyHidden>team information</VisuallyHidden>
                          </Link>
                          <Text as="span">)</Text>
                        </>
                      ) : null}
                    </Box>
                    <Box>
                      {Number.isSafeInteger(leader.value)
                        ? leader.value
                        : Number(leader.value).toFixed(3)}
                    </Box>
                  </Flex>
                );
              })}
          </Flex>
        );
      })}
    </>
  );
}
