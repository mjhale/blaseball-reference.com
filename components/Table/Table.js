import { useTable } from "react-table";

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
} from "components/Table/Table.styled";

export default function Table({ columns, data }) {
  const tableInstance = useTable({ columns, data });

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
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column, index) => {
                  if (index === 0) {
                    return (
                      <StyledTableHeadCellFixed {...column.getHeaderProps()}>
                        {column.render("Header")}
                      </StyledTableHeadCellFixed>
                    );
                  }

                  return (
                    <StyledTableHeadCell {...column.getHeaderProps()}>
                      {column.render("Header")}
                    </StyledTableHeadCell>
                  );
                })}
              </tr>
            ))}
          </StyledTableHead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <StyledTableRow {...row.getRowProps()}>
                  {row.cells.map((cell, index) => {
                    if (index === 0) {
                      return (
                        <StyledTableCellFixed {...cell.getCellProps()}>
                          {cell.render("Cell")}
                        </StyledTableCellFixed>
                      );
                    }

                    return (
                      <StyledTableCell {...cell.getCellProps()}>
                        {cell.render("Cell")}
                      </StyledTableCell>
                    );
                  })}
                </StyledTableRow>
              );
            })}
          </tbody>
          <tfoot>
            {footerGroups.map((group) => (
              <tr {...group.getFooterGroupProps()}>
                {group.headers.map((column, index) => {
                  if (index === 0) {
                    return (
                      <StyledTableFootCellFixed {...column.getFooterProps()}>
                        {column.render("Footer")}
                      </StyledTableFootCellFixed>
                    );
                  }

                  return (
                    <StyledTableFootCell {...column.getFooterProps()}>
                      {column.render("Footer")}
                    </StyledTableFootCell>
                  );
                })}
              </tr>
            ))}
          </tfoot>
        </StyledTable>
      </StyledScrollContainer>
    </StyledContainer>
  );
}
