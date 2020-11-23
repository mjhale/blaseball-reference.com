import { translateLeaderViewToSlug } from "utils/slugHelpers";
import Leader from "types/leader";
import LeaderCategory from "types/leaderCategory";
import Team from "types/team";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import LeaderTable from "components/LeaderTable";
import { Heading, Grid, Select, Skeleton, Stack } from "@chakra-ui/react";

type Props = {
  categories: LeaderCategory[];
  leaders: Leader[];
  teams: Team[];
  view?: string;
};

// A "view" contains data for "Career", "Season 1", "Season 2",  ..
export default function LeaderView({
  categories,
  leaders,
  teams,
  view,
}: Props) {
  const router = useRouter();

  const sortedSeasonList = leaders
    ? Object.keys(leaders)
        .filter((view) => Number(view))
        .sort((a, b) => Number(a) - Number(b))
    : [];
  const mostRecentSeason = sortedSeasonList
    .filter((view) => Number(view))
    .sort((a, b) => Number(a) - Number(b))
    .pop();

  const [selectedView, setSelectedView] = useState(view ?? mostRecentSeason);
  const [seasonList, setSeasonList] = useState(sortedSeasonList);

  useEffect(() => {
    setSeasonList(sortedSeasonList);
  }, [JSON.stringify(sortedSeasonList)]);

  useEffect(() => {
    mostRecentSeason;
  }, [JSON.stringify(seasonList)]);

  const handleSelectChange = (evt) => {
    router.push(
      `/leaders/${translateLeaderViewToSlug(evt.target.value)}`,
      undefined,
      { shallow: true }
    );

    setSelectedView(evt.target.value);
  };

  if (
    !categories ||
    !Object.hasOwnProperty.call(leaders, selectedView) ||
    !teams
  ) {
    return <Loading />;
  }

  return (
    <>
      <ViewSelect
        handleSelectChange={handleSelectChange}
        seasonList={seasonList}
        selectedView={selectedView}
      />

      {leaders[selectedView].batting ? (
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
            {Object.keys(leaders[selectedView].batting).map((category) => (
              <LeaderTable
                category={categories.find((c) => c.id === category)}
                leaders={leaders[selectedView].batting[category]}
                key={category}
                teams={teams}
              />
            ))}
          </Grid>
        </>
      ) : null}

      {leaders[selectedView].pitching ? (
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
            {Object.keys(leaders[selectedView].pitching).map((category) => (
              <LeaderTable
                category={categories.find((c) => c.id === category)}
                leaders={leaders[selectedView].pitching[category]}
                key={category}
                teams={teams}
              />
            ))}
          </Grid>
        </>
      ) : null}
    </>
  );
}

function ViewSelect({ handleSelectChange, seasonList, selectedView }) {
  return (
    <Select
      fontSize={{ base: "lg", md: "md" }}
      maxWidth="2xs"
      mb={4}
      onChange={handleSelectChange}
      size="md"
      value={selectedView}
    >
      <option key="allTime" value="allTime">
        {`Career`}
      </option>
      {seasonList.map((season) => (
        <option key={season} value={season}>
          {`Season ${Number(season) + 1}`}
        </option>
      ))}
    </Select>
  );
}

function Loading() {
  return (
    <>
      <Select
        isDisabled={true}
        fontSize={{ base: "lg", md: "md" }}
        maxWidth="2xs"
        mb={4}
        placeholder="Loading..."
        size="md"
      />
      <Stack>
        <Skeleton height="20px" />
        <Skeleton height="20px" />
        <Skeleton height="20px" />
      </Stack>
    </>
  );
}
