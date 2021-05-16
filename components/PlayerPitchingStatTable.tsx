/* eslint-disable react/display-name */

import { commonPitchingStatColumns } from "components/PitchingStatTable";
import * as React from "react";

import { Cell, Column } from "react-table";
import PlayerStats from "types/playerStats";
import StatSplit from "types/statSplit";
import Team from "types/team";

import NextLink from "next/link";
import Table from "components/Table";
import { Box, Flex, Grid, Link, Tooltip } from "@chakra-ui/react";

type StatTableProps = {
  careerPitchingStats;
  isPostseason?: boolean;
  pitchingStats: PlayerStats;
  statTargetName: string;
};

export default function PlayerPitchingStatTable({
  careerPitchingStats,
  isPostseason = false,
  pitchingStats,
  statTargetName,
}: StatTableProps) {
  const data = React.useMemo<StatSplit[]>(
    () => pitchingStats.splits,
    [statTargetName]
  );
  const careerData = careerPitchingStats.splits[0];

  const columns = React.useMemo<
    Column<StatSplit & { season: number; teamName: typeof NextLink | null }>[]
  >(
    () => [
      {
        accessor: "season",
        Header: () => (
          <Tooltip closeOnClick={false} hasArrow label="Year" placement="top">
            Yr
          </Tooltip>
        ),
        Cell: ({ value }: Cell<StatSplit>) => {
          // Return an asterisk for seasons 1 and 2 due to limited data
          return [0, 1].includes(Number(value))
            ? `${Number(value) + 1}*`
            : Number(value) + 1;
        },
      },
      {
        accessor: "teamName",
        Header: () => (
          <Tooltip closeOnClick={false} hasArrow label="Team" placement="top">
            Tm
          </Tooltip>
        ),
        Cell: ({ row }: Cell<StatSplit>) => {
          const team: Team | undefined = row.original.team;

          return team && team.url_slug ? (
            <NextLink href={`/teams/${team.url_slug}`} passHref>
              <Link>{team.nickname}</Link>
            </NextLink>
          ) : null;
        },
      },
      // @ts-expect-error: Type not assignable error
      ...commonPitchingStatColumns(careerData),
    ],
    [isPostseason, statTargetName]
  );

  const exportFilename = `${statTargetName} ${
    isPostseason ? "Postseason" : "Regular Season"
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
      <Table.Content />
    </Table>
  );
}
