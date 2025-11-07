import type { Metadata } from 'next';
import './globals.css';
import LayouBase from '@/containers/layout/base';
import LayoutDashboard from '@/containers/layout/dashboard';
import localFont from 'next/font/local';
import { Providers } from './providers';
import { headers } from 'next/headers';

const iransans = localFont({
  src: '../public/fonts/IRANSansXV.woff2',
  variable: '--font-iransans',
  weight: '100 900',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'دکتر پلاس',
  description: 'توسعه توسط حمید شاهسونی',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname')!;
  const isDashboard = pathname.includes('/dashboard');

  return (
    <html lang="fa" dir="rtl">
      <body className={iransans.className}>
        <Providers>
          {isDashboard ? (
            <LayoutDashboard>{children}</LayoutDashboard>
          ) : (
            <LayouBase>{children}</LayouBase>
          )}
        </Providers>
      </body>
    </html>
  );
}
