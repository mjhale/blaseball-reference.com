import { Column } from "react-table";
import { commonPitchingStatColumns } from "components/PitchingStatTable";
import PlayerStats from "types/playerStats";
import StatSplit from "types/statSplit";
import { useMemo } from "react";

import { Flex, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import Table from "components/Table";
import { Tooltip } from "@chakra-ui/react";

type StatTableProps = {
  isPostseason?: boolean;
  pitchingStats: PlayerStats;
  splitView: string | number;
  statTargetName: string;
};

export default function TeamPitchingStatTable({
  isPostseason = false,
  splitView,
  pitchingStats,
  statTargetName,
}: StatTableProps) {
  const data = useMemo<StatSplit[]>(() => pitchingStats.splits, [
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
      ...commonPitchingStatColumns(),
    ],
    [isPostseason, statTargetName]
  );

  return (
    <Table columns={columns} data={data}>
      <Flex alignContent="baseline" justifyContent="space-between">
        <Table.Heading level="h3" size="sm">
          Pitching Stats
        </Table.Heading>
        <Flex alignItems="center">
          <Table.CSVExport
            filename={`${statTargetName} Regular Season Pitching Stats.csv`}
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
