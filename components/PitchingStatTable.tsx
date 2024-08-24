/* eslint-disable react/display-name */

import * as React from "react";
import { roundNumber } from "utils/columnHelpers";

import { Cell, Column } from "react-table";
import PlayerStats from "types/playerStats";
import StatSplit from "types/statSplit";

import NextLink from "next/link";
import Table from "components/Table";
import { Box, Flex, Grid, Link, Tooltip } from "@chakra-ui/react";

type StatTableProps = {
  isPaginated?: boolean;
  isPostseason?: boolean;
  pitchingStats: PlayerStats;
  statTargetName: string;
};

export default function PitchingStatTable({
  isPaginated = false,
  isPostseason = false,
  pitchingStats,
  statTargetName,
}: StatTableProps) {
  const data = React.useMemo<StatSplit[]>(
    () => pitchingStats.splits,
    [pitchingStats]
  );

  const columns = React.useMemo<
    Column<StatSplit & { season: number; teamName?: typeof Link | null }>[]
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
            <Link
              href={`/players/${row.original.player.id}`}
              as={NextLink}
              prefetch={false}
            >
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

  const exportFilename = `${statTargetName} ${
    isPostseason ? "Postseason" : "Regular Season"
  } Batting Stats`;

  return (
    <Table columns={columns} data={data} isPaginated={isPaginated}>
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
      <Table.Content />
    </Table>
  );
}

export function commonPitchingStatColumns(
  summaryData: StatSplit
): Column<StatSplit>[] {
  return [
    {
      accessor: (row) => row.stat.wins,
      id: "wins",
      Header: () => (
        <Tooltip closeOnClick={false} hasArrow label="Wins" placement="top">
          W
        </Tooltip>
      ),
      Footer: (): number =>
        React.useMemo(() => summaryData?.stat?.wins ?? null, []),
    },
    {
      accessor: (row) => row.stat.losses,
      id: "losses",
      Header: () => (
        <Tooltip closeOnClick={false} hasArrow label="Losses" placement="top">
          L
        </Tooltip>
      ),
      Footer: (): number =>
        React.useMemo(() => summaryData?.stat?.losses ?? null, []),
    },
    {
      accessor: (row) => row.stat.win_pct,
      id: "winningPercentage",
      Header: () => (
        <Tooltip
          closeOnClick={false}
          hasArrow
          label="Winning Percentage"
          placement="top"
        >
          W-L%
        </Tooltip>
      ),
      Footer: (): number =>
        React.useMemo(() => summaryData?.stat?.win_pct ?? null, []),
      Cell: ({ value }: Cell<StatSplit>) => Number(value).toFixed(2),
      sortType: "basic",
    },
    {
      accessor: (row) => row.stat.earned_run_average,
      id: "earnedRunAverage",
      Header: () => (
        <Tooltip
          closeOnClick={false}
          hasArrow
          label="Earned Run Average"
          placement="top"
        >
          ERA
        </Tooltip>
      ),
      Footer: (): number =>
        React.useMemo(() => summaryData?.stat?.earned_run_average ?? null, []),
      Cell: ({ value }: Cell<StatSplit>) => Number(value).toFixed(2),
      sortType: "basic",
    },
    {
      accessor: (row) => row.stat.games,
      id: "gamesPlayed",
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
        React.useMemo(() => summaryData?.stat?.games ?? null, []),
    },
    {
      accessor: (row) => row.stat.shutouts,
      id: "shutouts",
      Header: () => (
        <Tooltip closeOnClick={false} hasArrow label="Shutouts" placement="top">
          SHO
        </Tooltip>
      ),
      Footer: (): number =>
        React.useMemo(() => summaryData?.stat?.shutouts ?? null, []),
    },
    {
      accessor: (row) => row.stat.innings,
      id: "inningsPitched",
      Header: () => (
        <Tooltip
          closeOnClick={false}
          hasArrow
          label="Innings Pitched"
          placement="top"
        >
          IP
        </Tooltip>
      ),
      Footer: (): number =>
        React.useMemo(() => summaryData?.stat?.innings ?? null, []),
      Cell: ({ value }: Cell<StatSplit>) => Number(value).toFixed(1),
      sortType: "basic",
    },
    {
      accessor: (row) => row.stat.hits_allowed,
      id: "hitsAllowed",
      Header: () => (
        <Tooltip
          closeOnClick={false}
          hasArrow
          label="Hits Allowed"
          placement="top"
        >
          H
        </Tooltip>
      ),
      Footer: (): number =>
        React.useMemo(() => summaryData?.stat?.hits_allowed ?? null, []),
    },
    {
      accessor: (row) => row.stat.runs_allowed,
      id: "earnedRuns",
      Header: () => (
        <Tooltip
          closeOnClick={false}
          hasArrow
          label="Earned Runs"
          placement="top"
        >
          R
        </Tooltip>
      ),
      Footer: (): string | null =>
        React.useMemo(
          () => roundNumber(summaryData?.stat?.runs_allowed) ?? null,
          []
        ),
      Cell: ({ value }: Cell<StatSplit>) => roundNumber(value) ?? 0,
      sortType: "basic",
    },
    {
      accessor: (row) => row.stat.home_runs_allowed,
      id: "homeRuns",
      Header: () => (
        <Tooltip
          closeOnClick={false}
          hasArrow
          label="Home Runs"
          placement="top"
        >
          HR
        </Tooltip>
      ),
      Footer: (): number =>
        React.useMemo(() => summaryData?.stat?.home_runs_allowed ?? null, []),
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
      accessor: (row) => row.stat.quality_starts,
      id: "qualityStarts",
      Header: () => (
        <Tooltip
          closeOnClick={false}
          hasArrow
          label="Quality Starts"
          placement="top"
        >
          QS
        </Tooltip>
      ),
      Footer: (): number =>
        React.useMemo(() => summaryData?.stat?.quality_starts ?? null, []),
    },
    {
      accessor: (row) => row.stat.batters_faced,
      id: "battersFaced",
      Header: () => (
        <Tooltip
          closeOnClick={false}
          hasArrow
          label="Batters Faced"
          placement="top"
        >
          BF
        </Tooltip>
      ),
      Footer: (): number =>
        React.useMemo(() => summaryData?.stat?.batters_faced ?? null, []),
    },
    {
      accessor: (row) => row.stat.whip,
      id: "walksAndHitsPerInningPitched",
      Header: () => (
        <Tooltip
          closeOnClick={false}
          hasArrow
          label="Walks and Hits Per Inning Pitched"
          placement="top"
        >
          WHIP
        </Tooltip>
      ),
      Footer: (): number =>
        React.useMemo(() => summaryData?.stat?.whip ?? null, []),
      Cell: ({ value }: Cell<StatSplit>) => Number(value).toFixed(3),
      sortType: "basic",
    },
    {
      accessor: (row) => row.stat.hits_per_9,
      id: "hitsAllowedPerNine",
      Header: () => (
        <Tooltip
          closeOnClick={false}
          hasArrow
          label="Hits Per 9 Innings"
          placement="top"
        >
          H9
        </Tooltip>
      ),
      Footer: (): number =>
        React.useMemo(() => summaryData?.stat?.hits_per_9 ?? null, []),
      Cell: ({ value }: Cell<StatSplit>) => Number(value).toFixed(1),
      sortType: "basic",
    },
    {
      accessor: (row) => row.stat.home_runs_per_9,
      id: "homeRunsPerNine",
      Header: () => (
        <Tooltip
          closeOnClick={false}
          hasArrow
          label="Home Runs Per 9 Innings"
          placement="top"
        >
          HR9
        </Tooltip>
      ),
      Footer: (): number =>
        React.useMemo(() => summaryData?.stat?.home_runs_per_9 ?? null, []),
      Cell: ({ value }: Cell<StatSplit>) => Number(value).toFixed(1),
      sortType: "basic",
    },
    {
      accessor: (row) => row.stat.walks_per_9,
      id: "basesOnBallsPerNine",
      Header: () => (
        <Tooltip
          closeOnClick={false}
          hasArrow
          label="Walks Per 9 Innings"
          placement="top"
        >
          BB9
        </Tooltip>
      ),
      Footer: (): number =>
        React.useMemo(() => summaryData?.stat?.walks_per_9 ?? null, []),
      Cell: ({ value }: Cell<StatSplit>) => Number(value).toFixed(1),
      sortType: "basic",
    },
    {
      accessor: (row) => row.stat.strikeouts_per_9,
      id: "strikeoutsPerNine",
      Header: () => (
        <Tooltip
          closeOnClick={false}
          hasArrow
          label="Strikeouts Per 9 Innings"
          placement="top"
        >
          SO9
        </Tooltip>
      ),
      Footer: (): number =>
        React.useMemo(() => summaryData?.stat?.strikeouts_per_9 ?? null, []),
      Cell: ({ value }: Cell<StatSplit>) => Number(value).toFixed(1),
      sortType: "basic",
    },
    {
      accessor: (row) => row.stat.strikeouts_per_walk,
      id: "strikeoutToWalkRatio",
      Header: () => (
        <Tooltip
          closeOnClick={false}
          hasArrow
          label="Strikeout-to-Walk Ratio"
          placement="top"
        >
          SO/BB
        </Tooltip>
      ),
      Footer: (): number =>
        React.useMemo(() => summaryData?.stat?.strikeouts_per_walk ?? null, []),
      Cell: ({ value }: Cell<StatSplit>) => Number(value).toFixed(2),
      sortType: "basic",
    },
  ];
}
