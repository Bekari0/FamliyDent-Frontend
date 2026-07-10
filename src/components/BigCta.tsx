import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

export function BigCta() {
  return (
    <section
      className="relative overflow-hidden bg-[linear-gradient(180deg,#f3f9fc_0%,#dceef7_45%,#c6e1ef_100%)] py-20 lg:py-0"
      aria-label="Запись на приём"
    >
      {/* Desktop: абсолютная композиция */}
      <div className="container relative mx-auto hidden max-w-[940px] lg:block lg:h-[430px]">
        <p
          className="pointer-events-none absolute left-[130px] top-0 z-[1] select-none text-[128px] font-light leading-[0.95] tracking-[-5px] text-white/90"
          aria-hidden="true"
        >
          Family
        </p>
        <p
          className="pointer-events-none absolute left-[435px] top-[145px] z-[2] select-none text-[148px] font-light leading-[0.95] tracking-[-6px] text-[#334562]"
          aria-hidden="true"
        >
          Dent
        </p>

        <img
          src="/images/crystal-tooth.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute left-[175px] top-[95px] z-[3] w-[300px] select-none mix-blend-multiply [mask-image:radial-gradient(ellipse_58%_58%_at_center,black_40%,transparent_80%)] drop-shadow-[0_18px_28px_rgba(35,70,95,0.18)]"
          width={300}
          height={300}
          loading="lazy"
          decoding="async"
        />

        <div className="absolute right-[40px] top-[115px] z-[4] flex flex-col text-[17px] font-semibold leading-[1.45] text-[#334562]">
          <a href="mailto:info@familydent.tj" className="transition-colors hover:text-accent">
            info@familydent.tj
          </a>
          <a href="tel:+992985454647" className="transition-colors hover:text-accent">
            +992 98 545 46 47
          </a>
        </div>

        <Link
          to="/book"
          className="group absolute left-[560px] top-[300px] z-[4] inline-flex items-stretch text-white"
          aria-label="Записаться на приём"
        >
          <span className="inline-flex h-[45px] items-center justify-center rounded-l-[7px] bg-[#334562] px-6 text-xs font-bold">
            Записаться на приём
          </span>
          <span
            className="ml-px inline-flex h-[45px] w-[45px] items-center justify-center rounded-r-[7px] bg-[#334562] transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          >
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </Link>
      </div>

      {/* Mobile: обычный поток */}
      <div className="container mx-auto flex flex-col items-center px-4 text-center sm:px-6 lg:hidden">
        <p
          className="select-none text-[72px] font-light leading-[0.95] tracking-[-3px] text-white/90 sm:text-[100px]"
          aria-hidden="true"
        >
          Family
        </p>
        <img
          src="/images/crystal-tooth.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none -my-8 w-[210px] select-none mix-blend-multiply [mask-image:radial-gradient(ellipse_58%_58%_at_center,black_40%,transparent_80%)] sm:w-[250px]"
          width={250}
          height={250}
          loading="lazy"
          decoding="async"
        />
        <p
          className="select-none text-[88px] font-light leading-[0.95] tracking-[-4px] text-[#334562] sm:text-[118px]"
          aria-hidden="true"
        >
          Dent
        </p>

        <div className="mt-8 flex flex-col gap-1 text-[17px] font-semibold leading-[1.45] text-[#334562]">
          <a href="mailto:info@familydent.tj">info@familydent.tj</a>
          <a href="tel:+992985454647">+992 98 545 46 47</a>
        </div>

        <Link to="/book" className="group mt-6 inline-flex items-stretch text-white" aria-label="Записаться на приём">
          <span className="inline-flex h-[45px] items-center justify-center rounded-l-[7px] bg-[#334562] px-6 text-xs font-bold">
            Записаться на приём
          </span>
          <span
            className="ml-px inline-flex h-[45px] w-[45px] items-center justify-center rounded-r-[7px] bg-[#334562]"
            aria-hidden="true"
          >
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </Link>
      </div>
    </section>
  );
}
