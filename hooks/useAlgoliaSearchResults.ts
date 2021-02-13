import algoliasearch from "algoliasearch/lite";
import useDebounce from "hooks/useDebounce";
import * as React from "react";

import SearchRecord from "types/searchRecord";

export default function useAlgoliaSearchResults(): [
  {
    isError: boolean;
    isLoading: boolean;
    results: Record<string, SearchRecord[]>;
  },
  React.Dispatch<React.SetStateAction<string>>
] {
  const [isError, setIsError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [results, setResults] = React.useState({});
  const [searchTerm, setSearchTerm] = React.useState("");

  const client = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
    process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY
  );
  const debouncedSearchTerm = useDebounce(searchTerm, 200);
  const index = client.initIndex(process.env.NEXT_PUBLIC_ALGOLIA_INDEX);

  React.useEffect(() => {
    async function getSearchResults() {
      setResults({});

      if (debouncedSearchTerm.trim() !== "") {
        setIsError(false);
        setIsLoading(true);

        // Fetch autocomplete suggestion results and group into result types (i.e., players, teams)
        await index.search(debouncedSearchTerm).then(
          // @ts-expect-error: Argument not assignable error
          ({ hits }: { hits: SearchRecord[] }) => {
            const hitsGroupedByType = hits.reduce(
              (
                acc: { [hitType: string]: SearchRecord[] },
                currHit: SearchRecord
              ) => ({
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
