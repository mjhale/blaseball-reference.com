import { Flex, Link, Tooltip } from "@chakra-ui/core";
import NextLink from "next/link";
import Table from "components/Table";

export default function StandingsTable({
  division,
  divisions,
  season,
  standings,
  teams,
}) {
  const data = React.useMemo(() => {
    return standings;
  }, [season]);

  const columns = React.useMemo(
    () => [
      {
        accessor: "teamName",
        Header: (
          <Tooltip hasArrow label="Team Name" placement="top">
            {`${division.name} Teams`}
          </Tooltip>
        ),
        Cell: ({ row, value }) => {
          const team = teams.find((team) => team.id === row.original.teamId);

          return team ? (
            <NextLink
              href="/teams/[teamSlug]"
              as={`/teams/${team.slug}`}
              passHref
            >
              <Link>{value}</Link>
            </NextLink>
          ) : null;
        },
      },
      {
        accessor: "wins",
        Header: (
          <Tooltip hasArrow label="Wins" placement="top">
            W
          </Tooltip>
        ),
        Footer: (info) => {
          const totalWins = React.useMemo(
            () => info.rows.reduce((sum, row) => row.values.wins + sum, 0),
            [info.rows]
          );

          return <>{totalWins}</>;
        },
      },
      {
        accessor: "losses",
        Header: (
          <Tooltip hasArrow label="Losses" placement="top">
            L
          </Tooltip>
        ),
        Footer: (info) => {
          const totalLosses = React.useMemo(
            () => info.rows.reduce((sum, row) => row.values.losses + sum, 0),
            [info.rows]
          );

          return <>{totalLosses}</>;
        },
      },
      {
        accessor: "winningPercentage",
        Header: (
          <Tooltip hasArrow label="Winning Percentage" placement="top">
            PCT
          </Tooltip>
        ),
        Cell: (params) => Number.parseFloat(params.value).toFixed(3),
        Footer: (info) => {
          const winningPct = React.useMemo(() => {
            const totalWins = info.rows.reduce(
              (sum, row) => row.values.wins + sum,
              0
            );
            const totalLosses = info.rows.reduce(
              (sum, row) => row.values.losses + sum,
              0
            );
            return Number.parseFloat(
              totalWins / (totalWins + totalLosses)
            ).toFixed(3);
          }, [info.rows]);

          return winningPct;
        },
        sortType: "basic",
      },
      {
        accessor: "splitRecords.extraInnings",
        Header: (
          <Tooltip hasArrow label="In Extra Inning Games" placement="top">
            XTRA
          </Tooltip>
        ),
        Cell: ({ value }) => `${value.wins}-${value.losses}`,
        Footer: (info) => {
          return React.useMemo(() => {
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
              return (
                <>
                  {wins}-{losses}
                </>
              );
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
        accessor: "streak.streakCode",
        Header: (
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
        Header: (
          <Tooltip hasArrow label="Runs Scored" placement="top">
            RS
          </Tooltip>
        ),
        Footer: (info) => {
          const runsScored = React.useMemo(
            () =>
              info.rows.reduce((sum, row) => row.values.runsScored + sum, 0),
            [info.rows]
          );

          return <>{runsScored}</>;
        },
      },
      {
        accessor: "runsAllowed",
        Header: (
          <Tooltip hasArrow label="Runs Allowed" placement="top">
            RA
          </Tooltip>
        ),
        Footer: (info) => {
          const runsScored = React.useMemo(
            () =>
              info.rows.reduce((sum, row) => row.values.runsAllowed + sum, 0),
            [info.rows]
          );

          return <>{runsScored}</>;
        },
      },
      {
        accessor: "runDifferential",
        Header: (
          <Tooltip hasArrow label="Runs Allowed" placement="top">
            DIFF
          </Tooltip>
        ),
        Footer: (info) => {
          const runDifferential = React.useMemo(
            () =>
              info.rows.reduce(
                (sum, row) => row.values.runDifferential + sum,
                0
              ),
            [info.rows]
          );

          return <>{runDifferential}</>;
        },
        sortType: "basic",
      },
      {
        accessor: "gamesBack",
        Header: (
          <Tooltip hasArrow label="Games Behind" placement="top">
            GB
          </Tooltip>
        ),
        Footer: () => "-",
      },
      {
        accessor: "magicNumber",
        Header: (
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
        Header: (
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
        accessor: "splitRecords.home",
        Header: (
          <Tooltip hasArrow label="Record at Home" placement="top">
            HOME
          </Tooltip>
        ),
        Cell: ({ value }) => `${value.wins}-${value.losses}`,
        Footer: (info) => {
          return React.useMemo(() => {
            const wins = info.rows.reduce(
              (sum, row) => row.values["splitRecords.home"].wins + sum,
              0
            );

            const losses = info.rows.reduce(
              (sum, row) => row.values["splitRecords.home"].losses + sum,
              0
            );

            if (wins > 0 || losses > 0) {
              return (
                <>
                  {wins}-{losses}
                </>
              );
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
        accessor: "splitRecords.away",
        Header: (
          <Tooltip hasArrow label="Record When Away" placement="top">
            AWAY
          </Tooltip>
        ),
        Cell: ({ value }) => `${value.wins}-${value.losses}`,
        Footer: (info) => {
          return React.useMemo(() => {
            const wins = info.rows.reduce(
              (sum, row) => row.values["splitRecords.away"].wins + sum,
              0
            );

            const losses = info.rows.reduce(
              (sum, row) => row.values["splitRecords.away"].losses + sum,
              0
            );

            if (wins > 0 || losses > 0) {
              return (
                <>
                  {wins}-{losses}
                </>
              );
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
        accessor: "splitRecords.winners",
        Header: (
          <Tooltip hasArrow label="Record Against >.500 Teams" placement="top">
            {`>.500`}
          </Tooltip>
        ),
        Cell: ({ value }) => `${value.wins}-${value.losses}`,
        Footer: (info) => {
          return React.useMemo(() => {
            const wins = info.rows.reduce(
              (sum, row) => row.values["splitRecords.winners"].wins + sum,
              0
            );

            const losses = info.rows.reduce(
              (sum, row) => row.values["splitRecords.winners"].losses + sum,
              0
            );

            if (wins > 0 || losses > 0) {
              return (
                <>
                  {wins}-{losses}
                </>
              );
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
        accessor: "splitRecords.shame",
        Header: (
          <Tooltip hasArrow label="Record in Shamed Games" placement="top">
            SHA
          </Tooltip>
        ),
        Cell: ({ value }) => `${value.wins}-${value.losses}`,
        Footer: (info) => {
          return React.useMemo(() => {
            const wins = info.rows.reduce(
              (sum, row) => row.values["splitRecords.shame"].wins + sum,
              0
            );

            const losses = info.rows.reduce(
              (sum, row) => row.values["splitRecords.shame"].losses + sum,
              0
            );

            if (wins > 0 || losses > 0) {
              return (
                <>
                  {wins}-{losses}
                </>
              );
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
          accessor: `divisionRecords[${division.id}]`,
          Header: (
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
            return React.useMemo(() => {
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
                return (
                  <>
                    {wins}-{losses}
                  </>
                );
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
    []
  );

  return (
    <Table columns={columns} data={data}>
      <Flex alignContent="baseline" justifyContent="space-between" mt={4}>
        <Table.Heading>{division.name} Standings</Table.Heading>
        <Flex alignItems="center">
          <Table.CSVExport
            filename={`Team Standings ${division.name} Season ${season}.csv`}
          />
        </Flex>
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
