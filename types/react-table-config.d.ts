import { HeaderProps, Renderer, UseSortByColumnOptions } from "react-table";

declare module "react-table" {
  export interface TableOptions<D extends Record<string, unknown>>
    extends UseExpandedOptions<D>,
      UseTableOptions<D> {}

  export interface ColumnInterfaceBasedOnValue<
    D extends Record<string, unknown>
  > extends UseSortByColumnOptions<D>,
      Partial<{
        Footer: Renderer<HeaderProps<D>>;
      }> {}

  export interface HeaderGroup<D extends Record<string, unknown>>
    extends ColumnInstance<D>,
      UseTableHeaderGroupProps<D>,
      UseSortByColumnProps<D> {}
}
