// backend/services/contextService.ts
import { Doctor } from '../models/Doctor';
import { Service } from '../models/Service';

export class ContextService {
 private clinics = [
 {
 name: 'Главный филиал',
 address: 'г. Душанбе, ул. Айни, д. 45',
 landmark: 'Дома Бостон',
 phone: '+992 44 651 66 00',
 hours: 'Пн-Сб 7:30-19:00'
 },
 {
 name: 'Филиал на Негмата Карабаева',
 address: 'г. Душанбе, ул. Негмата Карабаева, д. 42',
 landmark: ' ул. Негмата Карабаева, д. 29',
 phone: '+992 44 651 66 00',
 hours: 'Пн-Сб 08:00-17:00'
 }
 ];

 async getDoctorsInfo(): Promise<string> {
 const doctors = await Doctor.find();
 if (!doctors.length) return 'Информация о врачах временно недоступна.';
 
 let info = 'Наши врачи:\n';
 doctors.forEach((d: any) => {
 info += `• ${d.name} - ${d.specialty}`;
 if (d.experience) info += `, стаж ${d.experience} лет`;
 info += '\n';
 });
 return info;
 }

 async getServicesInfo(): Promise<string> {
 const services = await Service.find();
 if (!services.length) return 'Информация об услугах временно недоступна.';
 
 let info = 'Наши услуги:\n';
 services.forEach((cat: any) => {
 info += `\n${cat.category}:\n`;
 cat.services.forEach((s: string) => {
 info += ` • ${s}\n`;
 });
 });
 return info;
 }

 getClinicsInfo(): string {
 let info = 'Наши филиалы:\n';
 this.clinics.forEach((c, i) => {
 info += `\n${i + 1}. ${c.name}\n`;
 info += ` Адрес: ${c.address}\n`;
 info += ` Ориентир: ${c.landmark}\n`;
 info += ` Телефон: ${c.phone}\n`;
 info += ` Часы: ${c.hours}\n`;
 });
 return info;
 }

 async getContextByQuestion(question: string): Promise<string> {
 const lower = question.toLowerCase();
 let context = '';

 const wantsDoctors =
 lower.includes('врач') ||
 lower.includes('доктор') ||
 lower.includes('специалист');

 const wantsServices =
 lower.includes('услуг') ||
 lower.includes('услуга') ||
 lower.includes('цена') ||
 lower.includes('стоимость') ||
 lower.includes('прайс');

 const wantsClinics =
 lower.includes('адрес') ||
 lower.includes('филиал') ||
 lower.includes('филиалы') ||
 lower.includes('где находится') ||
 lower.includes('локация') ||
 lower.includes('как добраться');

 const wantsContacts =
 lower.includes('номер') ||
 lower.includes('телефон') ||
 lower.includes('позвонить') ||
 lower.includes('контакт') ||
 lower.includes('связаться');

 if (wantsDoctors) {
 context += await this.getDoctorsInfo();
 }

 if (wantsServices) {
 context += '\n\n' + await this.getServicesInfo();
 }

 if (wantsClinics || wantsContacts) {
 context += '\n\n' + this.getClinicsInfo();
 }

 return context.trim() || 'Общая информация о стоматологической клинике FamilyDent.';
}

}
