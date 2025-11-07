import Image from 'next/image';
import Link from 'next/link';
import { CircleArrowOutUpLeft, User } from 'lucide-react';

export function Header() {
  return (
    <header>
      <div className="bg-grey-10 container rounded-b-2xl shadow-[0_0_12px_0_rgba(158,158,158,.25)]">
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="relative z-0">
            <Image
              src="/images/layout/header-logo.svg"
              alt="logo"
              width={90}
              height={30}
            />
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="bg-primary hover:bg-primary/90 flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-white transition-all"
            >
              <p>داشبورد</p>
              <CircleArrowOutUpLeft className="size-4" />
            </Link>
            <Link
              href="/auth"
              className="bg-secondary hover:bg-secondary/90 flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-white transition-all"
            >
              <p>ورود</p>
              <User className="size-4.5" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
