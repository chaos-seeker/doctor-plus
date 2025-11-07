'use client';

import Image from 'next/image';
import Link from 'next/link';
import { CircleArrowOutUpLeft, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const Hero = () => {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const handleSearch = () => {
    if (!search.trim()) return;
    const query = new URLSearchParams({ doctor: search.trim() }).toString();
    router.push(`/explore?${query}`);
  };

  return (
    <section className="relative container flex flex-col items-center gap-4">
      <div className="bg-primary relative w-full overflow-hidden rounded-3xl px-6 pt-6 md:pt-10">
        <Image
          src="/images/routes/home/hero-bg.svg"
          alt="background"
          fill
          priority
          className="object-cover opacity-70"
        />
        <div className="relative z-10 flex h-full flex-col flex-col-reverse justify-center gap-3 xl:flex-row xl:flex-row-reverse xl:items-center xl:gap-30">
          <div className="flex justify-center">
            <div className="x-auto w-full max-w-[350px] sm:max-w-[400px] md:max-w-[450px] lg:max-w-[500px] xl:order-1 xl:max-w-[480px]">
              <Image
                src="/images/routes/home/hero-girl.png"
                alt="doctor"
                width={520}
                height={520}
                className="pointer-events-none h-auto w-full select-none"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2 text-white">
            <div className="flex items-center gap-1 sm:gap-2">
              <p className="font-extrabold sm:text-2xl sm:text-3xl">
                ارائه خدمات پزشکی
              </p>
              <Image
                src="/images/routes/home/hero-rounded-object.png"
                alt="icon"
                width={40}
                height={40}
              />
              <p className="font-extrabold sm:text-2xl sm:text-3xl">به صورت</p>
              <div className="h-10 rounded-xl bg-linear-to-r from-[#169e9a] via-white/20 to-[#169e9a] p-2 px-3">
                <p className="font-semibold">آنلاین</p>
              </div>
            </div>
            <p className="font-semibold text-white/90">
              همین حالا وقت رزرو کنید
            </p>
            <Link href="/request" className="mt-4 inline-block xl:mb-33">
              <button className="flex items-center gap-1.5 rounded-xl bg-[#159f9b] px-4 py-2.5 text-white transition-all hover:bg-[#159f9b]/90">
                <span className="flex items-center gap-2 px-1 py-1">
                  <p>درخواست نوبت</p>
                  <CircleArrowOutUpLeft className="size-4" />
                </span>
              </button>
            </Link>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-7 left-1/2 z-10 flex w-[340px] -translate-x-1/2 items-center justify-between gap-2 rounded-xl border border-gray-200 bg-white p-2 xl:-right-6 xl:bottom-25">
        <input
          type="text"
          placeholder="جستجوی پزشک"
          className="w-full text-sm outline-none truncate"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              handleSearch();
            }
          }}
        />
        <button
          className="bg-secondary hover:bg-secondary/90 rounded-xl p-2.5 text-white transition-all"
          onClick={handleSearch}
          aria-label="جستجو"
        >
          <Search className="size-5" />
        </button>
      </div>
    </section>
  );
};
