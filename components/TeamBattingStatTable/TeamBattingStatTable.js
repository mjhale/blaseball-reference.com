import { commonBattingStatColumns } from "components/BattingStatTable/BattingStatTable";

import { Flex, Link } from "@chakra-ui/core";
import NextLink from "next/link";
import Table from "components/Table";
import { Tooltip } from "@chakra-ui/core";

export default function TeamBattingStatTable({
  isPostseason = false,
  battingStats,
  season,
  statTargetName,
}) {
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

  const data = React.useMemo(() => {
    const seasons = isPostseason
      ? battingStats.postseasons
      : battingStats.seasons;

    if (!season) {
      season = Object.keys(seasons).sort().pop();
    }

    return seasons[season].map((player) => {
      return {
        ...player,
        season,
      };
    });
  }, [isPostseason, season, statTargetName]);

  const columns = React.useMemo(
    () =>
      [
        {
          accessor: "name",
          Header: (
            <Tooltip hasArrow label="Team" placement="top">
              Player
            </Tooltip>
          ),
          Cell: ({ row, value }) => {
            return row.original?.slug ? (
              <NextLink
                href="/players/[playerSlug]"
                as={`/players/${row.original.slug}`}
                passHref
              >
                <Link>{value}</Link>
              </NextLink>
            ) : null;
          },
        },
      ].concat(commonBattingStatColumns()),
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
