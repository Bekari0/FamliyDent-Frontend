import { Router } from 'express';
import { Doctor as DoctorModel } from '../models/Doctor';
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

export default router;

function findDoctor(idOrSlug: string) {
 return Doctor.findOne({ $or: [{ _id: idOrSlug }, { slug: idOrSlug }] });
}
