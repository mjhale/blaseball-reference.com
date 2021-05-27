import { commonBattingStatColumns } from "components/BattingStatTable";
import * as React from "react";

import { Cell, Column } from "react-table";
import PlayerStats from "types/playerStats";
import StatSplit from "types/statSplit";
import TeamPlayerStats from "types/teamPlayerStats";

import { Box, Flex, Grid, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import Table from "components/Table";
import { Tooltip } from "@chakra-ui/react";

type StatTableProps = {
  battingStats: PlayerStats;
  isPostseason?: boolean;
  splitView: string | number;
  statTargetName: string;
  teamBattingStats: TeamPlayerStats;
};

export default function TeamPlayerBattingStatTable({
  battingStats,
  isPostseason = false,
  splitView,
  statTargetName,
  teamBattingStats,
}: StatTableProps) {
  const data = React.useMemo<StatSplit[]>(
    () => battingStats.splits,
    [isPostseason, splitView, statTargetName]
  );
  const teamData = teamBattingStats.splits[0];

  const columns = React.useMemo<
    Column<StatSplit & { name: typeof NextLink | null }>[]
  >(
    () => [
      {
        accessor: (row) => row.player.fullName,
        id: "name",
        Header: () => (
          <Tooltip hasArrow label="Team" placement="top">
            Player
          </Tooltip>
        ),
        Cell: ({ row, value }: Cell<StatSplit>) => {
          return row.original?.player?.id ? (
            <NextLink href={`/players/${row.original.player.id}`} passHref>
              <Link>{value}</Link>
            </NextLink>
          ) : null;
        },
      },
      // @ts-expect-error: Type not assignable error
      ...commonBattingStatColumns(teamData),
    ],
    []
  );

  const exportFilename = `${statTargetName} ${splitView} ${
    isPostseason ? "Postseason" : "Standard"
  } Batting Stats`;

  return (
    <Table columns={columns} data={data}>
      <Flex
        alignContent="center"
        flexWrap="wrap"
        justifyContent="space-between"
      >
        <Box mt={2}>
          <Table.Heading>
            {isPostseason
              ? "Postseason Batting Stats"
              : "Standard Batting Stats"}
          </Table.Heading>
        </Box>
        <Grid gap={2} mt={2} templateColumns="repeat(2, 1fr)">
          <Table.JsonDownload filename={`${exportFilename}.json`} />
          <Table.CSVExport filename={`${exportFilename}.csv`} />
        </Grid>
      </Flex>

      {Array.isArray(data) && data.length > 0 ? (
        <Table.Content />
      ) : (
        "Sorry, no results available for this season."
      )}
    </Table>
  );
}
