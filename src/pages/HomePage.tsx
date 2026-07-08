import { Hero } from '@/components/Hero';
import { WhyChooseUs } from '@/components/WhyChooseUs';
import { Services } from '@/components/Services';
import { Gallery } from '@/components/Gallery';
import { Doctors } from '@/components/Doctors';
import { Reviews } from '@/components/Reviews';
import { FAQ } from '@/components/FAQ';
import { BigCta } from '@/components/BigCta';
import { Contact } from '@/components/Contact';

export function HomePage() {
 return (
 <>
 <Hero />
 <WhyChooseUs />
 <Services />
 <Gallery />
 <Doctors />
 <Reviews />
 <FAQ />
 <BigCta />
 <Contact />
 </>
 );
}

