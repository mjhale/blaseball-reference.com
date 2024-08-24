import {
  Heading,
  Link,
  ListItem,
  Stack,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import Head from "next/head";
import Layout from "components/Layout";

export default function ContributePage() {
  return (
    <>
      <Head>
        <title>Contribute to Blaseball - Blaseball-Reference.com</title>
        <meta
          property="og:title"
          content="Contribute to Blaseball - Blaseball-Reference.com"
          key="og:title"
        />
        <meta
          name="description"
          property="og:description"
          content="Help contribute to the tools that power Blaseball statistics."
        />
      </Head>
      <Layout>
        <Heading as="h1" size="lg">
          Contributors Needed
        </Heading>
        <Stack mt={2} spacing={2}>
          <Text>
            Blaseball Reference is powered by open source tools which are
            developed and run by volunteers throughout the Blaseball community.
          </Text>
          <Text>
            A significant effort is required to maintain and continuously update
            these projects alongside each new iteration of Blaseball. If you are
            interested in contributing to this effort, we would be happy to
            assist in onboarding you and finding good first issues to work on.
            Please join the{" "}
            <Link
              href="https://sibr.dev/"
              isExternal
              textDecoration="underline"
              fontWeight="bold"
            >
              Society for Internet Blaseball Research
            </Link>{" "}
            Discord server for assistance.
          </Text>
          <Text>
            These are the community projects which power Blaseball Reference:
          </Text>
          <Text>
            <UnorderedList mt={2} spacing={2}>
              <ListItem>
                <Link
                  href="https://github.com/Society-for-Internet-Blaseball-Research/prophesizer"
                  isExternal
                  textDecoration="underline"
                  fontWeight="bold"
                >
                  Prophesizer
                </Link>{" "}
                provides the primary source of information for Blaseball
                Reference. It is divided into three parts: a handler which
                tracks changes in models such as teams, players, and items; a
                game event parser which processes play-by-play logs; and a
                collection of SQL views which tie everything together in an
                accessible format. It is written in C# and uses Postgres as its
                database. Within the Blaseball Reference pipeline, it is
                currently the project in need of most support.
              </ListItem>
              <ListItem>
                <Link
                  href="https://github.com/Society-for-Internet-Blaseball-Research/datablase"
                  isExternal
                  textDecoration="underline"
                  fontWeight="bold"
                >
                  Datablase
                </Link>{" "}
                provides a publicly accessible API built around Prophesizer. It
                is written in Node.js and uses Prisma as an ORM for accessing
                Prophesizer's Postgres database.
              </ListItem>
              <ListItem>
                <Link
                  href="https://github.com/xSke/Chronicler"
                  isExternal
                  textDecoration="underline"
                  fontWeight="bold"
                >
                  Chronicler
                </Link>{" "}
                provides an API for accessing historical Blaseball data in its
                raw format. It is written in C#.
              </ListItem>
            </UnorderedList>
          </Text>
          <Text>
            Blaseball Reference would not be possible without the support of the
            Society for Internet Blaseball Research as well as the following
            people (listed in alphabetical order):
            <UnorderedList mt={2} spacing={0}>
              <ListItem>allie</ListItem>
              <ListItem>Beefox</ListItem>
              <ListItem>ch00beh</ListItem>
              <ListItem>Corvimae</ListItem>
              <ListItem>Cuttlefishman</ListItem>
              <ListItem>Dargo</ListItem>
              <ListItem>DLareau</ListItem>
              <ListItem>Edgarware</ListItem>
              <ListItem>Gizmo</ListItem>
              <ListItem>glumbaron</ListItem>
              <ListItem>iliana</ListItem>
              <ListItem>korvys</ListItem>
              <ListItem>lilserf</ListItem>
              <ListItem>nightpool</ListItem>
              <ListItem>Paranundrox</ListItem>
              <ListItem>pokeylope</ListItem>
              <ListItem>Sakimori</ListItem>
              <ListItem>shibboh</ListItem>
              <ListItem>tehstone</ListItem>
              <ListItem>vriska</ListItem>
            </UnorderedList>
          </Text>
          <Text>
            Additionally, we would like to thank everyone who has submitted bug
            reports, suggested features, and been involved in the countless
            discussions on all things related to statistics in Blaseball.
          </Text>
        </Stack>
      </Layout>
    </>
  );
}
