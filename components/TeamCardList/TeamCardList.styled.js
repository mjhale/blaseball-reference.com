import styled from "@emotion/styled";

export const StyledTeamCardList = styled.ul`
  display: grid;
  grid-gap: var(--space-md);
  grid-template-columns: repeat(3, minmax(302px, 33%));
  list-style: none;
  margin-top: var(--space-md);
  position: relative;
`;

export const StyledTeamCardListItem = styled.li`
  margin: 0;
  padding: 0;
`;
