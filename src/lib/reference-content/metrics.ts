import type { ClinicMetric } from './types';

export const clinicMetrics: readonly ClinicMetric[] = [
  { id: 'experience', value: 8, suffix: '+', label: 'Лет работы клиники', description: 'Стабильный опыт и доверие пациентов' },
  { id: 'expert-experience', value: 30, suffix: '+', label: 'Лет опыта у ведущего врача', description: 'Многолетняя практическая экспертиза' },
  { id: 'smiles', value: 5000, suffix: '+', label: 'Улыбок преображено', description: 'Успешно проведённое лечение' },
  { id: 'doctors', value: 20, suffix: '+', label: 'Сертифицированных специалистов', description: 'Команда экспертов высокого уровня' },
];
