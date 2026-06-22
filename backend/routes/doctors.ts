import { Router } from 'express';
import { Doctor as DoctorModel } from '../models/Doctor';
import { User } from '../models/User';
import { authenticate, authorize } from '../middleware/auth';
import { createSlug } from '../utils/slug';
const Doctor = DoctorModel as any;

const router = Router();

router.get('/', async (req, res) => {
 try {
 const doctors = await Doctor.find();
 res.json(doctors);
 } catch (err) {
 console.error('Error fetching doctors:', err);
 res.status(500).json({ error: 'Ошибка при получении списка врачей' });
 }
});

router.get('/:id', async (req, res) => {
 try {
 const doctor = await findDoctor(req.params.id);
 if (!doctor) return res.status(404).json({ error: 'Врач не найден' });
 res.json(doctor);
 } catch (err) {
 console.error('Error fetching doctor:', err);
 res.status(500).json({ error: 'Ошибка сервера' });
 }
});

router.patch('/:id', authenticate, authorize('admin'), async (req, res) => {
 try {
 const payload = { ...req.body };
 if (payload.name && !payload.slug) payload.slug = createSlug(payload.name);

 const existingDoctor = await findDoctor(req.params.id);
 if (!existingDoctor) return res.status(404).json({ error: 'Врач не найден' });

 const doctor = await Doctor.findByIdAndUpdate(existingDoctor._id, payload, {
 new: true,
 runValidators: true,
 });
 res.json(doctor);
 } catch (err) {
 console.error('Error updating doctor:', err);
 res.status(500).json({ error: 'Ошибка сервера' });
 }
});

router.patch('/:id', async (req, res) => {
 try {
 const payload = { ...req.body };
 if (payload.name && !payload.slug) payload.slug = createSlug(payload.name);
 const doctor = await Doctor.findByIdAndUpdate(req.params.id, payload, { new: true });
 if (!doctor) return res.status(404).json({ error: 'Врач не найден' });
 res.json(doctor);
 } catch (err) {
 console.error('Error updating doctor:', err);
 res.status(500).json({ error: 'Ошибка сервера' });
 }
});

router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
 try {
 const doctor = await findDoctor(req.params.id);
 if (!doctor) return res.status(404).json({ error: 'Врач не найден' });

 await Doctor.deleteOne({ _id: doctor._id });

 if (doctor.userId) {
 await (User as any).deleteOne({ _id: doctor.userId, role: 'doctor' });
 }

 res.json({ message: 'Врач удален' });
 } catch (err) {
 console.error('Error deleting doctor:', err);
 res.status(500).json({ error: 'Ошибка при удалении врача' });
 }
});

export default router;

function findDoctor(idOrSlug: string) {
 return Doctor.findOne({ $or: [{ _id: idOrSlug }, { slug: idOrSlug }] });
}
