import algoliasearch from "algoliasearch/lite";
import useDebounce from "hooks/useDebounce";
import { useEffect, useState } from "react";

export default function useAlgoliaSearchResults() {
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const client = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
    process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY
  );
  const debouncedSearchTerm = useDebounce(searchTerm, 200);
  const index = client.initIndex(process.env.NEXT_PUBLIC_ALGOLIA_INDEX);

  useEffect(() => {
    async function getSearchResults() {
      setResults({});

      if (debouncedSearchTerm.trim() !== "") {
        setIsError(false);
        setIsLoading(true);

        // Fetch autocomplete suggestion results
        await index.search(debouncedSearchTerm).then(
          ({ hits }) => {
            const hitsGroupedByType = hits.reduce(
              (acc, currHit) => ({
                ...acc,
                [currHit.type]: [...(acc[currHit.type] || []), currHit],
              }),
              {}
            );

            setResults(hitsGroupedByType);
          },
          (_error) => {
            setIsError(true);
          }
        );

        setIsLoading(false);
      }
    }

    getSearchResults();
  }, [debouncedSearchTerm]);

  return [{ isError, isLoading, results }, setSearchTerm];
}
