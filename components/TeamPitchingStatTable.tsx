import { commonPitchingStatColumns } from "components/PitchingStatTable";
import * as React from "react";

import { Cell, Column } from "react-table";
import PlayerStats from "types/playerStats";
import StatSplit from "types/statSplit";
import TeamStats from "types/teamStats";

import { Flex, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import Table from "components/Table";
import { Tooltip } from "@chakra-ui/react";

type StatTableProps = {
  isPostseason?: boolean;
  pitchingStats: PlayerStats;
  splitView: string | number;
  statTargetName: string;
  teamPitchingStats: TeamStats;
};

export default function TeamPitchingStatTable({
  isPostseason = false,
  splitView,
  pitchingStats,
  statTargetName,
  teamPitchingStats,
}: StatTableProps) {
  const data = React.useMemo<StatSplit[]>(() => pitchingStats.splits, [
    isPostseason,
    splitView,
    statTargetName,
  ]);
  const teamData = teamPitchingStats.splits[0];

  const columns = React.useMemo<Column<StatSplit>[]>(
    () => [
      {
        accessor: (row) => row.player.fullName,
        id: "name",
        Header: () => (
          <Tooltip hasArrow label="Team" placement="top">
            Player
          </Tooltip>
        ),
        Cell: ({ row, value }: Cell<any>) => {
          return row.original?.player?.id ? (
            <NextLink href={`/players/${row.original.player.id}`} passHref>
              <Link>{value}</Link>
            </NextLink>
          ) : null;
        },
      },
      ...commonPitchingStatColumns(teamData),
    ],
    [isPostseason, statTargetName]
  );

  return (
    <Table columns={columns} data={data}>
      <Flex alignContent="baseline" justifyContent="space-between">
        <Table.Heading level="h3" size="sm">
          {isPostseason
            ? "Postseason Pitching Stats"
            : "Standard Pitching Stats"}
        </Table.Heading>
        <Flex alignItems="center">
          <Table.CSVExport
            filename={`${statTargetName} ${splitView} ${
              isPostseason ? "Postseason" : "Standard"
            } Pitching Stats.csv`}
          />
        </Flex>
      </Flex>
      {Array.isArray(data) && data.length > 0 ? (
        <Table.Content />
      ) : (
        "Sorry, no results available for this season."
      )}
    </Table>
  );
}
