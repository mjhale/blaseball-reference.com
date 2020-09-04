import useAlgoliaSearchResults from "hooks/useAlgoliaSearchResults";
import { useEffect } from "react";
import { useRouter } from "next/router";

import { Box, Flex, Heading, Image, Link, Skeleton } from "@chakra-ui/core";
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
          <SearchResults
            isError={isError}
            isLoading={isLoading}
            searchResults={results}
          />
        ) : (
          <Box>Please enter a search query.</Box>
        )}
      </Layout>
    </>
  );
}

function SearchResults({ isError, isLoading, searchResults }) {
  if (isError) {
    return (
      <Box>
        Sorry, we're having trouble processing your search. Please refresh the
        page.
      </Box>
    );
  }

  if (isLoading) {
    return <Box>Loading...</Box>;
  }

  return (
    <>
      {Object.keys(searchResults).length === 0 ? (
        <Box>No results found.</Box>
      ) : (
        Object.keys(searchResults).map((resultGroup) => (
          <Box _notLast={{ mb: 4 }}>
            <Heading as="h2" mb={1} size="md" textTransform="capitalize">
              {resultGroup}
            </Heading>
            {searchResults[resultGroup].map((result) => (
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
      )}
      <Flex justifyContent={{ base: "center", md: "flex-start" }} mt={6}>
        <Link display="inlineBlock" href="https://algolia.com" isExternal>
          <Image
            alt="Search by Algolia"
            height="16px"
            src="/search-by-algolia.svg"
          />
        </Link>
      </Flex>
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
