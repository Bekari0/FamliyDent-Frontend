import { Router } from 'express';
import { Booking } from '../models/Booking';
import { User } from '../models/User';
import { Doctor } from '../models/Doctor';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

async function enrichBookings(bookings: any[]) {
 const patientIds = [...new Set(bookings.map(b => b.patientId?.toString()).filter(Boolean))];
 const patients = await (User as any).find({ $or: [{ _id: { $in: patientIds } }, { uid: { $in: patientIds } }] }).select('displayName email phoneNumber photoURL birthDate gender uid');
 
 const patientMap: Record<string, any> = {};
 patients.forEach((p: any) => {
 if (p._id) patientMap[p._id.toString()] = p;
 if (p.uid) patientMap[p.uid] = p;
 });

 return bookings.map(b => {
 const bJson = b.toJSON ? b.toJSON() : b;
 const pId = b.patientId?.toString();
 const patient = patientMap[pId];
 return {
 ...bJson,
 patientName: patient?.displayName || 'Пациент',
 patientInfo: patient || {}
 };
 });
}

// Получаем все возможные идентификаторы врача
async function getDoctorIdentifiers(user: any) {
 const ids = new Set<string>();
 
 // Добавляем собственные идентификаторы пользователя
 if (user._id) ids.add(user._id.toString());
 if (user.uid) ids.add(user.uid);
 if (user.doctorId) ids.add(user.doctorId);
 
 // Ищем профиль врача, связанный с пользователем
 const doctors = await (Doctor as any).find({ 
 $or: [
 { userId: user._id }, 
 { userId: user.uid },
 { email: user.email }
 ] 
 });
 
 doctors.forEach((d: any) => {
 ids.add(d._id.toString());
 });
 
 return Array.from(ids);
}

// Получение записей врача
router.get('/bookings', authenticate, authorize('doctor', 'admin'), async (req: any, res) => {
 try {
 const doctorIdentifiers = await getDoctorIdentifiers(req.user);
 
 // Ищем записи по любому из найденных идентификаторов
 const bookings = await (Booking as any).find({ 
 doctorId: { $in: doctorIdentifiers }
 }).sort({ date: 1, time: 1 });
 
 const enriched = await enrichBookings(bookings);
 res.json(enriched);
 } catch (err) {
 console.error('Error in GET /bookings:', err);
 res.status(500).json({ error: 'Ошибка получения записей' });
 }
});

// Получение статистики врача
router.get('/stats', authenticate, authorize('doctor', 'admin'), async (req: any, res) => {
 try {
 const doctorIdentifiers = await getDoctorIdentifiers(req.user);
 const query = { doctorId: { $in: doctorIdentifiers } };

 const [total, pending, confirmed] = await Promise.all([
 (Booking as any).countDocuments(query),
 (Booking as any).countDocuments({ ...query, status: 'pending' }),
 (Booking as any).countDocuments({ ...query, status: 'confirmed' })
 ]);

 // Считаем статистику по дням на ближайшую неделю
 const daily: any[] = [];
 const now = new Date();
 
 // Загружаем записи одним запросом и считаем локально
 const allBookings = await (Booking as any).find(query).select('date');
 
 for (let i = 0; i < 7; i++) {
 const d = new Date(now);
 d.setDate(d.getDate() + i);
 const isoDate = d.toISOString().split('T')[0];
 const label = d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
 
 const count = allBookings.filter((b: any) => b.date === isoDate).length;
 
 daily.push({ label, value: count });
 }

 res.json({
 total,
 pending,
 confirmed,
 daily
 });
 } catch (err) {
 res.status(500).json({ error: 'Ошибка получения статистики' });
 }
});

export default router;
