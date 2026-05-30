import { Router } from 'express';
import { Booking as BookingModel } from '../models/Booking';
import { User } from '../models/User';
import { authenticate, authorize } from '../middleware/auth';
import { getDoctorNameMap } from '../utils/doctorResolver';

const router = Router();
const Booking = BookingModel as any;

async function enrichBookings(bookings: any[]) {
 const patientIds = [...new Set(bookings.map((b) => b.patientId?.toString()).filter(Boolean))];
 const doctorIds = [...new Set(bookings.map((b) => b.doctorId?.toString()).filter(Boolean))];

 const [patients, doctorNameMap] = await Promise.all([
 (User as any)
 .find({ $or: [{ _id: { $in: patientIds } }, { uid: { $in: patientIds } }] })
 .select('_id uid displayName email phoneNumber photoURL birthDate gender'),
 getDoctorNameMap(doctorIds),
 ]);

 const patientMap: Record<string, any> = {};
 patients.forEach((patient: any) => {
 if (patient._id) patientMap[patient._id.toString()] = patient;
 if (patient.uid) patientMap[patient.uid] = patient;
 });

 return bookings.map((booking: any) => {
 const json = booking.toJSON ? booking.toJSON() : booking;
 const patientId = booking.patientId?.toString();
 const doctorId = booking.doctorId?.toString();
 const patient = patientMap[patientId];

 const doctorName =
 json.doctorName ||
 json.doctor?.fullName ||
 json.doctor?.name ||
 json.doctorId?.fullName ||
 json.doctorId?.name ||
 doctorNameMap[doctorId] ||
 'Врач не указан';

 return {
 ...json,
 patientName: patient?.displayName || 'Пациент',
 patientInfo: patient || {},
 doctorName,
 doctor: json.doctor || null,
 doctorInfo: json.doctorInfo || {},
 };
 });
}

router.get('/', authenticate, async (req: any, res) => {
 try {
 let query: any = {};
 if (req.user.role !== 'admin' && req.user.role !== 'doctor') {
 query = { patientId: { $in: [req.user.uid, req.user._id].filter(Boolean) } };
 }
 const bookings = await Booking.find(query).sort({ createdAt: -1 });
 res.json(await enrichBookings(bookings));
 } catch (err) {
 console.error('Bookings list error:', err);
 res.status(500).json({ error: 'Ошибка при получении записей' });
 }
});

router.get('/my', authenticate, async (req: any, res) => {
 try {
 const bookings = await Booking.find({ patientId: { $in: [req.user.uid, req.user._id].filter(Boolean) } }).sort({ createdAt: -1 });
 res.json(await enrichBookings(bookings));
 } catch (err) {
 console.error('My bookings error:', err);
 res.status(500).json({ error: 'Ошибка при получении ваших записей' });
 }
});

router.post('/', authenticate, async (req: any, res) => {
 try {
 const booking = new Booking({
 _id: `booking-${Date.now()}`,
 ...req.body,
 patientId: req.user.uid || req.user._id,
 status: 'pending',
 });
 await booking.save();
 res.status(201).json((await enrichBookings([booking]))[0]);
 } catch (err) {
 console.error('Create booking error:', err);
 res.status(400).json({ error: 'Ошибка при создании записи' });
 }
});

router.patch('/:id', authenticate, async (req: any, res) => {
 try {
 const { status } = req.body;
 const query: any = { _id: req.params.id };

 if (req.user.role !== 'admin' && req.user.role !== 'doctor') {
 query.patientId = { $in: [req.user.uid, req.user._id].filter(Boolean) };
 if (status !== 'cancelled') return res.status(403).json({ error: 'Недостаточно прав для изменения статуса' });
 }

 const booking = await Booking.findOneAndUpdate(query, { status }, { new: true });
 if (!booking) return res.status(404).json({ error: 'Запись не найдена' });
 res.json((await enrichBookings([booking]))[0]);
 } catch (err) {
 console.error('Update booking status error:', err);
 res.status(500).json({ error: 'Ошибка при обновлении статуса' });
 }
});

router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
 try {
 const booking = await Booking.findByIdAndDelete(req.params.id);
 if (!booking) return res.status(404).json({ error: 'Запись не найдена' });
 res.json({ message: 'Запись удалена' });
 } catch (err) {
 console.error('Delete booking error:', err);
 res.status(500).json({ error: 'Ошибка при удалении' });
 }
});

router.get('/busy-slots', authenticate, async (req, res) => {
 try {
 const { doctorId, date } = req.query;
 if (!doctorId || !date) return res.status(400).json({ error: 'Не указаны врач или дата' });
 const bookings = await Booking.find({ doctorId, date, status: { $in: ['pending', 'confirmed'] } }).select('time');
 res.json(bookings.map((b: any) => b.time));
 } catch (err) {
 console.error('Busy slots error:', err);
 res.status(500).json({ error: 'Ошибка при получении занятых слотов' });
 }
});

router.patch('/:id/user-action', authenticate, async (req: any, res) => {
 try {
 const booking = await Booking.findOne({ _id: req.params.id, patientId: { $in: [req.user.uid, req.user._id].filter(Boolean) } });
 if (!booking) return res.status(404).json({ error: 'Запись не найдена' });

 if (req.body.action === 'reschedule') {
 booking.date = req.body.date;
 booking.time = req.body.time;
 booking.status = 'pending';
 await booking.save();
 }
 res.json((await enrichBookings([booking]))[0]);
 } catch (err) {
 console.error('Booking user action error:', err);
 res.status(500).json({ error: 'Ошибка выполнения действия' });
 }
});

router.patch('/:id/cancel', authenticate, async (req: any, res) => {
 try {
 const booking = await Booking.findOne({ _id: req.params.id, patientId: { $in: [req.user.uid, req.user._id].filter(Boolean) } });
 if (!booking) return res.status(404).json({ error: 'Запись не найдена' });

 const bookingDate = booking.date ? new Date(`${booking.date}T${booking.time || '23:59'}`) : null;
 if (bookingDate && bookingDate < new Date()) return res.status(400).json({ error: 'Прошедшую запись нельзя отменить' });
 if (booking.status === 'completed' || booking.status === 'cancelled') return res.status(400).json({ error: 'Эту запись уже нельзя отменить' });

 booking.status = 'cancelled';
 await booking.save();
 res.json((await enrichBookings([booking]))[0]);
 } catch (err) {
 console.error('Cancel booking error:', err);
 res.status(500).json({ error: 'Ошибка при отмене' });
 }
});

export default router;
