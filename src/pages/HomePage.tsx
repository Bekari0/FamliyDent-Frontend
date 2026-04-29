import { Hero } from '@/components/Hero';
import { WhyChooseUs } from '@/components/WhyChooseUs';
import { Services } from '@/components/Services';
import { Doctors } from '@/components/Doctors';
import { Reviews } from '@/components/Reviews';
import { FAQ } from '@/components/FAQ';
import { Contact } from '@/components/Contact';

export function HomePage() {
  return (
    <>
      <Hero />
      <WhyChooseUs />
      <Services />
      <Doctors />
      <Reviews />
      <FAQ />
      <Contact />
    </>
  );
}
