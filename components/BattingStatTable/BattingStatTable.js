import Table from "components/Table";
import { Tooltip } from "@chakra-ui/core";

export default function BattingStatTable({
  isPostseason = false,
  battingStats,
}) {
  const careerTotals = isPostseason
    ? battingStats.careerPostseason
    : battingStats.careerSeason;

  const data = React.useMemo(() => {
    const seasons = isPostseason
      ? battingStats.postseasons
      : battingStats.seasons;

    return Object.keys(seasons)
      .sort()
      .map((season) => {
        return {
          ...seasons[season],
          season: season,
        };
      });
  }, []);

  const columns = React.useMemo(
    () =>
      [
        {
          accessor: "season",
          Header: (
            <Tooltip hasArrow label="Year" placement="top">
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
      ].concat(commonBattingStatColumns(careerTotals)),
    []
  );

  return <Table columns={columns} data={data} />;
}

export function commonBattingStatColumns(summaryData = null) {
  return [
    {
      accessor: "appearances",
      Header: (
        <Tooltip hasArrow label="Games Played" placement="top">
          G
        </Tooltip>
      ),
      Footer: () => summaryData?.appearances ?? null,
    },
    {
      accessor: "plateAppearances",
      Header: (
        <Tooltip hasArrow label="Plate Appearances" placement="top">
          PA
        </Tooltip>
      ),
      Footer: () => summaryData?.plateAppearances ?? null,
    },
    {
      accessor: "atBats",
      Header: (
        <Tooltip hasArrow label="At Bats" placement="top">
          AB
        </Tooltip>
      ),
      Footer: () => summaryData?.atBats ?? null,
    },
    {
      accessor: "runsScored",
      Header: (
        <Tooltip hasArrow label="Runs Scored" placement="top">
          R
        </Tooltip>
      ),
      Footer: () => summaryData?.runsScored ?? null,
    },
    {
      accessor: "hits",
      Header: (
        <Tooltip hasArrow label="Hits" placement="top">
          H
        </Tooltip>
      ),
      Footer: () => summaryData?.hits ?? null,
    },
    {
      accessor: "doublesHit",
      Header: (
        <Tooltip hasArrow label="Doubles Hit" placement="top">
          2B
        </Tooltip>
      ),
      Footer: () => summaryData?.doublesHit ?? null,
    },
    {
      accessor: "triplesHit",
      Header: (
        <Tooltip hasArrow label="Triples Hit" placement="top">
          3B
        </Tooltip>
      ),
      Footer: () => summaryData?.triplesHit ?? null,
    },
    {
      accessor: "homeRunsHit",
      Header: (
        <Tooltip hasArrow label="Home Runs Hit" placement="top">
          HR
        </Tooltip>
      ),
      Footer: () => summaryData?.homeRunsHit ?? null,
    },
    {
      accessor: "runsBattedIn",
      Header: (
        <Tooltip hasArrow label="Runs Batted In" placement="top">
          RBI
        </Tooltip>
      ),
      Footer: () => summaryData?.runsBattedIn ?? null,
    },
    {
      accessor: "stolenBases",
      Header: (
        <Tooltip hasArrow label="Stolen Bases" placement="top">
          SB
        </Tooltip>
      ),
      Footer: () => summaryData?.stolenBases ?? null,
    },
    {
      accessor: "caughtStealing",
      Header: (
        <Tooltip hasArrow label="Caught Stealing" placement="top">
          CS
        </Tooltip>
      ),
      Footer: () => summaryData?.caughtStealing ?? null,
    },
    {
      accessor: "basesOnBalls",
      Header: (
        <Tooltip hasArrow label="Bases on Balls (Walks)" placement="top">
          BB
        </Tooltip>
      ),
      Footer: () => summaryData?.basesOnBalls ?? null,
    },
    {
      accessor: "strikeouts",
      Header: (
        <Tooltip hasArrow label="Strikeouts" placement="top">
          SO
        </Tooltip>
      ),
      Footer: () => summaryData?.strikeouts ?? null,
    },
    {
      accessor: "battingAverage",
      Header: (
        <Tooltip hasArrow label="Batting Average" placement="top">
          BA
        </Tooltip>
      ),
      Footer: () =>
        summaryData
          ? Number.parseFloat(summaryData.battingAverage).toFixed(3)
          : null,
      Cell: ({ value }) => Number.parseFloat(value).toFixed(3),
    },
    {
      accessor: "onBasePercentage",
      Header: (
        <Tooltip hasArrow label="On-base Percentage" placement="top">
          OBP
        </Tooltip>
      ),
      Footer: () =>
        summaryData
          ? Number.parseFloat(summaryData.onBasePercentage).toFixed(3)
          : null,
      Cell: ({ value }) => Number.parseFloat(value).toFixed(3),
    },
    {
      accessor: "sluggingPercentage",
      Header: (
        <Tooltip hasArrow label="Slugging Percentage" placement="top">
          SLG
        </Tooltip>
      ),
      Footer: () =>
        summaryData
          ? Number.parseFloat(summaryData.sluggingPercentage).toFixed(3)
          : null,
      Cell: ({ value }) => Number.parseFloat(value).toFixed(3),
    },
    {
      accessor: "onBasePlusSlugging",
      Header: (
        <Tooltip
          hasArrow
          label="On-base Plus Slugging Percentages"
          placement="top"
        >
          OPS
        </Tooltip>
      ),
      Footer: () =>
        summaryData
          ? Number.parseFloat(summaryData.onBasePlusSlugging).toFixed(3)
          : null,
      Cell: ({ value }) => Number.parseFloat(value).toFixed(3),
    },
    {
      accessor: "totalBases",
      Header: (
        <Tooltip hasArrow label="Total Bases" placement="top">
          TB
        </Tooltip>
      ),
      Footer: () => summaryData?.totalBases ?? null,
    },
    {
      accessor: "groundIntoDoublePlays",
      Header: (
        <Tooltip hasArrow label="Double Plays Grounded Into" placement="top">
          GDP
        </Tooltip>
      ),
      Footer: () => summaryData?.groundIntoDoublePlays ?? null,
    },
    {
      accessor: "sacrificeBunts",
      Header: (
        <Tooltip
          hasArrow
          label="Sacrifice Hits (Sacrifice Bunts)"
          placement="top"
        >
          SH
        </Tooltip>
      ),
      Footer: () => summaryData?.sacrificeBunts ?? null,
    },
    {
      accessor: "sacrificeFlies",
      Header: (
        <Tooltip hasArrow label="Sacrifice Flies" placement="top">
          SF
        </Tooltip>
      ),
      Footer: () => summaryData?.sacrificeFlies ?? null,
    },
  ];
}
