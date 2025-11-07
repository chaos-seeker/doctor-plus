import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LayouBase from "@/containers/layout/base";
import localFont from 'next/font/local';

const iransans = localFont({
  src: '../public/fonts/IRANSansXV.woff2',
  variable: '--font-iransans',
  weight: '100 900',
  display: 'swap',
});


export const metadata: Metadata = {
  title: "دکتر پلاس",
  description: "توسعه توسط حمید شاهسونی",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body
        className={iransans.className}
      >
        <LayouBase>
        {children}
        </LayouBase>
      </body>
    </html>
  );
}
