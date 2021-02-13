/* eslint-disable react/display-name */

import { getColumnAverage, getColumnSum } from "utils/columnHelpers";
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
  isPostseason?: boolean;
  statTargetName: string;
};

export default function BattingStatTable({
  battingStats,
  isPostseason = false,
  statTargetName,
}: StatTableProps) {
  const data = React.useMemo<StatSplit[]>(() => battingStats.splits, [
    isPostseason,
    statTargetName,
  ]);

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
      ...commonBattingStatColumns(),
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

export function commonBattingStatColumns(): Column<StatSplit>[] {
  return [
    // {
    //   accessor: "appearances",
    //   Header: () => (
    //     <Tooltip
    //       closeOnClick={false}
    //       hasArrow
    //       label="Games Played"
    //       placement="top"
    //     >
    //       G
    //     </Tooltip>
    //   ),
    //   Footer: (): number | null => summaryData?.appearances ?? null,
    // },
    {
      accessor: (row) => row.stat.plate_appearances,
      id: "plateAppearances",
      Header: () => (
        <Tooltip
          closeOnClick={false}
          hasArrow
          label="Plate Appearances"
          placement="top"
        >
          PA
        </Tooltip>
      ),
      Footer: (original): number =>
        React.useMemo(
          () => getColumnSum(original.rows, original.column.id),
          []
        ),
    },
    {
      accessor: (row) => row.stat.at_bats,
      id: "atBats",
      Header: () => (
        <Tooltip closeOnClick={false} hasArrow label="At Bats" placement="top">
          AB
        </Tooltip>
      ),
      Footer: (original): number => {
        return React.useMemo(
          () => getColumnSum(original.rows, original.column.id),
          []
        );
      },
    },
    {
      accessor: (row) => row.stat.runs,
      id: "runsScored",
      Header: () => (
        <Tooltip
          closeOnClick={false}
          hasArrow
          label="Runs Scored"
          placement="top"
        >
          R
        </Tooltip>
      ),
      Footer: (original): number =>
        React.useMemo(
          () => getColumnSum(original.rows, original.column.id),
          []
        ),
    },
    {
      accessor: (row) => row.stat.hits,
      id: "hits",
      Header: () => (
        <Tooltip closeOnClick={false} hasArrow label="Hits" placement="top">
          H
        </Tooltip>
      ),
      Footer: (original): number =>
        React.useMemo(
          () => getColumnSum(original.rows, original.column.id),
          []
        ),
    },
    {
      accessor: (row) => row.stat.doubles,
      id: "doublesHit",
      Header: () => (
        <Tooltip
          closeOnClick={false}
          hasArrow
          label="Doubles Hit"
          placement="top"
        >
          2B
        </Tooltip>
      ),
      Footer: (original): number =>
        React.useMemo(
          () => getColumnSum(original.rows, original.column.id),
          []
        ),
    },
    {
      accessor: (row) => row.stat.triples,
      id: "triplesHit",
      Header: () => (
        <Tooltip
          closeOnClick={false}
          hasArrow
          label="Triples Hit"
          placement="top"
        >
          3B
        </Tooltip>
      ),
      Footer: (original): number =>
        React.useMemo(
          () => getColumnSum(original.rows, original.column.id),
          []
        ),
    },
    {
      accessor: (row) => row.stat.quadruples,
      id: "quadruplesHit",
      Header: () => (
        <Tooltip
          closeOnClick={false}
          hasArrow
          label="Quadruples Hit"
          placement="top"
        >
          4B
        </Tooltip>
      ),
      Footer: (original): number =>
        React.useMemo(
          () => getColumnSum(original.rows, original.column.id),
          []
        ),
    },
    {
      accessor: (row) => row.stat.home_runs,
      id: "homeRunsHit",
      Header: () => (
        <Tooltip
          closeOnClick={false}
          hasArrow
          label="Home Runs Hit"
          placement="top"
        >
          HR
        </Tooltip>
      ),
      Footer: (original): number =>
        React.useMemo(
          () => getColumnSum(original.rows, original.column.id),
          []
        ),
    },
    {
      accessor: (row) => row.stat.runs_batted_in,
      id: "runsBattedIn",
      Header: () => (
        <Tooltip
          closeOnClick={false}
          hasArrow
          label="Runs Batted In"
          placement="top"
        >
          RBI
        </Tooltip>
      ),
      Footer: (original): number =>
        React.useMemo(
          () => getColumnSum(original.rows, original.column.id),
          []
        ),
    },
    {
      accessor: (row) => row.stat.stolen_bases,
      id: "stolenBases",
      Header: () => (
        <Tooltip
          closeOnClick={false}
          hasArrow
          label="Stolen Bases"
          placement="top"
        >
          SB
        </Tooltip>
      ),
      Footer: (original): number =>
        React.useMemo(
          () => getColumnSum(original.rows, original.column.id),
          []
        ),
    },
    {
      accessor: (row) => row.stat.caught_stealing,
      id: "caughtStealing",
      Header: () => (
        <Tooltip
          closeOnClick={false}
          hasArrow
          label="Caught Stealing"
          placement="top"
        >
          CS
        </Tooltip>
      ),
      Footer: (original): number =>
        React.useMemo(
          () => getColumnSum(original.rows, original.column.id),
          []
        ),
    },
    {
      accessor: (row) => row.stat.walks,
      id: "basesOnBalls",
      Header: () => (
        <Tooltip
          closeOnClick={false}
          hasArrow
          label="Bases on Balls (Walks)"
          placement="top"
        >
          BB
        </Tooltip>
      ),
      Footer: (original): number =>
        React.useMemo(
          () => getColumnSum(original.rows, original.column.id),
          []
        ),
    },
    {
      accessor: (row) => row.stat.strikeouts,
      id: "strikeouts",
      Header: () => (
        <Tooltip
          closeOnClick={false}
          hasArrow
          label="Strikeouts"
          placement="top"
        >
          SO
        </Tooltip>
      ),
      Footer: (original): number =>
        React.useMemo(
          () => getColumnSum(original.rows, original.column.id),
          []
        ),
    },
    {
      accessor: (row) => row.stat.batting_average,
      id: "battingAverage",
      Header: () => (
        <Tooltip
          closeOnClick={false}
          hasArrow
          label="Batting Average"
          placement="top"
        >
          BA
        </Tooltip>
      ),
      Footer: (original): string =>
        React.useMemo(
          () => getColumnAverage(original.rows, original.column.id).toFixed(3),
          []
        ),
      Cell: ({ value }: Cell<StatSplit>) => Number(value).toFixed(3),
      sortType: "basic",
    },
    {
      accessor: (row) => row.stat.batting_average_risp,
      id: "battingAverageWithRunnersInScoringPosition",
      Header: () => (
        <Tooltip
          closeOnClick={false}
          hasArrow
          label="Batting Average With Runners in Scoring Position"
          placement="top"
        >
          BA/RISP
        </Tooltip>
      ),
      Footer: (original): string =>
        React.useMemo(
          () => getColumnAverage(original.rows, original.column.id).toFixed(3),
          []
        ),
      Cell: ({ value }: Cell<StatSplit>) => Number(value).toFixed(3),
      sortType: "basic",
    },
    {
      accessor: (row) => row.stat.on_base_percentage,
      id: "onBasePercentage",
      Header: () => (
        <Tooltip
          closeOnClick={false}
          hasArrow
          label="On-base Percentage"
          placement="top"
        >
          OBP
        </Tooltip>
      ),
      Footer: (original): string =>
        React.useMemo(
          () => getColumnAverage(original.rows, original.column.id).toFixed(3),
          []
        ),
      Cell: ({ value }: Cell<StatSplit>) => Number(value).toFixed(3),
      sortType: "basic",
    },
    {
      accessor: (row) => row.stat.slugging,
      id: "sluggingPercentage",
      Header: () => (
        <Tooltip
          closeOnClick={false}
          hasArrow
          label="Slugging Percentage"
          placement="top"
        >
          SLG
        </Tooltip>
      ),
      Footer: (original): string =>
        React.useMemo(
          () => getColumnAverage(original.rows, original.column.id).toFixed(3),
          []
        ),
      Cell: ({ value }: Cell<StatSplit>) => Number(value).toFixed(3),
      sortType: "basic",
    },
    {
      accessor: (row) => row.stat.on_base_slugging,
      id: "onBasePlusSlugging",
      Header: () => (
        <Tooltip
          closeOnClick={false}
          hasArrow
          label="On-base Plus Slugging Percentage"
          placement="top"
        >
          OPS
        </Tooltip>
      ),
      Footer: (original): string =>
        React.useMemo(
          () => getColumnAverage(original.rows, original.column.id).toFixed(3),
          []
        ),
      Cell: ({ value }: Cell<StatSplit>) => Number(value).toFixed(3),
      sortType: "basic",
    },
    {
      accessor: (row) => row.stat.total_bases,
      id: "totalBases",
      Header: () => (
        <Tooltip
          closeOnClick={false}
          hasArrow
          label="Total Bases"
          placement="top"
        >
          TB
        </Tooltip>
      ),
      Footer: (original): number =>
        React.useMemo(
          () => getColumnSum(original.rows, original.column.id),
          []
        ),
    },
    {
      accessor: (row) => row.stat.gidp,
      id: "groundIntoDoublePlays",
      Header: () => (
        <Tooltip
          closeOnClick={false}
          hasArrow
          label="Double Plays Grounded Into"
          placement="top"
        >
          GDP
        </Tooltip>
      ),
      Footer: (original): number =>
        React.useMemo(
          () => getColumnSum(original.rows, original.column.id),
          []
        ),
    },
    {
      accessor: (row) => row.stat.sacrifice_bunts,
      id: "sacrificeBunts",
      Header: () => (
        <Tooltip
          closeOnClick={false}
          hasArrow
          label="Sacrifice Hits (Sacrifice Bunts)"
          placement="top"
        >
          SH
        </Tooltip>
      ),
      Footer: (original): number =>
        React.useMemo(
          () => getColumnSum(original.rows, original.column.id),
          []
        ),
    },
    {
      accessor: (row) => row.stat.sacrifice_flies,
      id: "sacrificeFlies",
      Header: () => (
        <Tooltip
          closeOnClick={false}
          hasArrow
          label="Sacrifice Flies"
          placement="top"
        >
          SF
        </Tooltip>
      ),
      Footer: (original): number =>
        React.useMemo(
          () => getColumnSum(original.rows, original.column.id),
          []
        ),
    },
  ];
}
