import nodemailer from 'nodemailer';
import dns from 'dns';
import fs from 'fs';
import path from 'path';
import { Booking } from '../models/Booking';
import { User } from '../models/User';
import { getDoctorNameMap } from '../utils/doctorResolver';

type NotificationKey = 'bookingUpdates' | 'appointmentReminders' | 'cancellations' | 'news';

const defaultSettings = {
 email: true,
 bookingUpdates: true,
 appointmentReminders: true,
 cancellations: true,
 news: false,
};

const logoCid = 'familydent-icon';

function getLogoPath() {
 const candidates = [
 path.resolve(process.cwd(), 'public', 'icon.svg'),
 path.resolve(process.cwd(), '..', 'public', 'icon.svg'),
 ];
 return candidates.find((candidate) => fs.existsSync(candidate));
}

function createTransporter() {
 if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
 throw new Error('SMTP_NOT_CONFIGURED');
 }

 const dnsServers = (process.env.SMTP_DNS_SERVERS || process.env.MONGODB_DNS_SERVERS || '8.8.8.8,1.1.1.1')
 .split(',')
 .map((server) => server.trim())
 .filter(Boolean);

 if (dnsServers.length > 0) dns.setServers(dnsServers);

 return nodemailer.createTransport({
 host: process.env.SMTP_HOST,
 port: Number(process.env.SMTP_PORT) || 587,
 secure: process.env.SMTP_SECURE === 'true',
 connectionTimeout: 15000,
 greetingTimeout: 15000,
 socketTimeout: 30000,
 auth: {
 user: process.env.SMTP_USER,
 pass: process.env.SMTP_PASS,
 },
 });
}

function getSettings(user: any) {
 const settings = user?.notificationSettings?.toObject?.() || user?.notificationSettings || {};
 return { ...defaultSettings, ...settings };
}

function canSend(user: any, key: NotificationKey) {
 const settings = getSettings(user);
 return Boolean(user?.email && settings.email && settings[key]);
}

async function getPatient(patientId: string) {
 return (User as any).findOne({ $or: [{ _id: patientId }, { uid: patientId }] });
}

async function getDoctorName(doctorId?: string) {
 if (!doctorId) return 'Врач FamilyDent';
 const names = await getDoctorNameMap([doctorId]);
 return names[doctorId] || 'Врач FamilyDent';
}

function formatBookingDate(booking: any) {
 return [booking.date, booking.time].filter(Boolean).join(' в ') || 'Дата и время уточняются';
}

function escapeHtml(value: string) {
 return String(value)
 .replace(/&/g, '&amp;')
 .replace(/</g, '&lt;')
 .replace(/>/g, '&gt;')
 .replace(/"/g, '&quot;')
 .replace(/'/g, '&#39;');
}

function normalizeUrl(value?: string) {
 return value?.trim().replace(/\/+$/, '') || '';
}

function renderEmailTemplate({ subject, body }: { subject: string; body: string }) {
 const clientUrl = normalizeUrl(process.env.CLIENT_URL) || 'http://localhost:3000';
 const logoUrl = getLogoPath() ? `cid:${logoCid}` : process.env.EMAIL_LOGO_URL?.trim() || `${clientUrl}/icon.svg`;
 const heroImageUrl = process.env.EMAIL_HERO_IMAGE_URL?.trim() || '';
 const safeSubject = escapeHtml(subject);
 const safeBody = escapeHtml(body).replace(/\r?\n/g, '<br>');

 return `<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="x-ua-compatible" content="ie=edge">
  <title>${safeSubject}</title>
</head>
<body style="margin:0;padding:0;background:#F3F1ED;color:#2C2A28;font-family:Arial,Helvetica,sans-serif;-webkit-text-size-adjust:100%;text-size-adjust:100%;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${safeSubject}</div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;background:#F3F1ED;border-collapse:collapse;">
    <tr>
      <td align="center" style="padding:24px 12px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:640px;background:#ffffff;border:1px solid #D1CDC7;border-radius:14px;overflow:hidden;border-collapse:separate;">
          <tr>
            <td style="padding:20px 24px;background:#ffffff;border-bottom:1px solid #D1CDC7;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:collapse;">
                <tr>
                  <td style="vertical-align:middle;">
                    <img src="${escapeHtml(logoUrl)}" width="44" height="44" alt="FamilyDent" style="display:inline-block;width:44px;height:44px;border:0;vertical-align:middle;">
                    <span style="display:inline-block;margin-left:10px;font-size:22px;line-height:28px;font-weight:700;color:#2C2A28;vertical-align:middle;">FamilyDent</span>
                  </td>
                  <td align="right" style="vertical-align:middle;font-size:12px;line-height:18px;color:#6F6A63;">Семейная стоматология</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background:#C6A15B;">
              ${heroImageUrl
 ? `<img src="${escapeHtml(heroImageUrl)}" width="640" alt="Клиника FamilyDent" style="display:block;width:100%;max-width:640px;height:auto;border:0;">`
 : `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:collapse;background:#C6A15B;">
                  <tr>
                    <td style="padding:34px 24px;color:#ffffff;">
                      <div style="font-size:12px;line-height:18px;text-transform:uppercase;letter-spacing:1px;font-weight:700;">FamilyDent</div>
                      <div style="margin-top:8px;font-size:28px;line-height:34px;font-weight:700;">Заботимся о вашей улыбке</div>
                    </td>
                  </tr>
                </table>`}
            </td>
          </tr>
          <tr>
            <td style="padding:30px 24px 8px;background:#ffffff;">
              <h1 style="margin:0;color:#2C2A28;font-size:24px;line-height:32px;font-weight:700;">${safeSubject}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:10px 24px 22px;background:#ffffff;">
              <div style="font-size:16px;line-height:25px;color:#2C2A28;">${safeBody}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:0 24px 28px;background:#ffffff;">
              <a href="${escapeHtml(clientUrl)}" target="_blank" style="display:inline-block;background:#C6A15B;color:#ffffff;text-decoration:none;font-size:15px;line-height:20px;font-weight:700;padding:13px 22px;border-radius:8px;">Перейти в личный кабинет</a>
            </td>
          </tr>
          <tr>
            <td style="padding:22px 24px;background:#F3F1ED;border-top:1px solid #D1CDC7;border-bottom:1px solid #D1CDC7;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:collapse;">
                <tr>
                  <td style="font-size:15px;line-height:22px;color:#2C2A28;font-weight:700;padding-bottom:8px;">Контакты клиники</td>
                </tr>
                <tr>
                  <td style="font-size:14px;line-height:22px;color:#2C2A28;">
                    Телефон: <a href="tel:+992446606600" style="color:#C6A15B;text-decoration:none;font-weight:700;">+992 446 60 66 00</a><br>
                    Адрес: г. Душанбе, FamilyDent<br>
                    Время работы: Пн - Сб, 7:30 - 19:00
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:18px 24px;background:#ffffff;">
              <p style="margin:0 0 8px;color:#6F6A63;font-size:12px;line-height:18px;">Вы получили это письмо согласно настройкам уведомлений в личном кабинете FamilyDent.</p>
              <p style="margin:0;color:#6F6A63;font-size:12px;line-height:18px;">Если уведомление пришло по ошибке, свяжитесь с администратором клиники.</p>
              <div style="margin-top:12px;font-size:0;line-height:0;">
                <span style="display:inline-block;width:46px;height:4px;background:#10B981;border-radius:4px;margin-right:6px;"></span>
                <span style="display:inline-block;width:46px;height:4px;background:#EF4444;border-radius:4px;"></span>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

async function sendNotification(to: string, subject: string, body: string) {
 const transporter = createTransporter();
 const logoPath = getLogoPath();
 await transporter.sendMail({
 from: process.env.SMTP_FROM || `"FamilyDent" <${process.env.SMTP_USER}>`,
 to,
 subject,
 text: body,
 html: renderEmailTemplate({ subject, body }),
 attachments: logoPath
 ? [{
 filename: 'icon.svg',
 path: logoPath,
 cid: logoCid,
 contentType: 'image/svg+xml',
 }]
 : [],
 });
}

export async function notifyBookingCreated(booking: any) {
 const patient = await getPatient(booking.patientId?.toString());
 if (!canSend(patient, 'bookingUpdates')) return;

 const doctorName = await getDoctorName(booking.doctorId?.toString());
 await sendNotification(
 patient.email,
 'FamilyDent: заявка на запись создана',
 `Здравствуйте, ${patient.displayName || 'пациент'}.

Ваша заявка на запись создана и ожидает подтверждения.

Услуга: ${booking.serviceId || 'Не указана'}
Врач: ${doctorName}
Дата и время: ${formatBookingDate(booking)}

Мы сообщим вам, когда администратор подтвердит запись.`,
 );
}

export async function notifyBookingStatusChanged(booking: any, previousStatus?: string) {
 const patient = await getPatient(booking.patientId?.toString());
 if (!patient) return;

 const status = String(booking.status || '');
 const key: NotificationKey = status === 'cancelled' ? 'cancellations' : 'bookingUpdates';
 if (!canSend(patient, key)) return;

 const doctorName = await getDoctorName(booking.doctorId?.toString());
 const labels: Record<string, string> = {
 pending: 'ожидает подтверждения',
 confirmed: 'подтверждена',
 cancelled: 'отменена',
 completed: 'завершена',
 };

 await sendNotification(
 patient.email,
 `FamilyDent: запись ${labels[status] || 'обновлена'}`,
 `Здравствуйте, ${patient.displayName || 'пациент'}.

Статус вашей записи изменен${previousStatus ? ` (${previousStatus} -> ${status})` : ''}.

Текущий статус: ${labels[status] || status}
Услуга: ${booking.serviceId || 'Не указана'}
Врач: ${doctorName}
Дата и время: ${formatBookingDate(booking)}`,
 );
}

export async function notifyBookingRescheduled(booking: any, previousDate?: string, previousTime?: string) {
 const patient = await getPatient(booking.patientId?.toString());
 if (!canSend(patient, 'cancellations')) return;

 const doctorName = await getDoctorName(booking.doctorId?.toString());
 await sendNotification(
 patient.email,
 'FamilyDent: перенос записи',
 `Здравствуйте, ${patient.displayName || 'пациент'}.

Ваша запись перенесена и ожидает повторного подтверждения.

Было: ${[previousDate, previousTime].filter(Boolean).join(' в ') || 'не указано'}
Стало: ${formatBookingDate(booking)}
Услуга: ${booking.serviceId || 'Не указана'}
Врач: ${doctorName}`,
 );
}

function parseBookingDateTime(booking: any) {
 if (!booking.date) return null;
 const raw = `${booking.date}T${booking.time || '00:00'}`;
 const date = new Date(raw);
 return Number.isNaN(date.getTime()) ? null : date;
}

export async function sendUpcomingAppointmentReminders() {
 const now = new Date();
 const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);
 const bookings = await (Booking as any).find({
 status: 'confirmed',
 date: { $exists: true },
 });

 let sent = 0;
 for (const booking of bookings) {
 const appointmentAt = parseBookingDateTime(booking);
 if (!appointmentAt || appointmentAt <= now || appointmentAt > in24Hours) continue;

 const reminderFor = `${booking.date}|${booking.time || ''}`;
 if (booking.reminderFor === reminderFor && booking.reminderSentAt) continue;

 const patient = await getPatient(booking.patientId?.toString());
 if (!canSend(patient, 'appointmentReminders')) continue;

 const doctorName = await getDoctorName(booking.doctorId?.toString());
 await sendNotification(
 patient.email,
 'FamilyDent: напоминание о приеме',
 `Здравствуйте, ${patient.displayName || 'пациент'}.

Напоминаем о вашем приеме в FamilyDent.

Услуга: ${booking.serviceId || 'Не указана'}
Врач: ${doctorName}
Дата и время: ${formatBookingDate(booking)}`,
 );

 booking.reminderFor = reminderFor;
 booking.reminderSentAt = new Date();
 await booking.save();
 sent += 1;
 }

 return sent;
}

export function startAppointmentReminderScheduler() {
 const intervalMs = Number(process.env.REMINDER_CHECK_INTERVAL_MS) || 30 * 60 * 1000;
 const run = async () => {
 try {
 const sent = await sendUpcomingAppointmentReminders();
 if (sent > 0) console.log(`[Notifications] Appointment reminders sent: ${sent}`);
 } catch (error) {
 console.error('[Notifications] Appointment reminder scheduler failed:', error);
 }
 };

 windowlessSetTimeout(run, 10_000);
 const timer = setInterval(run, intervalMs);
 return () => clearInterval(timer);
}

function windowlessSetTimeout(callback: () => void, ms: number) {
 setTimeout(callback, ms);
}
