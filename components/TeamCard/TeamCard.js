import Link from "next/link";
import {
  StyledCard,
  StyledBigEmoji,
  StyledHighlight,
  StyledTeamName,
} from "./TeamCard.styled";

export default function TeamCard({ team }) {
  return (
    <Link href="teams/[teamId]" as={`teams/${team._id}`} passHref>
      <StyledCard backgroundColor={team?.mainColor}>
        <StyledHighlight highlightColor={team?.mainColor}>
          <StyledBigEmoji role="emoji">
            {String.fromCodePoint(team.emoji)}
          </StyledBigEmoji>
        </StyledHighlight>
        <StyledTeamName>{team.fullName}</StyledTeamName>
      </StyledCard>
    </Link>
  );
}
