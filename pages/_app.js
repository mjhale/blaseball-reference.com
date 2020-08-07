import "@reach/skip-nav/styles.css";
import theme from "theme";

import { ChakraProvider, CSSReset } from "@chakra-ui/core";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Lora:wght@700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <ChakraProvider theme={theme}>
        <CSSReset />
        <Component {...pageProps} />
      </ChakraProvider>
    </>
  );
}

export default MyApp;
