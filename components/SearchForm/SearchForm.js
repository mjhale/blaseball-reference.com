import { getColor } from "@chakra-ui/theme-tools";
import styled from "@emotion/styled";
import useAlgoliaSearchResults from "hooks/useAlgoliaSearchResults";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useTheme } from "@chakra-ui/core";

import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import {
  Box,
  Button,
  CircularProgress,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  List,
  ListItem,
  Skeleton,
} from "@chakra-ui/core";
import { SearchIcon } from "@chakra-ui/icons";

// @TODO: Fix combobox options rendering after submit when already on search page
export default function SearchForm() {
  const [hasSelected, setHasSelected] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [{ isLoading, results }, setSearchTerm] = useAlgoliaSearchResults();
  const resultComboboxOptionData = useRef({});
  const router = useRouter();
  const theme = useTheme();

  const StyledComboboxOption = styled(ComboboxOption)`
    [data-user-value] {
      font-weight: ${theme.fontWeights.bold};
    }
  `;

  function handleChange(event) {
    const value = event.target.value;
    setInputValue(value);

    if (value.length >= 2) {
      setSearchTerm(value);
    }
  }

  function handleSelect(value) {
    setInputValue(value);
    setHasSelected(true);

    // Redirect user to selected term's anchor
    if (resultComboboxOptionData.current[value].type === "players") {
      router.push(
        "/players/[playerSlug]",
        resultComboboxOptionData.current[value].anchor
      );
    } else if (resultComboboxOptionData.current[value].type === "teams") {
      router.push(
        "/teams/[teamSlug]",
        resultComboboxOptionData.current[value].anchor
      );
    }
  }

  // @TODO: Change focus to search result body on submit
  function handleSubmit(event) {
    event.preventDefault();
    setSearchTerm("");

    // If on search page, use shallow routing to avoid re-running data fetching methods
    if (router.pathname === "/search") {
      router.push(`/search?searchTerm=${inputValue}`, undefined, {
        shallow: true,
      });
    } else {
      router.push(`/search?searchTerm=${inputValue}`);
    }
  }

  // Insert term into input when component is being rendered on search page
  useEffect(() => {
    if (router.pathname === "/search" && router.query?.searchTerm) {
      setInputValue(router.query.searchTerm);
    }
  }, [router.pathname, router.query.searchTerm]);

  // Reset loading icon on page transitions
  useEffect(() => {
    const resetHasSelected = (url) => {
      if (hasSelected) {
        setInputValue("");
        setHasSelected(false);
      }
    };

    router.events.on("routeChangeComplete", resetHasSelected);

    return () => {
      router.events.off("routeChangeComplete", resetHasSelected);
    };
  }, [hasSelected]);

  return (
    <Box>
      <form onSubmit={handleSubmit}>
        <Flex alignItems="center" direction="row" wrap="nowrap">
          <Combobox
            as={Box}
            boxSizing="border-box"
            mr={2}
            onSelect={handleSelect}
            width="100%"
          >
            <InputGroup>
              <InputLeftElement>
                {isLoading ? (
                  <CircularProgress color="gray.50" isIndeterminate size={5} />
                ) : (
                  <SearchIcon color="gray.300" fontSize="xl" />
                )}
              </InputLeftElement>

              <Input
                _focus={{
                  border: "1px solid",
                  borderColor: "blue.200",
                  boxShadow: `0 0 0 4px ${getColor(theme, "blue.50")}`,
                  outline: "none",
                }}
                as={ComboboxInput}
                borderColor="gray.200"
                enterkeyhint="search"
                fontSize={{ base: "lg", md: "md" }}
                id="searchTerm"
                inputMode="search"
                name="searchTerm"
                onChange={handleChange}
                placeholder="Search players and teams"
                selectOnClick={true}
                value={inputValue}
              />
            </InputGroup>

            {isLoading || Object.keys(results).length > 0 ? (
              <ComboboxPopover>
                <ComboboxList
                  as={List}
                  bgColor="white"
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="md"
                  boxShadow="sm"
                  mt={2}
                >
                  {isLoading ? (
                    <>
                      <Heading
                        as="h3"
                        bgColor="gray.100"
                        py={2}
                        px={4}
                        size="sm"
                      >
                        <Skeleton
                          startColor="gray.500"
                          endColor="black"
                          height={4}
                          width={16}
                        />
                      </Heading>
                      <ListItem px={3} py={1}>
                        <Skeleton>Loading...</Skeleton>
                      </ListItem>
                    </>
                  ) : (
                    <>
                      {Object.keys(results).map((resultGroup) => {
                        return (
                          <React.Fragment key={resultGroup}>
                            <Heading
                              as="h3"
                              bgColor="gray.100"
                              py={2}
                              px={4}
                              size="sm"
                              textTransform="capitalize"
                            >
                              {resultGroup}
                            </Heading>
                            <Box _notLast={{ pb: 2 }}>
                              {results[resultGroup].map((result, index) => {
                                resultComboboxOptionData.current[
                                  result.title
                                ] = {
                                  ...result,
                                };

                                return (
                                  <ListItem
                                    _hover={{
                                      bgColor: "hsl(35, 100%, 95%)",
                                    }}
                                    _selected={{
                                      bgColor: "hsl(35, 100%, 85%)",
                                    }}
                                    as={StyledComboboxOption}
                                    cursor="pointer"
                                    fontSize="sm"
                                    key={result.objectID}
                                    px={3}
                                    py={1}
                                    value={result.title}
                                  />
                                );
                              })}
                            </Box>
                          </React.Fragment>
                        );
                      })}
                    </>
                  )}
                </ComboboxList>
              </ComboboxPopover>
            ) : null}
          </Combobox>
          <Button isLoading={isLoading || hasSelected} type="submit">
            Search
          </Button>
        </Flex>
      </form>
    </Box>
  );
}
