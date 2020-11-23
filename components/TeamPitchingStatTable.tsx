import { PitchingStats } from "types/pitchingStats";
import { Column } from "react-table";
import { commonPitchingStatColumns } from "components/PitchingStatTable";
import { useMemo } from "react";

import { Flex, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import Table from "components/Table";
import { Tooltip } from "@chakra-ui/react";

type StatTableProps = {
  isPostseason?: boolean;
  pitchingStats: { [seasonNumber: string]: PitchingStats };
  statTargetName: string;
  season: string;
};

export default function TeamPitchingStatTable({
  isPostseason = false,
  pitchingStats,
  season,
  statTargetName,
}: StatTableProps) {
  if (
    !pitchingStats ||
    (!isPostseason &&
      (!pitchingStats.seasons ||
        Object.keys(pitchingStats.seasons).length === 0)) ||
    (isPostseason &&
      (!pitchingStats.postseasons ||
        Object.keys(pitchingStats.postseasons).length === 0))
  ) {
    return null;
  }

  const data = useMemo<PitchingStats[]>(() => {
    const seasons = isPostseason
      ? pitchingStats.postseasons
      : pitchingStats.seasons;

    if (!season) {
      season = Object.keys(seasons)
        .sort((a, b) => Number(a) - Number(b))
        .pop();
    }

    return seasons[season].map((player) => {
      return {
        ...player,
        season,
      };
    });
  }, [isPostseason, season, statTargetName]);

  const columns = useMemo<Column<PitchingStats>[]>(
    () => [
      {
        accessor: "name",
        Header: () => (
          <Tooltip hasArrow label="Team" placement="top">
            Player
          </Tooltip>
        ),
        Cell: ({ row, value }) => {
          return row.original?.slug ? (
            <NextLink href={`/players/${row.original.slug}`} passHref>
              <Link>{value}</Link>
            </NextLink>
          ) : null;
        },
      },
      ...commonPitchingStatColumns(),
    ],
    [isPostseason, season, statTargetName]
  );

  return (
    <Table columns={columns} data={data}>
      <Flex alignContent="baseline" justifyContent="space-between">
        <Table.Heading level="h3" size="sm">
          {"Team Pitching Stats"}
        </Table.Heading>
        <Flex alignItems="center">
          <Table.CSVExport
            filename={`${statTargetName} Regular Season Pitching Stats.csv`}
          />
        </Flex>
      </Flex>
      <Table.Content />
    </Table>
  );
}
