'use client';

import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import * as styles from './Services.styles';

const SERVICES = [
  {
    title: 'Ортодонтия',
    icon: '/icons/icon-orthodontics.svg',
    text: 'Исправляем прикус и положение зубов с помощью брекетов и элайнеров. Перед началом лечения проводим цифровую диагностику, показываем прогноз и вместе выбираем комфортный путь к ровной улыбке.',
  },
  {
    title: 'Детская стоматология',
    icon: '/icons/icon-pediatric.svg',
    text: 'Знакомим ребёнка с лечением спокойно и без давления. Врач объясняет каждый шаг понятными словами, помогает сформировать полезные привычки и сохраняет доверие к стоматологии.',
  },
  {
    title: 'Эстетика улыбки',
    icon: '/icons/icon-aesthetic.svg',
    text: 'Восстанавливаем форму и естественный оттенок зубов с помощью реставраций, отбеливания и персонального дизайна улыбки. Результат планируем заранее и сохраняем естественные черты лица.',
  },
  {
    title: 'Имплантация',
    icon: '/icons/icon-implantation.svg',
    text: 'Восстанавливаем отсутствующие зубы на имплантах с точным цифровым планированием. Контролируем каждый этап — от диагностики и установки до постоянной коронки и профилактических осмотров.',
  },
  {
    title: 'Протезирование',
    icon: '/icons/icon-prosthetics.svg',
    text: 'Создаём коронки, виниры и другие конструкции, которые возвращают удобство при жевании и выглядят естественно. Учитываем прикус, форму лица и индивидуальные пожелания пациента.',
  },
  {
    title: 'Хирургия',
    icon: '/icons/icon-surgery.svg',
    text: 'Хирургическое направление закрывает задачи, которые требуют точности и спокойного сопровождения пациента. Это удаление зубов, зубосохраняющие процедуры, подготовка к имплантации и работа с костной тканью с понятными рекомендациями до и после визита.',
  },
];

export function Services() {
  const [activeIndex, setActiveIndex] = useState(SERVICES.length - 1);
  const reduceMotion = useReducedMotion();
  const activeService = SERVICES[activeIndex];

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex = index;
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % SERVICES.length;
    else if (event.key === 'ArrowLeft') nextIndex = (index - 1 + SERVICES.length) % SERVICES.length;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = SERVICES.length - 1;
    else return;

    event.preventDefault();
    setActiveIndex(nextIndex);
    document.getElementById(`service-tab-${nextIndex}`)?.focus();
  };

  return (
    <section id="services" className={styles.section} aria-labelledby="services-title">
      <div className={styles.container}>
        <h2 id="services-title" className={styles.title}>Направления<br />лечения</h2>

        <div className={styles.tabs} role="tablist" aria-label="Направления лечения">
          {SERVICES.map((service, index) => {
            const isActive = activeIndex === index;
            return (
              <button
                key={service.title}
                id={`service-tab-${index}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls="service-panel"
                tabIndex={isActive ? 0 : -1}
                className={isActive ? styles.tabActive : styles.tab}
                onClick={() => setActiveIndex(index)}
                onKeyDown={(event) => handleKeyDown(event, index)}
              >
                <span className={styles.iconCircle}>
                  <img src={service.icon} alt="" aria-hidden="true" className={styles.tabIcon} />
                </span>
                <span className={styles.tabLabel}>{service.title}</span>
              </button>
            );
          })}
        </div>

        <div id="service-panel" role="tabpanel" aria-labelledby={`service-tab-${activeIndex}`} className={styles.detail}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeService.title}
              className={styles.detailCopy}
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -12 }}
              transition={{ duration: reduceMotion ? 0 : 0.28, ease: 'easeOut' }}
            >
              <h3 className={styles.detailTitle}>{activeService.title}</h3>
              <p className={styles.detailText}>{activeService.text}</p>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`${activeService.title}-icon`}
              className={styles.detailVisual}
              initial={reduceMotion ? false : { opacity: 0, scale: 0.82, rotate: -4 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, scale: 0.9, rotate: 4 }}
              transition={{ duration: reduceMotion ? 0 : 0.38, ease: [0.22, 1, 0.36, 1] }}
            >
              <img src={activeService.icon} alt="" aria-hidden="true" className={styles.detailIcon} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
