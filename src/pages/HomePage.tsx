import { Hero } from '@/components/Hero';
import { WhyChooseUs } from '@/components/WhyChooseUs';
import { Services } from '@/components/Services';
import { Gallery } from '@/components/Gallery';
import { Doctors } from '@/components/Doctors';
import { FAQ } from '@/components/FAQ';
import { BigCta } from '@/components/BigCta';
import { Contact } from '@/components/Contact';

export function HomePage() {
 return (
 <>
 <Hero />
 <Gallery />
 <WhyChooseUs />
 <Services />
 <Doctors />
 <BigCta />
 <FAQ />
 <Contact />
 </>
 );
}

