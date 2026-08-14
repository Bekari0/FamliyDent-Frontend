export interface ClinicMetric {
  id: string;
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  description?: string;
}

export interface TreatmentCase {
  id: string;
  slug: string;
  title: string;
  category: 'veneers' | 'braces' | 'implantation' | 'restoration' | 'orthodontics';
  shortDescription: string;
  beforeImage: string;
  afterImage: string;
  disclaimer: string;
}
