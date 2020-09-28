import { Link, Tooltip } from "@chakra-ui/core";
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
          const team = teams.find(
            (team) => team.fullName === row.original.teamName
          );

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
      },
      {
        accessor: "streak.streakCode",
        Header: (
          <Tooltip hasArrow label="Current Streak" placement="top">
            STRK
          </Tooltip>
        ),
        Footer: "-",
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
        };
      }),
    ],
    []
  );

  return <Table columns={columns} data={data} />;
}
