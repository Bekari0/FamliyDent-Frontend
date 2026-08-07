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
    value: 15,
    suffix: "+",
    label: "Лет опыта",
    description: "Международные стандарты качества",
  },
  {
    id: "satisfaction",
    value: 98,
    suffix: "%",
    label: "Уровень удовлетворенности",
    description: "Доверие и высокие оценки пациентов",
  },
  {
    id: "smiles",
    value: 5000,
    suffix: "+",
    label: "Улыбок преображено",
    description: "Успешно проведенное лечение",
  },
  {
    id: "doctors",
    value: 17,
    label: "Сертифицированных экспертов",
    description: "Врачи высшей категории",
  },
] satisfies readonly ClinicMetric[];

export async function getClinicMetrics(): Promise<ClinicMetric[]> {
  return Promise.resolve([...clinicMetrics]);
}
