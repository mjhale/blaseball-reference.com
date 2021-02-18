import { useApiConfigContext } from "context/ApiConfig";

import ApiConfig from "types/apiConfig";
import { LeaderGroup } from "types/leader";
import Team from "types/team";

import LeaderTable from "components/LeaderTable";
import { Heading, Grid, Skeleton, Stack } from "@chakra-ui/react";

type Props = {
  isLeadersValidating: boolean;
  isLoading: boolean;
  leaders: LeaderGroup[];
  selectedView: string | null;
  teams: Team[];
};

// A "view" contains data for "Career", "Season 1", "Season 2",  ..
export default function LeaderView({
  isLeadersValidating,
  isLoading,
  leaders,
  selectedView,
  teams,
}: Props) {
  const apiConfig: ApiConfig = useApiConfigContext();

  if (
    apiConfig == null ||
    isLeadersValidating === true ||
    isLoading === true ||
    selectedView === null ||
    !leaders ||
    !teams
  ) {
    return (
      <>
        {(isLeadersValidating === true ||
          isLoading === true ||
          !leaders ||
          !teams) && <LeaderTablesLoading />}
      </>
    );
  }

  const hittingGroup = leaders.find(
    (leaderGroup) => leaderGroup.statGroup === "hitting"
  );
  const pitchingGroup = leaders.find(
    (leaderGroup) => leaderGroup.statGroup === "pitching"
  );

  return (
    <>
      {hittingGroup !== undefined ? (
        <>
          <Heading as="h2" size="md" mb={2}>
            {!Number.isNaN(Number(selectedView)) ? (
              <>Season {Number(selectedView) + 1} Batting</>
            ) : (
              <>Career Batting</>
            )}
          </Heading>
          <Grid
            templateColumns={{
              base: "repeat(1, 1fr)",
              md: "repeat(2, 1fr)",
              lg: "repeat(4, 1fr)",
            }}
            gap={2}
            mb={4}
          >
            <LeaderTable
              columns={apiConfig.columns.hitting}
              leaderCategories={hittingGroup.leaderCategories}
              teams={teams}
            />
          </Grid>
        </>
      ) : null}

      {pitchingGroup !== undefined ? (
        <>
          <Heading as="h2" size="md" mb={2}>
            {!Number.isNaN(Number(selectedView)) ? (
              <>Season {Number(selectedView) + 1} Pitching</>
            ) : (
              <>Career Pitching</>
            )}
          </Heading>
          <Grid
            templateColumns={{
              base: "repeat(1, 1fr)",
              md: "repeat(2, 1fr)",
              lg: "repeat(4, 1fr)",
            }}
            gap={2}
            mb={4}
          >
            <LeaderTable
              columns={apiConfig.columns.pitching}
              leaderCategories={pitchingGroup.leaderCategories}
              teams={teams}
            />
          </Grid>
        </>
      ) : null}
    </>
  );
}

function LeaderTablesLoading() {
  return (
    <Stack>
      <Skeleton height="20px" />
      <Skeleton height="20px" />
      <Skeleton height="20px" />
    </Stack>
  );
}
