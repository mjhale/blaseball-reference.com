/* eslint-disable react/display-name */

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
  careerBattingStats: PlayerStats;
  isPostseason?: boolean;
  statTargetName: string;
};

export default function BattingStatTable({
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

export function commonBattingStatColumns(
  summaryData: StatSplit
): Column<StatSplit>[] {
  return [
    {
      accessor: (row) => row.stat.appearances,
      id: "appearances",
      Header: () => (
        <Tooltip
          closeOnClick={false}
          hasArrow
          label="Games Played"
          placement="top"
        >
          G
        </Tooltip>
      ),
      Footer: (): number =>
        React.useMemo(() => summaryData?.stat?.appearances ?? null, []),
    },
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
      Footer: (): number =>
        React.useMemo(() => summaryData?.stat?.plate_appearances ?? null, []),
    },
    {
      accessor: (row) => row.stat.at_bats,
      id: "atBats",
      Header: () => (
        <Tooltip closeOnClick={false} hasArrow label="At Bats" placement="top">
          AB
        </Tooltip>
      ),
      Footer: (): number =>
        React.useMemo(() => summaryData?.stat?.at_bats ?? null, []),
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
      Footer: (): number =>
        React.useMemo(() => summaryData?.stat?.runs ?? null, []),
    },
    {
      accessor: (row) => row.stat.hits,
      id: "hits",
      Header: () => (
        <Tooltip closeOnClick={false} hasArrow label="Hits" placement="top">
          H
        </Tooltip>
      ),
      Footer: (): number =>
        React.useMemo(() => summaryData?.stat?.hits ?? null, []),
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
      Footer: (): number =>
        React.useMemo(() => summaryData?.stat?.doubles ?? null, []),
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
      Footer: (): number =>
        React.useMemo(() => summaryData?.stat?.triples ?? null, []),
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
      Footer: (): number =>
        React.useMemo(() => summaryData?.stat?.quadruples ?? null, []),
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
      Footer: (): number =>
        React.useMemo(() => summaryData?.stat?.home_runs ?? null, []),
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
      Footer: (): number =>
        React.useMemo(() => summaryData?.stat?.runs_batted_in ?? null, []),
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
      Footer: (): number =>
        React.useMemo(() => summaryData?.stat?.stolen_bases ?? null, []),
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
      Footer: (): number =>
        React.useMemo(() => summaryData?.stat?.caught_stealing ?? null, []),
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
      Footer: (): number =>
        React.useMemo(() => summaryData?.stat?.walks ?? null, []),
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
      Footer: (): number =>
        React.useMemo(() => summaryData?.stat?.strikeouts ?? null, []),
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
      Footer: (): number =>
        React.useMemo(() => summaryData?.stat?.batting_average ?? null, []),
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
      Footer: (): number =>
        React.useMemo(
          () => summaryData?.stat?.batting_average_risp ?? null,
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
      Footer: (): number =>
        React.useMemo(() => summaryData?.stat?.on_base_percentage ?? null, []),
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
      Footer: (): number =>
        React.useMemo(() => summaryData?.stat?.slugging ?? null, []),
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
      Footer: (): number =>
        React.useMemo(() => summaryData?.stat?.on_base_slugging ?? null, []),
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
      Footer: (): number =>
        React.useMemo(() => summaryData?.stat?.total_bases ?? null, []),
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
      Footer: (): number =>
        React.useMemo(() => summaryData?.stat?.gidp ?? null, []),
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
      Footer: (): number =>
        React.useMemo(() => summaryData?.stat?.sacrifice_bunts ?? null, []),
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
      Footer: (): number =>
        React.useMemo(() => summaryData?.stat?.sacrifice_flies ?? null, []),
    },
  ];
}
