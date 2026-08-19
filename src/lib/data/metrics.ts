export interface ClinicMetric {
  id: string;
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  description?: string;
}

export const clinicMetrics = [
  {
    id: "experience",
    value: 8,
    suffix: "+",
    label: "Лет работы клиники",
    description: "Стабильный опыт и доверие пациентов",
  },
  {
    id: "expert-experience",
    value: 30,
    suffix: "+",
    label: "Лет опыта у ведущего врача",
    description: "Многолетняя практическая экспертиза",
  },
  {
    id: "satisfaction",
    value: 97,
    suffix: "%",
    label: "Довольных пациентов",
    description: "Пациенты, довольные качеством лечения и сервиса",
  },
  {
    id: "doctors",
    value: 20,
    suffix: "+",
    label: "Сертифицированных специалистов",
    description: "Команда экспертов с высоким уровнем подготовки",
  },
] satisfies readonly ClinicMetric[];

export async function getClinicMetrics(): Promise<ClinicMetric[]> {
  return Promise.resolve([...clinicMetrics]);
}
