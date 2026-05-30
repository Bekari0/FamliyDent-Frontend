import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { User } from '../models/User';

const router = Router();
const UserModel = User as any;

const defaultNotificationSettings = {
 email: true,
 bookingUpdates: true,
 appointmentReminders: true,
 cancellations: true,
 news: false
};

router.patch('/me', authenticate, async (req: any, res) => {
 try {
 const allowed = ['displayName', 'phoneNumber', 'gender', 'birthDate', 'photoURL'];
 const update: Record<string, any> = { updatedAt: new Date() };
 allowed.forEach((field) => {
 if (req.body[field] !== undefined) update[field] = req.body[field];
 });

 const user = await UserModel.findOneAndUpdate(
 { uid: req.user.uid },
 update,
 { new: true, runValidators: true }
 );
 if (!user) return res.status(404).json({ error: 'Пользователь не найден' });
 res.json(user);
 } catch (err) {
 res.status(400).json({ error: 'Ошибка обновления профиля' });
 }
});

router.get('/export', authenticate, async (req: any, res) => {
 const user = req.user.toJSON ? req.user.toJSON() : req.user;
 const safeUser = { ...user };
 delete safeUser.password;
 delete safeUser.verificationCode;
 delete safeUser.emailVerificationCodeHash;
 res.json(safeUser);
});

router.get('/notification-settings', authenticate, async (req: any, res) => {
 const settings = {
 ...defaultNotificationSettings,
 ...(req.user.notificationSettings?.toObject?.() || req.user.notificationSettings || {})
 };
 res.json(settings);
});

router.put('/notification-settings', authenticate, async (req: any, res) => {
 try {
 const settings = {
 email: Boolean(req.body.email),
 bookingUpdates: Boolean(req.body.bookingUpdates),
 appointmentReminders: Boolean(req.body.appointmentReminders),
 cancellations: Boolean(req.body.cancellations),
 news: Boolean(req.body.news)
 };

 const user = await UserModel.findOneAndUpdate(
 { uid: req.user.uid },
 { notificationSettings: settings, updatedAt: new Date() },
 { new: true }
 );
 if (!user) return res.status(404).json({ error: 'Пользователь не найден' });
 res.json(user.notificationSettings || settings);
 } catch (err) {
 res.status(400).json({ error: 'Ошибка сохранения настроек уведомлений' });
 }
});

export default router;
