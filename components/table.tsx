import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

export type TableColumn<T> = {
  key: string;
  header: ReactNode;
  align?: 'left' | 'center' | 'right';
  className?: string;
  render?: (item: T, index: number) => ReactNode;
};

export interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  isLoading?: boolean;
  emptyState?: ReactNode;
  rowKey?: (item: T, index: number) => string;
  className?: string;
}

export function Table<T>(props: TableProps<T>) {
  if (props.isLoading) {
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

  if (!props.data.length) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-12 text-center text-gray-500 shadow-[0_0_12px_0_rgba(158,158,158,.25)]">
        {props.emptyState ?? 'داده‌ای برای نمایش وجود ندارد'}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_0_12px_0_rgba(158,158,158,.25)]',
        props.className,
      )}
    >
      <table className="w-full border-collapse">
        <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
          <tr>
            {props.columns.map((column) => (
              <th
                key={column.key}
                className={cn(
                  'px-4 py-3 text-left tracking-wide',
                  column.align === 'center' && 'text-center',
                  column.align === 'right' && 'text-right',
                  (column as any).className,
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
          {props.data.map((item, index) => (
            <tr
              key={props.rowKey ? props.rowKey(item, index) : index}
              className="hover:bg-primary/5 transition"
            >
              {props.columns.map((column) => (
                <td
                  key={column.key}
                  className={cn(
                    'px-4 py-4 align-middle',
                    column.align === 'center' && 'text-center',
                    column.align === 'right' && 'text-right',
                    (column as any).className,
                  )}
                >
                  {(column as any).render
                    ? (column as any).render(item, index)
                    : (item as Record<string, unknown>)[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
