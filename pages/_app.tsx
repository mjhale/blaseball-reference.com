import apiFetcher from "lib/api-fetcher";
import { AppProps } from "next/app";
import { SWRConfig } from "swr";

import "@reach/skip-nav/styles.css";

import { GetServerSideProps } from "next";

import { ApiConfigWrapper } from "context/ApiConfig";
import { Chakra } from "components/Chakra";
import { CSSReset } from "@chakra-ui/react";
import Head from "next/head";

export default function BRApp({ Component, pageProps }: AppProps) {
  const DEPLOYMENT_ENV = process.env.NEXT_PUBLIC_DEPLOYMENT_ENV;

  return (
    <>
      <Head>
        {DEPLOYMENT_ENV !== "production" ? (
          <meta name="robots" content="noindex" />
        ) : null}
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.heap=window.heap||[],heap.load=function(e,t){window.heap.appid=e,window.heap.config=t=t||{};var r=document.createElement("script");r.type="text/javascript",r.async=!0,r.src="https://cdn.heapanalytics.com/js/heap-"+e+".js";var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(r,a);for(var n=function(e){return function(){heap.push([e].concat(Array.prototype.slice.call(arguments,0)))}},p=["addEventProperties","addUserProperties","clearEventProperties","identify","resetIdentity","removeEventProperty","setEventProperties","track","unsetEventProperty"],o=0;o<p.length;o++)heap[p[o]]=n(p[o])};
              heap.load(${process.env.NEXT_PUBLIC_HEAP_IO_ID});`,
          }}
        />
        <meta
          key="og:image"
          property="og:image"
          content="https://blaseball-reference.com/default-share-image.jpg"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@blaseball_ref" />
      </Head>
      <Chakra cookies={pageProps.cookies}>
        <CSSReset />
        <SWRConfig
          value={{
            fetcher: apiFetcher,
            revalidateOnFocus: false,
            refreshInterval: 0,
            shouldRetryOnError: false,
          }}
        >
          <ApiConfigWrapper>
            <Component {...pageProps} />
          </ApiConfigWrapper>
        </SWRConfig>
      </Chakra>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  return {
    props: {
      cookies: req.headers.cookie ?? "",
    },
  };
};
