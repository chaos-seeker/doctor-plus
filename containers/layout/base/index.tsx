import { Footer } from './footer';
import { Header } from './header';
import { PropsWithChildren } from 'react';

export default function LayouBase(props: PropsWithChildren) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main>{props.children}</main>
      <Footer />
    </div>
  );
}
