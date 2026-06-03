import { Router } from 'express';
import { Service } from '../models/Service';

const router = Router();

router.get('/', async (req, res) => {
 try {
 const services = await Service.find();
 res.json(services);
 } catch (err) {
 console.error('Error fetching services:', err);
 res.status(500).json({ error: 'Ошибка при получении услуг' });
 }
});

export default router;
