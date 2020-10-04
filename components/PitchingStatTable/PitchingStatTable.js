import NextLink from "next/link";
import Table from "components/Table";
import { Flex, Link, Tooltip } from "@chakra-ui/core";

export default function PitchingStatTable({
  isPostseason = false,
  pitchingStats,
  statTargetName,
  teams,
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
  }, [isPostseason, statTargetName]);

  const columns = React.useMemo(
    () =>
      [
        {
          accessor: "season",
          Header: (
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
          Header: (
            <Tooltip closeOnClick={false} hasArrow label="Team" placement="top">
              Tm
            </Tooltip>
          ),
          Cell: ({ row, value }) => {
            const team = teams.find((team) => team.id === row.original.team);

            return team ? (
              <NextLink
                href="/teams/[teamSlug]"
                as={`/teams/${team.slug}`}
                passHref
              >
                <Link>{value}</Link>
              </NextLink>
            ) : null;
          },
        },
      ].concat(commonPitchingStatColumns(careerTotals)),
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

export function commonPitchingStatColumns(summaryData = null) {
  return [
    {
      accessor: "wins",
      Header: (
        <Tooltip closeOnClick={false} hasArrow label="Wins" placement="top">
          W
        </Tooltip>
      ),
      Footer: () => summaryData?.wins ?? null,
    },
    {
      accessor: "losses",
      Header: (
        <Tooltip closeOnClick={false} hasArrow label="Losses" placement="top">
          L
        </Tooltip>
      ),
      Footer: () => summaryData?.losses ?? null,
    },
    {
      accessor: "winningPercentage",
      Header: (
        <Tooltip
          closeOnClick={false}
          hasArrow
          label="Winning Percentage"
          placement="top"
        >
          W-L%
        </Tooltip>
      ),
      Footer: () =>
        summaryData
          ? Number.parseFloat(summaryData.winningPercentage).toFixed(2)
          : null,
      Cell: ({ value }) => Number.parseFloat(value).toFixed(2),
      sortType: "basic",
    },
    {
      accessor: "earnedRunAverage",
      Header: (
        <Tooltip
          closeOnClick={false}
          hasArrow
          label="Earned Run Average"
          placement="top"
        >
          ERA
        </Tooltip>
      ),
      Footer: () =>
        summaryData
          ? Number.parseFloat(summaryData.earnedRunAverage).toFixed(2)
          : null,
      Cell: ({ value }) => Number.parseFloat(value).toFixed(2),
      sortType: "basic",
    },
    {
      accessor: "appearances",
      Header: (
        <Tooltip
          closeOnClick={false}
          hasArrow
          label="Games Played"
          placement="top"
        >
          G
        </Tooltip>
      ),
      Footer: () => summaryData?.appearances ?? null,
    },
    {
      accessor: "shutouts",
      Header: (
        <Tooltip closeOnClick={false} hasArrow label="Shutouts" placement="top">
          SHO
        </Tooltip>
      ),
      Footer: () => summaryData?.shutouts ?? null,
    },
    {
      accessor: "inningsPitched",
      Header: (
        <Tooltip
          closeOnClick={false}
          hasArrow
          label="Innings Pitched"
          placement="top"
        >
          IP
        </Tooltip>
      ),
      Cell: ({ value }) => Number.parseFloat(value).toFixed(1),
      Footer: () => summaryData?.inningsPitched ?? null,
      sortType: "basic",
    },
    {
      accessor: "hitsAllowed",
      Header: (
        <Tooltip
          closeOnClick={false}
          hasArrow
          label="Hits Allowed"
          placement="top"
        >
          H
        </Tooltip>
      ),
      Footer: () => summaryData?.hitsAllowed ?? null,
    },
    {
      accessor: "earnedRuns",
      Header: (
        <Tooltip
          closeOnClick={false}
          hasArrow
          label="Earned Runs"
          placement="top"
        >
          R
        </Tooltip>
      ),
      Footer: () => summaryData?.earnedRuns ?? null,
    },
    {
      accessor: "homeRuns",
      Header: (
        <Tooltip
          closeOnClick={false}
          hasArrow
          label="Home Runs"
          placement="top"
        >
          HR
        </Tooltip>
      ),
      Footer: () => summaryData?.homeRuns ?? null,
    },
    {
      accessor: "basesOnBalls",
      Header: (
        <Tooltip
          closeOnClick={false}
          hasArrow
          label="Bases on Balls (Walks)"
          placement="top"
        >
          BB
        </Tooltip>
      ),
      Footer: () => summaryData?.basesOnBalls ?? null,
    },
    {
      accessor: "strikeouts",
      Header: (
        <Tooltip
          closeOnClick={false}
          hasArrow
          label="Strikeouts"
          placement="top"
        >
          SO
        </Tooltip>
      ),
      Footer: () => summaryData?.strikeouts ?? null,
    },
    {
      accessor: "qualityStarts",
      Header: (
        <Tooltip
          closeOnClick={false}
          hasArrow
          label="Quality Starts"
          placement="top"
        >
          QS
        </Tooltip>
      ),
      Footer: () => summaryData?.qualityStarts ?? null,
    },
    {
      accessor: "battersFaced",
      Header: (
        <Tooltip
          closeOnClick={false}
          hasArrow
          label="Batters Faced"
          placement="top"
        >
          BF
        </Tooltip>
      ),
      Footer: () => summaryData?.battersFaced ?? null,
    },
    {
      accessor: "walksAndHitsPerInningPitched",
      Header: (
        <Tooltip
          closeOnClick={false}
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
      sortType: "basic",
    },
    {
      accessor: "hitsAllowedPerNine",
      Header: (
        <Tooltip
          closeOnClick={false}
          hasArrow
          label="Hits Per 9 Innings"
          placement="top"
        >
          H9
        </Tooltip>
      ),
      Footer: () =>
        summaryData
          ? Number.parseFloat(summaryData.hitsAllowedPerNine).toFixed(1)
          : null,
      Cell: ({ value }) => Number.parseFloat(value).toFixed(1),
      sortType: "basic",
    },
    {
      accessor: "homeRunsPerNine",
      Header: (
        <Tooltip
          closeOnClick={false}
          hasArrow
          label="Home Runs Per 9 Innings"
          placement="top"
        >
          HR9
        </Tooltip>
      ),
      Footer: () =>
        summaryData
          ? Number.parseFloat(summaryData.homeRunsPerNine).toFixed(1)
          : null,
      Cell: ({ value }) => Number.parseFloat(value).toFixed(1),
      sortType: "basic",
    },
    {
      accessor: "basesOnBallsPerNine",
      Header: (
        <Tooltip
          closeOnClick={false}
          hasArrow
          label="Walks Per 9 Innings"
          placement="top"
        >
          BB9
        </Tooltip>
      ),
      Footer: () =>
        summaryData
          ? Number.parseFloat(summaryData.basesOnBallsPerNine).toFixed(1)
          : null,
      Cell: ({ value }) => Number.parseFloat(value).toFixed(1),
      sortType: "basic",
    },
    {
      accessor: "strikeoutsPerNine",
      Header: (
        <Tooltip
          closeOnClick={false}
          hasArrow
          label="Strikeouts Per 9 Innings"
          placement="top"
        >
          SO9
        </Tooltip>
      ),
      Footer: () =>
        summaryData
          ? Number.parseFloat(summaryData.strikeoutsPerNine).toFixed(1)
          : null,
      Cell: ({ value }) => Number.parseFloat(value).toFixed(1),
      sortType: "basic",
    },
    {
      accessor: "strikeoutToWalkRatio",
      Header: (
        <Tooltip
          closeOnClick={false}
          hasArrow
          label="Strikeout-to-Walk Ratio"
          placement="top"
        >
          SO/BB
        </Tooltip>
      ),
      Footer: () =>
        summaryData
          ? Number.parseFloat(summaryData.strikeoutToWalkRatio).toFixed(2)
          : null,
      Cell: ({ value }) => Number.parseFloat(value).toFixed(2),
      sortType: "basic",
    },
  ];
}
