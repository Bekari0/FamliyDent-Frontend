import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { ArrowDown, ArrowRight, MapPin, X } from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { servicesData } from "../lib/data/services";
import { tourismComparison, tourismPackages, tourismPlaces, tourismRoadmap } from "../lib/data/tourism";
import { submitTourismConsultation } from "../lib/tourism-consultation";
import "./tourism-page.css";

const editorialServices = [
  { service: servicesData.find((item) => item.slug === "implantation")!, image: "/images/clinic_about.jpg", className: "tourism-service--lead" },
  { service: servicesData.find((item) => item.slug === "orthodontics")!, image: "/images/tourism/dushanbe-architecture.png", className: "tourism-service--portrait" },
  { service: servicesData.find((item) => item.slug === "aesthetics")!, image: "/images/tourism/cultural-detail.png", className: "tourism-service--detail" },
];

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
    if (!values.contact?.trim()) nextErrors.contact = "Укажите телефон или Telegram.";
    if (!values.country?.trim()) nextErrors.country = "Укажите страну.";
    if (!values.service) nextErrors.service = "Выберите направление.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setStatus("loading");
    const result = await submitTourismConsultation({
      name: values.name.trim(),
      contact: values.contact.trim(),
      country: values.country.trim(),
      service: values.service,
      message: values.message?.trim(),
    });
    if (!result.ok) setStatus("not-configured");
    onSubmitted?.();
  }

  return (
    <form onSubmit={submit} className="tourism-form" noValidate>
      <label htmlFor={fieldId("name")}>Ваше имя</label>
      <input id={fieldId("name")} name="name" autoComplete="name" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? fieldId("name-error") : undefined} placeholder="Как к вам обращаться" />
      {errors.name && <p id={fieldId("name-error")} className="tourism-form__error">{errors.name}</p>}

      <label htmlFor={fieldId("contact")}>Телефон или Telegram</label>
      <input id={fieldId("contact")} name="contact" autoComplete="tel" aria-invalid={Boolean(errors.contact)} aria-describedby={errors.contact ? fieldId("contact-error") : undefined} placeholder="+___ или @username" />
      {errors.contact && <p id={fieldId("contact-error")} className="tourism-form__error">{errors.contact}</p>}

      <div className="tourism-form__row">
        <div>
          <label htmlFor={fieldId("country")}>Страна</label>
          <input id={fieldId("country")} name="country" autoComplete="country-name" aria-invalid={Boolean(errors.country)} aria-describedby={errors.country ? fieldId("country-error") : undefined} placeholder="Откуда вы" />
          {errors.country && <p id={fieldId("country-error")} className="tourism-form__error">{errors.country}</p>}
        </div>
        <div>
          <label htmlFor={fieldId("service")}>Направление</label>
          <select id={fieldId("service")} name="service" defaultValue="" aria-invalid={Boolean(errors.service)} aria-describedby={errors.service ? fieldId("service-error") : undefined}>
            <option value="" disabled>Выберите услугу</option>
            {servicesData.map((service) => <option key={service.id} value={service.slug}>{service.title}</option>)}
          </select>
          {errors.service && <p id={fieldId("service-error")} className="tourism-form__error">{errors.service}</p>}
        </div>
      </div>

      <label htmlFor={fieldId("message")}>Комментарий <span>необязательно</span></label>
      <textarea id={fieldId("message")} name="message" rows={3} placeholder="Коротко опишите ситуацию" />
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
  const heroRef = useRef<HTMLElement>(null);
  const roadmapRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const { scrollYProgress: roadmapProgress } = useScroll({ target: roadmapRef, offset: ["start 0.8", "end 0.45"] });
  const heroScale = useTransform(heroProgress, [0, 1], [1, 1.07]);
  const heroTextY = useTransform(heroProgress, [0, 1], [0, -64]);
  const lineScale = useTransform(roadmapProgress, [0, 1], [0, 1]);

  useEffect(() => {
    document.title = "Стоматологический туризм в Душанбе | Family Dent";
    const description = "Стоматологическое лечение в Family Dent в Душанбе: предварительная консультация, согласованный маршрут визитов и знако��ство с Таджикистаном.";
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!meta) { meta = document.createElement("meta"); meta.name = "description"; document.head.append(meta); }
    meta.content = description;
  }, []);

  return (
    <main className="tourism-page">
      <section ref={heroRef} className="tourism-hero" aria-labelledby="tourism-title">
        <motion.video
          className="tourism-hero__video"
          style={reduceMotion ? undefined : { scale: heroScale }}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/images/tourism/dushanbe-hero.png"
          aria-hidden="true"
        >
          <source src="/videos/familydent.mp4" type="video/mp4" />
        </motion.video>
        <motion.img className="tourism-hero__poster" style={reduceMotion ? undefined : { scale: heroScale }} src="/images/tourism/dushanbe-hero.png" width="1536" height="1024" fetchPriority="high" alt="Душанбе на фоне гор" />
        <div className="tourism-hero__overlay" />
        <motion.div style={reduceMotion ? undefined : { y: heroTextY }} className="tourism-hero__content">
          <p className="tourism-eyebrow">FamilyDent · Dushanbe</p>
          <h1 id="tourism-title"><span>Таджикистан —</span><span>путешествие,</span><span>которое стоит открыть.</span></h1>
          <div className="tourism-hero__support"><p>Величественные горы, древняя культура и искреннее гостеприимство. Совместите путешествие с диагностикой и необходимым лечением в Family Dent — мы поможем выстроить визиты комфортно и удобно.</p><button className="tourism-button tourism-button--light" onClick={() => setDialogOpen(true)}>Обсудить поездку <ArrowRight /></button></div>
        </motion.div>
        <a href="#intro" className="tourism-hero__scroll" aria-label="Перейти к содержанию"><ArrowDown /></a>
      </section>

      <section id="intro" className="tourism-intro tourism-shell"><Reveal><p className="tourism-eyebrow tourism-eyebrow--dark">Стоматология без границ</p></Reveal><Reveal className="tourism-intro__statement" delay={0.08}><h2>Медицинская ясность — и время увидеть Таджикистан.</h2><p>Начните путешествие в Душанбе, а затем отправьтесь к живописным озёрам, Фанским горам или легендарному Памиру. Стоматологические визиты можно совместить с отдыхом и новыми впечатлениями — мы поможем спланировать маршрут без лишней суеты, а медицинские решения врач подтвердит после диагностики.</p></Reveal></section>

      <section className="tourism-facts" aria-label="О Family Dent"><div className="tourism-shell tourism-facts__inner"><Reveal><strong>8+ лет</strong><span>Успешной работы в Душанбе</span></Reveal><Reveal delay={0.06}><strong>2 филиала</strong><span>Клиники Family Dent в столице</span></Reveal><Reveal delay={0.12}><strong>50 000+</strong><span>Пациентов по данным презентации клиники</span></Reveal></div></section>

      <section className="tourism-services" aria-labelledby="services-title"><div className="tourism-shell tourism-section-heading"><p className="tourism-eyebrow tourism-eyebrow--dark">Направления лечения</p><h2 id="services-title">Главное — точная медицинская задача</h2></div><div className="tourism-services__layout tourism-shell">{editorialServices.map(({ service, image, className }, index) => <Reveal key={service.id} className={`tourism-service ${className}`} delay={index * 0.08}><div className="tourism-service__image"><img src={image} width="960" height="720" loading="lazy" alt="" /></div><div className="tourism-service__body"><span>{String(index + 1).padStart(2, "0")}</span><h3>{service.title}</h3><p>{service.slug === "implantation" ? "Восстановление утраченных зубов с предварительной цифровой диагностикой и индивидуальным планированием." : service.slug === "orthodontics" ? "Исправление прикуса и выравнивание зубов современными брекет-системами и прозрачными элайнерами." : "Эстетические решения обсуждаются после диагностики, оценки состояния зубов и согласования ожидаемого результата."}</p></div></Reveal>)}</div></section>

      <section className="tourism-comparison" aria-labelledby="comparison-title"><div className="tourism-shell"><div className="tourism-comparison__head"><div><p className="tourism-eyebrow">Ориентир по стоимости</p><h2 id="comparison-title">Сравните —<br />и считайте всю поездку.</h2></div><p>Диапазоны из презентации Family Dent показывают порядок цен в долларах США. Это не публичная оферта: точная стоимость зависит от диагноза, материалов и плана врача.</p></div><div className="tourism-comparison__scroller" tabIndex={0} aria-label="Прокручиваемая таблица сравнения цен"><table><thead><tr><th scope="col">Услуга</th><th scope="col" className="is-featured">Таджикистан</th><th scope="col">Россия</th><th scope="col">Казахстан</th><th scope="col">Европа</th><th scope="col">США</th></tr></thead><tbody>{tourismComparison.map((row) => <tr key={row.service}><th scope="row">{row.service}</th><td className="is-featured">{row.tajikistan}</td><td>{row.russia}</td><td>{row.kazakhstan}</td><td>{row.europe}</td><td>{row.usa}</td></tr>)}</tbody></table></div><p className="tourism-comparison__note">Цены ориентировочные и приведены для сравнения. Финальную смету врач формирует после диагностики.</p></div></section>

      <section className="tourism-packages" aria-labelledby="packages-title"><div className="tourism-shell"><div className="tourism-packages__head"><p className="tourism-eyebrow tourism-eyebrow--dark">Готовые форматы поездки</p><div><h2 id="packages-title">Выберите ритм.<br />Маршрут уточним вместе.</h2><p>Пакет задаёт длительность и логику поездки, но не заменяет медицинский план.</p></div></div><div className="tourism-local-options"><p>Если вы уже в Таджикистане</p><ul><li>Консультация + диагностика</li><li>Диагностика + профессиональная чистка</li><li>Диагностика + чистка + лечение кариеса</li></ul></div><div className="tourism-packages__list">{tourismPackages.map((item, index) => <Reveal key={item.number} className="tourism-package" delay={index * 0.06}><img className="tourism-package__background" src={item.image} width="991" height="661" loading="lazy" alt={item.imageAlt} /><span className="tourism-package__scrim" aria-hidden="true" /><span className="tourism-package__number">{item.number}</span><div><p>{item.audience}</p><h3>{item.name}</h3></div><strong>{item.duration}</strong><p className="tourism-package__description">{item.description}</p><button type="button" onClick={() => setDialogOpen(true)} aria-label={`Обсудить пакет ${item.name}`}><ArrowRight /></button></Reveal>)}</div></div></section>

      <section ref={roadmapRef} className="tourism-roadmap" aria-labelledby="roadmap-title"><div className="tourism-shell"><div className="tourism-roadmap__head"><p className="tourism-eyebrow tourism-eyebrow--dark">Как это работает</p><h2 id="roadmap-title">От сообщения<br />до Душанбе</h2></div><div className="tourism-roadmap__track"><div className="tourism-roadmap__line"><motion.span style={reduceMotion ? { scaleX: 1 } : { scaleX: lineScale }} /></div>{tourismRoadmap.map((step) => <article key={step.number}><span className="tourism-roadmap__number">{step.number}</span><h3>{step.title}</h3><p>{step.description}</p></article>)}</div><p className="tourism-roadmap__disclaimer">Окончательный план, объём и сроки лечения определяет врач после очной диагностики.</p></div></section>

      <section className="tourism-visit" aria-labelledby="visit-title"><div className="tourism-shell tourism-visit__inner"><div><p className="tourism-eyebrow">Визит без неопределённости</p><h2 id="visit-title">До. Во время. После.</h2></div><div className="tourism-visit__steps"><Reveal><span>До визита</span><p>Собираем доступные снимки и уточняем медицинскую задачу.</p></Reveal><Reveal delay={0.07}><span>В Душанбе</span><p>Проводим очную диагностику и согласуем дальнейшие действия.</p></Reveal><Reveal delay={0.14}><span>После визита</span><p>Остаёмся на связи по вопросам согласованного лечения.</p></Reveal></div></div></section>

      <section className="tourism-manifesto" aria-label="FamilyDent и Таджикистан"><div className="tourism-manifesto__panel"><img src="/images/clinic_about.jpg" width="960" height="1080" loading="lazy" alt="Клиника Family Dent" /><strong>FamilyDent</strong></div><div className="tourism-manifesto__panel"><img src="/images/tourism/fann-mountains.png" width="1024" height="1280" loading="lazy" alt="Горы Таджикистана" /><strong>Tajikistan</strong></div><div className="tourism-manifesto__center">Точность<br />в лечении.<br /><em>Свобода</em> в пути.</div></section>

      <section className="tourism-places tourism-shell" aria-labelledby="places-title"><div className="tourism-places__heading"><p className="tourism-eyebrow tourism-eyebrow--dark">Между визитами</p><h2 id="places-title">Места, которые остаются с вами</h2></div><div className="tourism-places__grid">{tourismPlaces.map((place, index) => <Reveal key={place.name} className={`tourism-place ${place.className}`} delay={index * 0.06}><img src={place.image} width="1200" height="900" loading="lazy" alt={place.name} /><div><span>{place.meta}</span><h3>{place.name}</h3></div></Reveal>)}</div></section>

      <section className="tourism-cinematic" aria-label="Пейзаж Памира"><img src="/images/tourism/pamir-road.png" width="1536" height="1024" loading="lazy" alt="Дорога через горы Памир��" /><div><p>Сменить привычный горизонт</p></div></section>

      <section className="tourism-conversion" aria-labelledby="consultation-title"><div className="tourism-shell tourism-conversion__inner"><Reveal className="tourism-conversion__copy"><p className="tourism-eyebrow">Следующий шаг</p><h2 id="consultation-title">Начните с разговора, а не с билета.</h2><p>Расскажите о задаче. Координатор поможет подготовить материалы для врача и обсудить дальнейший маршрут.</p></Reveal><Reveal className="tourism-conversion__form" delay={0.08}><ConsultationForm idPrefix="section" /></Reveal></div></section>

      <section className="tourism-contacts tourism-shell" aria-labelledby="contacts-title"><div><p className="tourism-eyebrow tourism-eyebrow--dark">Family Dent · Душанбе</p><h2 id="contacts-title">Мы здесь,<br />когда вы готовы.</h2></div><address><a href="tel:+992446606600">+992 446 60 66 00</a><a href="mailto:familydent.tj@gmail.com">familydent.tj@gmail.com</a><p><MapPin /> Душанбе, улица Айни, 45</p><p><MapPin /> Душанбе, улица Немат Карабаева, 29</p></address><div className="tourism-contacts__map"><iframe title="Family Dent на карте" loading="lazy" src="https://www.openstreetmap.org/export/embed.html?bbox=68.75%2C38.54%2C68.82%2C38.60&layer=mapnik" /></div></section>

      <ConsultationDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </main>
  );
}
