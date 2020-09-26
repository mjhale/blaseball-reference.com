import { css } from "@emotion/core";
import styled from "@emotion/styled";
import theme from "theme";

const stickyCellStyle = css`
  background-color: inherit;
  left: 0;
  position: sticky;
  top: auto;
  white-space: unset;
`;

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
  ${stickyCellStyle}
`;

export const StyledTableFootCell = styled.td`
  font-size: ${theme.fontSizes.xs};
  font-weight: ${theme.fontWeights.bold};
  letter-spacing: ${theme.letterSpacings.tight};
  padding: ${theme.space["1"]} ${theme.space["2"]} ${theme.space["1"]};
  text-align: center;
`;

export const StyledTableFootCellFixed = styled(StyledTableFootCell)`
  ${stickyCellStyle}
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
  ${stickyCellStyle}
`;

export const StyledTableRow = styled.tr`
  background-color: ${theme.colors.white};
`;

export const StyledTableRowData = styled.tr`
  background-color: ${theme.colors.white};

  &:hover {
    background-color: hsl(35, 100%, 95%);
  }
`;
