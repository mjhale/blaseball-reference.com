import { BattingStats } from "types/battingStats";
import { Column } from "react-table";
import Team from "types/team";
import { useMemo } from "react";

import NextLink from "next/link";
import Table from "components/Table";
import { Flex, Link, Tooltip } from "@chakra-ui/react";

type StatTableProps = {
  battingStats: { [seasonNumber: string]: BattingStats };
  isPostseason?: boolean;
  statTargetName: string;
  teams: Array<Team>;
};

export default function BattingStatTable({
  battingStats,
  isPostseason = false,
  statTargetName,
  teams,
}: StatTableProps) {
  const careerTotals: BattingStats = isPostseason
    ? battingStats.careerPostseason
    : battingStats.careerSeason;

  const data = useMemo<BattingStats[]>(() => {
    const seasons = isPostseason
      ? battingStats.postseasons
      : battingStats.seasons;

    return Object.keys(seasons)
      .sort((a, b) => Number(a) - Number(b))
      .map((season) => {
        return {
          ...seasons[season],
          season,
        };
      });
  }, [isPostseason, statTargetName]);

  const columns = useMemo<Column<BattingStats>[]>(
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
        Cell: ({ row, value }: { row: any; value: any }) => {
          const team = teams.find((team) => team.id === row.original.team);

          return team ? (
            <NextLink href={`/teams/${team.slug}`} passHref>
              <Link>{value}</Link>
            </NextLink>
          ) : null;
        },
      },
      ...commonBattingStatColumns(careerTotals),
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
  summaryData?: BattingStats
): Column<BattingStats>[] {
  return [
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
      accessor: "plateAppearances",
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
      Footer: (): number | null => summaryData?.plateAppearances ?? null,
    },
    {
      accessor: "atBats",
      Header: () => (
        <Tooltip closeOnClick={false} hasArrow label="At Bats" placement="top">
          AB
        </Tooltip>
      ),
      Footer: (): number | null => summaryData?.atBats ?? null,
    },
    {
      accessor: "runsScored",
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
      Footer: (): number | null => summaryData?.runsScored ?? null,
    },
    {
      accessor: "hits",
      Header: () => (
        <Tooltip closeOnClick={false} hasArrow label="Hits" placement="top">
          H
        </Tooltip>
      ),
      Footer: (): number | null => summaryData?.hits ?? null,
    },
    {
      accessor: "doublesHit",
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
      Footer: (): number | null => summaryData?.doublesHit ?? null,
    },
    {
      accessor: "triplesHit",
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
      Footer: (): number | null => summaryData?.triplesHit ?? null,
    },
    {
      accessor: "quadruplesHit",
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
      Footer: (): number | null => summaryData?.quadruplesHit ?? null,
    },
    {
      accessor: "homeRunsHit",
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
      Footer: (): number | null => summaryData?.homeRunsHit ?? null,
    },
    {
      accessor: "runsBattedIn",
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
      Footer: (): number | null => summaryData?.runsBattedIn ?? null,
    },
    {
      accessor: "stolenBases",
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
      Footer: (): number | null => summaryData?.stolenBases ?? null,
    },
    {
      accessor: "caughtStealing",
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
      Footer: (): number | null => summaryData?.caughtStealing ?? null,
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
      accessor: "battingAverage",
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
      Footer: (): string | null =>
        summaryData ? Number(summaryData.battingAverage).toFixed(3) : null,
      Cell: ({ value }) => Number(value).toFixed(3),
      sortType: "basic",
    },
    {
      accessor: "battingAverageWithRunnersInScoringPosition",
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
      Footer: (): string | null =>
        summaryData
          ? Number(
              summaryData.battingAverageWithRunnersInScoringPosition
            ).toFixed(3)
          : null,
      Cell: ({ value }) => Number(value).toFixed(3),
      sortType: "basic",
    },
    {
      accessor: "onBasePercentage",
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
      Footer: (): string | null =>
        summaryData ? Number(summaryData.onBasePercentage).toFixed(3) : null,
      Cell: ({ value }) => Number(value).toFixed(3),
      sortType: "basic",
    },
    {
      accessor: "sluggingPercentage",
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
      Footer: (): string | null =>
        summaryData ? Number(summaryData.sluggingPercentage).toFixed(3) : null,
      Cell: ({ value }) => Number(value).toFixed(3),
      sortType: "basic",
    },
    {
      accessor: "onBasePlusSlugging",
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
      Footer: (): string | null =>
        summaryData ? Number(summaryData.onBasePlusSlugging).toFixed(3) : null,
      Cell: ({ value }) => Number(value).toFixed(3),
      sortType: "basic",
    },
    {
      accessor: "totalBases",
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
      Footer: (): number | null => summaryData?.totalBases ?? null,
    },
    {
      accessor: "groundIntoDoublePlays",
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
      Footer: (): number | null => summaryData?.groundIntoDoublePlays ?? null,
    },
    {
      accessor: "sacrificeBunts",
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
      Footer: (): number | null => summaryData?.sacrificeBunts ?? null,
    },
    {
      accessor: "sacrificeFlies",
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
      Footer: (): number | null => summaryData?.sacrificeFlies ?? null,
    },
  ];
}
