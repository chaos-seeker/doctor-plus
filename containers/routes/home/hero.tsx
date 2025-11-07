import Image from 'next/image';
import { Button } from '@heroui/button';
import Link from 'next/link';

export const Hero = () => {
  return (
    <div className="container flex flex-col gap-10">
      <Image
        src="/images/routes/home/hero.png"
        alt="hero"
        width={1000}
        height={1000}
      />
      <div className='flex flex-col gap-2'>
        <p className="text-[28px] font-semibold">
          Discover Your Dream Property with Estatein
        </p>
        <p className='font-medium text-sm text-grey-60'>
          Your journey to finding the perfect property begins here. Explore our
          listings to find the home that matches your dreams.
        </p>
        <div>
          <Link href={'/explore'}>
            <Button variant='light' className='w-full py-7 text-white '>explore estates</Button>
          </Link>
          <Link href="/explore">
            <Button variant='solid' color='primary' className='w-full py-7'>browse estates</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
