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
        <script
          dangerouslySetInnerHTML={{
            __html: `window.heap=window.heap||[],heap.load=function(e,t){window.heap.appid=e,window.heap.config=t=t||{};var r=document.createElement("script");r.type="text/javascript",r.async=!0,r.src="https://cdn.heapanalytics.com/js/heap-"+e+".js";var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(r,a);for(var n=function(e){return function(){heap.push([e].concat(Array.prototype.slice.call(arguments,0)))}},p=["addEventProperties","addUserProperties","clearEventProperties","identify","resetIdentity","removeEventProperty","setEventProperties","track","unsetEventProperty"],o=0;o<p.length;o++)heap[p[o]]=n(p[o])};
              heap.load(${process.env.NEXT_PUBLIC_HEAP_IO_KEY});`,
          }}
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
