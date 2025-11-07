'use client';

import { useMemo, useCallback } from 'react';
import Image from 'next/image';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { ColumnDef } from '@tanstack/react-table';
import { useQueryState } from 'nuqs';
import { toast } from 'react-hot-toast';
import { getDoctors } from '@/actions/dashboard/doctors/get-doctors';
import { deleteDoctor } from '@/actions/dashboard/doctors/delete-doctor';
import type { Doctor } from '@/types/doctor';
import { DataTable } from '@/components/data-table';
import { useModal } from '@/hooks/modal';
import { Pencil, Trash2 } from 'lucide-react';

export function ListDoctors() {
  const queryClient = useQueryClient();
  const editModal = useModal('edit-doctor');
  const [, setEditId] = useQueryState('modal-edit-doctor-id', {
    defaultValue: '',
  });

  const fetchDoctors = useQuery({
    queryKey: ['dashboard', 'manage-doctors', 'list'],
    queryFn: getDoctors,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteDoctor,
    onSuccess: () => {
      toast.success('پزشک حذف شد');
      queryClient.invalidateQueries({
        queryKey: ['dashboard', 'manage-doctors', 'list'],
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'خطا در حذف پزشک');
    },
  });

  const handleEdit = useCallback(
    (id: string) => {
      setEditId(id);
      editModal.show();
    },
    [setEditId, editModal],
  );

  const handleDelete = useCallback(
    (id: string) => {
      deleteMutation.mutate(id);
    },
    [deleteMutation],
  );

  const columns = useMemo<ColumnDef<Doctor, unknown>[]>(
    () => [
      {
        id: 'image',
        header: '',
        meta: 'text-center w-20',
        cell: ({ row }) => (
          <div className="mx-auto h-12 w-12 overflow-hidden rounded-xl bg-gray-100">
            {row.original.image ? (
              <Image
                src={row.original.image}
                alt={row.original.full_name}
                width={48}
                height={48}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                بدون تصویر
              </span>
            )}
          </div>
        ),
      },
      {
        accessorKey: 'full_name',
        header: 'نام پزشک',
        meta: 'text-center',
        cell: ({ row }) => (
          <span className="block text-center text-gray-900">
            {row.original.full_name}
          </span>
        ),
      },
      {
        accessorKey: 'slug',
        header: 'اسلاگ',
        meta: 'text-center',
        cell: ({ row }) => (
          <span className="block text-center text-gray-600">
            {row.original.slug}
          </span>
        ),
      },
      {
        accessorKey: 'medical_code',
        header: 'کد نظام پزشکی',
        meta: 'text-center',
        cell: ({ row }) => (
          <span className="block text-center">{row.original.medical_code}</span>
        ),
      },
      {
        accessorKey: 'category',
        header: 'دسته‌بندی',
        meta: 'text-center',
        cell: ({ row }) => (
          <span className="block text-center">
            {row.original.category?.name}
          </span>
        ),
      },
      {
        accessorKey: 'created_at',
        header: 'تاریخ ثبت',
        meta: 'text-center whitespace-nowrap',
        cell: ({ row }) => (
          <span className="block text-center">
            {new Date(row.original.created_at).toLocaleDateString('fa-IR')}
          </span>
        ),
      },
      {
        id: 'actions',
        header: '',
        meta: 'text-center w-40',
        cell: ({ row }) => (
          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => handleEdit(row.original.id)}
              className="bg-secondary hover:bg-secondary/80 flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-600 text-white transition"
              aria-label="ویرایش پزشک"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => handleDelete(row.original.id)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-red-400"
              aria-label="حذف پزشک"
              disabled={deleteMutation.isPending}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ),
      },
    ],
    [deleteMutation.isPending, handleDelete, handleEdit],
  );

  return (
    <div className="container">
      <DataTable
        columns={columns}
        data={fetchDoctors.data ?? []}
        isLoading={fetchDoctors.isLoading}
        emptyState="هیچ پزشکی ثبت نشده است"
      />
    </div>
  );
}
