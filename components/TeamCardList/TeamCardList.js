import { Grid, List, ListItem } from "@chakra-ui/core";
import TeamCard from "components/TeamCard";

export default function TeamCardList({ teams }) {
  return (
    <Grid
      as={List}
      gridGap="4"
      templateColumns={{
        base: "repeat(1, 1fr)",
        md: "repeat(2, 1fr)}",
        lg: "repeat(3, 1fr)}",
      }}
    >
      {teams
        .sort((a, b) => a.fullName.localeCompare(b.fullName))
        .map((team) => {
          return (
            <ListItem key={team._id}>
              <TeamCard team={team} />
            </ListItem>
          );
        })}
    </Grid>
  );
}
