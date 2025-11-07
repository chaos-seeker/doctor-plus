'use client';

import { ArrowUpIcon } from "lucide-react";

export const Footer = () => {

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return (
    <footer className="bg-[#114b5f] container rounded-t-2xl">
      <div className="text-white relative py-4 text-center">
        <p>توسعه توسط حمید شاهسونی</p>
        <button
        onClick={handleScrollToTop}
        className="p-3 bg-primary rounded-full absolute -top-5 left-3">
          <ArrowUpIcon className="size-4" />
        </button>
      </div>
    </footer>
  );
};
