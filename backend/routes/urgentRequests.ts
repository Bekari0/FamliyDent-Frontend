import { Router } from 'express';
import { UrgentRequest } from '../models/UrgentRequest';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.post('/', async (req, res) => {
 try {
 const { name, phone, branch, reason, preferredTime } = req.body;
 if (!name?.trim() || !phone?.trim() || !reason?.trim()) {
 return res.status(400).json({ error: 'Укажите имя, телефон и причину обращения' });
 }

 const request = new (UrgentRequest as any)({
 name: name.trim(),
 phone: phone.trim(),
 branch: branch?.trim() || '',
 reason: reason.trim(),
 preferredTime: preferredTime?.trim() || ''
 });
 await request.save();
 res.status(201).json(request);
 } catch (err) {
 res.status(400).json({ error: 'Не удалось отправить срочную заявку' });
 }
});

router.get('/', authenticate, authorize('admin'), async (_req, res) => {
 try {
 const requests = await (UrgentRequest as any).find().sort({ createdAt: -1 });
 res.json(requests);
 } catch (err) {
 res.status(500).json({ error: 'Ошибка получения срочных заявок' });
 }
});

router.patch('/:id', authenticate, authorize('admin'), async (req, res) => {
 try {
 const request = await (UrgentRequest as any).findByIdAndUpdate(
 req.params.id,
 { status: req.body.status, updatedAt: new Date() },
 { new: true, runValidators: true }
 );
 if (!request) return res.status(404).json({ error: 'Заявка не найдена' });
 res.json(request);
 } catch (err) {
 res.status(400).json({ error: 'Ошибка обновления заявки' });
 }
});

export default router;
