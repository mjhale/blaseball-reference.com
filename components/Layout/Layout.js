import { Alert, AlertIcon, Container } from "@chakra-ui/core";
import Footer from "components/Footer";
import Navigation from "components/Navigation";
import { SkipNavContent } from "@reach/skip-nav";

export default function Layout({ children }) {
  return (
    <>
      <Navigation />
      <main>
        <SkipNavContent />
        <Container maxWidth="6xl">
          <Alert bgColor="gray.100" mb={4} status="info">
            <AlertIcon />
            This is a work-in-progress build. All stats are based on incomplete
            data.
          </Alert>

          {children}
        </Container>
      </main>
      <Footer />
    </>
  );
}
