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

export default function BattingStatTable({
  isPostseason = false,
  battingStats,
}) {
  const careerTotals = isPostseason
    ? battingStats.careerPostseason
    : battingStats.careerSeason;

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
        accessor: "appearances",
        Header: (
          <Tooltip hasArrow label="Games Played" placement="top">
            G
          </Tooltip>
        ),
        Footer: careerTotals.appearances,
      },
      {
        accessor: "plateAppearances",
        Header: (
          <Tooltip hasArrow label="Plate Appearances" placement="top">
            PA
          </Tooltip>
        ),
        Footer: careerTotals.plateAppearances,
      },
      {
        accessor: "atBats",
        Header: (
          <Tooltip hasArrow label="At Bats" placement="top">
            AB
          </Tooltip>
        ),
        Footer: careerTotals.atBats,
      },
      {
        accessor: "runsScored",
        Header: (
          <Tooltip hasArrow label="Runs Scored" placement="top">
            R
          </Tooltip>
        ),
        Footer: careerTotals.runsScored,
      },
      {
        accessor: "hits",
        Header: (
          <Tooltip hasArrow label="Hits" placement="top">
            H
          </Tooltip>
        ),
        Footer: careerTotals.hits,
      },
      {
        accessor: "doublesHit",
        Header: (
          <Tooltip hasArrow label="Doubles Hit" placement="top">
            2B
          </Tooltip>
        ),
        Footer: careerTotals.doublesHit,
      },
      {
        accessor: "triplesHit",
        Header: (
          <Tooltip hasArrow label="Triples Hit" placement="top">
            3B
          </Tooltip>
        ),
        Footer: careerTotals.triplesHit,
      },
      {
        accessor: "homeRunsHit",
        Header: (
          <Tooltip hasArrow label="Home Runs Hit" placement="top">
            HR
          </Tooltip>
        ),
        Footer: careerTotals.homeRunsHit,
      },
      {
        accessor: "runsBattedIn",
        Header: (
          <Tooltip hasArrow label="Runs Batted In" placement="top">
            RBI
          </Tooltip>
        ),
        Footer: careerTotals.runsBattedIn,
      },
      {
        accessor: "stolenBases",
        Header: (
          <Tooltip hasArrow label="Stolen Bases" placement="top">
            SB
          </Tooltip>
        ),
        Footer: careerTotals.stolenBases,
      },
      {
        accessor: "caughtStealing",
        Header: (
          <Tooltip hasArrow label="Caught Stealing" placement="top">
            CS
          </Tooltip>
        ),
        Footer: careerTotals.caughtStealing,
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
        accessor: "battingAverage",
        Header: (
          <Tooltip hasArrow label="Batting Average" placement="top">
            BA
          </Tooltip>
        ),
        Footer: Number.parseFloat(careerTotals.battingAverage).toFixed(3),
        Cell: ({ value }) => Number.parseFloat(value).toFixed(3),
      },
      {
        accessor: "onBasePercentage",
        Header: (
          <Tooltip hasArrow label="On-base Percentage" placement="top">
            OBP
          </Tooltip>
        ),
        Footer: Number.parseFloat(careerTotals.onBasePercentage).toFixed(3),
        Cell: ({ value }) => Number.parseFloat(value).toFixed(3),
      },
      {
        accessor: "sluggingPercentage",
        Header: (
          <Tooltip hasArrow label="Slugging Percentage" placement="top">
            SLG
          </Tooltip>
        ),
        Footer: Number.parseFloat(careerTotals.sluggingPercentage).toFixed(3),
        Cell: ({ value }) => Number.parseFloat(value).toFixed(3),
      },
      {
        accessor: "onBasePlusSlugging",
        Header: (
          <Tooltip
            hasArrow
            label="On-base Plus Slugging Percentages"
            placement="top"
          >
            OPS
          </Tooltip>
        ),
        Footer: Number.parseFloat(careerTotals.onBasePlusSlugging).toFixed(3),
        Cell: ({ value }) => Number.parseFloat(value).toFixed(3),
      },
      {
        accessor: "totalBases",
        Header: (
          <Tooltip hasArrow label="Total Bases" placement="top">
            TB
          </Tooltip>
        ),
        Footer: careerTotals.totalBases,
      },
      {
        accessor: "groundIntoDoublePlays",
        Header: (
          <Tooltip hasArrow label="Double Plays Grounded Into" placement="top">
            GDP
          </Tooltip>
        ),
        Footer: careerTotals.groundIntoDoublePlays,
      },
      {
        accessor: "sacrificeBunts",
        Header: (
          <Tooltip
            hasArrow
            label="Sacrifice Hits (Sacrifice Bunts)"
            placement="top"
          >
            SH
          </Tooltip>
        ),
        Footer: careerTotals.sacrificeBunts,
      },
      {
        accessor: "sacrificeFlies",
        Header: (
          <Tooltip hasArrow label="Sacrifice Flies" placement="top">
            SF
          </Tooltip>
        ),
        Footer: careerTotals.sacrificeFlies,
      },
    ],
    []
  );

  const data = React.useMemo(() => {
    const seasons = isPostseason
      ? battingStats.postseasons
      : battingStats.seasons;

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
