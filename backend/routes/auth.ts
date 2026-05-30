import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { z } from 'zod';
import nodemailer from 'nodemailer';
import { User as UserModel } from '../models/User';
import { authenticate } from '../middleware/auth';

const router = Router();
const User = UserModel as any;

const JWT_SECRET = process.env.JWT_SECRET || 'family-dent-secret-key-2024';
const CODE_TTL_MS = 10 * 60 * 1000;
const RESEND_COOLDOWN_MS = 60 * 1000;
const MAX_VERIFY_ATTEMPTS = 5;

const registerSchema = z.object({
 email: z.string().trim().toLowerCase().email('Укажите корректный email'),
 password: z.string().min(8, 'Пароль должен быть не короче 8 символов'),
 displayName: z.string().trim().min(2, 'Укажите имя').optional(),
 name: z.string().trim().min(2, 'Укажите имя').optional(),
 phone: z.string().trim().optional(),
 birthDate: z.string().optional(),
 gender: z.enum(['male', 'female', 'other']).optional()
}).refine((data) => data.displayName || data.name, {
 message: 'Укажите имя',
 path: ['displayName']
});

const emailSchema = z.object({
 email: z.string().trim().toLowerCase().email('Укажите корректный email')
});

const codeSchema = z.object({
 email: z.string().trim().toLowerCase().email('Укажите корректный email').optional(),
 code: z.string().trim().regex(/^\d{6}$/, 'Введите 6 цифр кода')
});

const hashCode = (code: string) => crypto.createHash('sha256').update(code).digest('hex');
const generateCode = () => crypto.randomInt(100000, 1000000).toString();
const normalizeId = (value: unknown) => String(value || '');

function publicUser(user: any) {
 const json = user?.toJSON ? user.toJSON() : { ...user };
 delete json.password;
 delete json.emailVerificationCodeHash;
 delete json.emailVerificationExpires;
 delete json.emailVerificationAttempts;
 delete json.emailVerificationLastSentAt;
 delete json.lastEmailVerificationSentAt;
 delete json.verificationCode;
 delete json.verificationCodeExpires;
 delete json.resetPasswordToken;
 delete json.resetPasswordExpires;

 json.uid = normalizeId(json.uid || json._id);
 json.id = normalizeId(json.id || json._id);
 json.emailVerified = Boolean(json.emailVerified || json.isEmailVerified);
 json.isEmailVerified = json.emailVerified;
 return json;
}

function createTransporter() {
 if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
 throw new Error('SMTP_NOT_CONFIGURED');
 }

 return nodemailer.createTransport({
 host: process.env.SMTP_HOST,
 port: Number(process.env.SMTP_PORT) || 587,
 secure: process.env.SMTP_SECURE === 'true',
 auth: {
 user: process.env.SMTP_USER,
 pass: process.env.SMTP_PASS
 }
 });
}

function isNewUnverifiedUser(user: any) {
 return (
 user.emailVerified === false &&
 user.isEmailVerified === false &&
 Boolean(user.emailVerificationCodeHash)
 );
}

router.post('/register', async (req, res) => {
 try {
 const parsed = registerSchema.parse(req.body);
 const email = parsed.email;
 const displayName = parsed.displayName || parsed.name;

 const existingUser = await User.findOne({ email });
 if (existingUser) {
 return res.status(409).json({ error: 'Пользователь с таким email уже существует' });
 }

 const userId = `user-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`;
 const user = new User({
 _id: userId,
 uid: userId,
 email,
 password: await bcrypt.hash(parsed.password, 12),
 displayName,
 phoneNumber: parsed.phone,
 birthDate: parsed.birthDate,
 gender: parsed.gender || 'other',
 role: 'patient',
 isEmailVerified: false,
 emailVerified: false
 });

 await sendCodeForUser(user);
 res.status(201).json({
 message: 'Аккаунт создан. Код подтверждения отправлен на email.',
 user: publicUser(user)
 });
 } catch (err: any) {
 if (err?.issues) {
 return res.status(400).json({ error: err.issues[0]?.message || 'Проверьте данные регистрации' });
 }
 if (err?.message === 'SMTP_NOT_CONFIGURED') {
 return res.status(500).json({ error: 'SMTP для отправки писем не настроен' });
 }
 if (err?.code === 11000) {
 return res.status(409).json({ error: 'Пользователь с таким email уже существует' });
 }
 console.error('Register error:', err);
 res.status(500).json({ error: 'Не удалось создать аккаунт' });
 }
});

router.post('/login', async (req, res) => {
 try {
 const email = String(req.body.email || '').toLowerCase().trim();
 const password = String(req.body.password || '');

 if (!email || !password) {
 return res.status(400).json({ error: 'Введите email и пароль' });
 }

 const user = await User.findOne({ email }).lean();
 if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
 return res.status(401).json({ error: 'Неверный email или пароль' });
 }

 // Backward compatibility: old users may not have verification fields at all.
 // New unverified users are blocked only when there is an active verification code.
 if (isNewUnverifiedUser(user)) {
 return res.status(403).json({ error: 'Подтвердите email перед входом' });
 }

 const normalizedUid = normalizeId(user.uid || user._id);
 const role = user.role || 'patient';
 const legacyEmailVerified = user.emailVerified ?? true;
 const legacyIsEmailVerified = user.isEmailVerified ?? legacyEmailVerified;

 await User.updateOne(
 { _id: user._id },
 {
 $set: {
 uid: normalizedUid,
 lastLoginAt: new Date(),
 emailVerified: legacyEmailVerified,
 isEmailVerified: legacyIsEmailVerified
 }
 }
 );

 const token = jwt.sign({ uid: normalizedUid, role }, JWT_SECRET, { expiresIn: '7d' });
 res.cookie('token', token, {
 httpOnly: true,
 secure: process.env.NODE_ENV === 'production',
 sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
 maxAge: 7 * 24 * 60 * 60 * 1000
 });

 res.json({
 token,
 user: publicUser({
 ...user,
 uid: normalizedUid,
 role,
 emailVerified: legacyEmailVerified,
 isEmailVerified: legacyIsEmailVerified
 })
 });
 } catch (err) {
 console.error('Login error:', err);
 res.status(500).json({ error: 'Ошибка входа' });
 }
});

router.get('/me', authenticate, (req: any, res) => {
 res.json(publicUser(req.user));
});

router.post('/send-email-code', authenticate, async (req: any, res) => {
 try {
 const email = String(req.body.email || req.user.email || '').toLowerCase().trim();
 if (!z.string().email().safeParse(email).success) {
 return res.status(400).json({ error: 'Укажите корректный email' });
 }

 const user = await User.findOne({ $or: [{ uid: req.user.uid }, { _id: req.user._id }] });
 if (!user) return res.status(404).json({ error: 'Пользователь не найден' });
 if (Boolean(user.emailVerified || user.isEmailVerified) && user.email === email) {
 return res.status(400).json({ error: 'Email уже подтверждён' });
 }

 const duplicate = await User.findOne({ email, _id: { $ne: user._id } });
 if (duplicate) return res.status(409).json({ error: 'Этот email уже используется' });

 user.email = email;
 user.emailVerified = false;
 user.isEmailVerified = false;
 await sendCodeForUser(user);
 res.json({ message: 'Код отправлен на email' });
 } catch (err: any) {
 if (err?.message === 'TOO_SOON') {
 return res.status(429).json({ error: 'Повторная отправка доступна через 60 секунд' });
 }
 if (err?.message === 'SMTP_NOT_CONFIGURED') {
 return res.status(500).json({ error: 'SMTP для отправки писем не настроен' });
 }
 console.error('Send email code error:', err);
 res.status(500).json({ error: 'Не удалось отправить код' });
 }
});

router.post(['/resend-code', '/resend-email-code'], async (req, res) => {
 try {
 const { email } = emailSchema.parse(req.body);
 const user = await User.findOne({ email });
 if (!user) return res.status(404).json({ error: 'Пользователь не найден' });
 if (Boolean(user.emailVerified || user.isEmailVerified)) {
 return res.status(400).json({ error: 'Email уже подтверждён' });
 }

 await sendCodeForUser(user);
 res.json({ message: 'Новый код отправлен на email' });
 } catch (err: any) {
 if (err?.issues) {
 return res.status(400).json({ error: err.issues[0]?.message || 'Укажите корректный email' });
 }
 if (err?.message === 'TOO_SOON') {
 return res.status(429).json({ error: 'Повторная отправка доступна через 60 секунд' });
 }
 if (err?.message === 'SMTP_NOT_CONFIGURED') {
 return res.status(500).json({ error: 'SMTP для отправки писем не настроен' });
 }
 console.error('Resend code error:', err);
 res.status(500).json({ error: 'Не удалось отправить код' });
 }
});

router.post('/verify-email-code', authenticate, async (req: any, res) => {
 try {
 const { code } = codeSchema.parse(req.body);
 const user = await User.findOne({ $or: [{ uid: req.user.uid }, { _id: req.user._id }] });
 if (!user) return res.status(404).json({ error: 'Пользователь не найден' });

 const result = await verifyUserCode(user, code);
 if ('error' in result) return res.status(result.status).json({ error: result.error });
 res.json({ message: 'Email подтверждён', user: publicUser(result.user) });
 } catch (err: any) {
 if (err?.issues) return res.status(400).json({ error: err.issues[0]?.message || 'Введите код' });
 console.error('Verify email code error:', err);
 res.status(500).json({ error: 'Ошибка проверки кода' });
 }
});

router.post('/verify-code', async (req, res) => {
 try {
 const parsed = codeSchema.extend({
 email: z.string().trim().toLowerCase().email('Укажите корректный email')
 }).parse(req.body);
 const user = await User.findOne({ email: parsed.email });
 if (!user) return res.status(404).json({ error: 'Пользователь не найден' });

 const result = await verifyUserCode(user, parsed.code);
 if ('error' in result) return res.status(result.status).json({ error: result.error });
 res.json({ message: 'Email подтверждён', user: publicUser(result.user) });
 } catch (err: any) {
 if (err?.issues) return res.status(400).json({ error: err.issues[0]?.message || 'Введите код' });
 console.error('Verify code error:', err);
 res.status(500).json({ error: 'Ошибка проверки кода' });
 }
});

router.post('/logout', (_req, res) => {
 res.clearCookie('token', {
 httpOnly: true,
 secure: process.env.NODE_ENV === 'production',
 sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
 });
 res.json({ message: 'Вы вышли' });
});

async function verifyUserCode(user: any, code: string) {
 if (Boolean(user.emailVerified || user.isEmailVerified)) {
 return { status: 400, error: 'Email уже подтверждён' };
 }
 if (!user.emailVerificationCodeHash || !user.emailVerificationExpires) {
 return { status: 400, error: 'Сначала отправьте код подтверждения' };
 }
 if (new Date(user.emailVerificationExpires).getTime() < Date.now()) {
 return { status: 400, error: 'Код истёк. Отправьте новый код.' };
 }
 if ((user.emailVerificationAttempts || 0) >= MAX_VERIFY_ATTEMPTS) {
 return { status: 429, error: 'Слишком много попыток. Отправьте новый код.' };
 }

 if (hashCode(code) !== user.emailVerificationCodeHash) {
 user.emailVerificationAttempts = (user.emailVerificationAttempts || 0) + 1;
 await user.save();
 return { status: 400, error: 'Код неверный' };
 }

 user.emailVerified = true;
 user.isEmailVerified = true;
 user.emailVerificationCodeHash = undefined;
 user.emailVerificationExpires = undefined;
 user.emailVerificationAttempts = 0;
 user.verificationCode = undefined;
 user.verificationCodeExpires = undefined;
 await user.save();
 return { user };
}

async function sendCodeForUser(user: any) {
 const lastSent = user.lastEmailVerificationSentAt || user.emailVerificationLastSentAt;
 if (lastSent && Date.now() - new Date(lastSent).getTime() < RESEND_COOLDOWN_MS) {
 throw new Error('TOO_SOON');
 }

 const code = generateCode();
 user.emailVerificationCodeHash = hashCode(code);
 user.emailVerificationExpires = new Date(Date.now() + CODE_TTL_MS);
 user.emailVerificationAttempts = 0;
 user.emailVerificationLastSentAt = new Date();
 user.lastEmailVerificationSentAt = user.emailVerificationLastSentAt;
 user.verificationCode = undefined;
 user.verificationCodeExpires = undefined;
 await user.save();

 const transporter = createTransporter();
 await transporter.sendMail({
 from: process.env.SMTP_FROM || `"FamilyDent" <${process.env.SMTP_USER}>`,
 to: user.email,
 subject: 'Код подтверждения FamilyDent',
 text: `Ваш код подтверждения FamilyDent: ${code}. Код действует 10 минут. Если вы не регистрировались в FamilyDent, просто проигнорируйте это письмо.`,
 html: `
 <div style="font-family:Arial,sans-serif;line-height:1.5;color:#24211f">
 <h2 style="margin:0 0 12px">FamilyDent</h2>
 <p>Ваш код подтверждения:</p>
 <p style="font-size:28px;font-weight:700;letter-spacing:4px;margin:12px 0">${code}</p>
 <p>Код действует 10 минут.</p>
 <p style="color:#6b6661;font-size:13px">Если вы не регистрировались в FamilyDent, просто проигнорируйте это письмо.</p>
 </div>
 `
 });
}

export default router;
