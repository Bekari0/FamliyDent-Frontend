import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowRight, Star } from "lucide-react";
import { getPatientReviews } from "../../lib/data/patient-reviews";
import type { PatientReview } from "../../lib/data/types";

const platformLinks = [
  {
    name: "Google Maps",
    shortName: "Google",
    href: "https://www.google.com/maps/place/Family+Dent/@38.563438,68.8018967,17z/data=!4m8!3m7!1s0x38b5d1aba35cafc3:0xd10cb723db2752e2!8m2!3d38.563438!4d68.8044716!9m1!1b1!16s%2Fg%2F11jv8kdh_9",
    icon: "https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/google-maps/default.svg",
  },
  {
    name: "Яндекс Карты",
    shortName: "Яндекс",
    href: "https://yandex.ru/maps/org/femili_dent/16415187433/reviews/",
    icon: "https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/yandex/default.svg",
  },
  {
    name: "2ГИС",
    shortName: "2ГИС",
    href: "https://2gis.tj/dushanbe/search/Family%20Dent",
    icon: "https://static.2gis.com/favicon.ico",
  },
] as const;

const sourceLabels: Partial<Record<PatientReview["source"], string>> = {
  google: "Google",
  yandex: "Яндекс",
  "2gis": "2ГИС",
};

function ReviewCard({ review }: { review: PatientReview }) {
  const content = (
    <article className="flex min-h-52 flex-col justify-between gap-6 rounded-[var(--radius-lg)] bg-[var(--color-surface)] p-6 text-[var(--color-ink)] transition-transform duration-300 hover:-translate-y-1 sm:p-7">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-1" aria-label={`${review.rating ?? 5} из 5`}>
          {Array.from({ length: review.rating ?? 5 }).map((_, index) => (
            <Star key={index} aria-hidden="true" className="size-4 fill-[var(--color-warn)] text-[var(--color-warn)]" />
          ))}
        </div>
        <p className="text-pretty text-sm leading-6 text-[var(--color-ink-2)]">{review.text}</p>
      </div>
      <footer className="flex items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h3 className="font-sans text-base font-bold">{review.authorName}</h3>
          <p className="text-xs text-[var(--color-muted)]">{review.publishedAt}</p>
        </div>
        <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[var(--color-accent)]">
          {sourceLabels[review.source] ?? review.source}
        </span>
      </footer>
    </article>
  );

  return review.sourceUrl ? (
    <a href={review.sourceUrl} target="_blank" rel="noreferrer" aria-label={`Отзыв ${review.authorName} на ${sourceLabels[review.source]}`}>
      {content}
    </a>
  ) : content;
}

export function PatientReviewsSection() {
  const [reviews, setReviews] = useState<PatientReview[]>([]);
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const firstColumnY = useTransform(scrollYProgress, [0, 1], [-96, 112]);
  const secondColumnY = useTransform(scrollYProgress, [0, 1], [96, -128]);

  useEffect(() => {
    getPatientReviews().then(setReviews);
  }, []);

  const firstColumn = reviews.filter((_, index) => index % 2 === 0);
  const secondColumn = reviews.filter((_, index) => index % 2 !== 0);

  return (
    <section ref={sectionRef} aria-labelledby="patient-reviews-title" className="bg-[var(--color-paper)] px-4 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto overflow-hidden rounded-[var(--radius-xl)] bg-[var(--color-paper-2)] min-[900px]:grid min-[900px]:h-[48rem] min-[900px]:max-w-7xl min-[900px]:grid-cols-[minmax(18rem,0.84fr)_minmax(0,1.16fr)]">
        <div className="flex flex-col items-start px-6 py-12 sm:px-10 min-[900px]:px-12 min-[900px]:py-16 min-[1100px]:px-16">
          <h2 id="patient-reviews-title" className="font-mono text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-accent)]">Что говорят наши пациенты?</h2>

          <div className="mt-8 flex flex-wrap items-center gap-5">
            {platformLinks.map((platform) => (
              <a
                key={platform.name}
                href={platform.href}
                target="_blank"
                rel="noreferrer"
                className="flex min-h-11 items-center gap-2 rounded-[var(--radius-sm)] px-1 text-xs font-semibold text-[var(--color-ink)] transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
                aria-label={`Отзывы Family Dent на ${platform.name}`}
              >
                <img src={platform.icon} alt="" width="24" height="24" className="size-6 object-contain" />
                <span>{platform.shortName}</span>
              </a>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-2">
            <strong className="font-sans text-4xl font-bold leading-none tracking-[-0.04em] text-[var(--color-accent)]">4,8 / 5</strong>
            <p className="font-sans text-base font-bold text-[var(--color-accent)]">Отзывы на картах</p>
            <p className="font-mono text-xs text-[var(--color-muted)]">Яндекс: 12 оценок · 6 отзывов</p>
          </div>

          <p className="mt-7 max-w-sm text-pretty text-sm leading-6 text-[var(--color-muted)]">
            Реальные истории пациентов о лечении, внимании врачей и атмосфере Family Dent. Выберите площадку, чтобы посмотреть оригиналы отзывов.
          </p>

          <Link to="/reviews" className="group mt-12 inline-flex min-h-11 items-center gap-3 text-sm font-bold text-[var(--color-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]">
            <span>Изучить все отзывы</span>
            <ArrowRight aria-hidden="true" className="size-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="border-t border-[var(--color-rule)] min-[900px]:border-l min-[900px]:border-t-0">
          <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 py-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden min-[900px]:hidden">
            {reviews.map((review) => (
              <div key={review.id} className="w-[82vw] max-w-sm shrink-0 snap-center"><ReviewCard review={review} /></div>
            ))}
          </div>

          <div className="hidden h-full grid-cols-2 gap-3 overflow-hidden p-3 min-[900px]:grid">
            <motion.div style={reduceMotion ? undefined : { y: firstColumnY }} className="flex flex-col gap-3 will-change-transform">
              {firstColumn.concat(firstColumn).map((review, index) => <ReviewCard key={`${review.id}-${index}`} review={review} />)}
            </motion.div>
            <motion.div style={reduceMotion ? undefined : { y: secondColumnY }} className="flex flex-col gap-3 will-change-transform">
              {secondColumn.concat(secondColumn).map((review, index) => <ReviewCard key={`${review.id}-${index}`} review={review} />)}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
