import Team from "types/team";

import { Grid, List, ListItem } from "@chakra-ui/react";
import TeamCard from "components/TeamCard";

type Props = {
  teams: Team[];
};

export default function TeamCardList({ teams }: Props) {
  // if (!teams) {
  //   return "Loading...";
  // }

  return (
    <Grid
      as={List}
      gap="4"
      templateColumns={{
        base: "repeat(1, 1fr)",
        md: "repeat(2, 1fr)}",
        lg: "repeat(3, 1fr)}",
      }}
    >
      {teams
        .sort((a, b) => a.full_name.localeCompare(b.full_name))
        .map((team) => {
          return (
            <ListItem key={team.team_id}>
              <TeamCard team={team} />
            </ListItem>
          );
        })}
    </Grid>
  );
}
