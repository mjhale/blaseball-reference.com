import { Box, Container, Link } from "@chakra-ui/core";

export default function Footer() {
  return (
    <Container maxWidth="6xl">
      <Box
        as="footer"
        color="gray.400"
        fontSize="sm"
        fontStyle="italic"
        my={{ base: 6, md: 8 }}
        textAlign="center"
      >
        Blaseball Reference is neither endorsed by or directly affiliated with{" "}
        <Link href="https://thegameband.com/" isExternal>
          The Game Band
        </Link>{" "}
        or{" "}
        <Link href="https://www.sports-reference.com/" isExternal>
          Sports Reference
        </Link>
        .
      </Box>
    </Container>
  );
}
