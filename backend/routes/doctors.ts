import { Router } from 'express';
import { Doctor as DoctorModel } from '../models/Doctor';
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
 const doctor = await Doctor.findById(req.params.id);
 if (!doctor) return res.status(404).json({ error: 'Врач не найден' });
 res.json(doctor);
 } catch (err) {
 console.error('Error fetching doctor:', err);
 res.status(500).json({ error: 'Ошибка сервера' });
 }
});

router.patch('/:id', async (req, res) => {
 try {
 const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true });
 if (!doctor) return res.status(404).json({ error: 'Врач не найден' });
 res.json(doctor);
 } catch (err) {
 console.error('Error updating doctor:', err);
 res.status(500).json({ error: 'Ошибка сервера' });
 }
});

export default router;
