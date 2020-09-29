import {
  Alert,
  AlertDescription,
  AlertIcon,
  Container,
  Link,
  Text,
} from "@chakra-ui/core";
import Footer from "components/Footer";
import Navigation from "components/Navigation";
import NextLink from "next/link";
import { SkipNavContent } from "@reach/skip-nav";

export default function Layout({ children }) {
  return (
    <>
      <Navigation />
      <main>
        <Container maxWidth="6xl">
          <PreviewBuildWarning />
          <StatDisclaimerNotice />

          <>
            <SkipNavContent />
            {children}
          </>
        </Container>
      </main>
      <Footer />
    </>
  );
}

function PreviewBuildWarning() {
  const DEPLOYMENT_ENV = process.env.NEXT_PUBLIC_DEPLOYMENT_ENV;

  if (DEPLOYMENT_ENV === "production") {
    return null;
  }

  return (
    <Alert mb={4} status="warning">
      <AlertIcon />
      <AlertDescription>
        This is a subdomain intended for previewing unstable features. For the
        main website, visit{" "}
        <NextLink href="https://blaseball-reference.com/" passHref>
          <Link display="inline-block" isExternal textDecoration="underline">
            www.blaseball-reference.com
          </Link>
        </NextLink>
        .
      </AlertDescription>
    </Alert>
  );
}

function StatDisclaimerNotice() {
  return (
    <Alert bgColor="gray.100" mb={4} status="info">
      <AlertIcon />
      All stats are currently based on incomplete data.
    </Alert>
  );
}
