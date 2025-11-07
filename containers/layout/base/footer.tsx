'use client';

import { ArrowUpIcon } from "lucide-react";

export const Footer = () => {

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return (
    <footer className="bg-bg">
      <div className="text-white container relative py-5 text-center bg-grey-10">
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
