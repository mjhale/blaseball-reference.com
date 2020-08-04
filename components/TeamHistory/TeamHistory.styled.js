import styled from "@emotion/styled";

export const StyledDescriptionDetails = styled.dd``;

export const StyledDescriptionList = styled.dl`
  margin: var(--layout-xxs) var(--layout-xxs);
`;

export const StyledDescriptionPair = styled.div`
  display: flex;
  flex-direction: row;
`;

export const StyledDescriptionTerm = styled.dt`
  font-weight: var(--fontWeightBold);
  margin-right: var(--space-xs);
`;

export const StyledTable = styled.table`
  border-spacing: 0;
  border: 1px solid black;
  margin-top: var(--layout-xxs);
  max-width: 600px;
  width: 100%;
`;

export const StyledTableHead = styled.thead`
  background-color: #ccc;
`;

export const StyledTableHeadCell = styled.th`
  text-align: center;
`;

export const StyledTableCell = styled.td`
  padding: var(--space-xxs);
  text-align: center;
`;
