import styled from "@emotion/styled";
import theme from "theme";

export const StyledTable = styled.table`
  border-collapse: collapse;
  border-spacing: 0;
  margin-top: ${theme.space["2"]};
  width: 100%;
`;

export const StyledTableCell = styled.td`
  border-bottom: 1px solid ${theme.colors.gray["300"]};
  font-size: ${theme.fontSizes.xs};
  font-weight: ${theme.fontWeights.normal};
  letter-spacing: ${theme.letterSpacings.tight};
  padding: ${theme.space["1"]} ${theme.space["2"]} ${theme.space["1"]};
  text-align: center;
`;

export const StyledTableFootCell = styled.td`
  font-size: ${theme.fontSizes.xs};
  font-weight: ${theme.fontWeights.bold};
  letter-spacing: ${theme.letterSpacings.tight};
  padding: ${theme.space["1"]} ${theme.space["2"]} ${theme.space["1"]};
  text-align: center;
`;

export const StyledTableHead = styled.thead`
  border-bottom: 2px solid ${theme.colors.black};
`;

export const StyledTableHeadCell = styled.th`
  font-size: ${theme.fontSizes.xs};
  font-weight: ${theme.fontWeights.normal};
  letter-spacing: ${theme.letterSpacings.tight};
  padding-bottom: ${theme.space["1"]};
  padding-left: ${theme.space["2"]};
  padding-right: ${theme.space["2"]};
  text-align: center;
  text-transform: uppercase;
`;

export const StyledTableRow = styled.tr`
  &:hover {
    background-color: ${theme.colors.gray["100"]};
  }
`;
