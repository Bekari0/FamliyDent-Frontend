import {
  Button,
  Field,
  Heading,
  IconButton,
  Input,
  Reveal,
  RevealHeading,
  Select,
  Text,
  Textarea,
} from "@/ui-kit";
import {
  ArrowRight,
  CalendarCheck,
  ClipboardCheck,
  Route,
  X,
} from "lucide-react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { getServices } from "../lib/data/services";
import {
  getTourismComparison,
  getTourismPackages,
  getTourismPlaces,
  getTourismRoadmap,
} from "../lib/data/tourism";
import type { Service } from "../lib/data/types";
import { submitTourismConsultation } from "../lib/tourism-consultation";
import "./tourism-page.css";

const heroSlides = [
  {
    image: "/images/tourism/hero-dushanbe.jpg",
    eyebrow: "Столица Таджикистана",
    title: "Душанбе",
    description:
      "Современная столица у подножия гор — отправная точка путешествия и место, где вас ждёт Family Dent.",
  },
  {
    image: "/images/tourism/hero-iskanderkul.jpg",
    eyebrow: "Фанские горы",
    title: "Искандеркуль",
    description:
      "Бирюзовое горное озеро среди скалистых вершин и один из самых узнаваемых природных символов страны.",
  },
  {
    image: "/images/tourism/hero-karakul.jpg",
    eyebrow: "Восточный Памир",
    title: "Озеро Каракуль",
    description:
      "Высокогорное озеро, окружённое суровыми памирскими ландшафтами и заснеженными хребтами.",
  },
  {
    image: "/images/tourism/hero-sughd.jpg",
    eyebrow: "Север Таджикистана",
    title: "Согдийская область",
    description:
      "Древние города, крепости и культурное наследие одного из самых исторически насыщенных регионов страны.",
  },
  {
    image: "/images/tourism/hero-fann.jpg",
    eyebrow: "Сердце горного Таджикистана",
    title: "Фанские горы",
    description:
      "Альпийские озёра, снежные вершины и маршруты для настоящего путешествия среди дикой природы.",
  },
] as const;

const treatmentDirections = [
  { title: "Протезирование зубов", icon: "/icons/tourism-treatment-1.svg?v=3" },
  { title: "Имплантация", icon: "/icons/tourism-treatment-2.svg?v=3" },
  {
    title: "Эстетическая стоматология",
    icon: "/icons/tourism-treatment-2.svg?v=3",
  },
  {
    title: "Лечение корневых каналов",
    icon: "/icons/tourism-treatment-4.svg?v=3",
  },
  { title: "Ортодонтия", icon: "/icons/tourism-treatment-5.svg?v=3" },
  {
    title: "Профессиональная гигиена и отбеливание",
    icon: "/icons/tourism-treatment-6.svg?v=3",
  },
] as const;

const treatmentDurations = [
  ["Отбеливание", "1 день"],
  ["Профессиональная гигиена", "1 день"],
  ["Лечение кариеса", "1–3 дня"],
  ["Виниры", "5–7 дней"],
  ["Коронки", "5–7 дней"],
  ["Имплантация", "Индивидуально"],
  ["All-on-4 / All-on-6", "Индивидуально"],
  ["Полная реабилитация", "Индивидуально"],
] as const;

const tourServices = [
  "Предварительная онлайн-консультация",
  "Анализ КТ или рентгена",
  "Предварительный план лечения",
  "Расчёт стоимости",
  "Планирование визитов",
  "Подбор отеля",
  "Трансфер из аэропорта",
  "Трансфер между отелем и клиникой",
  "Сопровождение координатора",
  "Языковая поддержка",
  "Стоматологическое лечение",
  "Рекомендации перед возвращением домой",
  "Дистанционная связь после лечения",
] as const;

const tourismFaq = [
  [
    "Нужно ли приезжать на консультацию до лечения?",
    "Нет. Предварительную консультацию можно пройти онлайн. Отправьте фотографии, КТ или панорамный снимок, если они у вас есть. Окончательный план утверждается после очной диагностики.",
  ],
  [
    "Можно ли узнать стоимость лечения до приезда?",
    "Да. После изучения медицинских материалов мы предоставим предварительный расчёт. Окончательная стоимость определяется после очной диагностики.",
  ],
  [
    "Сколько дней нужно провести в Душанбе?",
    "Это зависит от вида и объёма лечения. После изучения вашего случая мы составим индивидуальный график.",
  ],
  [
    "Помогаете ли вы с отелем и трансфером?",
    "Да. Мы можем помочь подобрать проживание и по предварительной договорённости организовать трансфер из аэропорта, между отелем и клиникой и обратно.",
  ],
  [
    "На каком языке можно общаться?",
    "Коммуникация доступна на русском, таджикском, английском и узбекском языках. При необходимости поможем организовать дополнительную языковую поддержку.",
  ],
  [
    "Что делать после возвращения домой?",
    "Свяжитесь с координатором Family Dent. Мы остаёмся на связи для дистанционной консультации и контроля состояния.",
  ],
  [
    "Как забронировать лечение?",
    "Оставьте заявку на сайте или напишите в WhatsApp. Координатор свяжется с вами и расскажет о следующих шагах.",
  ],
] as const;

function ConsultationForm({
  idPrefix = "consultation",
  onSubmitted,
  services = [],
}: {
  idPrefix?: string;
  onSubmitted?: () => void;
  services?: Service[];
}) {
  const generatedId = useId();
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "request-failed"
  >("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fieldId = (name: string) => `${idPrefix}-${generatedId}-${name}`;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form)) as Record<
      string,
      string
    >;
    const nextErrors: Record<string, string> = {};
    if (!values.name?.trim()) nextErrors.name = "Укажите имя.";
    if (!values.email?.trim()) nextErrors.email = "Укажите email.";
    else if (!/^\S+@\S+\.\S+$/.test(values.email.trim()))
      nextErrors.email = "Проверьте формат email.";
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
    if (!result.ok) {
      setStatus("request-failed");
      return;
    }
    setStatus("success");
    form.reset();
    onSubmitted?.();
  }

  return (
    <form onSubmit={submit} className="tourism-form" noValidate>
      <Field id={fieldId("name")} label="Ваше имя" error={errors.name} required>
        <Input
          name="name"
          autoComplete="name"
          placeholder="Как к вам обращаться"
        />
      </Field>
      <div className="tourism-form__row">
        <Field
          id={fieldId("email")}
          label="Email"
          error={errors.email}
          required
        >
          <Input
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="name@example.com"
          />
        </Field>
        <Field
          id={fieldId("phone")}
          label="Номер телефона"
          error={errors.phone}
          required
        >
          <Input
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+992 00 000 00 00"
          />
        </Field>
      </div>
      <div className="tourism-form__row">
        <Field id={fieldId("telegram")} label="Telegram" hint="Необязательно">
          <Input name="telegram" autoComplete="off" placeholder="@username" />
        </Field>
        <Field
          id={fieldId("country")}
          label="Страна"
          error={errors.country}
          required
        >
          <Input
            name="country"
            autoComplete="country-name"
            placeholder="Откуда вы"
          />
        </Field>
      </div>
      <Field
        id={fieldId("service")}
        label="Направление"
        error={errors.service}
        required
      >
        <Select name="service" defaultValue="">
          <option value="" disabled>
            Выберите услугу
          </option>
          {services.map((service) => (
            <option key={service.id} value={service.slug}>
              {service.title}
            </option>
          ))}
        </Select>
      </Field>
      <Field id={fieldId("message")} label="Комментарий" hint="Необязательно">
        <Textarea
          name="message"
          rows={3}
          placeholder="Коротко опишите ситуацию"
        />
      </Field>
      <Button variant="secondary" type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Отправляем…" : "Отправить запрос"}{" "}
        <ArrowRight aria-hidden="true" />
      </Button>
      <Text variant="caption" className="tourism-form__note">
        Нажимая кнопку, вы соглашаетесь на обработку данных.
      </Text>
      <div className="tourism-form__status" role="status" aria-live="polite">
        {status === "success" && (
          <>Запрос принят. Координатор Family Dent свяжется с вами.</>
        )}
        {status === "request-failed" && (
          <>
            Не удалось отправить запрос. Позвоните по номеру{" "}
            <a href="tel:+992446606600">+992 446 60 66 00</a>.
          </>
        )}
      </div>
    </form>
  );
}

function ConsultationDialog({
  open,
  onClose,
  services,
}: {
  open: boolean;
  onClose: () => void;
  services: Service[];
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className="tourism-dialog"
      onClose={onClose}
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="tourism-dialog__top">
        <div>
          <Text
            variant="overline"
            className="tourism-eyebrow tourism-eyebrow--dark"
          >
            Персональная консультация
          </Text>
          <RevealHeading level={2}>Расскажите о задаче</RevealHeading>
        </div>
        <IconButton onClick={onClose} aria-label="Закрыть форму">
          <X aria-hidden="true" />
        </IconButton>
      </div>
      <Text variant="body" className="tourism-dialog__intro">
        Координатор уточнит детали и поможет подготовить материалы для врача.
      </Text>
      <ConsultationForm idPrefix="dialog" services={services} />
    </dialog>
  );
}

export function TourismPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);
  const [services, setServices] = useState<Service[]>([]);
  const [comparison, setComparison] = useState<
    Awaited<ReturnType<typeof getTourismComparison>>
  >([]);
  const [packages, setPackages] = useState<
    Awaited<ReturnType<typeof getTourismPackages>>
  >([]);
  const [places, setPlaces] = useState<
    Awaited<ReturnType<typeof getTourismPlaces>>
  >([]);
  const [roadmap, setRoadmap] = useState<
    Awaited<ReturnType<typeof getTourismRoadmap>>
  >([]);
  const heroRef = useRef<HTMLElement>(null);
  const roadmapRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const { scrollYProgress: roadmapProgress } = useScroll({
    target: roadmapRef,
    offset: ["start 0.8", "end 0.45"],
  });
  const heroScale = useTransform(heroProgress, [0, 1], [1, 1.07]);
  const heroTextY = useTransform(heroProgress, [0, 1], [0, -64]);
  const lineScale = useTransform(roadmapProgress, [0, 1], [0, 1]);
  const activeSlide = heroSlides[activeHeroSlide];

  useEffect(() => {
    if (reduceMotion) return;
    const interval = window.setInterval(
      () => setActiveHeroSlide((current) => (current + 1) % heroSlides.length),
      6500,
    );
    return () => window.clearInterval(interval);
  }, [reduceMotion]);

  useEffect(() => {
    document.title = "Стоматологический туризм в Душанбе | Family Dent";
    void Promise.all([
      getServices(),
      getTourismComparison(),
      getTourismPackages(),
      getTourismPlaces(),
      getTourismRoadmap(),
    ]).then(
      ([
        nextServices,
        nextComparison,
        nextPackages,
        nextPlaces,
        nextRoadmap,
      ]) => {
        setServices(nextServices);
        setComparison(nextComparison);
        setPackages(nextPackages);
        setPlaces(nextPlaces);
        setRoadmap(nextRoadmap);
      },
    );
    const description =
      "Стоматологическое лечение в Family Dent в Душанбе: предварительная консультация, согласованный маршрут визитов и знакомство с Таджикистаном.";
    let meta = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]',
    );
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.append(meta);
    }
    meta.content = description;
  }, []);

  return (
    <div className="tourism-page">
      <section
        ref={heroRef}
        className="tourism-hero"
        aria-labelledby="tourism-title"
      >
        <AnimatePresence initial={false} mode="sync">
          <motion.img
            key={activeSlide.image}
            className="tourism-hero__slide"
            style={reduceMotion ? undefined : { scale: heroScale }}
            src={activeSlide.image}
            width="1536"
            height="1024"
            fetchPriority={activeHeroSlide === 0 ? "high" : "auto"}
            alt=""
            initial={reduceMotion ? false : { opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: 1.1 },
              scale: { duration: 6.5, ease: "linear" },
            }}
          />
        </AnimatePresence>
        <div className="tourism-hero__overlay" />
        <motion.div
          style={reduceMotion ? undefined : { y: heroTextY }}
          className="tourism-hero__content"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeHeroSlide}
              initial={reduceMotion ? false : { opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            >
              <Text variant="overline" className="tourism-eyebrow">
                {activeSlide.eyebrow}
              </Text>
              <Heading level={1} id="tourism-title">
                {activeSlide.title}
              </Heading>
              <div className="tourism-hero__support">
                <Text variant="body">{activeSlide.description}</Text>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </section>

      <section
        id="intro"
        className="tourism-borderless"
        aria-labelledby="borderless-title"
      >
        <div className="tourism-shell tourism-borderless__inner">
          <Reveal className="tourism-borderless__heading">
            <Text variant="overline" className="tourism-eyebrow">
              Стоматология без границ
            </Text>
            <Heading level={2} id="borderless-title">
              <span>Лечение продумано.</span>
              <br />
              Путешествие — тоже.
            </Heading>
            <Text variant="body">
              Family Dent помогает собрать визит в Душанбе в понятный маршрут:
              от первого сообщения и подготовки снимков до очной диагностики и
              связи после приёма.
            </Text>
          </Reveal>

          <div className="tourism-borderless__grid">
            <Reveal className="tourism-borderless__photo">
              <img
                src="/images/clinic-exterior-poster.png"
                width="1536"
                height="882"
                loading="lazy"
                alt="Клиника Family Dent в центре Душанбе"
              />
              <div>
                <span>Вас сопровождает</span>
                <strong>
                  Персональный
                  <br />
                  координатор
                </strong>
              </div>
            </Reveal>

            <Reveal
              className="tourism-borderless__card tourism-borderless__card--route"
              delay={0.06}
            >
              <Route aria-hidden="true" />
              <div>
                <span>План поездки</span>
                <strong>Согласуем визиты с вашим маршрутом</strong>
              </div>
            </Reveal>

            <Reveal
              className="tourism-borderless__card tourism-borderless__card--support"
              delay={0.1}
            >
              <ClipboardCheck aria-hidden="true" />
              <div>
                <span>До и после приёма</span>
                <strong>Остаёмся на связи по плану лечения</strong>
              </div>
            </Reveal>

            <Reveal
              className="tourism-borderless__card tourism-borderless__card--clinic"
              delay={0.14}
            >
              <CalendarCheck aria-hidden="true" />
              <div>
                <span>Family Dent</span>
                <strong>
                  Работаем в Душанбе
                  <br />с 2018 года
                </strong>
                <small>Два адреса в столице</small>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="tourism-services" aria-labelledby="services-title">
        <div className="tourism-shell tourism-services__inner">
          <div className="tourism-services__intro">
            <Text
              variant="overline"
              className="tourism-eyebrow tourism-eyebrow--dark"
            >
              Направления лечения
            </Text>
            <RevealHeading level={2} id="services-title">
              Рекомендуемые процедуры
            </RevealHeading>
            <Text variant="body">
              От эстетической до функциональной стоматологии — подберём решение
              после диагностики и составим понятный план лечения.
            </Text>
          </div>
          <div className="tourism-services__list">
            {treatmentDirections.map((item) => (
              <div key={item.title} className="tourism-service">
                <span
                  className="tourism-service__icon"
                  style={
                    {
                      "--tourism-service-icon": `url("${item.icon}")`,
                    } as React.CSSProperties
                  }
                  aria-hidden="true"
                />
                <RevealHeading level={3}>{item.title}</RevealHeading>
                <button
                  type="button"
                  onClick={() => setDialogOpen(true)}
                  aria-label={`Обсудить направление: ${item.title}`}
                >
                  <ArrowRight />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="tourism-comparison"
        aria-labelledby="comparison-title"
      >
        <div className="tourism-shell">
          <div className="tourism-comparison__head">
            <div>
              <Text variant="overline" className="tourism-eyebrow">
                Ориентир по стоимости
              </Text>
              <RevealHeading level={2} id="comparison-title">
                Сравните —<br />и считайте всю поездку.
              </RevealHeading>
            </div>
            <Text variant="body">
              Диапазоны из презентации Family Dent показывают порядок цен в
              долларах США. Это не публичная оферта: точная стоимость зависит от
              диагноза, материалов и плана врача.
            </Text>
          </div>
          <div
            className="tourism-comparison__scroller"
            tabIndex={0}
            aria-label="Прокручиваемая таблица сравнения цен"
          >
            <table>
              <thead>
                <tr>
                  <th scope="col">Услуга</th>
                  <th scope="col" className="is-featured">
                    Таджикистан
                  </th>
                  <th scope="col">Россия</th>
                  <th scope="col">Казахстан</th>
                  <th scope="col">Европа</th>
                  <th scope="col">США</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row) => (
                  <tr key={row.service}>
                    <th scope="row">{row.service}</th>
                    <td className="is-featured">{row.tajikistan}</td>
                    <td>{row.russia}</td>
                    <td>{row.kazakhstan}</td>
                    <td>{row.europe}</td>
                    <td>{row.usa}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Text variant="caption" className="tourism-comparison__note">
            Цены ориентировочные и приведены для сравнения. Финальную смету врач
            формирует после диагностики.
          </Text>
        </div>
      </section>

      <section className="tourism-packages" aria-labelledby="packages-title">
        <div className="tourism-shell">
          <div className="tourism-packages__head">
            <Text
              variant="overline"
              className="tourism-eyebrow tourism-eyebrow--dark"
            >
              Готовые форматы поездки
            </Text>
            <div>
              <RevealHeading level={2} id="packages-title">
                Выберите ритм.
                <br />
                Маршрут уточним вместе.
              </RevealHeading>
              <Text variant="body">
                Пакет задаёт длительность и логику поездки, но не заменяет
                медицинский план.
              </Text>
            </div>
          </div>
          <div className="tourism-local-options">
            <Text variant="body">Если вы уже в Таджикистане</Text>
            <ul>
              <li>Консультация + диагностика</li>
              <li>Диагностика + профессиональная чистка</li>
              <li>Диагностика + чистка + лечение кариеса</li>
            </ul>
          </div>
          <div className="tourism-packages__list">
            {packages.map((item, index) => (
              <Reveal
                key={item.number}
                className="tourism-package"
                delay={index * 0.06}
              >
                <img
                  className="tourism-package__background"
                  src={item.image}
                  width="991"
                  height="661"
                  loading="lazy"
                  alt={item.imageAlt}
                />
                <span className="tourism-package__scrim" aria-hidden="true" />
                <span className="tourism-package__number">{item.number}</span>
                <div>
                  <Text variant="body">{item.audience}</Text>
                  <Heading level={3}>{item.name}</Heading>
                </div>
                <strong>{item.duration}</strong>
                <Text variant="body" className="tourism-package__description">
                  {item.description}
                </Text>
                <button
                  type="button"
                  onClick={() => setDialogOpen(true)}
                  aria-label={`Обсудить пакет ${item.name}`}
                >
                  <ArrowRight />
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section
        ref={roadmapRef}
        className="tourism-roadmap"
        aria-labelledby="roadmap-title"
      >
        <div className="tourism-shell">
          <div className="tourism-roadmap__head">
            <Text
              variant="overline"
              className="tourism-eyebrow tourism-eyebrow--dark"
            >
              Как это работает
            </Text>
            <RevealHeading level={2} variant="display" id="roadmap-title">
              От сообщения
              <br />
              до Душанбе
            </RevealHeading>
          </div>
          <div className="tourism-roadmap__track">
            <div className="tourism-roadmap__line">
              <motion.span
                style={reduceMotion ? { scaleX: 1 } : { scaleX: lineScale }}
              />
            </div>
            {roadmap.map((step) => (
              <article key={step.number}>
                <span className="tourism-roadmap__number">{step.number}</span>
                <RevealHeading level={3}>{step.title}</RevealHeading>
                <Text variant="body">{step.description}</Text>
              </article>
            ))}
          </div>
          <Text variant="caption" className="tourism-roadmap__disclaimer">
            Окончательный план, объём и сроки лечения определяет врач после
            очной диагностики.
          </Text>
        </div>
      </section>

      <section className="tourism-visit" aria-labelledby="visit-title">
        <div className="tourism-shell tourism-visit__inner">
          <div>
            <Text variant="overline" className="tourism-eyebrow">
              Визит без неопределённости
            </Text>
            <RevealHeading level={2} id="visit-title">
              До. Во время. После.
            </RevealHeading>
          </div>
          <div className="tourism-visit__steps">
            <Reveal>
              <span>До визита</span>
              <Text variant="body">
                Собираем доступные снимки и уточняем медицинскую задачу.
              </Text>
            </Reveal>
            <Reveal delay={0.07}>
              <span>В Душанбе</span>
              <Text variant="body">
                Проводим очную диагностику и согласуем дальнейшие действия.
              </Text>
            </Reveal>
            <Reveal delay={0.14}>
              <span>После визита</span>
              <Text variant="body">
                Остаёмся на связи для дистанционной консультации, контроля
                состояния и передачи рекомендаций.
              </Text>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="tourism-details" aria-labelledby="duration-title">
        <div className="tourism-shell">
          <div className="tourism-details__head">
            <Text
              variant="overline"
              className="tourism-eyebrow tourism-eyebrow--dark"
            >
              Планирование поездки
            </Text>
            <RevealHeading level={2} id="duration-title">
              Сколько дней нужно находиться в Душанбе
            </RevealHeading>
            <Text variant="body">
              Продолжительность зависит от диагноза, объёма работ и выбранного
              метода. Точный график составляется после изучения вашей ситуации.
            </Text>
          </div>
          <div className="tourism-details__table">
            {treatmentDurations.map(([name, duration]) => (
              <div key={name}>
                <span>{name}</span>
                <strong>{duration}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="tourism-support" aria-labelledby="support-title">
        <div className="tourism-shell tourism-support__layout">
          <div>
            <Text variant="overline" className="tourism-eyebrow">
              Организация тура
            </Text>
            <RevealHeading level={2} id="support-title">
              Что может организовать Family Dent
            </RevealHeading>
            <Text variant="body">
              Условия включения дополнительных услуг согласовываются
              индивидуально.
            </Text>
          </div>
          <ul>
            {tourServices.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="tourism-language" aria-labelledby="language-title">
        <div className="tourism-shell tourism-language__layout">
          <div>
            <Text
              variant="overline"
              className="tourism-eyebrow tourism-eyebrow--dark"
            >
              Языковая поддержка
            </Text>
            <RevealHeading level={2} id="language-title">
              Мы говорим на вашем языке
            </RevealHeading>
            <Text variant="body">
              Для нас важно, чтобы пациент понимал каждый этап лечения.
            </Text>
          </div>
          <ul>
            <li>Русский</li>
            <li>Таджикский</li>
            <li>Английский</li>
            <li>Узбекский</li>
          </ul>
        </div>
      </section>

      <section className="tourism-faq" aria-labelledby="tourism-faq-title">
        <div className="tourism-shell">
          <Text
            variant="overline"
            className="tourism-eyebrow tourism-eyebrow--dark"
          >
            Ответы перед поездкой
          </Text>
          <RevealHeading level={2} id="tourism-faq-title">
            Часто задаваемые вопросы
          </RevealHeading>
          <div className="tourism-faq__list">
            {tourismFaq.map(([question, answer]) => (
              <details key={question}>
                <summary>
                  {question}
                  <span aria-hidden="true">+</span>
                </summary>
                <Text variant="body">{answer}</Text>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section
        className="tourism-manifesto"
        aria-label="FamilyDent и Таджикистан"
      >
        <div className="tourism-manifesto__panel">
          <img
            src="/images/family-dent-2-reception.jpg"
            width="4000"
            height="6000"
            loading="lazy"
            alt="Зона ожидания Family Dent 2 в Душанбе"
          />
          <strong>FamilyDent</strong>
        </div>
        <div className="tourism-manifesto__panel">
          <img
            src="/images/tourism/fann-mountains.png"
            width="1024"
            height="1280"
            loading="lazy"
            alt="Горы Таджикистана"
          />
          <strong>Tajikistan</strong>
        </div>
        <div className="tourism-manifesto__center">
          Точность
          <br />в лечении.
          <br />
          <em>Свобода</em> в пути.
        </div>
      </section>

      <section className="tourism-places" aria-labelledby="places-title">
        <div className="tourism-shell tourism-places__heading">
          <Text
            variant="overline"
            className="tourism-eyebrow tourism-eyebrow--dark"
          >
            Между визитами
          </Text>
          <RevealHeading level={2} id="places-title">
            10 мест, ради которых стоит увидеть Таджикистан
          </RevealHeading>
        </div>
        <div className="tourism-places__grid">
          {places.map((place, index) => (
            <Reveal
              key={place.name}
              className={`tourism-place ${place.className}`}
              delay={Math.min(index * 0.04, 0.2)}
            >
              <img
                src={place.image}
                width="1200"
                height="900"
                loading="lazy"
                alt={`${place.name} — ${place.meta}`}
              />
              <div>
                <span>{place.meta}</span>
                <Heading level={3}>{place.name}</Heading>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="tourism-cinematic" aria-label="Пейзаж Памира">
        <img
          src="/images/tourism/pamir-road.png"
          width="1536"
          height="1024"
          loading="lazy"
          alt="Дорога через горы Памира"
        />
        <div>
          <Text variant="display">Сменить привычный горизонт</Text>
        </div>
      </section>

      <section
        className="tourism-conversion"
        aria-labelledby="consultation-title"
      >
        <div className="tourism-shell tourism-conversion__inner">
          <Reveal className="tourism-conversion__copy">
            <Text variant="overline" className="tourism-eyebrow">
              Следующий шаг
            </Text>
            <Heading level={2} id="consultation-title">
              Начните с разговора, а не с билета.
            </Heading>
            <Text variant="body">
              Расскажите о задаче. Координатор поможет подготовить материалы для
              врача и обсудить дальнейший маршрут.
            </Text>
            <Text variant="overline" className="tourism-coordinator">
              WhatsApp · Telegram · Телефон
              <br />
              <a href="tel:+992988770009">+992 98 877 0009</a>
            </Text>
          </Reveal>
          <Reveal className="tourism-conversion__form" delay={0.08}>
            <ConsultationForm idPrefix="section" services={services} />
          </Reveal>
        </div>
      </section>

      <ConsultationDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        services={services}
      />
    </div>
  );
}
