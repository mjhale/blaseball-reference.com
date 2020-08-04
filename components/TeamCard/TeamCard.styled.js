import styled from "@emotion/styled";

export const StyledCard = styled.a`
  align-items: center;
  background-color: #fffaf3;
  border: 1px solid #cbd6e0;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 96px;

  &:hover {
    box-shadow: 0 0 0 5px rgba(50, 50, 93, 0.01),
      0 7px 14px 0 rgba(50, 50, 93, 0.1), 0 3px 6px 0 rgba(0, 0, 0, 0.02);
  }
`;

export const StyledHighlight = styled.div`
  align-items: center;
  background-color: ${(props) => props.highlightColor};
  border-right: 1px solid #cbd6e0;
  display: flex;
  justify-content: center;
  height: 100%;
  padding: 1rem 0.5rem;
  width: 90px;
`;

export const StyledBigEmoji = styled.span`
  font-size: 3rem;
  display: block;
`;

export const StyledTeamName = styled.h2`
  display: block;
  padding: 1rem 0.725rem;
  width: 100%;
`;
