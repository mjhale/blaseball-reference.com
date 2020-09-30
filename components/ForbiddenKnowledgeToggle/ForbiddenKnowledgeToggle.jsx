import useForbiddenKnowledge from "hooks/useForbiddenKnowledge";

import { Button, Flex, Link } from "@chakra-ui/core";

export default function ForbiddenKnowledgeToggle() {
  const [
    showForbiddenKnowledge,
    setShowForbiddenKnowledge,
  ] = useForbiddenKnowledge();

  return (
    <Flex justifyContent="center" mt={8}>
      <Button
        onClick={() => setShowForbiddenKnowledge(!showForbiddenKnowledge)}
      >
        {showForbiddenKnowledge ? "Hide" : "Show"} Forbidden Knowledge
      </Button>
    </Flex>
  );
}
