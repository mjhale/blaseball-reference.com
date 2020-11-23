import { Column } from "react-table";
import { PitchingStats } from "types/pitchingStats";
import Team from "types/team";
import { useMemo } from "react";

import NextLink from "next/link";
import Table from "components/Table";
import { Flex, Link, Tooltip } from "@chakra-ui/react";

type StatTableProps = {
  pitchingStats: { [seasonNumber: string]: PitchingStats };
  isPostseason?: boolean;
  statTargetName: string;
  teams: Array<Team>;
};

export default function PitchingStatTable({
  isPostseason = false,
  pitchingStats,
  statTargetName,
  teams,
}: StatTableProps) {
  const careerTotals: PitchingStats = isPostseason
    ? pitchingStats.careerPostseason
    : pitchingStats.careerSeason;

  const data = useMemo<PitchingStats[]>(() => {
    const seasons = isPostseason
      ? pitchingStats.postseasons
      : pitchingStats.seasons;

    return Object.keys(seasons)
      .sort((a, b) => Number(a) - Number(b))
      .map((season) => {
        return {
          ...seasons[season],
          season: season,
        };
      });
  }, [isPostseason, statTargetName]);

  const columns = useMemo<Column<PitchingStats>[]>(
    () => [
      {
        accessor: "season",
        Header: () => (
          <Tooltip closeOnClick={false} hasArrow label="Year" placement="top">
            Yr
          </Tooltip>
        ),
        Cell: ({ value }) => {
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
        Cell: ({ row, value }) => {
          const team = teams.find((team) => team.id === row.original.team);

          return team ? (
            <NextLink href={`/teams/${team.slug}`} passHref>
              <Link>{value}</Link>
            </NextLink>
          ) : null;
        },
      },
      ...commonPitchingStatColumns(careerTotals),
    ],
    [isPostseason, statTargetName]
  );

  return (
    <Table columns={columns} data={data}>
      <Flex alignContent="center" justifyContent="space-between" mb={1}>
        <Table.Heading>
          {isPostseason
            ? "Postseason Pitching Stats"
            : "Standard Pitching Stats"}
        </Table.Heading>
        <Flex alignItems="center">
          <Table.CSVExport
            filename={`${statTargetName} ${
              isPostseason ? "Postseason" : "Regular Season"
            } Pitching Stats.csv`}
          />
        </Flex>
      </Flex>
      <Table.Content />
    </Table>
  );
}

export function commonPitchingStatColumns(
  summaryData?: PitchingStats
): Column<PitchingStats>[] {
  return [
    {
      accessor: "wins",
      Header: () => (
        <Tooltip closeOnClick={false} hasArrow label="Wins" placement="top">
          W
        </Tooltip>
      ),
      Footer: (): number | null => summaryData?.wins ?? null,
    },
    {
      accessor: "losses",
      Header: () => (
        <Tooltip closeOnClick={false} hasArrow label="Losses" placement="top">
          L
        </Tooltip>
      ),
      Footer: (): number | null => summaryData?.losses ?? null,
    },
    {
      accessor: "winningPercentage",
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
      Footer: (): string | null =>
        summaryData ? Number(summaryData.winningPercentage).toFixed(2) : null,
      Cell: ({ value }) => Number(value).toFixed(2),
      sortType: "basic",
    },
    {
      accessor: "earnedRunAverage",
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
      Footer: (): string | null =>
        summaryData ? Number(summaryData.earnedRunAverage).toFixed(2) : null,
      Cell: ({ value }) => Number(value).toFixed(2),
      sortType: "basic",
    },
    {
      accessor: "appearances",
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
      Footer: (): number | null => summaryData?.appearances ?? null,
    },
    {
      accessor: "shutouts",
      Header: () => (
        <Tooltip closeOnClick={false} hasArrow label="Shutouts" placement="top">
          SHO
        </Tooltip>
      ),
      Footer: (): number | null => summaryData?.shutouts ?? null,
    },
    {
      accessor: "inningsPitched",
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
      Cell: ({ value }) => Number(value).toFixed(1),
      Footer: (): number | null => summaryData?.inningsPitched ?? null,
      sortType: "basic",
    },
    {
      accessor: "hitsAllowed",
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
      Footer: (): number | null => summaryData?.hitsAllowed ?? null,
    },
    {
      accessor: "earnedRuns",
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
      Footer: (): number | null => summaryData?.earnedRuns ?? null,
    },
    {
      accessor: "homeRuns",
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
      Footer: (): number | null => summaryData?.homeRuns ?? null,
    },
    {
      accessor: "basesOnBalls",
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
      Footer: (): number | null => summaryData?.basesOnBalls ?? null,
    },
    {
      accessor: "strikeouts",
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
      Footer: (): number | null => summaryData?.strikeouts ?? null,
    },
    {
      accessor: "qualityStarts",
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
      Footer: (): number | null => summaryData?.qualityStarts ?? null,
    },
    {
      accessor: "battersFaced",
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
      Footer: (): number | null => summaryData?.battersFaced ?? null,
    },
    {
      accessor: "walksAndHitsPerInningPitched",
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
      Footer: (): string | null =>
        summaryData
          ? Number(summaryData.walksAndHitsPerInningPitched).toFixed(3)
          : null,
      Cell: ({ value }) => Number(value).toFixed(3),
      sortType: "basic",
    },
    {
      accessor: "hitsAllowedPerNine",
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
      Footer: (): string | null =>
        summaryData ? Number(summaryData.hitsAllowedPerNine).toFixed(1) : null,
      Cell: ({ value }) => Number(value).toFixed(1),
      sortType: "basic",
    },
    {
      accessor: "homeRunsPerNine",
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
      Footer: (): string | null =>
        summaryData ? Number(summaryData.homeRunsPerNine).toFixed(1) : null,
      Cell: ({ value }) => Number(value).toFixed(1),
      sortType: "basic",
    },
    {
      accessor: "basesOnBallsPerNine",
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
      Footer: (): string | null =>
        summaryData ? Number(summaryData.basesOnBallsPerNine).toFixed(1) : null,
      Cell: ({ value }) => Number(value).toFixed(1),
      sortType: "basic",
    },
    {
      accessor: "strikeoutsPerNine",
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
      Footer: (): string | null =>
        summaryData ? Number(summaryData.strikeoutsPerNine).toFixed(1) : null,
      Cell: ({ value }) => Number(value).toFixed(1),
      sortType: "basic",
    },
    {
      accessor: "strikeoutToWalkRatio",
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
      Footer: (): string | null =>
        summaryData
          ? Number(summaryData.strikeoutToWalkRatio).toFixed(2)
          : null,
      Cell: ({ value }) => Number(value).toFixed(2),
      sortType: "basic",
    },
  ];
}
