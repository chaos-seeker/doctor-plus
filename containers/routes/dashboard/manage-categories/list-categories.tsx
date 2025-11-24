'use client';

import { useMemo, useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { ColumnDef } from '@tanstack/react-table';
import { Pencil, Trash2 } from 'lucide-react';
import { useQueryState } from 'nuqs';
import { toast } from 'react-hot-toast';
import { getCategories } from '@/actions/categories/get-categories';
import { deleteCategory } from '@/actions/categories/delete-category';
import type { Category } from '@/types/category';
import { DataTable } from '@/components/data-table';
import { useModal } from '@/hooks/modal';

export function ListCategories() {
  const queryClient = useQueryClient();
  const editModal = useModal('edit-category');
  const [, setEditId] = useQueryState('modal-edit-category-id', {
    defaultValue: '',
  });

  const fetchCategories = useQuery({
    queryKey: ['dashboard', 'manage-categories', 'list'],
    queryFn: getCategories,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      toast.success('دسته‌بندی حذف شد');
      queryClient.invalidateQueries({
        queryKey: ['dashboard', 'manage-categories', 'list'],
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'خطا در حذف دسته‌بندی');
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

  const columns = useMemo<ColumnDef<Category, unknown>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'نام دسته‌بندی',
        meta: 'text-center',
        cell: ({ row }) => (
          <span className="block text-center text-gray-900">
            {row.original.name}
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
        meta: 'text-center w-28',
        cell: ({ row }) => (
          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => handleEdit(row.original.id)}
              className="bg-secondary hover:bg-secondary/80 flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-600 text-white transition"
              aria-label="ویرایش دسته‌بندی"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => handleDelete(row.original.id)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-red-400"
              aria-label="حذف دسته‌بندی"
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
        data={fetchCategories.data ?? []}
        isLoading={fetchCategories.isLoading}
        emptyState="هیچ دسته‌بندی ثبت نشده است"
      />
    </div>
  );
}
