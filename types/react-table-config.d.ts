import {
  ColumnInterfaceBasedOnValue,
  HeaderProps,
  Renderer,
  UseSortByColumnOptions,
  UseSortByOptions,
} from "react-table";

declare module "react-table" {
  export interface TableOptions<D extends Record<string, unknown>>
    extends UseSortByOptions<D> {}

  export interface ColumnInterfaceBasedOnValue<
    D extends object = {}
  > extends UseSortByColumnOptions<D>,
      Partial<{
        Footer: Renderer<HeaderProps<D>>;
      }> {}
}
