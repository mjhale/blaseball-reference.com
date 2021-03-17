import * as React from "react";
import { useDisclosure } from "@chakra-ui/react";
import { useRouter } from "next/router";

import {
  Button,
  FormControl,
  FormLabel,
  FormHelperText,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Textarea,
} from "@chakra-ui/react";

export default function ReportBug() {
  const router = useRouter();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [bugDescription, setBugDescription] = React.useState("");

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    onClose();

    await fetch("/api/reportBug", {
      method: "POST",
      mode: "same-origin",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bugDescription: bugDescription,
        page: router.asPath,
      }),
    });

    setBugDescription("");
  };

  return (
    <>
      <Button fontWeight="normal" onClick={onOpen} size="sm">
        Report Bug
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Report a Bug</ModalHeader>
          <ModalCloseButton />

          <form>
            <ModalBody>
              <FormControl id="email">
                <FormLabel>Bug Description</FormLabel>
                <Textarea
                  onChange={(evt) => setBugDescription(evt.currentTarget.value)}
                  isRequired={true}
                  size="md"
                  value={bugDescription}
                />
                <FormHelperText>
                  Your bug report may be shared with others if humorous.
                </FormHelperText>
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button onClick={handleSubmit}>Submit</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}
