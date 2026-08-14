import type { TreatmentCase } from './types';

const disclaimer = 'Результат лечения индивидуален и зависит от клинической ситуации.';

export const treatmentCases = [
  {
    id: 'case-veneers-1',
    slug: 'estetika-ulibki-vinirami',
    title: 'Преображение улыбки керамическими винирами E.max',
    category: 'veneers',
    shortDescription: 'Коррекция формы, пропорций и цвета верхних зубов керамическими винирами.',
    beforeImage: 'https://images.pexels.com/photos/6627532/pexels-photo-6627532.jpeg?auto=compress&cs=tinysrgb&w=800',
    afterImage: 'https://images.pexels.com/photos/3762453/pexels-photo-3762453.jpeg?auto=compress&cs=tinysrgb&w=800',
    disclaimer,
  },
  {
    id: 'case-braces-1',
    slug: 'ispravlenie-prikusa-breketami',
    title: 'Исправление скученности и глубокого прикуса',
    category: 'braces',
    shortDescription: 'Лечение самолигирующей брекет-системой без удаления здоровых зубов.',
    beforeImage: 'https://images.pexels.com/photos/6812561/pexels-photo-6812561.jpeg?auto=compress&cs=tinysrgb&w=800',
    afterImage: 'https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&w=800',
    disclaimer,
  },
] satisfies readonly TreatmentCase[];
