import { useTable } from "react-table";

import {
  StyledTable,
  StyledTableCell,
  StyledTableFootCell,
  StyledTableHead,
  StyledTableHeadCell,
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
    <StyledTable {...getTableProps()}>
      <StyledTableHead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <StyledTableHeadCell {...column.getHeaderProps()}>
                {column.render("Header")}
              </StyledTableHeadCell>
            ))}
          </tr>
        ))}
      </StyledTableHead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <StyledTableRow {...row.getRowProps()}>
              {row.cells.map((cell) => {
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
            {group.headers.map((column) => (
              <StyledTableFootCell {...column.getFooterProps()}>
                {column.render("Footer")}
              </StyledTableFootCell>
            ))}
          </tr>
        ))}
      </tfoot>
    </StyledTable>
  );
}
