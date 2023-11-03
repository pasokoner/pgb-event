"use client";
import * as React from "react";

import { Button } from "@/components/ui/button";

import {
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { offices } from "@/lib/config";
import { type Employee } from "./columns";
import GenerateQrButton from "./generate-qr-button";
import OfficeItems from "./office-items";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTableEmployees<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [rowSelection, setRowSelection] = React.useState({});

  const [customFilters, setCustomFilters] = React.useState({
    office: "",
    officeAssignment: "",
    status: "",
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      rowSelection,
      columnFilters,
    },
  });

  React.useEffect(() => {
    const { office, officeAssignment, status } = customFilters;
    setRowSelection({});
    table.getColumn("office")?.setFilterValue(office);
    table.getColumn("officeAssignment")?.setFilterValue(officeAssignment);
    table.getColumn("employmentStatus")?.setFilterValue(status);
  }, [customFilters, table]);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <Input
          placeholder="Search Name"
          value={
            (table.getColumn("fullName")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("fullName")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />

        <Popover>
          <PopoverTrigger className="text-sm text-primary hover:underline">
            Apply Filter
          </PopoverTrigger>
          <PopoverContent className="space-y-2">
            <Select
              value={customFilters.office}
              onValueChange={(v) =>
                setCustomFilters((prev) => ({ ...prev, office: v }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Office" />
              </SelectTrigger>
              <SelectContent className="max-h-60 overflow-y-auto">
                <OfficeItems />
              </SelectContent>
            </Select>

            <Select
              value={customFilters.officeAssignment}
              onValueChange={(v) =>
                setCustomFilters((prev) => ({ ...prev, officeAssignment: v }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Office Assignments" />
              </SelectTrigger>
              <SelectContent className="max-h-60 overflow-y-auto">
                <OfficeItems />
              </SelectContent>
            </Select>

            <Select
              value={customFilters.status}
              onValueChange={(v) =>
                setCustomFilters((prev) => ({ ...prev, status: v }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {["REGULAR", "JOBORDER"].map((status) => (
                  <SelectItem value={status} key={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              className="w-full"
              variant="outline"
              onClick={() =>
                setCustomFilters({
                  office: "",
                  officeAssignment: "",
                  status: "",
                })
              }
            >
              Reset Filter
            </Button>
          </PopoverContent>
        </Popover>
      </div>
      <div className="mb-2 flex gap-x-2">
        <GenerateQrButton
          employees={data as Employee[]}
          indexes={Object.keys(rowSelection)}
          all={true}
        />
        {Object.keys(rowSelection).length !== 0 && (
          <GenerateQrButton
            employees={data as Employee[]}
            indexes={Object.keys(rowSelection)}
          />
        )}
      </div>
      <div className="rounded-sm">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="bg-white font-semibold"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="bg-white">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
