import { commonPitchingStatColumns } from "components/PitchingStatTable/PitchingStatTable";

import { Link } from "@chakra-ui/core";
import NextLink from "next/link";
import Table from "components/Table";
import { Tooltip } from "@chakra-ui/core";

export default function TeamPitchingStatTable({
  isPostseason = false,
  pitchingStats,
}) {
  const data = React.useMemo(() => {
    const seasons = isPostseason
      ? pitchingStats.postseasons
      : pitchingStats.seasons;

    const mostRecentSeason = Object.keys(seasons).sort().pop();

    return seasons[mostRecentSeason].map((player) => {
      return {
        ...player,
        season: mostRecentSeason,
      };
    });
  }, []);

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
                href="/players/[playerId]"
                as={`/players/${row.original.slug}`}
                passHref
              >
                <Link>{value}</Link>
              </NextLink>
            ) : null;
          },
        },
      ].concat(commonPitchingStatColumns()),
    []
  );

  return <Table columns={columns} data={data} />;
}
