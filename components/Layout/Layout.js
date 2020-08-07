import { Container } from "@chakra-ui/core";
import Navigation from "components/Navigation";
import { SkipNavContent } from "@reach/skip-nav";

export default function Layout({ children }) {
  return (
    <>
      <Navigation />
      <main>
        <SkipNavContent />
        <Container maxWidth="6xl">{children}</Container>
      </main>
    </>
  );
}
