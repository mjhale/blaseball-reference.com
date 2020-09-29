import useForbiddenKnowledge from "hooks/useForbiddenKnowledge";

import { Box, Container, Link, List, ListItem, Text } from "@chakra-ui/core";

export default function Footer() {
  const [forbiddenKnowledge, setForbiddenKnowledge] = useForbiddenKnowledge();

  return (
    <Container maxWidth="6xl">
      <Box
        as="footer"
        color="gray.600"
        fontSize="sm"
        my={{ base: 8, md: 10 }}
        textAlign="center"
      >
        <Box mb={2}>
          <List>
            <ListItem display="inline">
              <Link
                href="https://twitter.com/blaseball_ref"
                isExternal
                textDecoration="underline"
              >
                Twitter
              </Link>
            </ListItem>
            <ListItem display="inline" ml={1}>
              -
            </ListItem>
            <ListItem display="inline" ml={1}>
              <Link
                href="https://github.com/mjhale/blaseball-reference.com"
                isExternal
                textDecoration="underline"
              >
                GitHub
              </Link>
            </ListItem>
          </List>
        </Box>
        <Box mb={2}>
          <Link
            as="button"
            href="#"
            onClick={() => setForbiddenKnowledge(!forbiddenKnowledge)}
            textDecoration="underline"
          >
            {forbiddenKnowledge ? "disable" : "enable"} Forbidden Knowledge
          </Link>
        </Box>
        <Box>
          Blaseball Reference is neither endorsed by or directly affiliated with{" "}
          <Link
            href="https://thegameband.com/"
            isExternal
            textDecoration="underline"
          >
            The Game Band
          </Link>
          <Text as="span"> or </Text>
          <Link
            href="https://www.sports-reference.com/"
            isExternal
            textDecoration="underline"
          >
            Sports Reference
          </Link>
          .
        </Box>
      </Box>
    </Container>
  );
}
