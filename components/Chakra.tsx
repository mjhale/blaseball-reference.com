import { cookieStorageManager, localStorageManager } from "@chakra-ui/react";
import theme from "theme";

import { ChakraProvider } from "@chakra-ui/react";

export function Chakra({ cookies, children }) {
  const colorModeManager =
    typeof cookies === "string"
      ? cookieStorageManager(cookies)
      : localStorageManager;

  return (
    <ChakraProvider colorModeManager={colorModeManager} theme={theme}>
      {children}
    </ChakraProvider>
  );
}
