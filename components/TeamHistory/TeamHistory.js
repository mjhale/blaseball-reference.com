import { Box, Heading, Stack } from "@chakra-ui/core";

export default function TeamHistory({ team }) {
  if (!team) {
    return <Box>Loading team history...</Box>;
  }

  return (
    <>
      <Stack spacing={4}>
        <Heading as="h1" size="lg">
          {team.fullName}
        </Heading>
        <Heading as="h2" size="md">
          Team History
        </Heading>
      </Stack>
    </>
  );
}
