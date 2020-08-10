import { useTable } from "react-table";

import { Tooltip } from "@chakra-ui/core";
import {
  StyledTable,
  StyledTableCell,
  StyledTableFootCell,
  StyledTableHead,
  StyledTableHeadCell,
  StyledTableRow,
} from "components/Table/Table.styled";

export default function PitchingStatTable({
  isPostseason = false,
  pitchingStats,
}) {
  const careerTotals = isPostseason
    ? pitchingStats.careerPostseason
    : pitchingStats.careerSeason;

  const columns = React.useMemo(
    () => [
      {
        accessor: "season",
        Header: (
          <Tooltip hasArrow label="Year" placement="top">
            Yr
          </Tooltip>
        ),
        Cell: ({ value }) => {
          return isPostseason
            ? Number(value) + 1
            : [0, 1].includes(Number(value))
            ? `${Number(value) + 1}*`
            : Number(value) + 1;
        },
      },
      {
        accessor: "teamName",
        Header: (
          <Tooltip hasArrow label="Team" placement="top">
            Tm
          </Tooltip>
        ),
      },
      {
        accessor: "wins",
        Header: (
          <Tooltip hasArrow label="Wins" placement="top">
            W
          </Tooltip>
        ),
        Footer: careerTotals.wins,
      },
      {
        accessor: "losses",
        Header: (
          <Tooltip hasArrow label="Losses" placement="top">
            L
          </Tooltip>
        ),
        Footer: careerTotals.losses,
      },
      {
        accessor: "winningPercentage",
        Header: (
          <Tooltip hasArrow label="Winning Percentage" placement="top">
            W-L%
          </Tooltip>
        ),
        Footer: Number.parseFloat(careerTotals.winningPercentage).toFixed(2),
        Cell: ({ value }) => Number.parseFloat(value).toFixed(2),
      },
      {
        accessor: "earnedRunAverage",
        Header: (
          <Tooltip hasArrow label="Earned Run Average" placement="top">
            ERA
          </Tooltip>
        ),
        Footer: Number.parseFloat(careerTotals.earnedRunAverage).toFixed(2),
        Cell: ({ value }) => Number.parseFloat(value).toFixed(2),
      },
      {
        accessor: "appearances",
        Header: (
          <Tooltip hasArrow label="Games Played" placement="top">
            G
          </Tooltip>
        ),
        Footer: careerTotals.appearances,
      },
      {
        accessor: "shutouts",
        Header: (
          <Tooltip hasArrow label="Shutouts" placement="top">
            SHO
          </Tooltip>
        ),
        Footer: careerTotals.shutouts,
      },
      {
        accessor: "inningsPitched",
        Header: (
          <Tooltip hasArrow label="Innings Pitched" placement="top">
            IP
          </Tooltip>
        ),
        Footer: careerTotals.inningsPitched,
      },
      {
        accessor: "hitsAllowed",
        Header: (
          <Tooltip hasArrow label="Hits Allowed" placement="top">
            H
          </Tooltip>
        ),
        Footer: careerTotals.hitsAllowed,
      },
      {
        accessor: "earnedRuns",
        Header: (
          <Tooltip hasArrow label="Earned Runs" placement="top">
            R
          </Tooltip>
        ),
        Footer: careerTotals.earnedRuns,
      },
      {
        accessor: "homeRuns",
        Header: (
          <Tooltip hasArrow label="Home Runs" placement="top">
            HR
          </Tooltip>
        ),
        Footer: careerTotals.homeRuns,
      },
      {
        accessor: "basesOnBalls",
        Header: (
          <Tooltip hasArrow label="Bases on Balls (Walks)" placement="top">
            BB
          </Tooltip>
        ),
        Footer: careerTotals.basesOnBalls,
      },
      {
        accessor: "strikeouts",
        Header: (
          <Tooltip hasArrow label="Strikeouts" placement="top">
            SO
          </Tooltip>
        ),
        Footer: careerTotals.strikeouts,
      },
      {
        accessor: "battersFaced",
        Header: (
          <Tooltip hasArrow label="Batters Faced" placement="top">
            BF
          </Tooltip>
        ),
        Footer: careerTotals.battersFaced,
      },
      {
        accessor: "walksAndHitsPerInningPitched",
        Header: (
          <Tooltip
            hasArrow
            label="Walks and Hits Per Inning Pitched"
            placement="top"
          >
            WHIP
          </Tooltip>
        ),
        Footer: Number.parseFloat(
          careerTotals.walksAndHitsPerInningPitched
        ).toFixed(3),
        Cell: ({ value }) => Number.parseFloat(value).toFixed(3),
      },
      {
        accessor: "hitsAllowedPerNine",
        Header: (
          <Tooltip hasArrow label="Hits Per 9 Innings" placement="top">
            H9
          </Tooltip>
        ),
        Footer: Number.parseFloat(careerTotals.hitsAllowedPerNine).toFixed(1),
        Cell: ({ value }) => Number.parseFloat(value).toFixed(1),
      },
      {
        accessor: "homeRunsPerNine",
        Header: (
          <Tooltip hasArrow label="Home Runs Per 9 Innings" placement="top">
            HR9
          </Tooltip>
        ),
        Footer: Number.parseFloat(careerTotals.homeRunsPerNine).toFixed(1),
        Cell: ({ value }) => Number.parseFloat(value).toFixed(1),
      },
      {
        accessor: "basesOnBallsPerNine",
        Header: (
          <Tooltip hasArrow label="Walks Per 9 Innings" placement="top">
            BB9
          </Tooltip>
        ),
        Footer: Number.parseFloat(careerTotals.basesOnBallsPerNine).toFixed(1),
        Cell: ({ value }) => Number.parseFloat(value).toFixed(1),
      },
      {
        accessor: "strikeoutsPerNine",
        Header: (
          <Tooltip hasArrow label="Strikeouts Per 9 Innings" placement="top">
            SO9
          </Tooltip>
        ),
        Footer: Number.parseFloat(careerTotals.strikeoutsPerNine).toFixed(1),
        Cell: ({ value }) => Number.parseFloat(value).toFixed(1),
      },
      {
        accessor: "strikeoutToWalkRatio",
        Header: (
          <Tooltip hasArrow label="Strikeout-to-Walk Ratio" placement="top">
            SO/BB
          </Tooltip>
        ),
        Footer: Number.parseFloat(careerTotals.strikeoutToWalkRatio).toFixed(2),
        Cell: ({ value }) => Number.parseFloat(value).toFixed(2),
      },
    ],
    []
  );

  const data = React.useMemo(() => {
    const seasons = isPostseason
      ? pitchingStats.postseasons
      : pitchingStats.seasons;

    return Object.keys(seasons)
      .sort()
      .map((season) => {
        return {
          ...seasons[season],
          season: season,
        };
      });
  }, []);

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
