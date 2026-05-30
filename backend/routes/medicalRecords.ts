import { Router } from 'express';
import { MedicalRecord as MedicalRecordModel } from '../models/MedicalRecord';
const MedicalRecord = MedicalRecordModel as any;
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, async (req: any, res) => {
 try {
 let query: any = { patientId: req.user.uid };
 
 // If admin/doctor wants specific patient
 if ((req.user.role === 'admin' || req.user.role === 'doctor') && req.query.patientId) {
 query = { patientId: req.query.patientId };
 }

 const records = await MedicalRecord.find(query).sort({ date: -1 });
 res.json(records);
 } catch (err) {
 res.status(500).json({ error: 'Ошибка при получении мед. записей' });
 }
});

router.get('/my', authenticate, async (req: any, res) => {
 try {
 const records = await MedicalRecord.find({ patientId: req.user.uid }).sort({ date: -1 });
 res.json(records);
 } catch (err) {
 res.status(500).json({ error: 'Ошибка при получении мед. записей' });
 }
});

router.post('/', authenticate, authorize('admin', 'doctor'), async (req: any, res) => {
 try {
 const record = new MedicalRecord({
 _id: `record-${Date.now()}`,
 ...req.body,
 createdAt: new Date()
 });
 await record.save();
 res.status(201).json(record);
 } catch (err) {
 res.status(400).json({ error: 'Ошибка при создании мед. записи' });
 }
});

export default router;
