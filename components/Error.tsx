import { Box, Heading, Stack } from "@chakra-ui/react";
import * as React from "react";

type Props = {
  children?: React.ReactNode;
  type?: number;
};

export default function Error({ children, type }: Props) {
  return (
    <Stack spacing={3}>
      <Heading as="h1" size="lg">
        Error
      </Heading>
      {children ? (
        <Box>{children}</Box>
      ) : type === 404 ? (
        <Box>The page you were looking for cannot be found.</Box>
      ) : (
        <Box>The page you were looking for is currently unavailable.</Box>
      )}
    </Stack>
  );
}
