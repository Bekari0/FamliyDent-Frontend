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

function getUserLookup(user: any) {
 const ids = [user?.uid, user?._id?.toString?.(), user?._id].filter(Boolean);
 return { $or: ids.flatMap((id) => [{ uid: id }, { _id: id }]) };
}

function toBooleanSetting(value: unknown, fallback: boolean) {
 if (typeof value === 'boolean') return value;
 return fallback;
}

router.patch('/me', authenticate, async (req: any, res) => {
 try {
 const allowed = ['displayName', 'phoneNumber', 'gender', 'birthDate', 'photoURL'];
 const update: Record<string, any> = { updatedAt: new Date() };
 allowed.forEach((field) => {
 if (req.body[field] !== undefined) update[field] = req.body[field];
 });

 const user = await UserModel.findOneAndUpdate(
 getUserLookup(req.user),
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
 const currentSettings = {
 ...defaultNotificationSettings,
 ...(req.user.notificationSettings?.toObject?.() || req.user.notificationSettings || {})
 };
 const settings = {
 email: toBooleanSetting(req.body.email, currentSettings.email),
 bookingUpdates: toBooleanSetting(req.body.bookingUpdates, currentSettings.bookingUpdates),
 appointmentReminders: toBooleanSetting(req.body.appointmentReminders, currentSettings.appointmentReminders),
 cancellations: toBooleanSetting(req.body.cancellations, currentSettings.cancellations),
 news: toBooleanSetting(req.body.news, currentSettings.news)
 };

 const user = await UserModel.findOneAndUpdate(
 getUserLookup(req.user),
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
