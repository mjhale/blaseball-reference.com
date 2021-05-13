import React from "react";

import {
  ColumnInstance,
  HeaderProps,
  Renderer,
  UseColumnOrderState,
  UsePaginationInstanceProps,
  UsePaginationOptions,
  UsePaginationState,
  UseRowStateCellProps,
  UseSortByColumnOptions,
  UseSortByInstanceProps,
  UseSortByOptions,
  UseSortByState,
} from "react-table";

declare module "react-table" {
  export interface TableOptions<D extends Record<string, unknown>>
    extends UsePaginationOptions<D>,
      UseSortByOptions<D>,
      Record<string, any> {}

  export interface TableInstance<
    D extends Record<string, unknown> = Record<string, unknown>
  > extends UsePaginationInstanceProps<D>,
      UseSortByInstanceProps<D> {}

  export interface TableState<
    D extends Record<string, unknown> = Record<string, unknown>
  > extends UseColumnOrderState<D>,
      UsePaginationState<D>,
      UseSortByState<D> {}

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

  export interface ColumnInstance<
    D extends Record<string, unknown> = Record<string, unknown>
  > extends UseSortByColumnProps<D> {}

  export interface Cell<
    D extends Record<string, unknown> = Record<string, unknown>,
    V = any
  > extends UseRowStateCellProps<D> {}

  export interface Row<
    D extends Record<string, unknown> = Record<string, unknown>
  > {}
}
