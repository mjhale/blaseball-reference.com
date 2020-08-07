import { Heading, Stack } from "@chakra-ui/core";

export default function TeamHistory({ team }) {
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
