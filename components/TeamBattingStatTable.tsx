import { commonBattingStatColumns } from "components/BattingStatTable";
import * as React from "react";

import { Cell, Column } from "react-table";
import StatSplit from "types/statSplit";
import TeamStats from "types/teamStats";

import { Box, Flex, Grid, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import Table from "components/Table";
import { Tooltip } from "@chakra-ui/react";

type StatTableProps = {
  battingStats: TeamStats;
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
  const data = React.useMemo<StatSplit[]>(
    () => battingStats.splits,
    [isPostseason, splitView, statTargetName]
  );

  const columns = React.useMemo<
    Column<StatSplit & { name: typeof NextLink | null }>[]
  >(
    () => [
      {
        accessor: (row) => row.team.full_name,
        id: "name",
        Header: () => (
          <Tooltip hasArrow label="Team" placement="top">
            Team
          </Tooltip>
        ),
        Cell: ({ row, value }: Cell<StatSplit>) => {
          return row.original?.team?.team_id ? (
            <NextLink href={`/teams/${row.original.team.team_id}`} passHref>
              <Link>{value}</Link>
            </NextLink>
          ) : null;
        },
      },
      // @ts-expect-error: Type not assignable error
      ...commonBattingStatColumns(),
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
          <Table.Heading>Batting Stats</Table.Heading>
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
