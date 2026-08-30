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
    id: "patients",
    value: 10000,
    suffix: "+",
    label: "Довольных пациентов",
    description: "Пациенты, доверившие нам здоровье своей улыбки",
  },
  {
    id: "implants",
    value: 5000,
    prefix: "Более ",
    label: "Установленных имплантов",
    description: "Практический опыт команды Family Dent",
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
