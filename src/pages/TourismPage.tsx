import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { ArrowRight, CalendarCheck, ClipboardCheck, Route, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { servicesData } from "../lib/data/services";
import { tourismComparison, tourismPackages, tourismPlaces, tourismRoadmap } from "../lib/data/tourism";
import { submitTourismConsultation } from "../lib/tourism-consultation";
import "./tourism-page.css";

const heroSlides = [
  { image: "/images/tourism/hero-dushanbe.jpg", eyebrow: "Столица Таджикистана", title: "Душанбе", description: "Современная столица у подножия гор — отправная точка путешествия и место, где вас ждёт Family Dent." },
  { image: "/images/tourism/hero-iskanderkul.jpg", eyebrow: "Фанские горы", title: "Искандеркуль", description: "Бирюзовое горное озеро среди скалистых вершин и один из самых узнаваемых природных символов страны." },
  { image: "/images/tourism/hero-karakul.jpg", eyebrow: "Восточный Памир", title: "Озеро Каракуль", description: "Высокогорное озеро, окружённое суровыми памирскими ландшафтами и заснеженными хребтами." },
  { image: "/images/tourism/hero-sughd.jpg", eyebrow: "Север Таджикистана", title: "Согдийская область", description: "Древние города, крепости и культурное наследие одного из самых исторически насыщенных регионов страны." },
  { image: "/images/tourism/hero-fann.jpg", eyebrow: "Сердце горного Таджикистана", title: "Фанские горы", description: "Альпийские озёра, снежные вершины и маршруты для настоящего путешествия среди дикой природы." },
] as const;

const treatmentDirections = [
  { title: "Протезирование зубов", icon: "/icons/tourism-treatment-1.svg?v=3" },
  { title: "Имплантация", icon: "/icons/tourism-treatment-2.svg?v=3" },
  { title: "Эстетическая стоматология", icon: "/icons/tourism-treatment-3.svg?v=3" },
  { title: "Лечение корневых каналов", icon: "/icons/tourism-treatment-4.svg?v=3" },
  { title: "Ортодонтия", icon: "/icons/tourism-treatment-5.svg?v=3" },
  { title: "Профессиональная гигиена и отбеливание", icon: "/icons/tourism-treatment-6.svg?v=3" },
] as const;

const treatmentDurations = [
  ["Отбеливание", "1 день"], ["Профессиональная гигиена", "1 день"], ["Лечение кариеса", "1–3 дня"],
  ["Виниры", "5–7 дней"], ["Коронки", "5–7 дней"], ["Имплантация", "Индивидуально"],
  ["All-on-4 / All-on-6", "Индивидуально"], ["Полная реабилитация", "Индивидуально"],
] as const;

const tourServices = ["Предварительная онлайн-консультация", "Анализ КТ или рентгена", "Предварительный план лечения", "Расчёт стоимости", "Планирование визитов", "Подбор отеля", "Трансфер из аэропорта", "Трансфер между отелем и клиникой", "Сопровождение координатора", "Языковая поддержка", "Стоматологическое лечение", "Рекомендации перед возвращением домой", "Дистанционная связь после лечения"] as const;

const tourismFaq = [
  ["Нужно ли приезжать на консультацию до лечения?", "Нет. Предварительную консультацию можно пройти онлайн. Отправьте фотографии, КТ или панорамный снимок, если они у вас есть. Окончательный план утверждается после очной диагностики."],
  ["Можно ли узнать стоимость лечения до приезда?", "Да. После изучения медицинских материалов мы предоставим предварительный расчёт. Окончательная стоимость определяется после очной диагностики."],
  ["Сколько дней нужно провести в Душанбе?", "Это зависит от вида и объёма лечения. После изучения вашего случая мы составим индивидуальный график."],
  ["Помогаете ли вы с отелем и трансфером?", "Да. Мы можем помочь подобрать проживание и по предварительной договорённости организовать трансфер из аэропорта, между отелем и клиникой и обратно."],
  ["На каком языке можно общаться?", "Коммуникация доступна на русском, таджикском, английском и узбекском языках. При необходимости поможем организовать дополнительную языковую поддержку."],
  ["Что делать после возвращения домой?", "Свяжитесь с координатором Family Dent. Мы остаёмся на связи для дистанционной консультации и контроля состояния."],
  ["Как забронировать лечение?", "Оставьте заявку на сайте или напишите в WhatsApp. Координатор свяжется с вами и расскажет о следующих шагах."],
] as const;

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div className={className} initial={reduceMotion ? false : { opacity: 0, y: 32 }} whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.18 }} transition={{ duration: 0.68, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
}

function ConsultationForm({ idPrefix = "consultation", onSubmitted }: { idPrefix?: string; onSubmitted?: () => void }) {
  const generatedId = useId();
  const [status, setStatus] = useState<"idle" | "loading" | "not-configured">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fieldId = (name: string) => `${idPrefix}-${generatedId}-${name}`;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form)) as Record<string, string>;
    const nextErrors: Record<string, string> = {};
    if (!values.name?.trim()) nextErrors.name = "Укажите имя.";
    if (!values.email?.trim()) nextErrors.email = "Укажите email.";
    else if (!/^\S+@\S+\.\S+$/.test(values.email.trim())) nextErrors.email = "Проверьте формат email.";
    if (!values.phone?.trim()) nextErrors.phone = "Укажите номер телефона.";
    if (!values.country?.trim()) nextErrors.country = "Укажите страну.";
    if (!values.service) nextErrors.service = "Выберите направление.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setStatus("loading");
    const result = await submitTourismConsultation({
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      telegram: values.telegram?.trim(),
      country: values.country.trim(),
      service: values.service,
      message: values.message?.trim(),
    });
    if (!result.ok) setStatus("not-configured");
    onSubmitted?.();
  }

  return (
    <form onSubmit={submit} className="tourism-form" noValidate>
      <div className="tourism-form__field">
        <label htmlFor={fieldId("name")}>Ваше имя</label>
        <input id={fieldId("name")} name="name" autoComplete="name" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? fieldId("name-error") : undefined} placeholder="Как к вам обращаться" />
        {errors.name && <p id={fieldId("name-error")} className="tourism-form__error">{errors.name}</p>}
      </div>

      <div className="tourism-form__row">
        <div className="tourism-form__field">
          <label htmlFor={fieldId("email")}>Email</label>
          <input id={fieldId("email")} name="email" type="email" inputMode="email" autoComplete="email" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? fieldId("email-error") : undefined} placeholder="name@example.com" />
          {errors.email && <p id={fieldId("email-error")} className="tourism-form__error">{errors.email}</p>}
        </div>
        <div className="tourism-form__field">
          <label htmlFor={fieldId("phone")}>Номер телефона</label>
          <input id={fieldId("phone")} name="phone" type="tel" inputMode="tel" autoComplete="tel" aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? fieldId("phone-error") : undefined} placeholder="+992 00 000 00 00" />
          {errors.phone && <p id={fieldId("phone-error")} className="tourism-form__error">{errors.phone}</p>}
        </div>
      </div>

      <div className="tourism-form__row">
        <div className="tourism-form__field">
          <label htmlFor={fieldId("telegram")}>Telegram <span>необязательно</span></label>
          <input id={fieldId("telegram")} name="telegram" autoComplete="off" placeholder="@username" />
        </div>
        <div className="tourism-form__field">
          <label htmlFor={fieldId("country")}>Страна</label>
          <input id={fieldId("country")} name="country" autoComplete="country-name" aria-invalid={Boolean(errors.country)} aria-describedby={errors.country ? fieldId("country-error") : undefined} placeholder="Откуда вы" />
          {errors.country && <p id={fieldId("country-error")} className="tourism-form__error">{errors.country}</p>}
        </div>
      </div>

      <div className="tourism-form__field">
        <label htmlFor={fieldId("service")}>Направление</label>
        <select id={fieldId("service")} name="service" defaultValue="" aria-invalid={Boolean(errors.service)} aria-describedby={errors.service ? fieldId("service-error") : undefined}>
          <option value="" disabled>Выберите услугу</option>
          {servicesData.map((service) => <option key={service.id} value={service.slug}>{service.title}</option>)}
        </select>
        {errors.service && <p id={fieldId("service-error")} className="tourism-form__error">{errors.service}</p>}
      </div>

      <div className="tourism-form__field">
        <label htmlFor={fieldId("message")}>Комментарий <span>необязательно</span></label>
        <textarea id={fieldId("message")} name="message" rows={3} placeholder="Коротко опишите ситуацию" />
      </div>
      <button className="tourism-button tourism-button--dark" type="submit" disabled={status === "loading"}>{status === "loading" ? "Отправляем…" : "Отправить запрос"} <ArrowRight /></button>
      <p className="tourism-form__note">Нажимая кнопку, вы соглашаетесь на обработку данных.</p>
      <div className="tourism-form__status" role="status" aria-live="polite">
        {status === "not-configured" && <>Онлайн-отправка в Telegram ещё подключается. Позвоните по номеру <a href="tel:+992446606600">+992 446 60 66 00</a>.</>}
      </div>
    </form>
  );
}

function ConsultationDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog ref={dialogRef} className="tourism-dialog" onClose={onClose} onCancel={onClose} onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="tourism-dialog__top"><div><p className="tourism-eyebrow tourism-eyebrow--dark">Персональная консультация</p><h2>Расскажите о задаче</h2></div><button className="tourism-dialog__close" onClick={onClose} aria-label="Закрыть форму"><X /></button></div>
      <p className="tourism-dialog__intro">Координатор уточнит детали и поможет подготовить материалы для врача.</p>
      <ConsultationForm idPrefix="dialog" />
    </dialog>
  );
}

export function TourismPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);
  const heroRef = useRef<HTMLElement>(null);
  const roadmapRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const { scrollYProgress: roadmapProgress } = useScroll({ target: roadmapRef, offset: ["start 0.8", "end 0.45"] });
  const heroScale = useTransform(heroProgress, [0, 1], [1, 1.07]);
  const heroTextY = useTransform(heroProgress, [0, 1], [0, -64]);
  const lineScale = useTransform(roadmapProgress, [0, 1], [0, 1]);
  const activeSlide = heroSlides[activeHeroSlide];

  useEffect(() => {
    if (reduceMotion) return;
    const interval = window.setInterval(() => setActiveHeroSlide((current) => (current + 1) % heroSlides.length), 6500);
    return () => window.clearInterval(interval);
  }, [reduceMotion]);

  useEffect(() => {
    document.title = "Стоматологический туризм в Душанбе | Family Dent";
    const description = "Стоматологическое лечение в Family Dent в Душанбе: предварительная консультация, согласованный маршрут визитов и знакомство с Таджикистаном.";
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!meta) { meta = document.createElement("meta"); meta.name = "description"; document.head.append(meta); }
    meta.content = description;
  }, []);

  return (
    <main className="tourism-page">
      <section ref={heroRef} className="tourism-hero" aria-labelledby="tourism-title">
        <AnimatePresence initial={false} mode="sync">
          <motion.img key={activeSlide.image} className="tourism-hero__slide" style={reduceMotion ? undefined : { scale: heroScale }} src={activeSlide.image} width="1536" height="1024" fetchPriority={activeHeroSlide === 0 ? "high" : "auto"} alt="" initial={reduceMotion ? false : { opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ opacity: { duration: 1.1 }, scale: { duration: 6.5, ease: "linear" } }} />
        </AnimatePresence>
        <div className="tourism-hero__overlay" />
        <motion.div style={reduceMotion ? undefined : { y: heroTextY }} className="tourism-hero__content">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={activeHeroSlide} initial={reduceMotion ? false : { opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}>
              <p className="tourism-eyebrow">{activeSlide.eyebrow}</p>
              <h1 id="tourism-title">{activeSlide.title}</h1>
              <div className="tourism-hero__support"><p>{activeSlide.description}</p></div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </section>

      <section id="intro" className="tourism-borderless" aria-labelledby="borderless-title">
        <div className="tourism-shell tourism-borderless__inner">
          <Reveal className="tourism-borderless__heading">
            <p className="tourism-eyebrow">Стоматология без границ</p>
            <h2 id="borderless-title"><span>Лечение продумано.</span><br />Путешествие — тоже.</h2>
            <p>Family Dent помогает собрать визит в Душанбе в понятный маршрут: от первого сообщения и подготовки снимков до очной диагностики и связи после приёма.</p>
          </Reveal>

          <div className="tourism-borderless__grid">
            <Reveal className="tourism-borderless__photo">
              <img src="/images/clinic-exterior-poster.png" width="1536" height="882" loading="lazy" alt="Клиника Family Dent в центре Душанбе" />
              <div><span>Вас сопровождает</span><strong>Персональный<br />координатор</strong></div>
            </Reveal>

            <Reveal className="tourism-borderless__card tourism-borderless__card--route" delay={0.06}>
              <Route aria-hidden="true" />
              <div><span>План поездки</span><strong>Согласуем визиты с вашим маршрутом</strong></div>
            </Reveal>

            <Reveal className="tourism-borderless__card tourism-borderless__card--support" delay={0.1}>
              <ClipboardCheck aria-hidden="true" />
              <div><span>До и после приёма</span><strong>Остаёмся на связи по плану лечения</strong></div>
            </Reveal>

            <Reveal className="tourism-borderless__card tourism-borderless__card--clinic" delay={0.14}>
              <CalendarCheck aria-hidden="true" />
              <div><span>Family Dent</span><strong>Работаем в Душанбе<br />с 2018 года</strong><small>Два адреса в столице</small></div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="tourism-services" aria-labelledby="services-title">
        <div className="tourism-shell tourism-services__inner">
          <div className="tourism-services__intro">
            <p className="tourism-eyebrow tourism-eyebrow--dark">Направления лечения</p>
            <h2 id="services-title">Рекомендуемые процедуры</h2>
            <p>От эстетической до функциональной стоматологии — подберём решение после диагностики и составим понятный план лечения.</p>
          </div>
          <div className="tourism-services__list">
            {treatmentDirections.map((item) => (
              <div key={item.title} className="tourism-service">
                <span
                  className="tourism-service__icon"
                  style={{ "--tourism-service-icon": `url("${item.icon}")` } as React.CSSProperties}
                  aria-hidden="true"
                />
                <h3>{item.title}</h3>
                <button type="button" onClick={() => setDialogOpen(true)} aria-label={`Обсудить направление: ${item.title}`}>
                  <ArrowRight />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="tourism-comparison" aria-labelledby="comparison-title"><div className="tourism-shell"><div className="tourism-comparison__head"><div><p className="tourism-eyebrow">Ориентир по стоимости</p><h2 id="comparison-title">Сравните —<br />и считайте всю поездку.</h2></div><p>Диапазоны из презентации Family Dent показывают порядок цен в долларах США. Это не публичная оферта: точная стоимость зависит от диагноза, материалов и плана врача.</p></div><div className="tourism-comparison__scroller" tabIndex={0} aria-label="Прокручиваемая таблица сравнения цен"><table><thead><tr><th scope="col">Услуга</th><th scope="col" className="is-featured">Таджикистан</th><th scope="col">Россия</th><th scope="col">Казахстан</th><th scope="col">Европа</th><th scope="col">США</th></tr></thead><tbody>{tourismComparison.map((row) => <tr key={row.service}><th scope="row">{row.service}</th><td className="is-featured">{row.tajikistan}</td><td>{row.russia}</td><td>{row.kazakhstan}</td><td>{row.europe}</td><td>{row.usa}</td></tr>)}</tbody></table></div><p className="tourism-comparison__note">Цены ориентировочные и приведены для сравнения. Финальную смету врач формирует после диагностики.</p></div></section>

      <section className="tourism-packages" aria-labelledby="packages-title"><div className="tourism-shell"><div className="tourism-packages__head"><p className="tourism-eyebrow tourism-eyebrow--dark">Готовые форматы поездки</p><div><h2 id="packages-title">Выберите ритм.<br />Маршрут уточним вместе.</h2><p>Пакет задаёт длительность и логику поездки, но не заменяет медицинский план.</p></div></div><div className="tourism-local-options"><p>Если вы уже в Таджикистане</p><ul><li>Консультация + диагностика</li><li>Диагностика + профессиональная чистка</li><li>Диагностика + чистка + лечение кариеса</li></ul></div><div className="tourism-packages__list">{tourismPackages.map((item, index) => <Reveal key={item.number} className="tourism-package" delay={index * 0.06}><img className="tourism-package__background" src={item.image} width="991" height="661" loading="lazy" alt={item.imageAlt} /><span className="tourism-package__scrim" aria-hidden="true" /><span className="tourism-package__number">{item.number}</span><div><p>{item.audience}</p><h3>{item.name}</h3></div><strong>{item.duration}</strong><p className="tourism-package__description">{item.description}</p><button type="button" onClick={() => setDialogOpen(true)} aria-label={`Обсудить пакет ${item.name}`}><ArrowRight /></button></Reveal>)}</div></div></section>

      <section ref={roadmapRef} className="tourism-roadmap" aria-labelledby="roadmap-title"><div className="tourism-shell"><div className="tourism-roadmap__head"><p className="tourism-eyebrow tourism-eyebrow--dark">Как это работает</p><h2 id="roadmap-title">От сообщения<br />до Душанбе</h2></div><div className="tourism-roadmap__track"><div className="tourism-roadmap__line"><motion.span style={reduceMotion ? { scaleX: 1 } : { scaleX: lineScale }} /></div>{tourismRoadmap.map((step) => <article key={step.number}><span className="tourism-roadmap__number">{step.number}</span><h3>{step.title}</h3><p>{step.description}</p></article>)}</div><p className="tourism-roadmap__disclaimer">Окончательный план, объём и сроки лечения определяет врач после очной диагностики.</p></div></section>

      <section className="tourism-visit" aria-labelledby="visit-title"><div className="tourism-shell tourism-visit__inner"><div><p className="tourism-eyebrow">Визит без неопределённости</p><h2 id="visit-title">До. Во время. После.</h2></div><div className="tourism-visit__steps"><Reveal><span>До визита</span><p>Собираем доступные снимки и уточняем медицинскую задачу.</p></Reveal><Reveal delay={0.07}><span>В Душанбе</span><p>Проводим очную диагностику и согласуем дальнейшие действия.</p></Reveal><Reveal delay={0.14}><span>После визита</span><p>Остаёмся на связи для дистанционной консультации, контроля состояния и передачи рекомендаций.</p></Reveal></div></div></section>

      <section className="tourism-details" aria-labelledby="duration-title"><div className="tourism-shell"><div className="tourism-details__head"><p className="tourism-eyebrow tourism-eyebrow--dark">Планирование поездки</p><h2 id="duration-title">Сколько дней нужно находиться в Душанбе</h2><p>Продолжительность зависит от диагноза, объёма работ и выбранного метода. Точный график составляется после изучения вашей ситуации.</p></div><div className="tourism-details__table">{treatmentDurations.map(([name, duration]) => <div key={name}><span>{name}</span><strong>{duration}</strong></div>)}</div></div></section>

      <section className="tourism-support" aria-labelledby="support-title"><div className="tourism-shell tourism-support__layout"><div><p className="tourism-eyebrow">Организация тура</p><h2 id="support-title">Что может организовать Family Dent</h2><p>Условия включения дополнительных услуг согласовываются индивидуально.</p></div><ul>{tourServices.map((item) => <li key={item}>{item}</li>)}</ul></div></section>

      <section className="tourism-language" aria-labelledby="language-title"><div className="tourism-shell tourism-language__layout"><div><p className="tourism-eyebrow tourism-eyebrow--dark">Языковая поддержка</p><h2 id="language-title">Мы говорим на вашем языке</h2><p>Для нас важно, чтобы пациент понимал каждый этап лечения.</p></div><ul><li>Русский</li><li>Таджикский</li><li>Английский</li><li>Узбекский</li></ul></div></section>

      <section className="tourism-faq" aria-labelledby="tourism-faq-title"><div className="tourism-shell"><p className="tourism-eyebrow tourism-eyebrow--dark">Ответы перед поездкой</p><h2 id="tourism-faq-title">Часто задаваемые вопросы</h2><div className="tourism-faq__list">{tourismFaq.map(([question, answer]) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div></div></section>

      <section className="tourism-manifesto" aria-label="FamilyDent и Таджикистан"><div className="tourism-manifesto__panel"><img src="/images/family-dent-2-reception.jpg" width="4000" height="6000" loading="lazy" alt="Зона ожидания Family Dent 2 в Душанбе" /><strong>FamilyDent</strong></div><div className="tourism-manifesto__panel"><img src="/images/tourism/fann-mountains.png" width="1024" height="1280" loading="lazy" alt="Горы Таджикистана" /><strong>Tajikistan</strong></div><div className="tourism-manifesto__center">Точность<br />в лечении.<br /><em>Свобода</em> в пути.</div></section>

      <section className="tourism-places" aria-labelledby="places-title"><div className="tourism-shell tourism-places__heading"><p className="tourism-eyebrow tourism-eyebrow--dark">Между визитами</p><h2 id="places-title">10 мест, ради которых стоит увидеть Таджикистан</h2></div><div className="tourism-places__grid">{tourismPlaces.map((place, index) => <Reveal key={place.name} className={`tourism-place ${place.className}`} delay={Math.min(index * 0.04, 0.2)}><img src={place.image} width="1200" height="900" loading="lazy" alt={`${place.name} — ${place.meta}`} /><div><span>{place.meta}</span><h3>{place.name}</h3></div></Reveal>)}</div></section>

      <section className="tourism-cinematic" aria-label="Пейзаж Памира"><img src="/images/tourism/pamir-road.png" width="1536" height="1024" loading="lazy" alt="Дорога через горы Памира" /><div><p>Сменить привычный горизонт</p></div></section>

      <section className="tourism-conversion" aria-labelledby="consultation-title"><div className="tourism-shell tourism-conversion__inner"><Reveal className="tourism-conversion__copy"><p className="tourism-eyebrow">Следующий шаг</p><h2 id="consultation-title">Начните с разговора, а не с билета.</h2><p>Расскажите о задаче. Координатор поможет подготовить материалы для врача и обсудить дальнейший маршрут.</p><p className="tourism-coordinator">WhatsApp · Telegram · Телефон<br /><a href="tel:+992988770009">+992 98 877 0009</a></p></Reveal><Reveal className="tourism-conversion__form" delay={0.08}><ConsultationForm idPrefix="section" /></Reveal></div></section>

      <ConsultationDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </main>
  );
}
