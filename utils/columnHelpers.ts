export function getColumnAverage(rows: any, column: string): number {
  return getColumnSum(rows, column) / rows.length || 1;
}

export function getColumnSum(rows: any, column: string): number {
  return rows.reduce((sum, row) => row.values[column] + sum, 0);
}
