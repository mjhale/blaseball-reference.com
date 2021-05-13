/* eslint-disable react/display-name */

import { commonBattingStatColumns } from "components/BattingStatTable";
import * as React from "react";

import { Cell, Column, Row } from "react-table";
import PlayerStats from "types/playerStats";
import StatSplit from "types/statSplit";
import Team from "types/team";

import NextLink from "next/link";
import Table from "components/Table";
import { Flex, Link, Tooltip } from "@chakra-ui/react";

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
  const data = React.useMemo<StatSplit[]>(() => battingStats.splits, [
    isPostseason,
    statTargetName,
  ]);
  const careerData = careerBattingStats.splits[0];

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
            <NextLink href={`/teams/${team.url_slug}`} passHref>
              <Link>{team.nickname}</Link>
            </NextLink>
          ) : null;
        },
      },
      // @ts-expect-error: Type not assignable error
      ...commonBattingStatColumns(careerData),
    ],
    [isPostseason, statTargetName]
  );

  return (
    <>
      <Table columns={columns} data={data}>
        <Flex alignContent="center" justifyContent="space-between" mb={1}>
          <Table.Heading>
            {isPostseason
              ? "Postseason Batting Stats"
              : "Standard Batting Stats"}
          </Table.Heading>
          <Flex alignItems="center">
            <Table.CSVExport
              filename={`${statTargetName} ${
                isPostseason ? "Postseason" : "Regular Season"
              } Batting Stats.csv`}
            />
          </Flex>
        </Flex>
        <Table.Content />
      </Table>
    </>
  );
}
