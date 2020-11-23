import { Fragment, useEffect, useState } from "react";

import { Select, Skeleton, Stack } from "@chakra-ui/react";
import StandingsTable from "components/StandingsTable";

export default function Standings({ leaguesAndDivisions, standings, teams }) {
  const sortedSeasonList = () =>
    standings
      ? Object.keys(standings).sort((a, b) => Number(a) - Number(b))
      : [];
  const mostRecentSeason = () => sortedSeasonList().pop();

  const [selectedSeason, setSelectedSeason] = useState(mostRecentSeason());
  const [seasonList, setSeasonList] = useState(sortedSeasonList());

  useEffect(() => {
    setSeasonList(sortedSeasonList);
  }, [JSON.stringify(sortedSeasonList)]);

  useEffect(() => {
    if (seasonList.length > 0) {
      setSelectedSeason(seasonList[seasonList.length - 1]);
    }
  }, [JSON.stringify(seasonList)]);

  const handleSelectChange = (evt) => {
    setSelectedSeason(evt.target.value);
  };

  if (
    !leaguesAndDivisions ||
    !Object.hasOwnProperty.call(standings, selectedSeason) ||
    !standings
  ) {
    return (
      <>
        <Select
          fontSize={{ base: "lg", md: "md" }}
          isDisabled={true}
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

  return (
    <>
      <Select
        fontSize={{ base: "lg", md: "md" }}
        maxWidth="2xs"
        mb={4}
        onChange={handleSelectChange}
        size="md"
        value={selectedSeason}
      >
        {seasonList.map((season) => (
          <option key={season} value={season}>
            {`Season ${Number(season) + 1}`}
          </option>
        ))}
      </Select>

      {Object.entries(standings[selectedSeason]).map(
        ([divisionId, divisionTeams]) => {
          const division = leaguesAndDivisions.seasons[
            selectedSeason
          ].divisions.find((division) => division.id === divisionId);
          const seasonDivisions =
            leaguesAndDivisions.seasons[selectedSeason].divisions;

          return (
            <Fragment key={`${selectedSeason}-${divisionId}`}>
              <StandingsTable
                division={division}
                divisions={seasonDivisions}
                season={selectedSeason}
                standings={standings[selectedSeason][divisionId]}
                teams={teams}
              />
            </Fragment>
          );
        }
      )}
    </>
  );
}
