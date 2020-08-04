import { useTable } from "react-table";

import Heading from "components/Heading";
import {
  StyledDescriptionDetails,
  StyledDescriptionList,
  StyledDescriptionPair,
  StyledDescriptionTerm,
  StyledTable,
  StyledTableCell,
  StyledTableHead,
  StyledTableHeadCell,
} from "./TeamHistory.styled";

export default function TeamHistory({ team }) {
  return (
    <>
      <Heading>{team.fullName}</Heading>
      <StyledDescriptionList>
        <StyledDescriptionPair>
          <StyledDescriptionTerm>Slogan:</StyledDescriptionTerm>
          <StyledDescriptionDetails>{team.slogan}</StyledDescriptionDetails>
        </StyledDescriptionPair>

        <StyledDescriptionPair>
          <StyledDescriptionTerm>Seasons:</StyledDescriptionTerm>
          <StyledDescriptionDetails>
            2 (Seasons 1 to 2)
          </StyledDescriptionDetails>
        </StyledDescriptionPair>

        <StyledDescriptionPair>
          <StyledDescriptionTerm>Record:</StyledDescriptionTerm>
          <StyledDescriptionDetails>65-40, .615 W-L %</StyledDescriptionDetails>
        </StyledDescriptionPair>

        <StyledDescriptionPair>
          <StyledDescriptionTerm>Playoff Appearances:</StyledDescriptionTerm>
          <StyledDescriptionDetails>1</StyledDescriptionDetails>
        </StyledDescriptionPair>

        <StyledDescriptionPair>
          <StyledDescriptionTerm>Championships:</StyledDescriptionTerm>
          <StyledDescriptionDetails>0</StyledDescriptionDetails>
        </StyledDescriptionPair>
      </StyledDescriptionList>

      <Heading>Team History</Heading>
      <TeamHistoryTable team={team} />
    </>
  );
}

function TeamHistoryTable({ team }) {
  const columns = React.useMemo(
    () => [
      {
        Header: "Yr",
        accessor: "season", // accessor is the "key" in the data
      },
      {
        Header: "Tm",
        accessor: "team",
      },
      {
        Header: "Lg",
        accessor: "league",
      },
      {
        Header: "G",
        accessor: "games",
      },
      {
        Header: "W",
        accessor: "wins",
      },
      {
        Header: "L",
        accessor: "losses",
      },
      {
        Header: "W-L%",
        accessor: "winLossPercentage",
      },
      {
        Header: "Shm",
        accessor: "shames",
      },
      {
        Header: "GB",
        accessor: "gamesBack",
      },
      {
        Header: "R",
        accessor: "runs",
      },
      {
        Header: "HR",
        accessor: "homeRuns",
      },
      {
        Header: "BB",
        accessor: "baseOnBalls",
      },
      {
        Header: "K",
        accessor: "strikeouts",
      },
    ],
    []
  );

  const data = React.useMemo(
    () => [
      {
        season: "1",
        team: team.nickname,
        league: "World",
        games: "14",
        shames: "4",
        wins: "7",
        losses: "7",
        winLossPercentage: "50%",
        gamesBack: "3",
        runs: "25",
        homeRuns: "10",
        baseOnBalls: "6",
        strikeouts: "30",
      },
    ],
    []
  );

  const tableInstance = useTable({ columns, data });

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
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
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return (
                  <StyledTableCell {...cell.getCellProps()}>
                    {cell.render("Cell")}
                  </StyledTableCell>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </StyledTable>
  );
}
