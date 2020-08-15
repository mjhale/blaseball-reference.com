import { Alert, AlertIcon, Container } from "@chakra-ui/core";
import Navigation from "components/Navigation";
import { SkipNavContent } from "@reach/skip-nav";

export default function Layout({ children }) {
  return (
    <>
      <Navigation />
      <main>
        <SkipNavContent />
        <Container maxWidth="6xl">
          <Alert mb={4} status="warning">
            <AlertIcon />
            This is a work-in-progress build. All stats are based on incomplete
            data.
          </Alert>

          {children}
        </Container>
      </main>
    </>
  );
}
