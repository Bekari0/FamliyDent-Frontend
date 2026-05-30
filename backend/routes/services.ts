import { Router } from 'express';
import { Service } from '../models/Service';

const router = Router();

router.get('/', async (req, res) => {
 try {
 const services = await Service.find();
 res.json(services);
 } catch (err) {
 res.status(500).json({ error: 'Ошибка при получении услуг' });
 }
});

export default router;
