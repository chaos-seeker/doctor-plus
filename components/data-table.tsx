import type { ReactNode } from 'react';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table';
import { cn } from '@/utils/cn';

export interface DataTableProps<TData> {
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
  isLoading?: boolean;
  emptyState?: ReactNode;
  className?: string;
}

export function DataTable<TData extends object>({
  columns,
  data,
  isLoading,
  emptyState,
  className,
}: DataTableProps<TData>) {
  if (isLoading) {
    return (
      <div className="space-y-2 rounded-2xl border border-gray-100 bg-white p-4 shadow-[0_0_12px_0_rgba(158,158,158,.25)]">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={idx}
            className="h-14 animate-pulse rounded-xl bg-gray-100"
          />
        ))}
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-12 text-center text-gray-500 shadow-[0_0_12px_0_rgba(158,158,158,.25)]">
        {emptyState ?? 'داده‌ای برای نمایش وجود ندارد'}
      </div>
    );
  }

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div
      className={cn(
        'overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_0_12px_0_rgba(158,158,158,.25)]',
        className,
      )}
    >
      <table className="w-full border-collapse text-sm">
        <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const headerMeta = header.column.columnDef.meta;
                const headerClass =
                  typeof headerMeta === 'string' ? headerMeta : undefined;
                return (
                  <th
                    key={header.id}
                    className={cn(
                      'px-4 py-3 tracking-wide whitespace-nowrap',
                      headerClass,
                    )}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-gray-100 text-gray-700">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-primary/5 transition">
              {row.getVisibleCells().map((cell) => {
                const cellMeta = cell.column.columnDef.meta;
                const cellClass =
                  typeof cellMeta === 'string' ? cellMeta : undefined;
                return (
                  <td
                    key={cell.id}
                    className={cn(
                      'px-4 py-4 align-middle whitespace-nowrap',
                      cellClass,
                    )}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
