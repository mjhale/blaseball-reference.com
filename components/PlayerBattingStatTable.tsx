/* eslint-disable react/display-name */

import { commonBattingStatColumns } from "components/BattingStatTable";
import * as React from "react";

import { Cell, Column, Row } from "react-table";
import PlayerStats from "types/playerStats";
import StatSplit from "types/statSplit";
import Team from "types/team";

import NextLink from "next/link";
import Table from "components/Table";
import { Box, Flex, Grid, Link, Tooltip } from "@chakra-ui/react";

type StatTableProps = {
  battingStats: PlayerStats;
  careerBattingStats?: PlayerStats;
  isPostseason?: boolean;
  statTargetName: string;
};

export default function PlayerBattingStatTable({
  battingStats,
  careerBattingStats,
  isPostseason = false,
  statTargetName,
}: StatTableProps) {
  const data = React.useMemo<StatSplit[]>(
    () => battingStats.splits,
    [battingStats]
  );
  const careerData = careerBattingStats.splits[0];

  const columns = React.useMemo<
    Column<StatSplit & { season: number; teamName: typeof Link | null }>[]
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
          return isPostseason
            ? Number(value) + 1
            : [0, 1].includes(Number(value))
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
        Cell: ({ row }: { row: Row<StatSplit> }) => {
          const team: Team | undefined = row.original.team;

          return team ? (
            <Link
              href={`/teams/${team.url_slug}`}
              as={NextLink}
              prefetch={false}
            >
              {team.nickname}
            </Link>
          ) : null;
        },
      },
      // @ts-expect-error: Type not assignable error
      ...commonBattingStatColumns(careerData),
    ],
    [isPostseason, careerData]
  );

  const exportFilename = `${statTargetName} ${
    isPostseason ? "Postseason" : "Regular Season"
  } Batting Stats`;

  return (
    <>
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
        <Table.Content />
      </Table>
    </>
  );
}
