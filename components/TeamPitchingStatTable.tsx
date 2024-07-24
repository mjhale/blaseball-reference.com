import { commonPitchingStatColumns } from "components/PitchingStatTable";
import * as React from "react";

import { Cell, Column } from "react-table";
import StatSplit from "types/statSplit";
import TeamStats from "types/teamStats";

import { Box, Flex, Grid, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import Table from "components/Table";
import { Tooltip } from "@chakra-ui/react";

type StatTableProps = {
  pitchingStats: TeamStats;
  isPostseason?: boolean;
  splitView: string | number;
  statTargetName: string;
};

export default function TeamPitchingStatTable({
  pitchingStats,
  isPostseason = false,
  splitView,
  statTargetName,
}: StatTableProps) {
  const data = React.useMemo<StatSplit[]>(
    () => pitchingStats.splits,
    [pitchingStats]
  );

  const columns = React.useMemo<
    Column<StatSplit & { name: typeof Link | null }>[]
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
            <Link href={`/teams/${row.original.team.team_id}`} as={NextLink}>
              {value}
            </Link>
          ) : null;
        },
      },
      // @ts-expect-error: Type not assignable error
      ...commonPitchingStatColumns(),
    ],
    []
  );

  const exportFilename = `${statTargetName} ${splitView} ${
    isPostseason ? "Postseason" : "Standard"
  } Pitching Stats`;

  return (
    <Table columns={columns} data={data}>
      <Flex
        alignContent="center"
        flexWrap="wrap"
        justifyContent="space-between"
      >
        <Box mt={2}>
          <Table.Heading>Pitching Stats</Table.Heading>
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
