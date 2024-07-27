import useDebounce from "hooks/useDebounce";
import * as React from "react";
import fs from "flexsearch";
import searchIndexJSON from "../lib/search-index.json";

import Player from "types/player";
import Team from "types/team";
import SearchRecord from "types/searchRecord";

function loadIndex(): [
      {[index: string]: SearchRecord},
      any,
] {
  // TODO cache this index probably
  const index = new fs.Document({
      id: "uuid",
      index: [
          {
              field: "uuid",
              tokenize: "strict",
          },
          {
              field: "title",
              tokenize: "forward",
          },
      ],
  });
  const indexRecords = {};
  searchIndexJSON.p.forEach((record) => {
      indexRecords[record[2]] = {
          anchor: `/players/${record[0]}`,
          title: record[1],
          uuid: record[2],
          type: 'players',
      };
  });
  searchIndexJSON.t.forEach((record) => {
      indexRecords[record[2]] = {
          anchor: `/teams/${record[0]}`,
          title: record[1],
          uuid: record[2],
          type: 'teams',
      };
  });
  for (const key in indexRecords) {
      index.add(indexRecords[key]);
  }

  return [indexRecords, index];
}

export default function useSearchResults(): [
  {
    isError: boolean;
    isLoading: boolean;
    results: { players?: Player[]; teams?: Team[] };
  },
  React.Dispatch<React.SetStateAction<string>>
] {
  const [isError, setIsError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [results, setResults] = React.useState({});
  const [searchTerm, setSearchTerm] = React.useState("");

  const debouncedSearchTerm = useDebounce(searchTerm, 200);

  const [indexRecords, index] = loadIndex();

  React.useEffect(() => {
    async function getSearchResults() {
      setResults({});

      if (debouncedSearchTerm.trim() !== "") {
        setIsError(false);
        setIsLoading(true);

        // Fetch autocomplete suggestion results and group into result types (i.e., players, teams)
        await index.searchAsync(debouncedSearchTerm).then(
          (results) => {
            if (!results || results.length === 0) {
                setResults({});
                return;
            };
            const hits = results[0].result.map((r) => {
                return indexRecords[r];
            })
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
          () => {
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
