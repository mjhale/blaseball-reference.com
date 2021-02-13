/* eslint-disable react/jsx-key */

import * as React from "react";
import { useSortBy, useTable } from "react-table";

import { Cell, Column, HeaderGroup, Row, TableInstance } from "react-table";

import { Button, Heading } from "@chakra-ui/react";
import { CSVLink } from "react-csv";
import {
  StyledContainer,
  StyledScrollContainer,
  StyledTable,
  StyledTableCell,
  StyledTableCellFixed,
  StyledTableFootCell,
  StyledTableFootCellFixed,
  StyledTableHead,
  StyledTableHeadCell,
  StyledTableHeadCellFixed,
  StyledTableRow,
  StyledTableRowData,
} from "components/Table/Table.styled";
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

  return (
    <StyledContainer>
      <StyledScrollContainer>
        <StyledTable {...getTableProps()}>
          <StyledTableHead>
            {headerGroups.map((headerGroup: HeaderGroup) => (
              <StyledTableRow {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column, index) => (
                  <TableCell
                    index={index}
                    type="header"
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
                  </TableCell>
                ))}
              </StyledTableRow>
            ))}
          </StyledTableHead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row: Row<any>) => {
              prepareRow(row);

              return (
                <StyledTableRowData {...row.getRowProps()}>
                  {row.cells.map((cell: Cell, index) => (
                    <TableCell index={index} {...cell.getCellProps()}>
                      {cell.render("Cell")}
                    </TableCell>
                  ))}
                </StyledTableRowData>
              );
            })}
          </tbody>
          <tfoot>
            {footerGroups.map((group) => (
              <StyledTableRow {...group.getFooterGroupProps()}>
                {group.headers.map((column, index) => (
                  <TableCell
                    index={index}
                    type="footer"
                    {...column.getFooterProps()}
                  >
                    {column.render("Footer")}
                  </TableCell>
                ))}
              </StyledTableRow>
            ))}
          </tfoot>
        </StyledTable>
      </StyledScrollContainer>
    </StyledContainer>
  );
}

function TableCell({
  index,
  children,
  type,
  ...columnProps
}: {
  index: number;
  children: React.ReactNode;
  type?: "footer" | "header";
}) {
  let StyledCell;

  switch (type) {
    case "footer":
      StyledCell = index === 0 ? StyledTableFootCellFixed : StyledTableFootCell;
      break;

    case "header":
      StyledCell = index === 0 ? StyledTableHeadCellFixed : StyledTableHeadCell;
      break;

    default:
      StyledCell = index === 0 ? StyledTableCellFixed : StyledTableCell;
  }

  return <StyledCell {...columnProps}>{children}</StyledCell>;
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
