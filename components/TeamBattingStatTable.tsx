import { BattingStats } from "types/battingStats";
import { Column } from "react-table";
import { commonBattingStatColumns } from "components/BattingStatTable";
import { useMemo } from "react";

import { Flex, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import Table from "components/Table";
import { Tooltip } from "@chakra-ui/react";

type StatTableProps = {
  battingStats: { [seasonNumber: string]: BattingStats };
  isPostseason?: boolean;
  statTargetName: string;
  season: string;
};

export default function TeamBattingStatTable({
  battingStats,
  isPostseason = false,
  statTargetName,
  season,
}: StatTableProps) {
  if (
    !battingStats ||
    (!isPostseason &&
      (!battingStats.seasons ||
        Object.keys(battingStats.seasons).length === 0)) ||
    (isPostseason &&
      (!battingStats.postseasons ||
        Object.keys(battingStats.postseasons).length === 0))
  ) {
    return null;
  }

  const data = useMemo<BattingStats[]>(() => {
    const seasons = isPostseason
      ? battingStats.postseasons
      : battingStats.seasons;

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

  const columns = useMemo<Column<BattingStats>[]>(
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
      ...commonBattingStatColumns(),
    ],
    [isPostseason, season, statTargetName]
  );

  return (
    <Table columns={columns} data={data}>
      <Flex alignContent="baseline" justifyContent="space-between">
        <Table.Heading level="h3" size="sm">
          {"Team Batting Stats"}
        </Table.Heading>
        <Flex alignItems="center">
          <Table.CSVExport
            filename={`${statTargetName} Regular Season Batting Stats.csv`}
          />
        </Flex>
      </Flex>
      <Table.Content />
    </Table>
  );
}
