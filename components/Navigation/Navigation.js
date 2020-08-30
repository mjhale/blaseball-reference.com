import {
  Box,
  Button,
  Container,
  Heading,
  Flex,
  Link,
  Text,
} from "@chakra-ui/core";
import NextLink from "next/link";
import SearchForm from "components/SearchForm";
import { SkipNavLink } from "@reach/skip-nav";
import { useState } from "react";

const MenuItem = ({ children, href }) => (
  <NextLink href={href} passHref>
    <Link
      _notLast={{
        borderBottom: { base: "1px solid" },
        borderBottomColor: { base: "gray.200" },
      }}
      px={{ base: 6, md: 1 }}
      py={{ base: 3, md: 2 }}
      ml={{ md: 6 }}
      display="block"
    >
      {children}
    </Link>
  </NextLink>
);

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  function handleToggle(event) {
    setIsOpen(!isOpen);
  }

  return (
    <>
      <SkipNavLink />
      <Container maxWidth="6xl">
        <Flex
          as="nav"
          align="center"
          justify="space-between"
          wrap="wrap"
          mt={8}
          bg="white"
        >
          <Flex
            align="center"
            justify={{ base: "space-between", md: "normal" }}
            width={{ base: "100%", md: "auto" }}
          >
            <Heading as="h1" size="lg">
              <NextLink href="/" passHref>
                <Link
                  _hover={{ textDecoration: "none" }}
                  display="block"
                  fontFamily="heading"
                  lineHeight="0.9"
                  textTransform="uppercase"
                  textDecoration="none"
                >
                  <Text
                    as="span"
                    fontFamily="inherit"
                    fontSize="4xl"
                    fontWeight="bold"
                    textTransform="inherit"
                  >
                    Blaseball
                  </Text>
                  <Text
                    as="span"
                    color="hsl(0, 100%, 50%)"
                    display="block"
                    fontFamily="inherit"
                    fontSize="xl"
                    textTransform="inherit"
                  >
                    Reference
                  </Text>
                </Link>
              </NextLink>
            </Heading>
            <Button
              cursor="pointer"
              display={{ base: "block", md: "none" }}
              p={{ base: 3 }}
              onClick={handleToggle}
            >
              <svg
                fill="black"
                width={16}
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>Menu</title>
                <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
              </svg>
            </Button>
          </Flex>
          <Box
            mt={{ base: 4 }}
            minWidth={{ base: "auto", md: "md" }}
            width={{ base: "100%", md: "auto" }}
          >
            <SearchForm />
          </Box>
        </Flex>

        <Flex as="nav" align="center" wrap="nowrap" mb={4} mt={4} bg="white">
          <Box
            alignItems="left"
            bgColor="gray.100"
            display={{ base: isOpen ? "flex" : "none", md: "flex" }}
            flexDirection={{ base: "column", md: "row" }}
            flexGrow={1}
            justifyContent={{ md: "flex-start" }}
          >
            <MenuItem href="/players">Players</MenuItem>
            <MenuItem href="/teams">Teams</MenuItem>
            <MenuItem href="/leaders">Leaders</MenuItem>
            <MenuItem href="/standings">Standings</MenuItem>
          </Box>
        </Flex>
      </Container>
    </>
  );
}
