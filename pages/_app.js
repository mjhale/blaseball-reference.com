import apiFetcher from "lib/api-fetcher";
import theme from "theme";
import { SWRConfig } from "swr";

import "@reach/skip-nav/styles.css";

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
        <SWRConfig
          value={{
            fetcher: apiFetcher,
            refreshInterval: 900000,
          }}
        >
          <Component {...pageProps} />
        </SWRConfig>
      </ChakraProvider>
    </>
  );
}

export default MyApp;
