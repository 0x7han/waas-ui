import { TableRoot, TableToolbar, TableSearch, TableFilters, TablePagination, TableCaption, TableHead, TableBody, TableRow, TableHeaderCell, TableCell, TableBase } from "./Table";

export const Table = Object.assign(TableBase, {
  Root: TableRoot,
  Toolbar: TableToolbar,
  Search: TableSearch,
  Filters: TableFilters,
  Pagination: TablePagination,
  Caption: TableCaption,
  Head: TableHead,
  Body: TableBody,
  Row: TableRow,
  HeaderCell: TableHeaderCell,
  Cell: TableCell,
});