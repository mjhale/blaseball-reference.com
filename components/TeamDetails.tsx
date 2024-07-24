import * as React from "react";
import { useRouter } from "next/router";

import Team from "types/team";

import { Box, Flex, Heading, Link, Skeleton, Stack } from "@chakra-ui/react";
import NextLink from "next/link";
import TeamHistory from "components/TeamHistory";

type Props = {
  team: Team | null;
};

export default function TeamDetails({ team }: Props) {
  const router = useRouter();

  if (team == null) {
    return (
      <>
        <Skeleton height="20px" mb={4} width="2xs" />
        <Stack>
          <Skeleton height="20px" />
          <Skeleton height="20px" />
          <Skeleton height="20px" />
        </Stack>
      </>
    );
  }

  return (
    <>
      <Heading as="h1" mb={2} size="lg">
        {team.full_name}
      </Heading>
      <TeamHistory teamDetails={team} />
      <Heading as="h2" mb={2} size="md">
        Team Pages
      </Heading>
      <Flex mb={2}>
        <Link
          href={`/teams/${router.query.teamSlug}`}
          as={NextLink}
          fontSize="md"
          textDecoration="underline"
        >
          Player Stats
        </Link>
        <Box mx={1}>-</Box>
        <Link
          href={`/teams/${router.query.teamSlug}/schedule`}
          as={NextLink}
          fontSize="md"
          textDecoration="underline"
        >
          Season Schedule
        </Link>
        <Box mx={1}>-</Box>
        <Link
          href={`${process.env.NEXT_PUBLIC_BLASEBALL_WIKI}/UUID:${team.team_id}`}
          as={NextLink}
          fontSize="md"
          isExternal
          textDecoration="underline"
        >
          Blaseball Wiki
        </Link>
      </Flex>
    </>
  );
}
