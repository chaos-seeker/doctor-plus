import Link from 'next/link';
import { getDoctors } from '@/actions/dashboard/manage-doctors/get-doctors';
import { DoctorCard } from '@/components/card';
import { Sparkles } from 'lucide-react';

export async function ListDoctors() {
  const doctors = await getDoctors();

  if (!doctors.length) {
    return null;
  }

  return (
    <section className="container space-y-6 mt-3">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="bg-primary/15 text-primary flex h-10 w-10 items-center justify-center rounded-full">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="space-y-1 text-right">
            <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
              لیست پزشکان
            </h2>
            <p className="text-xs text-gray-500 sm:text-sm">
              لیست پزشکان تایید شده در دسترس شما هستند.
            </p>
          </div>
        </div>
      </div>
      <div className="scrollbar-hide flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 lg:grid lg:snap-none lg:grid-cols-3 lg:overflow-x-visible xl:grid-cols-5">
        {doctors.map((doctor) => (
          <div key={doctor.id} className="shrink-0 snap-center lg:shrink">
            <DoctorCard
              id={doctor.id}
              image={doctor.image}
              name={doctor.full_name}
              slug={doctor.slug}
              specialty={String(doctor.category?.name)}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
