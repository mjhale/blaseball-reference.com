import { Box, Heading, Link, Text } from "@chakra-ui/core";
import NextLink from "next/link";

export default function TeamCard({ team }) {
  return (
    <NextLink href="teams/[teamSlug]" as={`teams/${team.slug}`} passHref>
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
          bgColor={team.mainColor}
          borderRight="1px"
          borderRightColor="gray.200"
          display="flex"
          height="full"
          justifyContent="center"
          mr="3"
          width="20"
        >
          <Text as="span" display="block" fontSize="4xl" role="emoji">
            {String.fromCodePoint(team.emoji)}
          </Text>
        </Box>
        <Box textAlign="left">
          <Heading as="h2" size="md">
            {team.fullName}
          </Heading>
        </Box>
      </Link>
    </NextLink>
  );
}
