'use client';

import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { getDoctors } from '@/actions/dashboard/manage-doctors/get-doctors';
import type { Doctor } from '@/types/doctor';
import { Table, type TableColumn } from '@/components/table';

export function ListDoctors() {
  const fetchDoctors = useQuery({
    queryKey: ['dashboard', 'manage-doctors', 'list'],
    queryFn: getDoctors,
  });

  const columns: TableColumn<Doctor>[] = [
    {
      key: 'image',
      header: '',
      align: 'center',
      className: 'w-20',
      render: (doctor) => (
        <div className="mx-auto h-12 w-12 overflow-hidden rounded-xl bg-gray-100">
          <Image
            src={doctor.image}
            alt={doctor.full_name}
            width={48}
            height={48}
            className="h-full w-full object-cover"
          />
        </div>
      ),
    },
    {
      key: 'full_name',
      header: 'نام پزشک',
      render: (doctor) => (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-900">
            {doctor.full_name}
          </span>
          <span className="text-xs text-gray-500">{doctor.slug}</span>
        </div>
      ),
    },
    {
      key: 'medical_code',
      header: 'کد نظام پزشکی',
      className: 'text-sm text-gray-600',
      render: (doctor) => doctor.medical_code,
    },
    {
      key: 'category',
      header: 'دسته‌بندی',
      className: 'text-sm text-gray-600',
      render: (doctor) => doctor.category?.name,
    },
    {
      key: 'documents',
      header: 'مدارک',
      render: (doctor) =>
        doctor.documents.length ? (
          <div className="flex flex-wrap gap-2">
            {doctor.documents.map((document, index) => (
              <span
                key={index}
                className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs"
              >
                {document}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-xs text-gray-400">ثبت نشده</span>
        ),
    },
    {
      key: 'created_at',
      header: 'تاریخ ثبت',
      align: 'right',
      className: 'text-sm text-gray-600 whitespace-nowrap',
      render: (doctor) =>
        new Date(doctor.created_at).toLocaleDateString('fa-IR'),
    },
  ];

  return (
    <div className="container">
      <Table
        columns={columns}
        data={fetchDoctors.data ?? []}
        isLoading={fetchDoctors.isLoading}
        emptyState="هیچ پزشکی ثبت نشده است"
        rowKey={(doctor) => doctor.id}
      />
    </div>
  );
}
