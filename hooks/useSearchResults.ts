import * as React from "react";
import fs from "flexsearch";
import useSWR from "swr";

import Player from "types/player";
import Team from "types/team";
import SearchRecord from "types/searchRecord";

type SearchIndex = {
  document: any;
  records: null | { p: IndexRecord[]; t: IndexRecord[] };
};

type IndexRecord = {
  anchor: string;
  title: string;
  uuid: string;
  type: "players" | "teams";
};

function useSearchIndex(): readonly [
  null | SearchIndex,
  boolean,
  null | Error,
  () => void,
] {
  const [shouldInitialize, setShouldInitialize] = React.useState(false);
  const [searchIndex, setSearchIndex] = React.useState<null | SearchIndex>(
    null
  );

  const {
    error: fetchError,
    isLoading,
    data,
  } = useSWR<null | { p: IndexRecord[]; t: IndexRecord[] }, Error | undefined>(
    shouldInitialize ? "/data/search-index.json" : null,
    async (url: string) => {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(await response.text());
      }

      return await response.json();
    },
    { revalidateOnFocus: false }
  );

  React.useEffect(() => {
    if (!data || searchIndex) {
      return;
    }

    const document = new fs.Document({
      document: {
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
      },
    });
    const indexRecords = { p: [], t: [] };

    data.p.forEach((record) => {
      indexRecords[record[2]] = {
        anchor: `/players/${record[0]}`,
        title: record[1],
        uuid: record[2],
        type: "players",
      };
    });

    data.t.forEach((record) => {
      indexRecords[record[2]] = {
        anchor: `/teams/${record[0]}`,
        title: record[1],
        uuid: record[2],
        type: "teams",
      };
    });

    for (const key in indexRecords) {
      document.add(indexRecords[key]);
    }

    setSearchIndex({
      document,
      records: indexRecords,
    });
  }, [searchIndex, shouldInitialize, data]);

  return React.useMemo(
    () => [searchIndex, isLoading, fetchError, () => setShouldInitialize(true)],
    [searchIndex, isLoading, fetchError, setShouldInitialize]
  );
}

export default function useSearchResults(): [
  {
    isError: boolean;
    isLoading: boolean;
    results: { players?: Player[]; teams?: Team[] };
  },
  React.Dispatch<React.SetStateAction<string>>,
  React.Dispatch<React.SetStateAction<boolean>>,
] {
  const [isFocused, setIsFocused] = React.useState(false);
  const [isError, setIsError] = React.useState(false);
  const [results, setResults] = React.useState({});
  const [searchTerm, setSearchTerm] = React.useState<string>("");

  const [searchIndex, isLoading, searchIndexFetchError, initializeSearchIndex] =
    useSearchIndex();

  React.useEffect(() => {
    async function getSearchResults() {
      setResults({});

      if (searchIndex && searchTerm.trim() !== "") {
        // Fetch autocomplete suggestion results and group into result types (i.e., players, teams)
        await searchIndex.document.searchAsync(searchTerm).then(
          (results) => {
            if (!results || results.length === 0) {
              setResults({});
              return;
            }
            const hits = results[0].result.map((r) => {
              return searchIndex.records[r];
            });
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
      }
    }

    getSearchResults();
  }, [searchTerm, searchIndex]);

  React.useEffect(() => {
    if (isFocused) {
      initializeSearchIndex();
    }
  }, [isFocused, initializeSearchIndex]);

  return [
    { isError: isError || !!searchIndexFetchError, isLoading, results },
    setSearchTerm,
    setIsFocused,
  ];
}
