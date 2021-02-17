/* eslint-disable react/jsx-key */

import * as React from "react";
import { useColorModeValue } from "@chakra-ui/react";
import { useSortBy, useTable } from "react-table";

import { Cell, Column, HeaderGroup, Row, TableInstance } from "react-table";

import {
  Box,
  Button,
  Heading,
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

interface Table<T extends Record<string, unknown>> {
  columns: Array<Column<T>>;
  children: React.ReactNode;
  data: T[];
}

export default function Table({ columns, children, data }: Table<any>) {
  const tableInstance = useTable({ columns, data }, useSortBy);
  const { rows } = tableInstance;
  const value = React.useMemo(() => ({ data, tableInstance }), [data, rows]);

  return (
    <TableContext.Provider value={value}>{children}</TableContext.Provider>
  );
}

function Content() {
  const { tableInstance }: { tableInstance: TableInstance } = useTableContext();

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    footerGroups,
    rows,
    prepareRow,
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
    <Box position="relative" maxWidth="100vw">
      <Box overflowX="auto">
        <ChakraTable
          // boxShadow="0 1px 0 0 rgba(22, 29, 37, 0.05)"
          marginTop={2}
          size="sm"
          variant="simple"
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
                        <TriangleDownIcon boxSize={4} ml={{ base: 0, md: 2 }} />
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
            {rows.map((row: Row<any>) => {
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

function CSVExport({
  filename,
  size = "xs",
}: {
  filename: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}) {
  const { data, tableInstance } = useTableContext();
  const { allColumns } = tableInstance;

  return (
    <Button
      as={CSVLink}
      columns={allColumns}
      data={data}
      download={filename}
      size={size}
    >
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
