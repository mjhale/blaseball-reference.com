import * as React from "react";

import Division from "types/division";
import { SeasonStandings } from "types/standings";
import Subleague from "types/subleague";
import Team from "types/team";

import { Select, Skeleton, Stack } from "@chakra-ui/react";
import StandingsTable from "components/StandingsTable";

type Props = {
  leaguesAndDivisions: {
    seasons: {
      [seasonId: string]: {
        divisions: Division[];
        subleagues: Subleague[];
      };
    };
  };
  standings: SeasonStandings;
  teams: Team[];
};

export default function Standings({
  leaguesAndDivisions,
  standings,
  teams,
}: Props) {
  const sortedSeasonList: string[] = React.useMemo(
    () =>
      standings
        ? Object.keys(standings).sort((a, b) => Number(b) - Number(a))
        : [],
    [standings]
  );
  const mostRecentSeason = () => sortedSeasonList[0];

  const [selectedSeason, setSelectedSeason] =
    React.useState(mostRecentSeason());
  const [seasonList, setSeasonList] = React.useState(sortedSeasonList);

  React.useEffect(() => {
    setSeasonList(sortedSeasonList);
  }, [sortedSeasonList]);

  React.useEffect(() => {
    if (seasonList.length > 0) {
      setSelectedSeason(seasonList[0]);
    }
  }, [seasonList]);

  const handleSelectChange = (
    evt: React.FormEvent<HTMLSelectElement>
  ): void => {
    evt.preventDefault();
    setSelectedSeason(evt.currentTarget.value);
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

      {Object.entries(standings[selectedSeason]).map(([divisionId]) => {
        const division = leaguesAndDivisions.seasons[
          selectedSeason
        ].divisions.find((division) => division.id === divisionId);
        const seasonDivisions =
          leaguesAndDivisions.seasons[selectedSeason].divisions;

        return (
          <React.Fragment key={`${selectedSeason}-${divisionId}`}>
            <StandingsTable
              division={division}
              divisions={seasonDivisions}
              season={selectedSeason}
              standings={standings[selectedSeason][divisionId]}
              teams={teams}
            />
          </React.Fragment>
        );
      })}
    </>
  );
}
