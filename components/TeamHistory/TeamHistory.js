import { Box, Heading, Stack } from "@chakra-ui/core";

export default function TeamHistory({ team }) {
  if (!team) {
    return <Box>Loading team information...</Box>;
  }

  return (
    <>
      <Stack spacing={4}>
        <Heading as="h1" size="lg">
          {team.fullName}
        </Heading>
      </Stack>
    </>
  );
}
