import { Router } from 'express';
import { User } from '../models/User';
import { Booking } from '../models/Booking';
import { Doctor } from '../models/Doctor';
import { MedicalRecord } from '../models/MedicalRecord';
import Scan from '../models/Scan';
import MedicalCard from '../models/MedicalCard';
import { Review } from '../models/Review';
import { authenticate, authorize } from '../middleware/auth';
import { getDoctorNameMap as resolveDoctorNameMap } from '../utils/doctorResolver';

const router = Router();

function mapByIds(items: any[], fields: string[]) {
 const map: Record<string, any> = {};
 items.forEach((item: any) => {
 fields.forEach((field) => {
 if (item[field]) map[item[field].toString()] = item;
 });
 });
 return map;
}

async function getDoctorNameMap(doctorIds: string[]) {
 return resolveDoctorNameMap(doctorIds);
}

router.get('/stats', authenticate, authorize('admin'), async (req, res) => {
 try {
 const [usersCount, bookingsCount, doctorsCount, recentBookingsRaw] = await Promise.all([
 (User as any).countDocuments({ role: 'patient' }),
 (Booking as any).countDocuments(),
 (Doctor as any).countDocuments(),
 (Booking as any).find().sort({ createdAt: -1 }).limit(5),
 ]);

 const patientIds = Array.from(
 new Set<string>(recentBookingsRaw.map((booking: any) => booking.patientId?.toString()).filter(Boolean)),
 );
 const doctorIds = Array.from(
 new Set<string>(recentBookingsRaw.map((booking: any) => booking.doctorId?.toString()).filter(Boolean)),
 );

 const [patients, doctorNameMap] = await Promise.all([
 (User as any)
 .find({ $or: [{ _id: { $in: patientIds } }, { uid: { $in: patientIds } }] })
 .select('_id uid displayName email phoneNumber photoURL birthDate gender'),
 getDoctorNameMap(doctorIds),
 ]);

 const patientMap = mapByIds(patients, ['_id', 'uid']);
 const recentBookings = recentBookingsRaw.map((booking: any) => {
 const patientId = booking.patientId?.toString();
 const doctorId = booking.doctorId?.toString();
 return {
 ...booking.toJSON(),
 patientName: patientMap[patientId]?.displayName || 'Пациент',
 patientInfo: patientMap[patientId] || {},
 doctorName: doctorNameMap[doctorId] || 'Врач не указан',
 };
 });

 res.json({
 users: usersCount,
 bookings: bookingsCount,
 doctors: doctorsCount,
 recentBookings,
 });
 } catch (err) {
 res.status(500).json({ error: 'Ошибка при получении статистики' });
 }
});

router.get('/patients', authenticate, authorize('admin', 'doctor'), async (req, res) => {
 try {
 const patients = await (User as any).find({ role: 'patient' }).sort({ createdAt: -1 });
 res.json(patients);
 } catch (err) {
 res.status(500).json({ error: 'Ошибка при получении списка пациентов' });
 }
});

router.get('/patients/:id', authenticate, authorize('admin', 'doctor'), async (req, res) => {
 try {
 const id = req.params.id;
 const patient = await (User as any).findOne({
 $or: [{ _id: id }, { uid: id }, { email: id }],
 role: 'patient',
 });

 if (!patient) return res.status(404).json({ error: 'Пациент не найден' });

 const patientIds = [patient._id?.toString(), patient.uid].filter(Boolean) as string[];
 const [bookingsRaw, records, scans, card] = await Promise.all([
 (Booking as any).find({ patientId: { $in: patientIds } }).sort({ createdAt: -1 }),
 (MedicalRecord as any).find({ patientId: { $in: patientIds } }).sort({ date: -1 }),
 (Scan as any).find({ patientId: { $in: patientIds } }).sort({ createdAt: -1 }),
 (MedicalCard as any).findOne({ patientId: { $in: patientIds } }),
 ]);

 const doctorIds = Array.from(
 new Set<string>(bookingsRaw.map((booking: any) => booking.doctorId?.toString()).filter(Boolean)),
 );
 const doctorNameMap = await getDoctorNameMap(doctorIds);

 const bookings = bookingsRaw.map((booking: any) => {
 const doctorId = booking.doctorId?.toString();
 return {
 ...booking.toJSON(),
 doctorName: doctorNameMap[doctorId] || 'Врач не указан',
 };
 });

 res.json({ patient, bookings, records, scans, card: card || null });
 } catch (err) {
 console.error('Admin patient detail error:', err);
 res.status(500).json({ error: 'Ошибка при получении данных пациента' });
 }
});

router.delete('/patients/:id', authenticate, authorize('admin'), async (req, res) => {
 try {
 const id = req.params.id;
 const patient = await (User as any).findOneAndDelete({
 $or: [{ _id: id }, { uid: id }],
 role: 'patient',
 });

 if (!patient) return res.status(404).json({ error: 'Пациент не найден' });

 res.json({ message: 'Пациент удален' });
 } catch (err) {
 res.status(500).json({ error: 'Ошибка при удалении' });
 }
});

router.patch('/patients/:id', authenticate, authorize('admin'), async (req, res) => {
 try {
 const id = req.params.id;
 const allowed = ['displayName', 'phoneNumber', 'email', 'birthDate', 'gender'];
 const update: Record<string, any> = { updatedAt: new Date() };
 allowed.forEach((field) => {
 if (req.body[field] !== undefined) update[field] = req.body[field];
 });

 const patient = await (User as any).findOneAndUpdate(
 { $or: [{ _id: id }, { uid: id }], role: 'patient' },
 update,
 { new: true, runValidators: true }
 );

 if (!patient) return res.status(404).json({ error: 'Пациент не найден' });
 res.json(patient);
 } catch (err) {
 res.status(400).json({ error: 'Ошибка при обновлении пациента' });
 }
});

router.get('/reviews', authenticate, authorize('admin'), async (req, res) => {
 try {
 const status = String(req.query.status || '');
 const filter = ['pending', 'approved', 'rejected'].includes(status) ? { status } : {};
 const reviews = await (Review as any).find(filter).sort({ createdAt: -1 });
 res.json(reviews);
 } catch (err) {
 res.status(500).json({ error: 'Ошибка при получении отзывов' });
 }
});

router.patch('/reviews/:id/approve', authenticate, authorize('admin'), async (req: any, res) => {
 try {
 const review = await (Review as any).findByIdAndUpdate(
 req.params.id,
 { status: 'approved', moderatedAt: new Date(), moderatedBy: req.user.uid || req.user._id },
 { new: true }
 );
 if (!review) return res.status(404).json({ error: 'Отзыв не найден' });
 res.json(review);
 } catch (err) {
 res.status(400).json({ error: 'Не удалось одобрить отзыв' });
 }
});

router.patch('/reviews/:id/reject', authenticate, authorize('admin'), async (req: any, res) => {
 try {
 const review = await (Review as any).findByIdAndUpdate(
 req.params.id,
 { status: 'rejected', moderatedAt: new Date(), moderatedBy: req.user.uid || req.user._id },
 { new: true }
 );
 if (!review) return res.status(404).json({ error: 'Отзыв не найден' });
 res.json(review);
 } catch (err) {
 res.status(400).json({ error: 'Не удалось отклонить отзыв' });
 }
});

router.delete('/reviews/:id', authenticate, authorize('admin'), async (req, res) => {
 try {
 const review = await (Review as any).findByIdAndDelete(req.params.id);
 if (!review) return res.status(404).json({ error: 'Отзыв не найден' });
 res.json({ message: 'Отзыв удален' });
 } catch (err) {
 res.status(400).json({ error: 'Не удалось удалить отзыв' });
 }
});

export default router;
