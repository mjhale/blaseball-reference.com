import {
  StyledTeamCardList,
  StyledTeamCardListItem,
} from "./TeamCardList.styled";
import TeamCard from "components/TeamCard";

export default function TeamCardList({ teams }) {
  return (
    <StyledTeamCardList>
      {teams
        .sort((a, b) => a.fullName.localeCompare(b.fullName))
        .map((team) => {
          return (
            <StyledTeamCardListItem key={team._id}>
              <TeamCard team={team} />
            </StyledTeamCardListItem>
          );
        })}
    </StyledTeamCardList>
  );
}
