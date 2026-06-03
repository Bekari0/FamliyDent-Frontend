import { Router } from 'express';
import { Review as ReviewModel } from '../models/Review';
import { Booking } from '../models/Booking';
import { authenticate } from '../middleware/auth';
import { resolveDoctorName } from '../utils/doctorResolver';

const router = Router();
const Review = ReviewModel as any;

async function getDoctorName(doctorId?: string) {
 return resolveDoctorName(doctorId);
}

router.get('/', async (_req, res) => {
 try {
 const reviews = await Review.find({ status: 'approved' }).sort({ createdAt: -1 });
 res.json(reviews);
 } catch (err) {
 res.status(500).json({ error: 'Ошибка при получении отзывов' });
 }
});

router.get('/public', async (_req, res) => {
 try {
 const reviews = await Review.find({ status: 'approved' }).sort({ createdAt: -1 });
 res.json(reviews);
 } catch (err) {
 res.status(500).json({ error: 'Ошибка при получении отзывов' });
 }
});

router.get('/my-available-appointments', authenticate, async (req: any, res) => {
 try {
 const patientIds = [req.user.uid, req.user._id].filter(Boolean);
 const completed = await (Booking as any)
 .find({ patientId: { $in: patientIds }, status: 'completed' })
 .sort({ date: -1, time: -1 });

 const reviewed = await Review.find({
 patientId: { $in: patientIds },
 appointmentId: { $in: completed.map((booking: any) => booking._id?.toString()).filter(Boolean) },
 }).select('appointmentId');

 const reviewedIds = new Set(reviewed.map((review: any) => review.appointmentId));
 const available = await Promise.all(
 completed
 .filter((booking: any) => !reviewedIds.has(booking._id?.toString()))
 .map(async (booking: any) => ({
 ...booking.toJSON(),
 doctorName: await getDoctorName(booking.doctorId?.toString()),
 })),
 );

 res.json(available);
 } catch (err) {
 res.status(500).json({ error: 'Не удалось получить завершённые приёмы' });
 }
});

router.post('/', authenticate, async (req: any, res) => {
 try {
 const appointmentId = String(req.body.appointmentId || '').trim();
 const rating = Number(req.body.rating);
 const text = String(req.body.text || req.body.comment || '').trim();

 if (!appointmentId) return res.status(400).json({ error: 'Выберите завершённый приём' });
 if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
 return res.status(400).json({ error: 'Оценка должна быть от 1 до 5' });
 }
 if (text.length < 10) return res.status(400).json({ error: 'Напишите отзыв не короче 10 символов' });

 const patientIds = [req.user.uid, req.user._id].filter(Boolean);
 const booking = await (Booking as any).findOne({
 _id: appointmentId,
 patientId: { $in: patientIds },
 status: 'completed',
 });
 if (!booking) return res.status(403).json({ error: 'Отзыв можно оставить только после завершённого приёма' });

 const duplicate = await Review.findOne({ appointmentId, patientId: { $in: patientIds } });
 if (duplicate) return res.status(400).json({ error: 'Отзыв по этому приёму уже отправлен' });

 const doctorName = await getDoctorName(booking.doctorId?.toString());
 const review = new Review({
 _id: `review-${Date.now()}`,
 patientId: req.user.uid || req.user._id,
 appointmentId,
 patientName: req.user.displayName || 'Пациент',
 doctorId: booking.doctorId,
 doctorName,
 rating,
 text,
 comment: text,
 source: 'site',
 status: 'pending',
 });
 await review.save();
 res.status(201).json({ message: 'Спасибо! Ваш отзыв отправлен на модерацию.', review });
 } catch (err) {
 res.status(400).json({ error: 'Ошибка при создании отзыва' });
 }
});

export default router;
