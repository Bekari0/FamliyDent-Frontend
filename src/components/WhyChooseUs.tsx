import { motion } from 'motion/react';
import * as styles from './WhyChooseUs.styles';

const REASONS = [
  {
    title: 'Современное оборудование',
    description: 'Цифровые сканеры, дентальные микроскопы и лазерные технологии — для точной диагностики и лечения.',
  },
  {
    title: 'Безболезненное лечение',
    description: 'Современные методы анестезии и седации: лечение проходит спокойно даже для тревожных пациентов.',
  },
  {
    title: 'Опытные специалисты',
    description: 'Врачи регулярно проходят стажировки в клиниках Европы и России и подтверждают квалификацию.',
  },
  {
    title: 'Честные цены',
    description: 'План лечения и стоимость фиксируются до начала работы — без скрытых доплат.',
  },
  {
    title: 'Гарантия на все работы',
    description: 'Официальная гарантия на все виды стоматологических работ, закреплённая в договоре.',
  },
];

export function WhyChooseUs() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.layout}>
          <div className={styles.imageCol}>
            <img
              src="/images/clinic-room.png"
              alt="Кабинет клиники FamilyDent: современное кресло и оборудование"
              className={styles.image}
              loading="lazy"
            />
          </div>

          <div className={styles.contentCol}>
            <p className={styles.kicker}>
              <span className={styles.kickerLine} aria-hidden="true" />
              Почему FamilyDent
            </p>
            <h2 className={styles.title}>
              Клиника, где технологии встречаются с заботой о пациенте
            </h2>
            <p className={styles.desc}>
              Мы построили FamilyDent как клинику для всей семьи: от первой детской
              чистки до сложного протезирования — в одном месте и у врачей, которым доверяют.
            </p>

            <div className={styles.list}>
              {REASONS.map((reason, index) => (
                <motion.div
                  key={reason.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                  className={styles.listItem}
                >
                  <span className={styles.listNumber}>{String(index + 1).padStart(2, '0')}</span>
                  <div>
                    <h3 className={styles.listTitle}>{reason.title}</h3>
                    <p className={styles.listDesc}>{reason.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
