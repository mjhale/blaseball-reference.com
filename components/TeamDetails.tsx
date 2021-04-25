import * as React from "react";
import { useRouter } from "next/router";

import Team from "types/team";

import { Box, Flex, Heading, Link, Skeleton, Stack } from "@chakra-ui/react";
import NextLink from "next/link";
import TeamHistory from "components/TeamHistory";

type Props = {
  team: Team | null;
  teamIsValidating: boolean;
};

export default function TeamDetails({ team, teamIsValidating }: Props) {
  const router = useRouter();

  if (team == null && teamIsValidating) {
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
        <NextLink href={`/teams/${router.query.teamSlug}`} passHref>
          <Link fontSize="md" textDecoration="underline">
            Player Stats
          </Link>
        </NextLink>
        <Box mx={1}>-</Box>
        <NextLink href={`/teams/${router.query.teamSlug}/schedule`} passHref>
          <Link fontSize="md" textDecoration="underline">
            Season Schedule
          </Link>
        </NextLink>
        <Box mx={1}>-</Box>
        <NextLink
          href={`${process.env.NEXT_PUBLIC_BLASEBALL_WIKI_URL}/UUID:${team.team_id}`}
          passHref
        >
          <Link fontSize="md" isExternal textDecoration="underline">
            Blaseball Wiki
          </Link>
        </NextLink>
      </Flex>
    </>
  );
}
