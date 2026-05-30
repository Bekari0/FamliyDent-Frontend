import { Booking, Service } from '../types';

export function checkBookingConflict(
 newDate: string,
 newTime: string,
 doctorId: string,
 existingBookings: Booking[]
): boolean {
 return existingBookings.some(b =>
 b.doctorId === doctorId &&
 b.date === newDate &&
 b.time === newTime &&
 b.status !== 'cancelled'
 );
}

export function calculateLoyaltyDiscount(_patientBookings: Booking[]): number {
 return 0;
}

export function smartContentFilter<T>(query: string, items: T[], fields: (keyof T)[]): T[] {
 if (!query) return items;
 const q = query.toLowerCase();

 return items
 .map(item => {
 let score = 0;
 fields.forEach(field => {
 const val = String(item[field]).toLowerCase();
 if (val.startsWith(q)) score += 10;
 else if (val.includes(q)) score += 5;
 });
 return { item, score };
 })
 .filter(res => res.score > 0)
 .sort((a, b) => b.score - a.score)
 .map(res => res.item);
}

export function formatDataForExport(bookings: Booking[]): string {
 const header = 'ORDER_ID;DATE;STATUS;REVENUE\n';
 const rows = bookings.map(b =>
 `${b.id};${b.date};${b.status.toUpperCase()};${Math.floor(Math.random() * 1000)}`
 ).join('\n');
 return header + rows;
}

export function aggregateAnalytics(bookings: Booking[], services: Service[]) {
 const stats: Record<string, number> = {};

 bookings.forEach(b => {
 const service = services.find(s => s.id === b.serviceId);
 if (!service) return;

 if (!stats[service.category]) stats[service.category] = 0;
 stats[service.category] += service.price;
 });

 return Object.entries(stats).map(([category, revenue]) => ({ category, revenue }));
}
