import type { TeamMember, TeamCategory } from "./types";
import { getDoctors } from "./doctors";

/* Mock data for non-doctor Family Dent staff */
const staffData: TeamMember[] = [
  // Nurses (Медсёстры)
  {
    id: "nurse-1",
    slug: "zarina-yusupova",
    name: "Зарина Юсупова",
    category: "nurses",
    position: "Старшая медицинская сестра",
    shortBio: "Обеспечивает строгое соблюдение асептики, антисептики и высочайшие стандарты стерилизационного режима.",
    image: "https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=800",
    experienceYears: 10,
    specialties: ["Стерилизация и асептика", "Ассистирование при хирургах"]
  },
  {
    id: "nurse-2",
    slug: "shahnoza-aliyan",
    name: "Шахноза Алиева",
    category: "nurses",
    position: "Медицинская сестра ассистент",
    shortBio: "Заботливое ассистирование в четыре руки при сложных терапевтических и детских приемах.",
    image: "https://images.pexels.com/photos/3714743/pexels-photo-3714743.jpeg?auto=compress&cs=tinysrgb&w=800",
    experienceYears: 6
  },

  // Administrators (Администраторы)
  {
    id: "admin-1",
    slug: "dilnoza-safari",
    name: "Дильноза Сафарова",
    category: "administrators",
    position: "Старший администратор клиники",
    shortBio: "Встречает пациентов с улыбкой, координирует графики приемов и помогает оформить все документы.",
    image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=800",
    experienceYears: 7
  },
  {
    id: "admin-2",
    slug: "tahmina-nur",
    name: "Тахмина Нурова",
    category: "administrators",
    position: "Администратор службы заботы",
    shortBio: "На связи с пациентами 24/7, помогает с консультациями по записи и туристическому сервису.",
    image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=800",
    experienceYears: 5
  },

  // Management (Руководство)
  {
    id: "mgmt-1",
    slug: "farhod-rahimov",
    name: "Фарход Рахимов",
    category: "management",
    position: "Генеральный директор Family Dent",
    shortBio: "Развивает стандарты сервиса, технологическое оснащение и международное сотрудничество клиники.",
    image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=800",
    experienceYears: 15
  },
  {
    id: "mgmt-2",
    slug: "sevara-sodiki",
    name: "Севара Содикова",
    category: "management",
    position: "Исполнительный директор",
    shortBio: "Отвечает за бесперебойную работу всех подразделений и высокое качество обслуживания клиентов.",
    image: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=800",
    experienceYears: 12
  },

  // Technical (Техническая и хозяйственная служба)
  {
    id: "tech-1",
    slug: "firdavs-ikromov",
    name: "Фирдавс Икромов",
    category: "technical",
    position: "Главный инженер медицинского оборудования",
    shortBio: "Отвечает за идеальную калибровку КТ, микроскопов, сканеров и бесперебойную работу инженерных систем.",
    image: "https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=800",
    experienceYears: 9
  },
  {
    id: "tech-2",
    slug: "bakhtiyor-nodiri",
    name: "Бахтиёр Нодири",
    category: "technical",
    position: "Руководитель хозяйственной службы",
    shortBio: "Поддерживает безупречную чистоту, уют и экологическую безопасность пространств клиники.",
    image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=800",
    experienceYears: 11
  }
];

export async function getTeamMembers(): Promise<TeamMember[]> {
  const doctors = await getDoctors();
  const doctorMembers: TeamMember[] = doctors.map((doc) => ({
    id: doc.id,
    slug: doc.slug,
    name: doc.name,
    category: "doctors",
    position: doc.specialty,
    shortBio: doc.bio[0],
    image: doc.image ?? "/images/clinic_about.jpg",
    experienceYears: doc.experienceYears,
    specialties: doc.specialties,
    education: doc.education
  }));

  return [...doctorMembers, ...staffData];
}

export async function getTeamMembersByCategory(category: TeamCategory): Promise<TeamMember[]> {
  const all = await getTeamMembers();
  return all.filter((member) => member.category === category);
}
