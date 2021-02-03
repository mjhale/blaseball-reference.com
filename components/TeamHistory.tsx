import Team from "types/team";

import { Box, Heading, Skeleton } from "@chakra-ui/react";

export default function TeamHistory({ teamDetails }: { teamDetails: Team }) {
  if (!teamDetails) {
    return (
      <Box mb={2}>
        <Skeleton height="20px" width="2xs" />
      </Box>
    );
  }

  return (
    <>
      <Heading as="h2" mb={2} size="md">
        Team Details
      </Heading>
      <Box fontSize="md" mb={2}>
        <Box>Slogan: {teamDetails.team_slogan}</Box>
      </Box>
    </>
  );
}
