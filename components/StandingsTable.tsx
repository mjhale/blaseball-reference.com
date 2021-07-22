import * as React from "react";

import { Cell, Column } from "react-table";
import Division from "types/division";
import Team from "types/team";
import { TeamStanding } from "types/standings";

import { Box, Flex, Grid, Link, Tooltip } from "@chakra-ui/react";
import NextLink from "next/link";
import Table from "components/Table";

type StandingsTableProps = {
  division: Division;
  divisions: Division[];
  season: string;
  standings: TeamStanding[];
  teams: Team[];
};

export default function StandingsTable({
  division,
  divisions,
  season,
  standings,
  teams,
}: StandingsTableProps) {
  const data = React.useMemo<TeamStanding[]>(() => {
    return standings;
  }, [standings]);

  const columns = React.useMemo<Column<TeamStanding>[]>(
    () => [
      {
        accessor: "teamName",
        Header: () => (
          <Tooltip hasArrow label="Team Name" placement="top">
            {`${division.name} Teams`}
          </Tooltip>
        ),
        Cell: ({ row, value }: Cell<any>) => {
          const team = teams.find(
            (team) => team.team_id === row.original.teamId
          );

          return team ? (
            <NextLink href={`/teams/${team.url_slug}`} passHref>
              <Link>{value}</Link>
            </NextLink>
          ) : null;
        },
      },
      {
        accessor: "wins",
        Header: () => (
          <Tooltip hasArrow label="Wins" placement="top">
            W
          </Tooltip>
        ),
        Footer: (info) => {
          const totalWins = React.useMemo<number>(
            () => info.rows.reduce((sum, row) => row.values.wins + sum, 0),
            [info.rows]
          );

          return <>{totalWins}</>;
        },
      },
      {
        accessor: "losses",
        Header: () => (
          <Tooltip hasArrow label="Losses" placement="top">
            L
          </Tooltip>
        ),
        Footer: (info) => {
          const totalLosses = React.useMemo<number>(
            () => info.rows.reduce((sum, row) => row.values.losses + sum, 0),
            [info.rows]
          );

          return <>{totalLosses}</>;
        },
      },
      {
        accessor: "winningPercentage",
        Header: () => (
          <Tooltip hasArrow label="Winning Percentage" placement="top">
            PCT
          </Tooltip>
        ),
        Cell: (params) => Number(params.value).toFixed(3),
        Footer: (info) => {
          const winningPct = React.useMemo<string>(() => {
            const totalWins = info.rows.reduce(
              (sum, row) => row.values.wins + sum,
              0
            );
            const totalLosses = info.rows.reduce(
              (sum, row) => row.values.losses + sum,
              0
            );
            return Number(totalWins / (totalWins + totalLosses)).toFixed(3);
          }, [info.rows]);

          return winningPct;
        },
        sortType: "basic",
      },
      {
        accessor: (row) => row.splitRecords.extraInnings,
        id: "splitRecords.extraInnings",
        Header: () => (
          <Tooltip hasArrow label="In Extra Inning Games" placement="top">
            XTRA
          </Tooltip>
        ),
        Cell: ({ value }) => `${value.wins}-${value.losses}`,
        Footer: (info) => {
          return React.useMemo<string>(() => {
            const wins = info.rows.reduce(
              (sum, row) => row.values["splitRecords.extraInnings"].wins + sum,
              0
            );

            const losses = info.rows.reduce(
              (sum, row) =>
                row.values["splitRecords.extraInnings"].losses + sum,
              0
            );

            if (wins > 0 || losses > 0) {
              return `${wins}-${losses}`;
            } else {
              return "-";
            }
          }, [info.rows]);
        },
        sortType: (rowA, rowB) =>
          sortByWinLossSplit({
            rowA,
            rowB,
            column: "splitRecords.extraInnings",
          }),
      },
      {
        accessor: (row) => row.streak.streakCode,
        id: "streak",
        Header: () => (
          <Tooltip hasArrow label="Current Streak" placement="top">
            STRK
          </Tooltip>
        ),
        Footer: "-",
        sortType: (rowA, rowB) =>
          sortByStreak({ rowA, rowB, column: "streak" }),
      },
      {
        accessor: "runsScored",
        Header: () => (
          <Tooltip hasArrow label="Runs Scored" placement="top">
            RS
          </Tooltip>
        ),
        Cell: (params) =>
          Math.round((params.value + Number.EPSILON) * 100) / 100,
        Footer: (info) => {
          const runsScored = React.useMemo<number>(
            () =>
              info.rows.reduce((sum, row) => row.values.runsScored + sum, 0),
            [info.rows]
          );

          return <>{Math.round((runsScored + Number.EPSILON) * 100) / 100}</>;
        },
      },
      {
        accessor: "runsAllowed",
        Header: () => (
          <Tooltip hasArrow label="Runs Allowed" placement="top">
            RA
          </Tooltip>
        ),
        Cell: (params) =>
          Math.round((params.value + Number.EPSILON) * 100) / 100,
        Footer: (info) => {
          const runsAllowed = React.useMemo<number>(
            () =>
              info.rows.reduce((sum, row) => row.values.runsAllowed + sum, 0),
            [info.rows]
          );

          return <>{Math.round((runsAllowed + Number.EPSILON) * 100) / 100}</>;
        },
      },
      {
        accessor: "runDifferential",
        Header: () => (
          <Tooltip hasArrow label="Run Differential" placement="top">
            DIFF
          </Tooltip>
        ),
        Cell: (params) =>
          Math.round((params.value + Number.EPSILON) * 100) / 100,
        Footer: (info) => {
          const runDifferential = React.useMemo<number>(
            () =>
              info.rows.reduce(
                (sum, row) => row.values.runDifferential + sum,
                0
              ),
            [info.rows]
          );

          return (
            <>{Math.round((runDifferential + Number.EPSILON) * 100) / 100}</>
          );
        },
        sortType: "basic",
      },
      {
        accessor: "gamesBack",
        Header: () => (
          <Tooltip hasArrow label="Games Behind" placement="top">
            GB
          </Tooltip>
        ),
        Footer: () => "-",
      },
      {
        accessor: "magicNumber",
        Header: () => (
          <Tooltip
            hasArrow
            label="Magic Number: Wins needed to clinch a playoff appearance."
            placement="top"
          >
            M#
          </Tooltip>
        ),
        Footer: () => "-",
        disableSortBy: true,
      },
      {
        accessor: "eliminationNumber",
        Header: () => (
          <Tooltip
            hasArrow
            label="Elimination Number: Number of losses until eliminated from playoff contention."
            placement="top"
          >
            E#
          </Tooltip>
        ),
        Footer: () => "-",
        disableSortBy: true,
      },
      {
        accessor: (row) => row.splitRecords.home,
        id: "splitRecords.home",
        Header: () => (
          <Tooltip hasArrow label="Record at Home" placement="top">
            HOME
          </Tooltip>
        ),
        Cell: ({ value }) => `${value.wins}-${value.losses}`,
        Footer: (info) => {
          return React.useMemo<string>(() => {
            const wins = info.rows.reduce(
              (sum, row) => row.values["splitRecords.home"].wins + sum,
              0
            );

            const losses = info.rows.reduce(
              (sum, row) => row.values["splitRecords.home"].losses + sum,
              0
            );

            if (wins > 0 || losses > 0) {
              return `${wins}-${losses}`;
            } else {
              return "-";
            }
          }, [info.rows]);
        },
        sortType: (rowA, rowB) =>
          sortByWinLossSplit({
            rowA,
            rowB,
            column: "splitRecords.home",
          }),
      },
      {
        accessor: (row) => row.splitRecords.away,
        id: "splitRecords.away",
        Header: () => (
          <Tooltip hasArrow label="Record When Away" placement="top">
            AWAY
          </Tooltip>
        ),
        Cell: ({ value }) => `${value.wins}-${value.losses}`,
        Footer: (info) => {
          return React.useMemo<string>(() => {
            const wins = info.rows.reduce(
              (sum, row) => row.values["splitRecords.away"].wins + sum,
              0
            );

            const losses = info.rows.reduce(
              (sum, row) => row.values["splitRecords.away"].losses + sum,
              0
            );

            if (wins > 0 || losses > 0) {
              return `${wins}-${losses}`;
            } else {
              return "-";
            }
          }, [info.rows]);
        },
        sortType: (rowA, rowB) =>
          sortByWinLossSplit({
            rowA,
            rowB,
            column: "splitRecords.losses",
          }),
      },
      {
        accessor: (row) => row.splitRecords.winners,
        id: "splitRecords.winners",
        Header: () => (
          <Tooltip hasArrow label="Record Against >.500 Teams" placement="top">
            {`>.500`}
          </Tooltip>
        ),
        Cell: ({ value }) => `${value.wins}-${value.losses}`,
        Footer: (info) => {
          return React.useMemo<string>(() => {
            const wins = info.rows.reduce(
              (sum, row) => row.values["splitRecords.winners"].wins + sum,
              0
            );

            const losses = info.rows.reduce(
              (sum, row) => row.values["splitRecords.winners"].losses + sum,
              0
            );

            if (wins > 0 || losses > 0) {
              return `${wins}-${losses}`;
            } else {
              return "-";
            }
          }, [info.rows]);
        },
        sortType: (rowA, rowB) =>
          sortByWinLossSplit({
            rowA,
            rowB,
            column: "splitRecords.winners",
          }),
      },
      {
        accessor: (row) => row.splitRecords.shame,
        id: "splitRecords.shame",
        Header: () => (
          <Tooltip hasArrow label="Record in Shamed Games" placement="top">
            SHA
          </Tooltip>
        ),
        Cell: ({ value }) => `${value.wins}-${value.losses}`,
        Footer: (info) => {
          return React.useMemo<string>(() => {
            const wins = info.rows.reduce(
              (sum, row) => row.values["splitRecords.shame"].wins + sum,
              0
            );

            const losses = info.rows.reduce(
              (sum, row) => row.values["splitRecords.shame"].losses + sum,
              0
            );

            if (wins > 0 || losses > 0) {
              return `${wins}-${losses}`;
            } else {
              return "-";
            }
          }, [info.rows]);
        },
        sortType: (rowA, rowB) =>
          sortByWinLossSplit({
            rowA,
            rowB,
            column: "splitRecords.shame",
          }),
      },
      ...divisions.map((division) => {
        return {
          accessor: (row) => row.divisionRecords[division.id],
          id: `divisionRecords[${division.id}]`,
          Header: () => (
            <Tooltip hasArrow label={`vs. ${division.name}`} placement="top">
              {division.name
                .split(" ")
                .map((word) => word[0])
                .join("")}
            </Tooltip>
          ),
          Cell: ({ value }) => {
            if (value) {
              return `${value.wins}-${value.losses}`;
            } else {
              return "-";
            }
          },
          Footer: (info) => {
            return React.useMemo<string>(() => {
              const wins = info.rows.reduce((sum, row) => {
                if (row.values[`divisionRecords[${division.id}]`]?.wins) {
                  return (
                    row.values[`divisionRecords[${division.id}]`].wins + sum
                  );
                } else {
                  return sum;
                }
              }, 0);

              const losses = info.rows.reduce((sum, row) => {
                if (row.values[`divisionRecords[${division.id}]`]?.losses) {
                  return (
                    row.values[`divisionRecords[${division.id}]`].losses + sum
                  );
                } else {
                  return sum;
                }
              }, 0);

              if (wins > 0 || losses > 0) {
                return `${wins}-${losses}`;
              } else {
                return "-";
              }
            }, [info.rows]);
          },
          sortType: (rowA, rowB) =>
            sortByWinLossSplit({
              rowA,
              rowB,
              column: `divisionRecords[${division.id}]`,
            }),
        };
      }),
    ],
    [division, divisions, teams]
  );

  const exportFilename = `Team Standings ${division.name} Season ${season}`;

  return (
    <Table columns={columns} data={data}>
      <Flex
        alignContent="center"
        flexWrap="wrap"
        justifyContent="space-between"
      >
        <Box mt={2}>
          <Table.Heading>{`${division.name} Standings`}</Table.Heading>
        </Box>
        <Grid gap={2} mt={2} templateColumns="repeat(2, 1fr)">
          <Table.JsonDownload filename={`${exportFilename}.json`} />
          <Table.CSVExport filename={`${exportFilename}.csv`} />
        </Grid>
      </Flex>
      <Table.Content />
    </Table>
  );
}

function sortByStreak({ rowA, rowB, column }) {
  const rowAStreakType = rowA.original[column]?.streakType;
  const rowAStreakNumber = rowA.original[column]?.streakNumber;

  const rowBStreakType = rowB.original[column]?.streakType;
  const rowBStreakNumber = rowB.original[column]?.streakNumber;

  // If rowA is missing either streakType or streakNumber, declare rowB as larger
  if (rowAStreakType === undefined || rowAStreakNumber === undefined) {
    return 1;
  }

  // If rowB is missing either streakType or streakNumber, declare rowA as larger
  if (rowBStreakType === undefined || rowBStreakNumber === undefined) {
    return -1;
  }

  // Sort win streaks as larger than loss streaks
  if (rowAStreakType !== rowBStreakType) {
    return rowAStreakType === "wins" ? 0 : -1;
  }

  // Sort win streak group by streak number (W10 > W5)
  if (rowAStreakType === "wins") {
    return rowAStreakNumber === rowBStreakNumber
      ? 0
      : rowAStreakNumber > rowBStreakNumber
      ? 1
      : -1;
  }

  // Sort losing streak group by streak number (L5 > L10)
  if (rowAStreakType === "losses") {
    return rowAStreakNumber === rowBStreakNumber
      ? 0
      : rowAStreakNumber > rowBStreakNumber
      ? -1
      : 1;
  }
}

function sortByWinLossSplit({ rowA, rowB, column }) {
  let rowAWins = rowA.values[column]?.wins;
  let rowALosses = rowA.values[column]?.losses;

  let rowBWins = rowB.values[column]?.wins;
  let rowBLosses = rowB.values[column]?.losses;

  // If rowA contains neither wins nor losses, declare row B as larger
  if (rowAWins === undefined && rowALosses === undefined) {
    return 1;
  }

  // If rowB contains neither wins nor losses, declare row A as larger
  if (rowBWins === undefined && rowBLosses === undefined) {
    return -1;
  }

  rowAWins = rowAWins ?? 0;
  rowALosses = rowALosses ?? 0;

  rowBWins = rowBWins ?? 0;
  rowBLosses = rowBLosses ?? 0;

  const rowAWinningPct = rowAWins / (rowAWins + rowALosses);
  const rowBWinningPct = rowBWins / (rowBWins + rowBLosses);

  return rowAWinningPct === rowBWinningPct
    ? 0
    : rowAWinningPct > rowBWinningPct
    ? 1
    : -1;
}
