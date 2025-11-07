'use client';

import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { getCategories } from '@/actions/dashboard/manage-categories/get-categories';
import type { Category } from '@/types/category';
import { Table, type TableColumn } from '@/components/table';

export function ListCategories() {
  const fetchCategories = useQuery({
    queryKey: ['dashboard', 'manage-categories', 'list'],
    queryFn: getCategories,
  });

  const columns: TableColumn<Category>[] = [
    {
      key: 'image',
      header: '',
      align: 'center',
      className: 'w-20',
      render: (category) => (
        <div className="mx-auto h-12 w-12 overflow-hidden rounded-xl bg-gray-100">
          {category.image ? (
            <Image
              src={category.image}
              alt={category.name}
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
      key: 'name',
      header: 'نام دسته‌بندی',
      render: (category) => (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-900">{category.name}</span>
          <span className="text-xs text-gray-500">{category.slug}</span>
        </div>
      ),
    },
    {
      key: 'created_at',
      header: 'تاریخ ثبت',
      align: 'right',
      className: 'text-sm text-gray-600 whitespace-nowrap',
      render: (category) =>
        new Date(category.created_at).toLocaleDateString('fa-IR'),
    },
  ];

  return (
    <div className="container">
      <Table
        columns={columns}
        data={fetchCategories.data ?? []}
        isLoading={fetchCategories.isLoading}
        emptyState="هیچ دسته‌بندی ثبت نشده است"
        rowKey={(category) => category.id}
      />
    </div>
  );
}
