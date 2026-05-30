import express from 'express';
import { authenticate, authorize } from '../middleware/auth';
import MedicalCard from '../models/MedicalCard';
import Scan from '../models/Scan';
import Recommendation from '../models/Recommendation';
import { MedicalRecord } from '../models/MedicalRecord';

const router = express.Router();

// --- Medical Card ---
router.get('/card/:patientId', authenticate, async (req: any, res) => {
 try {
 const { patientId } = req.params;
 // Only patient themselves or medical staff
 if (req.user.uid !== patientId && req.user._id !== patientId && req.user.role === 'patient') {
 return res.status(403).json({ error: 'Access denied' });
 }
 
 // Find by any ID format
 let card = await (MedicalCard as any).findOne({ 
 $or: [{ patientId: patientId }, { patientId: patientId.toString() }] 
 });
 
 if (!card) {
 console.log(`Creating new medical card for patient: ${patientId}`);
 card = new MedicalCard({ 
 patientId, 
 allergies: [], 
 chronicConditions: [],
 updatedAt: new Date()
 });
 await card.save();
 }
 res.json(card);
 } catch (err) {
 console.error('Error in GET /card/:patientId:', err);
 res.status(500).json({ error: 'Server error' });
 }
});

router.put('/card/:patientId', authenticate, authorize('admin', 'doctor'), async (req, res) => {
 try {
 const card = await (MedicalCard as any).findOneAndUpdate(
 { patientId: req.params.patientId },
 { ...req.body, updatedAt: new Date() },
 { new: true, upsert: true }
 );
 res.json(card);
 } catch (err) {
 res.status(500).json({ error: 'Server error' });
 }
});

// --- Scans ---
router.get('/scans/:patientId', authenticate, async (req: any, res) => {
 try {
 const { patientId } = req.params;
 if (req.user.uid !== patientId && req.user._id !== patientId && req.user.role === 'patient') {
 return res.status(403).json({ error: 'Access denied' });
 }
 const scans = await (Scan as any).find({ 
 $or: [{ patientId: patientId }, { patientId: patientId.toString() }] 
 }).sort({ createdAt: -1 });
 res.json(scans);
 } catch (err) {
 res.status(500).json({ error: 'Server error' });
 }
});

router.post('/scans', authenticate, authorize('admin', 'doctor'), async (req: any, res) => {
 try {
 const scan = new Scan({ ...req.body, doctorId: req.user.uid });
 await scan.save();
 res.status(201).json(scan);
 } catch (err) {
 res.status(500).json({ error: 'Server error' });
 }
});

router.delete('/scans/:id', authenticate, authorize('admin', 'doctor'), async (req: any, res) => {
 try {
 const scan = await (Scan as any).findByIdAndDelete(req.params.id);
 if (!scan) return res.status(404).json({ error: 'Файл не найден' });
 res.json({ message: 'Файл удален' });
 } catch (err) {
 res.status(500).json({ error: 'Ошибка удаления файла' });
 }
});

// --- Recommendations ---
router.get('/recommendations/:patientId', authenticate, async (req: any, res) => {
 try {
 const { patientId } = req.params;
 if (req.user.uid !== patientId && req.user._id !== patientId && req.user.role === 'patient') {
 return res.status(403).json({ error: 'Access denied' });
 }
 const recs = await (Recommendation as any).find({ 
 $or: [{ patientId: patientId }, { patientId: patientId.toString() }] 
 }).sort({ createdAt: -1 });
 res.json(recs);
 } catch (err) {
 res.status(500).json({ error: 'Server error' });
 }
});

router.post('/recommendations', authenticate, authorize('admin', 'doctor'), async (req: any, res) => {
 try {
 const rec = new Recommendation({ ...req.body, doctorId: req.user.uid });
 await rec.save();
 res.status(201).json(rec);
 } catch (err) {
 res.status(500).json({ error: 'Server error' });
 }
});

// --- Treatment History (reusing MedicalRecord model) ---
router.get('/history/:patientId', authenticate, async (req: any, res) => {
 try {
 const { patientId } = req.params;
 if (req.user.uid !== patientId && req.user._id !== patientId && req.user.role === 'patient') {
 return res.status(403).json({ error: 'Access denied' });
 }
 const history = await (MedicalRecord as any).find({ 
 $or: [{ patientId: patientId }, { patientId: patientId.toString() }] 
 }).sort({ date: -1 });
 res.json(history);
 } catch (err) {
 res.status(500).json({ error: 'Server error' });
 }
});

router.post('/history', authenticate, authorize('admin', 'doctor'), async (req: any, res) => {
 try {
 const record = new MedicalRecord({ 
 ...req.body, 
 doctorId: req.user.uid || req.user._id 
 });
 await record.save();
 res.status(201).json(record);
 } catch (err) {
 res.status(500).json({ error: 'Server error' });
 }
});

export default router;
