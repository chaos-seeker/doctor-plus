'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Check, Clock, Stethoscope, Award } from 'lucide-react';
import type { Doctor } from '@/types/doctor';

interface DoctorProfileProps {
  doctor: Doctor;
}

export function DoctorProfile({ doctor }: DoctorProfileProps) {
  return (
    <div className="container">
      <div className="grid gap-8 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-[0_0_12px_0_rgba(158,158,158,.25)]">
            <div className="mb-6 flex justify-center">
              <div className="relative h-32 w-32 overflow-hidden rounded-2xl">
                <Image
                  src={doctor.image}
                  alt={doctor.full_name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <h1 className="mb-2 text-center text-2xl font-bold text-gray-900">
              {doctor.full_name}
            </h1>

            {doctor.category && (
              <p className="mb-6 text-center text-sm text-gray-600">
                {doctor.category.name}
              </p>
            )}

            <div className="space-y-3">
              <button
                type="button"
                className="bg-primary hover:bg-primary/90 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-white transition"
              >
                <Check className="h-4 w-4" />
                <span>شماره نظام پزشکی: {doctor.medical_code}</span>
              </button>

              <Link
                href={`/request?doctor=${encodeURIComponent(doctor.full_name)}`}
                className="bg-secondary hover:bg-secondary/90 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-white transition"
              >
                <Clock className="h-4 w-4" />
                <span>رزرو وقت</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="lg:col-span-3 space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-[0_0_12px_0_rgba(158,158,158,.25)]">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-white">
                <Stethoscope className="h-4 w-4" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">
                معرفی و تخصص
              </h2>
            </div>
            {doctor.description ? (
              <p className="text-sm leading-7 text-gray-700">
                {doctor.description}
              </p>
            ) : (
              <p className="text-sm text-gray-500">
                توضیحاتی برای این پزشک ثبت نشده است.
              </p>
            )}
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-[0_0_12px_0_rgba(158,158,158,.25)]">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-white">
                <Award className="h-4 w-4" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">
              مدرک ها
              </h2>
            </div>
            {doctor.documents && doctor.documents.length > 0 ? (
              <ul className="mb-6 space-y-3">
                {doctor.documents.map((document, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-sm text-gray-700"
                  >
                    <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-secondary" />
                    <span className="leading-6">{document}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mb-6 text-sm text-gray-500">
                مدرکی برای این پزشک ثبت نشده است.
              </p>
            )}

            {/* Verification Banner */}
            <div className="bg-primary flex items-center gap-2 rounded-xl px-4 py-3">
              <Check className="h-5 w-5 text-white" />
              <p className="text-sm font-medium text-white">
                همه ی مدارک {doctor.full_name} توسط دکتر پلاس تایید شده است
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

