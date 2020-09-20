import styled from "@emotion/styled";
import theme from "theme";

export const StyledContainer = styled.div`
  position: relative;
  max-width: 100vw;
`;

export const StyledScrollContainer = styled.div`
  overflow-x: auto;
`;

export const StyledTable = styled.table`
  border-collapse: collapse;
  border-spacing: 0;
  box-shadow: 0 1px 0 0 rgba(22, 29, 37, 0.05);
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

export const StyledTableCellFixed = styled(StyledTableCell)`
  background-color: #fff;
  left: 0;
  min-width: 80px;
  overflow-wrap: break-word;
  position: sticky;
  top: auto;
  white-space: unset;
  word-wrap: break-word;
  word-break: break-word;
`;

export const StyledTableFootCell = styled.td`
  font-size: ${theme.fontSizes.xs};
  font-weight: ${theme.fontWeights.bold};
  letter-spacing: ${theme.letterSpacings.tight};
  padding: ${theme.space["1"]} ${theme.space["2"]} ${theme.space["1"]};
  text-align: center;
`;

export const StyledTableFootCellFixed = styled.td`
  background-color: #fff;
  left: 0;
  min-width: 80px;
  overflow-wrap: break-word;
  position: sticky;
  top: auto;
  white-space: unset;
  word-wrap: break-word;
  word-break: break-word;
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

export const StyledTableHeadCellFixed = styled(StyledTableHeadCell)`
  background-color: #fff;
  border-bottom: 2px solid ${theme.colors.black};
  left: 0;
  min-width: 80px;
  overflow-wrap: break-word;
  position: sticky;
  top: auto;
  white-space: unset;
  word-wrap: break-word;
  word-break: break-word;
`;

export const StyledTableRow = styled.tr`
  &:hover {
    background-color: hsl(35, 100%, 95%);
  }
`;
