import { Hero } from '@/components/Hero';
import { Services } from '@/components/Services';
import { Gallery } from '@/components/Gallery';
import { FAQ } from '@/components/FAQ';
import { Contact } from '@/components/Contact';

export function HomePage() {
 return (
 <>
 <Hero />
 <Gallery />
 <Services />
 <FAQ />
 <Contact />
 </>
 );
}

