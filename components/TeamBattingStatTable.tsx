import { Column } from "react-table";
import { commonBattingStatColumns } from "components/BattingStatTable";
import PlayerStats from "types/playerStats";
import StatSplit from "types/statSplit";
import { useMemo } from "react";

import { Flex, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import Table from "components/Table";
import { Tooltip } from "@chakra-ui/react";

type StatTableProps = {
  battingStats: PlayerStats;
  isPostseason?: boolean;
  splitView: string | number;
  statTargetName: string;
};

export default function TeamBattingStatTable({
  battingStats,
  isPostseason = false,
  splitView,
  statTargetName,
}: StatTableProps) {
  const data = useMemo<StatSplit[]>(() => battingStats.splits, [
    isPostseason,
    splitView,
    statTargetName,
  ]);

  const columns = useMemo<Column<StatSplit>[]>(
    () => [
      {
        accessor: (row) => row.player.fullName,
        id: "name",
        Header: () => (
          <Tooltip hasArrow label="Team" placement="top">
            Player
          </Tooltip>
        ),
        Cell: ({ row, value }) => {
          return row.original?.player?.id ? (
            <NextLink href={`/players/${row.original.player.id}`} passHref>
              <Link>{value}</Link>
            </NextLink>
          ) : null;
        },
      },
      ...commonBattingStatColumns(),
    ],
    []
  );

  return (
    <Table columns={columns} data={data}>
      <Flex alignContent="baseline" justifyContent="space-between">
        <Table.Heading level="h3" size="sm">
          Batting Stats
        </Table.Heading>
        <Flex alignItems="center">
          <Table.CSVExport
            filename={`${statTargetName} Regular Season Batting Stats.csv`}
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
