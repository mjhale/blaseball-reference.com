import Table from "components/Table";
import { Tooltip } from "@chakra-ui/core";

export default function PitchingStatTable({
  isPostseason = false,
  pitchingStats,
}) {
  const careerTotals =
    pitchingStats.careerPostseason || pitchingStats.careerSeason
      ? isPostseason
        ? pitchingStats.careerPostseason
        : pitchingStats.careerSeason
      : null;

  const data = React.useMemo(() => {
    const seasons = isPostseason
      ? pitchingStats.postseasons
      : pitchingStats.seasons;

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
        {
          accessor: "teamName",
          Header: (
            <Tooltip hasArrow label="Team" placement="top">
              Tm
            </Tooltip>
          ),
        },
      ].concat(commonPitchingStatColumns(careerTotals)),
    []
  );

  return <Table columns={columns} data={data} />;
}

export function commonPitchingStatColumns(summaryData = null) {
  return [
    {
      accessor: "wins",
      Header: (
        <Tooltip hasArrow label="Wins" placement="top">
          W
        </Tooltip>
      ),
      Footer: () => summaryData?.wins ?? null,
    },
    {
      accessor: "losses",
      Header: (
        <Tooltip hasArrow label="Losses" placement="top">
          L
        </Tooltip>
      ),
      Footer: () => summaryData?.losses ?? null,
    },
    {
      accessor: "winningPercentage",
      Header: (
        <Tooltip hasArrow label="Winning Percentage" placement="top">
          W-L%
        </Tooltip>
      ),
      Footer: () =>
        summaryData
          ? Number.parseFloat(summaryData.winningPercentage).toFixed(2)
          : null,
      Cell: ({ value }) => Number.parseFloat(value).toFixed(2),
    },
    {
      accessor: "earnedRunAverage",
      Header: (
        <Tooltip hasArrow label="Earned Run Average" placement="top">
          ERA
        </Tooltip>
      ),
      Footer: () =>
        summaryData
          ? Number.parseFloat(summaryData.earnedRunAverage).toFixed(2)
          : null,
      Cell: ({ value }) => Number.parseFloat(value).toFixed(2),
    },
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
      accessor: "shutouts",
      Header: (
        <Tooltip hasArrow label="Shutouts" placement="top">
          SHO
        </Tooltip>
      ),
      Footer: () => summaryData?.shutouts ?? null,
    },
    {
      accessor: "inningsPitched",
      Header: (
        <Tooltip hasArrow label="Innings Pitched" placement="top">
          IP
        </Tooltip>
      ),
      Footer: () => summaryData?.inningsPitched ?? null,
    },
    {
      accessor: "hitsAllowed",
      Header: (
        <Tooltip hasArrow label="Hits Allowed" placement="top">
          H
        </Tooltip>
      ),
      Footer: () => summaryData?.hitsAllowed ?? null,
    },
    {
      accessor: "earnedRuns",
      Header: (
        <Tooltip hasArrow label="Earned Runs" placement="top">
          R
        </Tooltip>
      ),
      Footer: () => summaryData?.earnedRuns ?? null,
    },
    {
      accessor: "homeRuns",
      Header: (
        <Tooltip hasArrow label="Home Runs" placement="top">
          HR
        </Tooltip>
      ),
      Footer: () => summaryData?.homeRuns ?? null,
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
      accessor: "battersFaced",
      Header: (
        <Tooltip hasArrow label="Batters Faced" placement="top">
          BF
        </Tooltip>
      ),
      Footer: () => summaryData?.battersFaced ?? null,
    },
    {
      accessor: "walksAndHitsPerInningPitched",
      Header: (
        <Tooltip
          hasArrow
          label="Walks and Hits Per Inning Pitched"
          placement="top"
        >
          WHIP
        </Tooltip>
      ),
      Footer: () =>
        summaryData
          ? Number.parseFloat(summaryData.walksAndHitsPerInningPitched).toFixed(
              3
            )
          : null,
      Cell: ({ value }) => Number.parseFloat(value).toFixed(3),
    },
    {
      accessor: "hitsAllowedPerNine",
      Header: (
        <Tooltip hasArrow label="Hits Per 9 Innings" placement="top">
          H9
        </Tooltip>
      ),
      Footer: () =>
        summaryData
          ? Number.parseFloat(summaryData.hitsAllowedPerNine).toFixed(1)
          : null,
      Cell: ({ value }) => Number.parseFloat(value).toFixed(1),
    },
    {
      accessor: "homeRunsPerNine",
      Header: (
        <Tooltip hasArrow label="Home Runs Per 9 Innings" placement="top">
          HR9
        </Tooltip>
      ),
      Footer: () =>
        summaryData
          ? Number.parseFloat(summaryData.homeRunsPerNine).toFixed(1)
          : null,
      Cell: ({ value }) => Number.parseFloat(value).toFixed(1),
    },
    {
      accessor: "basesOnBallsPerNine",
      Header: (
        <Tooltip hasArrow label="Walks Per 9 Innings" placement="top">
          BB9
        </Tooltip>
      ),
      Footer: () =>
        summaryData
          ? Number.parseFloat(summaryData.basesOnBallsPerNine).toFixed(1)
          : null,
      Cell: ({ value }) => Number.parseFloat(value).toFixed(1),
    },
    {
      accessor: "strikeoutsPerNine",
      Header: (
        <Tooltip hasArrow label="Strikeouts Per 9 Innings" placement="top">
          SO9
        </Tooltip>
      ),
      Footer: () =>
        summaryData
          ? Number.parseFloat(summaryData.strikeoutsPerNine).toFixed(1)
          : null,
      Cell: ({ value }) => Number.parseFloat(value).toFixed(1),
    },
    {
      accessor: "strikeoutToWalkRatio",
      Header: (
        <Tooltip hasArrow label="Strikeout-to-Walk Ratio" placement="top">
          SO/BB
        </Tooltip>
      ),
      Footer: () =>
        summaryData
          ? Number.parseFloat(summaryData.strikeoutToWalkRatio).toFixed(2)
          : null,
      Cell: ({ value }) => Number.parseFloat(value).toFixed(2),
    },
  ];
}
