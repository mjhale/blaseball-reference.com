import { commonPitchingStatColumns } from "components/PitchingStatTable";
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
  isPostseason?: boolean;
  pitchingStats: PlayerStats;
  splitView: string | number;
  statTargetName: string;
  teamPitchingStats: TeamPlayerStats;
};

export default function TeamPlayerPitchingStatTable({
  isPostseason = false,
  splitView,
  pitchingStats,
  statTargetName,
  teamPitchingStats,
}: StatTableProps) {
  const data = React.useMemo<StatSplit[]>(
    () => pitchingStats.splits,
    [pitchingStats]
  );
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
    [teamData]
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
          <Table.Heading>
            {isPostseason
              ? "Postseason Pitching Stats"
              : "Standard Pitching Stats"}
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
