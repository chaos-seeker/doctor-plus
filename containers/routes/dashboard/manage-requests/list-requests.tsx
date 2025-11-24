'use client';

import { useQuery } from '@tanstack/react-query';
import { getRequests } from '@/actions/request/get-requests';
import type { Request } from '@/types/request';
import { DataTable } from '@/components/data-table';
import type { ColumnDef } from '@tanstack/react-table';

export function ListRequests() {
  const fetchRequests = useQuery({
    queryKey: ['dashboard', 'manage-requests', 'list'],
    queryFn: getRequests,
  });

  const columns: ColumnDef<Request>[] = [
    {
      accessorKey: 'first_name',
      header: 'نام',
      cell: ({ row }) => (
        <div className="text-center">{row.original.first_name}</div>
      ),
      meta: {
        headerClassName: 'text-center',
      },
    },
    {
      accessorKey: 'last_name',
      header: 'نام خانوادگی',
      cell: ({ row }) => (
        <div className="text-center">{row.original.last_name}</div>
      ),
      meta: {
        headerClassName: 'text-center',
      },
    },
    {
      accessorKey: 'national_id',
      header: 'کد ملی',
      cell: ({ row }) => (
        <div className="text-center">{row.original.national_id}</div>
      ),
      meta: {
        headerClassName: 'text-center',
      },
    },
    {
      accessorKey: 'gender',
      header: 'جنسیت',
      cell: ({ row }) => (
        <div className="text-center">
          {row.original.gender === 'male'
            ? 'مرد'
            : row.original.gender === 'female'
              ? 'زن'
              : '-'}
        </div>
      ),
      meta: {
        headerClassName: 'text-center',
      },
    },
    {
      accessorKey: 'birth_date',
      header: 'تاریخ تولد',
      cell: ({ row }) => (
        <div className="text-center whitespace-nowrap">
          {new Date(row.original.birth_date).toLocaleDateString('fa-IR')}
        </div>
      ),
      meta: {
        headerClassName: 'text-center',
      },
    },
    {
      accessorKey: 'phone',
      header: 'شماره تماس',
      cell: ({ row }) => (
        <div className="text-center whitespace-nowrap">
          {row.original.phone}
        </div>
      ),
      meta: {
        headerClassName: 'text-center',
      },
    },
    {
      accessorKey: 'specialist',
      header: 'متخصص',
      cell: ({ row }) => (
        <div className="text-center">{row.original.specialist}</div>
      ),
      meta: {
        headerClassName: 'text-center',
      },
    },
    {
      accessorKey: 'created_at',
      header: 'تاریخ ثبت',
      cell: ({ row }) => (
        <div className="text-center whitespace-nowrap">
          {new Date(row.original.created_at).toLocaleDateString('fa-IR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      ),
      meta: {
        headerClassName: 'text-center',
      },
    },
  ];

  return (
    <div className="container">
      <DataTable
        columns={columns}
        data={fetchRequests.data ?? []}
        isLoading={fetchRequests.isLoading}
      />
    </div>
  );
}
