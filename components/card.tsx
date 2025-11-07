'use client';

import Image from 'next/image';
import { MapPin, ShieldCheck } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useRouter } from 'next/navigation';

export interface DoctorCardProps {
  id: string;
  slug: string | null;
  image: string | null;
  name: string;
  specialty: string | null;
  className?: string;
}

export function DoctorCard(props: DoctorCardProps) {
  const router = useRouter();

  const handleRedirect = () => {
    if (props.slug) {
      router.push(`/doctor/${props.slug}`);
    }
  };

  return (
    <div
      className={cn(
        'w-full max-w-[260px] hover:border-primary transition-all rounded-[24px] border border-gray-200 bg-white p-5 text-center shadow-[0_8px_24px_-12px_rgba(108,93,211,0.35)]',
        props.className,
      )}
    >
      <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-white shadow-[0_6px_18px_-8px_rgba(108,93,211,0.45)]">
        {props.image ? (
          <Image
            src={props.image}
            alt={props.name}
            width={96}
            height={96}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-100 text-xs text-gray-400">
            بدون تصویر
          </div>
        )}
      </div>

      <div className="space-y-1">
        <p className="text-lg font-semibold text-gray-900">{props.name}</p>
        {props.specialty && (
          <p className="text-sm text-gray-500">{props.specialty}</p>
        )}
      </div>
      <div className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-[#E8FBF7] px-3 py-2 text-xs font-medium text-[#109178]">
        <ShieldCheck className="h-4 w-4" />
        <span>متخصص تایید شده</span>
      </div>
      <button
        type="button"
        onClick={handleRedirect}
        className="bg-primary hover:bg-primary/90 mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-semibold text-white transition"
      >
        <span>مشاهده</span>
      </button>
    </div>
  );
}
