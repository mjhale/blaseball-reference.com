import * as React from "react";
import { useClipboard, useDisclosure } from "@chakra-ui/react";

import {
  Button,
  Flex,
  Input,
  Link,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Text,
} from "@chakra-ui/react";

type Props = {
  apiCalls: string[];
};

export default function ApiUsageHelper(props: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const DocumentationLink = (
    <Link
      href="https://api.sibr.dev/docs/"
      isExternal={true}
      textDecoration="underline"
    >
      documentation website
    </Link>
  );

  const OpenSourceLink = (
    <Link
      href="https://github.com/Society-for-Internet-Blaseball-Research/datablase"
      isExternal={true}
      textDecoration="underline"
    >
      open source
    </Link>
  );

  const DiscordLink = (
    <Link
      href="https://discord.gg/F8YSJE6"
      isExternal={true}
      textDecoration="underline"
    >
      SIBR Discord server
    </Link>
  );

  return (
    <>
      <Button onClick={onOpen} size="sm" variant="outline">
        Use Our Data
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Using Our Data</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={4}>
            <Text mb={2}>
              The data on Blaseball Reference is powered by the Society for
              Internet Blaseball Research's Datablase API. It is{" "}
              {OpenSourceLink} and free to use.
            </Text>

            <Text mb={2}>
              The {DocumentationLink} has information on all API endpoints. If
              you need assistance, please join the #Datablase channel on the{" "}
              {DiscordLink}.
            </Text>

            <Text mb={4}>On this page, the following API calls are made:</Text>

            {props.apiCalls.map((url, id) => (
              <ApiCall key={id} url={url} />
            ))}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

function ApiCall(props: { url: string }) {
  const [copyValue, setCopyValue] = React.useState(props.url);
  const { hasCopied, onCopy } = useClipboard(copyValue);

  React.useEffect(() => {
    setCopyValue(props.url);
  }, [props.url]);

  return (
    <Flex mb={4}>
      <Input value={props.url} isReadOnly />
      <Button onClick={onCopy} ml={2}>
        {hasCopied ? "Copied" : "Copy"}
      </Button>
    </Flex>
  );
}
