import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';

export function BigCta() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-secondary py-20 lg:py-28" aria-label="Запись на приём">
      <div className="container mx-auto flex flex-col items-center px-4 text-center sm:px-6 lg:px-8">
        <p className="select-none text-[clamp(3rem,12vw,9rem)] font-semibold leading-none tracking-tight text-primary" aria-hidden="true">
          Family
          <span className="text-accent/60">Dent</span>
        </p>

        <div className="mt-8 flex flex-col items-center gap-4">
          <div className="flex flex-col items-center gap-1 text-sm text-muted-foreground">
            <a href="mailto:info@familydent.tj" className="font-medium text-foreground transition-colors hover:text-accent">
              info@familydent.tj
            </a>
            <a href="tel:+992985454647" className="font-medium text-foreground transition-colors hover:text-accent">
              +992 98 545 46 47
            </a>
          </div>

          <Link
            to="/book"
            className="mt-2 inline-flex h-12 items-center gap-2 rounded-full bg-primary px-8 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            <Calendar className="h-4 w-4" />
            Записаться на приём
          </Link>
        </div>
      </div>
    </section>
  );
}
