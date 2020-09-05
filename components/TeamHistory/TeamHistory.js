import { Box, Heading, Skeleton } from "@chakra-ui/core";

export default function TeamHistory({ teamDetails }) {
  if (!teamDetails) {
    return (
      <Box mb={2}>
        <Skeleton height="20px" width="2xs" />
      </Box>
    );
  }

  return (
    <>
      <Heading as="h1" mb={2} size="lg">
        {teamDetails.fullName}
      </Heading>
    </>
  );
}
