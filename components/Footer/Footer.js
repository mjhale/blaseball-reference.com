import {
  Box,
  Container,
  Flex,
  Image,
  Link,
  List,
  ListItem,
  Text,
} from "@chakra-ui/core";
import NextLink from "next/link";

export default function Footer() {
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
            <ListItem display="inline" ml={1}>
              -
            </ListItem>
            <ListItem display="inline" ml={1}>
              <Link
                href="https://blaseball.com"
                isExternal
                textDecoration="underline"
              >
                Blaseball
              </Link>
            </ListItem>
            <ListItem display="inline" ml={1}>
              -
            </ListItem>
            <ListItem display="inline" ml={1}>
              <Link
                href="https://sibr.dev"
                isExternal
                textDecoration="underline"
              >
                SIBR
              </Link>
            </ListItem>
            <ListItem display="inline" ml={1}>
              -
            </ListItem>
            <ListItem display="inline" ml={1}>
              <NextLink href="/privacy" passHref>
                <Link textDecoration="underline">Privacy</Link>
              </NextLink>
            </ListItem>
          </List>
        </Box>
        <Box>
          Blaseball Reference is neither endorsed by nor directly affiliated
          with{" "}
          <Link
            href="https://thegameband.com/"
            isExternal
            textDecoration="underline"
          >
            The Game Band
          </Link>
          <Text as="span"> and </Text>
          <Link
            href="https://www.sports-reference.com/"
            isExternal
            textDecoration="underline"
          >
            Sports Reference
          </Link>
          .
        </Box>
        <Flex alignItems="center" justifyContent="center" mt={4}>
          <Link
            display="block"
            href="https://vercel.com/"
            isExternal
            mr={2}
            rel="nofollow"
          >
            <Image alt="Hosted by Vercel" height="20px" src="/vercel.svg" />
          </Link>
          <Link
            display="block"
            href="https://heap.io/?utm_source=badge"
            isExternal
            mr={2}
            rel="nofollow"
          >
            <Image
              alt="Product analytics by Heap"
              height="41px"
              src="/heap-analytics.png"
              width="108px"
            />
          </Link>
          <Link
            display="block"
            href="https://algolia.com"
            isExternal
            rel="nofollow"
          >
            <Image alt="Search by Algolia" height="20px" src="/algolia.svg" />
          </Link>
        </Flex>
      </Box>
    </Container>
  );
}
