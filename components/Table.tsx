/* eslint-disable react/jsx-key */

import * as React from "react";
import { useColorModeValue } from "@chakra-ui/react";
import { usePagination, useSortBy, useTable } from "react-table";

import {
  Cell,
  HeaderGroup,
  Row,
  TableInstance,
  TableOptions,
} from "react-table";

import {
  Box,
  Button,
  Heading,
  Link,
  Table as ChakraTable,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import { CSVLink } from "react-csv";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";

const TableContext = React.createContext(undefined);

// @TODO: Properly type table data and columns
interface TableProperties<T extends Record<string, unknown>>
  extends TableOptions<T> {
  columns: any;
  name?: string;
  data: any;
  isPaginated?: boolean;
}

export default function Table<T extends Record<string, unknown>>(
  props: React.PropsWithChildren<TableProperties<T>>
): React.ReactElement {
  const { children, columns, data, isPaginated = false } = props;

  let tableInstance = useTable<T>(
    {
      columns,
      data,
      initialState: {
        pageIndex: 0,
        pageSize: isPaginated ? 25 : Number.MAX_SAFE_INTEGER,
      },
    },
    useSortBy,
    usePagination
  );
  const { rows } = tableInstance;
  const value = React.useMemo(() => ({ data, tableInstance }), [data, rows]);

  return (
    <TableContext.Provider value={{ ...value, isPaginated }}>
      {children}
    </TableContext.Provider>
  );
}

function Content() {
  const {
    isPaginated,
    tableInstance,
  }: { isPaginated: boolean; tableInstance: TableInstance } = useTableContext();

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    footerGroups,
    page,
    prepareRow,
    state: { pageIndex },
    nextPage,
    canNextPage,
    previousPage,
    canPreviousPage,
    pageOptions,
    pageCount,
    gotoPage,
  } = tableInstance;

  const fixedCellStyles = {
    backgroundColor: "inherit",
    left: 0,
    position: "sticky",
    top: "auto",
    whiteSpace: "unset",
  };

  const RowBackgroundColor = useColorModeValue("white", "gray.800");
  const TrActiveRowBackgroundColor = useColorModeValue(
    "hsl(35, 100%, 95%)",
    "gray.700"
  );
  const TdBottomBorderColor = useColorModeValue("gray.300", "gray.600");

  return (
    <>
      <Box position="relative" maxWidth="100vw">
        <Box overflowX="auto">
          <ChakraTable
            marginTop={2}
            size="sm"
            variant="unstyled"
            width="100%"
            {...getTableProps()}
          >
            <Thead
              borderBottomWidth="2px"
              borderBottomColor={useColorModeValue("black", "gray.600")}
            >
              {headerGroups.map((headerGroup: HeaderGroup) => (
                <Tr
                  backgroundColor={RowBackgroundColor}
                  {...headerGroup.getHeaderGroupProps()}
                >
                  {headerGroup.headers.map((column, index) => (
                    <Th
                      fontSize="xs"
                      fontWeight="normal"
                      letterSpacing="tight"
                      paddingX={1}
                      paddingY={2}
                      textAlign="center"
                      textTransform="uppercase"
                      sx={index === 0 ? fixedCellStyles : null}
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                    >
                      {column.render("Header")}
                      {column.isSorted ? (
                        column.isSortedDesc ? (
                          <TriangleDownIcon
                            boxSize={4}
                            ml={{ base: 0, md: 2 }}
                          />
                        ) : (
                          <TriangleUpIcon boxSize={4} ml={{ base: 0, md: 2 }} />
                        )
                      ) : null}
                    </Th>
                  ))}
                </Tr>
              ))}
            </Thead>
            <Tbody {...getTableBodyProps()}>
              {page.map((row: Row<any>) => {
                prepareRow(row);

                return (
                  <Tr
                    _hover={{
                      backgroundColor: TrActiveRowBackgroundColor,
                    }}
                    backgroundColor={RowBackgroundColor}
                    {...row.getRowProps()}
                  >
                    {row.cells.map((cell: Cell, index) => (
                      <Td
                        borderBottom="1px"
                        borderBottomColor={TdBottomBorderColor}
                        fontSize="xs"
                        fontWeight="normal"
                        letterSpacing="tight"
                        paddingX={1}
                        paddingY={2}
                        sx={index === 0 ? fixedCellStyles : null}
                        textAlign="center"
                        {...cell.getCellProps()}
                      >
                        {cell.render("Cell")}
                      </Td>
                    ))}
                  </Tr>
                );
              })}
            </Tbody>
            <Tfoot>
              {footerGroups.map((group) => (
                <Tr
                  backgroundColor={RowBackgroundColor}
                  {...group.getFooterGroupProps()}
                >
                  {group.headers.map((column, index) => (
                    <Td
                      fontSize="xs"
                      fontWeight="bold"
                      letterSpacing="tight"
                      paddingX={2}
                      paddingY={1}
                      sx={index === 0 ? fixedCellStyles : null}
                      textAlign="center"
                      {...column.getFooterProps()}
                    >
                      {column.render("Footer")}
                    </Td>
                  ))}
                </Tr>
              ))}
            </Tfoot>
          </ChakraTable>
        </Box>
      </Box>
      {isPaginated && pageCount > 1 ? (
        <>
          <Box
            alignContent="center"
            as="nav"
            display={{ base: "none", md: "flex" }}
            justifyContent="center"
            role="navigation"
          >
            {pageOptions.map((page) => (
              <Button
                aria-label={`Go to page ${page + 1}`}
                key={page}
                disabled={pageIndex === page}
                onClick={() => gotoPage(page)}
                px={6}
                variant="link"
              >
                {page + 1}
              </Button>
            ))}
          </Box>
          <Box
            alignContent="center"
            display={{ base: "flex", md: "none" }}
            justifyContent="center"
          >
            <Button
              aria-label={`Go to previous page`}
              disabled={!canPreviousPage}
              onClick={() => previousPage()}
              mt={6}
              mr={4}
            >
              Previous page
            </Button>
            <Button
              aria-label={`Go to next page`}
              disabled={!canNextPage}
              onClick={() => nextPage()}
              mt={6}
            >
              Next page
            </Button>
          </Box>
        </>
      ) : null}
    </>
  );
}

function SectionHeading({
  children,
  level = "h3",
  size = "md",
}: {
  children: string;
  level?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}) {
  return (
    <Heading as={level} size={size}>
      {children}
    </Heading>
  );
}

function JsonDownload({
  filename,
  size = "xs",
}: {
  filename: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}) {
  const { tableInstance } = useTableContext();
  const { data } = tableInstance;

  return (
    <Button
      as={Link}
      download={filename}
      href={`data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(data, null, "\t")
      )}`}
      px={2}
      size={size}
    >
      Download JSON
    </Button>
  );
}

function CSVExport({
  filename,
  size = "xs",
}: {
  filename: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}) {
  const { tableInstance } = useTableContext();
  const { allColumns, rows } = tableInstance;

  const data = rows.reduce(
    (accumulator, row) => [...accumulator, row.values],
    []
  );

  return (
    <Button as={CSVLink} data={data} download={filename} px={2} size={size}>
      Export as CSV
    </Button>
  );
}

function useTableContext() {
  const context = React.useContext(TableContext);

  if (!context) {
    throw new Error(
      `Table compound components cannot be rendered outside the Table component`
    );
  }

  return context;
}

Table.Heading = SectionHeading;
Table.Content = Content;
Table.CSVExport = CSVExport;
Table.JsonDownload = JsonDownload;
