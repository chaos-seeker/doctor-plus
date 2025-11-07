'use client';

import Image from 'next/image';
import Link from 'next/link';
import { CircleArrowOutUpLeft } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useModal } from '@/hooks/modal';
import { useRef, useEffect } from 'react';
import { cn } from '@/utils/cn';

export default function Header() {
  const pathname = usePathname();
  const isManageDoctors = pathname?.includes('/manage-doctors');
  const isManageCategories = pathname?.includes('/manage-categories');
  const addDoctorModal = useModal('add-doctor');
  const addCategoryModal = useModal('add-category');

  return (
    <header>
      <div className="bg-white rounded-b-2xl shadow-[0_0_12px_0_rgba(158,158,158,.25)] container px-0">
        <div className="flex flex-col items-center justify-between pt-4">
          <div className="flex items-center justify-between w-full px-4">
            <button type="button" 
            onClick={() => window.location.href = '/'}
            className="relative z-0">
              <Image
                src="/images/layout/header-logo.svg"
                alt="logo"
                width={90}
                height={30}
              />
            </button>
            <div className="flex items-center gap-2">
              {isManageCategories && (
                <button
                  type="button"
                  onClick={addCategoryModal.show}
                  className="bg-secondary hover:bg-secondary/90 flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-white transition-all"
                >
                  <p>افزودن دسته‌بندی</p>
                </button>
              )}
              {isManageDoctors && (
                <button
                  type="button"
                  onClick={addDoctorModal.show}
                  className="bg-secondary hover:bg-secondary/90 flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-white transition-all"
                >
                  <p>افزودن پزشک</p>
                </button>
              )}
            </div>
          </div>
          <div className="border-slate-200 py-4 px-4 border-t w-full flex justify-center mt-3 border-slate-200">
            <Tabs />
          </div>
        </div>
      </div>
    </header>
  );
}

const Tabs = () => {
  const pathname = usePathname();
  const activeTabRef = useRef<HTMLAnchorElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const data = [
    { label: 'مدیریت دکتر ها', href: '/dashboard/manage-doctors' },
    { label: 'مدیریت دسته بندی ها', href: '/dashboard/manage-categories' },
  ];

  useEffect(() => {
    if (activeTabRef.current && containerRef.current) {
      const container = containerRef.current;
      const activeTab = activeTabRef.current;
      const containerRect = container.getBoundingClientRect();
      if (window.innerWidth < 1024) {
        const tabRect = activeTab.getBoundingClientRect();
        const scrollLeft =
          activeTab.offsetLeft - containerRect.width / 2 + tabRect.width / 2;
        container.scrollTo({
          left: scrollLeft,
          behavior: 'smooth',
        });
      }
    }
  }, [pathname]);

  return (
    <div
      ref={containerRef}
      className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth lg:justify-center lg:overflow-x-visible"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      {data.map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(item.href + '/');
        return (
          <Link
            ref={isActive ? activeTabRef : null}
            href={item.href}
            key={item.href}
            className="shrink-0 snap-center"
          >
            <button
              className={cn(
                'text-sm font-medium px-4 py-2.5 rounded-xl',
                isActive ? 'text-white bg-primary' : 'text-gray-500 bg-transparent',
              )}
            >
              {item.label}
            </button>
          </Link>
        );
      })}
    </div>
  );
};
