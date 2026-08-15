import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowDown, ArrowRight, Check, MapPin, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import "./tourism-page.css";

const services = [
  {
    number: "01",
    title: "Диагностика до перелёта",
    copy: "Изучим снимки и медицинскую историю онлайн, чтобы ваша поездка началась с понятного предварительного маршрута.",
    image: "/images/clinic_about.jpg",
    className: "tourism-service--lead",
  },
  {
    number: "02",
    title: "Персональный план",
    copy: "Профильный врач определит последовательность приёмов после очной диагностики в клинике.",
    image: "/images/tourism/dushanbe-architecture.png",
    className: "tourism-service--portrait",
  },
  {
    number: "03",
    title: "Сопровождение в Душанбе",
    copy: "Координатор остаётся на связи по вопросам расписания, визитов и пребывания в городе.",
    image: "/images/tourism/cultural-detail.png",
    className: "tourism-service--detail",
  },
];

const steps = [
  ["01", "Знакомство", "Вы оставляете контакты и коротко описываете задачу."],
  ["02", "Онлайн-разбор", "Мы уточняем данные и подбираем профильного специалиста."],
  ["03", "Маршрут лечения", "Формируем предварительный порядок визитов и даты поездки."],
  ["04", "Душанбе", "Проводим очную диагностику и начинаем согласованное лечение."],
];

const places = [
  { name: "Памирский тракт", meta: "Дорога выше облаков", image: "/images/tourism/pamir-road.png", className: "place--dominant" },
  { name: "Фанские горы", meta: "Высота и тишина", image: "/images/tourism/fann-mountains.png", className: "place--tall" },
  { name: "Проспект Рудаки", meta: "Ритм столицы", image: "/images/tourism/dushanbe-architecture.png", className: "place--portrait" },
  { name: "Орнамент", meta: "Детали культуры", image: "/images/tourism/cultural-detail.png", className: "place--square" },
];

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 36 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.72, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

function ConsultationDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [status, setStatus] = useState<"idle" | "ready">("idle");
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("ready");
  }

  return (
    <dialog ref={dialogRef} className="tourism-dialog" onClose={onClose} onCancel={onClose}>
      <div className="tourism-dialog__top">
        <div>
          <p className="tourism-eyebrow tourism-eyebrow--dark">Персональная консультация</p>
          <h2>Расскажите о задаче</h2>
        </div>
        <button className="tourism-dialog__close" onClick={onClose} aria-label="Закрыть форму"><X /></button>
      </div>
      <p className="tourism-dialog__intro">Координатор уточнит детали и поможет подготовить материалы для врача.</p>
      <form onSubmit={submit} className="tourism-form">
        <label>Ваше имя<input name="name" autoComplete="name" required placeholder="Как к вам обращаться" /></label>
        <label>Телефон или Telegram<input name="contact" required placeholder="+___ или @username" /></label>
        <label>Что вас беспокоит<textarea name="message" required rows={3} placeholder="Коротко опишите ситуацию" /></label>
        <label className="tourism-form__file">Снимок или документ <span>можно добавить позднее</span><input name="file" type="file" accept="image/*,.pdf" /></label>
        <button className="tourism-button tourism-button--dark" type="submit">Отправить запрос <ArrowRight /></button>
        <p className="tourism-form__note">Нажимая кнопку, вы соглашаетесь на обработку данных.</p>
        <div className="tourism-form__status" role="status" aria-live="polite">
          {status === "ready" && <><Check /> Форма готова. Отправка в Telegram будет подключена следующим этапом.</>}
        </div>
      </form>
    </dialog>
  );
}

export function TourismPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const roadmapRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const { scrollYProgress: roadmapProgress } = useScroll({ target: roadmapRef, offset: ["start 0.75", "end 0.45"] });
  const heroScale = useTransform(heroProgress, [0, 1], [1, 1.08]);
  const heroTextY = useTransform(heroProgress, [0, 1], [0, -70]);
  const lineScale = useTransform(roadmapProgress, [0, 1], [0, 1]);

  useEffect(() => {
    document.title = "Стоматологический туризм в Душанбе | Family Dent";
  }, []);

  const openConsultation = () => setDialogOpen(true);

  return (
    <main className="tourism-page">
      <section ref={heroRef} className="tourism-hero" aria-labelledby="tourism-title">
        <motion.img style={reduceMotion ? undefined : { scale: heroScale }} src="/images/tourism/dushanbe-hero.png" alt="Душанбе на фоне гор" />
        <div className="tourism-hero__overlay" />
        <motion.div style={reduceMotion ? undefined : { y: heroTextY }} className="tourism-hero__content">
          <p className="tourism-eyebrow">FamilyDent · Dushanbe</p>
          <h1 id="tourism-title"><span>Лечение.</span><span>Путешествие.</span><span>Одна забота.</span></h1>
          <div className="tourism-hero__support">
            <p>Продуманный маршрут стоматологического лечения в Душанбе — от первой онлайн-консультации до возвращения домой.</p>
            <button className="tourism-button tourism-button--light" onClick={openConsultation}>Обсудить поездку <ArrowRight /></button>
          </div>
        </motion.div>
        <a href="#intro" className="tourism-hero__scroll" aria-label="Перейти к содержанию"><ArrowDown /></a>
      </section>

      <section id="intro" className="tourism-intro tourism-shell">
        <Reveal className="tourism-intro__label"><p className="tourism-eyebrow tourism-eyebrow--dark">Стоматология без границ</p></Reveal>
        <Reveal className="tourism-intro__statement" delay={0.08}>
          <h2>Медицинская ясность — и время увидеть Таджикистан.</h2>
          <p>Мы соединяем лечение и сопровождение в одном спокойном маршруте. Без обещаний до диагностики, без лишней суеты, с вниманием к каждому этапу поездки.</p>
        </Reveal>
      </section>

      <section className="tourism-services" aria-labelledby="services-title">
        <div className="tourism-shell tourism-section-heading">
          <p className="tourism-eyebrow tourism-eyebrow--dark">Ваш маршрут</p>
          <h2 id="services-title">Всё важное — до, во время и после визита</h2>
        </div>
        <div className="tourism-services__layout tourism-shell">
          {services.map((service, index) => (
            <Reveal key={service.number} className={`tourism-service ${service.className}`} delay={index * 0.08}>
              <div className="tourism-service__image"><img src={service.image} alt="" /></div>
              <div className="tourism-service__body"><span>{service.number}</span><h3>{service.title}</h3><p>{service.copy}</p></div>
            </Reveal>
          ))}
        </div>
      </section>

      <section ref={roadmapRef} className="tourism-roadmap" aria-labelledby="roadmap-title">
        <div className="tourism-shell">
          <div className="tourism-roadmap__head"><p className="tourism-eyebrow tourism-eyebrow--dark">Как это работает</p><h2 id="roadmap-title">От сообщения<br />до Душанбе</h2></div>
          <div className="tourism-roadmap__track">
            <div className="tourism-roadmap__line"><motion.span style={reduceMotion ? { scaleX: 1 } : { scaleX: lineScale }} /></div>
            {steps.map(([number, title, copy]) => <article key={number}><span className="tourism-roadmap__number">{number}</span><h3>{title}</h3><p>{copy}</p></article>)}
          </div>
          <p className="tourism-roadmap__disclaimer">Окончательный план, объём и сроки лечения определяет врач после очной диагностики.</p>
        </div>
      </section>

      <section className="tourism-manifesto" aria-label="FamilyDent и Таджикистан">
        <div className="tourism-manifesto__panel tourism-manifesto__clinic"><img src="/images/clinic_about.jpg" alt="Клиника Family Dent" /><strong>FamilyDent</strong></div>
        <div className="tourism-manifesto__panel tourism-manifesto__tajikistan"><img src="/images/tourism/fann-mountains.png" alt="Горы Таджикистана" /><strong>Tajikistan</strong></div>
        <div className="tourism-manifesto__center">Точность<br />в лечении.<br /><em>Свобода</em> в пути.</div>
      </section>

      <section className="tourism-places tourism-shell" aria-labelledby="places-title">
        <div className="tourism-places__heading"><p className="tourism-eyebrow tourism-eyebrow--dark">Между визитами</p><h2 id="places-title">Места, которые остаются с вами</h2></div>
        <div className="tourism-places__grid">
          {places.map((place, index) => <Reveal key={place.name} className={`tourism-place ${place.className}`} delay={index * 0.06}><img src={place.image} alt={place.name} /><div><span>{place.meta}</span><h3>{place.name}</h3></div></Reveal>)}
        </div>
      </section>

      <section className="tourism-cinematic" aria-label="Пейзаж Памира"><img src="/images/tourism/pamir-road.png" alt="Дорога через горы Памира" /><div><p>Сменить привычный горизонт</p></div></section>

      <section className="tourism-conversion" aria-labelledby="consultation-title">
        <div className="tourism-shell tourism-conversion__inner">
          <Reveal><p className="tourism-eyebrow">Следующий шаг</p><h2 id="consultation-title">Начните с разговора, а не с билета.</h2></Reveal>
          <Reveal className="tourism-conversion__action" delay={0.1}><p>Оставьте контакты и опишите задачу. Координатор свяжется с вами, чтобы спокойно разобраться в деталях.</p><button className="tourism-button tourism-button--accent" onClick={openConsultation}>Получить консультацию <ArrowRight /></button></Reveal>
        </div>
      </section>

      <section className="tourism-contacts tourism-shell" aria-labelledby="contacts-title">
        <div><p className="tourism-eyebrow tourism-eyebrow--dark">Family Dent · Душанбе</p><h2 id="contacts-title">Мы здесь,<br />когда вы готовы.</h2></div>
        <address><a href="tel:+992446606600">+992 446 60 66 00</a><a href="mailto:info@familydent.tj">info@familydent.tj</a><p><MapPin /> Душанбе, улица Айни, 45</p></address>
        <div className="tourism-contacts__map"><iframe title="Family Dent на карте" loading="lazy" src="https://www.openstreetmap.org/export/embed.html?bbox=68.75%2C38.54%2C68.82%2C38.60&layer=mapnik" /></div>
      </section>

      <ConsultationDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </main>
  );
}
