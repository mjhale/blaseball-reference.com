import { Box, Container, Heading, Flex, Link, Text } from "@chakra-ui/core";
import NextLink from "next/link";
import { SkipNavLink } from "@reach/skip-nav";

const MenuItem = ({ children, href }) => (
  <NextLink href={href} passHref>
    <Link mt={{ base: 4, md: 0 }} ml={{ md: 6 }} display="block">
      {children}
    </Link>
  </NextLink>
);

export default function Navigation() {
  const [isOpen, setIsOpen] = React.useState(false);
  const handleToggle = () => setIsOpen(!isOpen);

  return (
    <>
      <SkipNavLink />
      <Container maxWidth="6xl">
        <Flex
          as="nav"
          align="center"
          justify="space-between"
          wrap="wrap"
          mb={6}
          mt={8}
          bg="white"
        >
          <Flex align="center">
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
          </Flex>

          <Box
            cursor="pointer"
            display={{ base: "block", md: "none" }}
            p={3}
            onClick={handleToggle}
          >
            <svg
              fill="black"
              width="12px"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Menu</title>
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
            </svg>
          </Box>
          <Box
            alignItems={{ base: "center", md: "right" }}
            display={{ base: isOpen ? "block" : "none", md: "flex" }}
            width={{ base: "full", md: "auto" }}
            justifyContent={{ md: "flex-end" }}
            flexGrow={1}
          >
            <MenuItem href="/players">Players</MenuItem>
            <MenuItem href="/teams">Teams</MenuItem>
            <MenuItem href="/seasons">Seasons</MenuItem>
            <MenuItem href="/playoffs">Playoffs</MenuItem>
            <MenuItem href="/game-viewer">Game Viewer</MenuItem>
          </Box>
        </Flex>
      </Container>
    </>
  );
}
