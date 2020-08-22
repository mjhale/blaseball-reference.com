import useAlgoliaSearchResults from "hooks/useAlgoliaSearchResults";
import { useEffect } from "react";
import { useRouter } from "next/router";

import { Box, Heading, Link, Skeleton } from "@chakra-ui/core";
import Head from "next/head";
import NextLink from "next/link";
import Layout from "components/Layout";

export default function SearchPage() {
  const router = useRouter();
  const [
    { isError, isLoading, results },
    setSearchTerm,
  ] = useAlgoliaSearchResults();

  useEffect(() => {
    if (router.query?.searchTerm) {
      setSearchTerm(router.query.searchTerm);
    }
  }, [router.query.searchTerm]);

  return (
    <>
      <Head>
        <title>
          Search Blaseball Players and Teams - Blaseball-Reference.com
        </title>
        <meta
          property="og:title"
          content="Search Blaseball Players and Teams - Blaseball-Reference.com"
          key="title"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Heading as="h1" size="lg" mb={4}>
          Search Results
        </Heading>

        {router.query?.searchTerm ? (
          isError ? (
            <Box>
              Sorry, we're having trouble processing your search. Please refresh
              the page.
            </Box>
          ) : isLoading ? (
            <Box>Loading...</Box>
          ) : Object.keys(results).length === 0 ? (
            <Box>No results found.</Box>
          ) : (
            Object.keys(results).map((resultGroup) => (
              <Box _notLast={{ mb: 4 }}>
                <Heading as="h2" mb={1} size="md" textTransform="capitalize">
                  {resultGroup}
                </Heading>
                {results[resultGroup].map((result) => (
                  <Box key={result.objectID} py={1}>
                    {/* @TODO: Remove href={...} logic in upcoming Next.js release */}
                    <NextLink
                      href={
                        resultGroup === "players"
                          ? "/players/[playerSlug]"
                          : resultGroup === "teams"
                          ? "/teams/[teamSlug]"
                          : null
                      }
                      as={result.anchor}
                      passHref
                    >
                      <Link>{result.title}</Link>
                    </NextLink>
                  </Box>
                ))}
              </Box>
            ))
          )
        ) : (
          <Box>Please enter a search query.</Box>
        )}
      </Layout>
    </>
  );
}

export async function getStaticProps({ params, preview = false }) {
  return {
    props: {
      preview,
    },
  };
}
