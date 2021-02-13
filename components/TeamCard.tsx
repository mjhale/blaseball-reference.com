import renderTeamEmoji from "utils/renderTeamEmoji";

import Team from "types/team";

import { Box, Heading, Link, Text } from "@chakra-ui/react";
import NextLink from "next/link";

type Props = {
  team: Team;
};

export default function TeamCard({ team }: Props) {
  return (
    <NextLink href={`/teams/${team.url_slug}`} passHref>
      <Link
        _hover={{ bgColor: "hsl(35, 100%, 98%)", boxShadow: "md" }}
        alignItems="center"
        border="1px"
        borderColor="gray.200"
        display="flex"
        flexDirection="row"
        height={24}
        justifyContent="flex-start"
        minWidth="300px"
      >
        <Box
          alignItems="center"
          bgColor={team.team_main_color}
          borderRight="1px"
          borderRightColor="gray.200"
          display="flex"
          height="full"
          justifyContent="center"
          mr="3"
          width="20"
        >
          <Text as="span" display="block" fontSize="4xl" role="img">
            {renderTeamEmoji(team.team_emoji)}
          </Text>
        </Box>
        <Box textAlign="left">
          <Heading as="h2" size="md">
            {team.full_name}
          </Heading>
        </Box>
      </Link>
    </NextLink>
  );
}
