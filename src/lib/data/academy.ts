import type { AcademyProgram } from "./types";

/* Mock data for Family Dent Academy directions */
const academyProgramsData: AcademyProgram[] = [
  {
    id: "ap-phantoms",
    title: "Практические интенсивы на фантомах",
    description: "Отработка навыков препарирования под микроскопом, изоляции коффердамом и эстетической реставрации на симуляторах."
  },
  {
    id: "ap-masterclasses",
    title: "Мастер-классы и лекции",
    description: "Семинары от лекторов международного уровня по эндодонтии, гнатологии и цифровой протокольной ортопедии."
  },
  {
    id: "ap-cases",
    title: "Разбор сложных клинических случаев",
    description: "Интерактивные консилиумы с детальным анализом реальных снимков, ошибок и алгоритмов решения нестандартных задач."
  },
  {
    id: "ap-communication",
    title: "Курсы по коммуникации с пациентами",
    description: "Психология доверительного диалога, презентация комплексных планов лечения и работа со страхами пациентов."
  },
  {
    id: "ap-protocols",
    title: "Современные протоколы лечения",
    description: "Обучение международным медицинским стандартам, работе с современными материалами и цифренным сканерам."
  }
];

export async function getAcademyPrograms(): Promise<AcademyProgram[]> {
  return [...academyProgramsData];
}
