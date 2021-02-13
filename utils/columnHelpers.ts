export function getColumnAverage(rows: any, column: string): number {
  return getColumnSum(rows, column) / rows.length || 1;
}

export function getColumnSum(rows: any, column: string): number {
  return rows.reduce((sum: number, row: any) => row.values[column] + sum, 0);
}
