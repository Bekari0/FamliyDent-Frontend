const dns = require('dns');
const path = require('path');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');

dotenv.config({ path: path.join(process.cwd(), '.env') });
dotenv.config({ path: path.join(process.cwd(), 'backend', '.env'), override: true });

const recipient =
 process.argv[2] ||
 process.env.TEST_NOTIFICATION_EMAIL ||
 process.env.SEED_ADMIN_EMAIL ||
 process.env.SMTP_USER;

const notifications = [
 ['email', 'Email-уведомления', 'Тест FamilyDent: Email-уведомления', 'Получать важные сообщения на почту'],
 ['bookingUpdates', 'Уведомления о записи', 'Тест FamilyDent: Уведомления о записи', 'Подтверждения и изменения записей'],
 ['appointmentReminders', 'Напоминания о приеме', 'Тест FamilyDent: Напоминания о приеме', 'Напоминания перед визитом'],
 ['cancellations', 'Отмена и перенос', 'Тест FamilyDent: Отмена и перенос', 'Сообщения об отмене или изменении приема'],
 ['news', 'Новости и акции', 'Тест FamilyDent: Новости и акции', 'Полезные новости клиники'],
];

function requireEnv(name) {
 const value = process.env[name];
 if (!value) throw new Error(`${name} is not configured`);
 return value;
}

async function main() {
 if (!recipient) throw new Error('Recipient email is not configured. Pass it as an argument.');

 const dnsServers = (process.env.SMTP_DNS_SERVERS || process.env.MONGODB_DNS_SERVERS || '8.8.8.8,1.1.1.1')
 .split(',')
 .map((server) => server.trim())
 .filter(Boolean);

 if (dnsServers.length > 0) {
 dns.setServers(dnsServers);
 console.log(`Node DNS servers: ${dnsServers.join(', ')}`);
 }

 const transporter = nodemailer.createTransport({
 host: requireEnv('SMTP_HOST'),
 port: Number(process.env.SMTP_PORT) || 587,
 secure: process.env.SMTP_SECURE === 'true',
 connectionTimeout: 15000,
 greetingTimeout: 15000,
 socketTimeout: 30000,
 auth: {
 user: requireEnv('SMTP_USER'),
 pass: requireEnv('SMTP_PASS'),
 },
 });

 await transporter.verify();
 console.log(`SMTP verified. Sending ${notifications.length} test emails to ${recipient}.`);

 for (const [key, title, subject, text] of notifications) {
 await transporter.sendMail({
 from: process.env.SMTP_FROM || `"FamilyDent" <${process.env.SMTP_USER}>`,
 to: recipient,
 subject,
 text: `${title}\n\n${text}\n\nЭто тестовое уведомление FamilyDent. Категория: ${key}.`,
 html: `
 <div style="font-family:Arial,sans-serif;line-height:1.5;color:#24211f">
 <h2 style="margin:0 0 12px">FamilyDent</h2>
 <p style="margin:0 0 8px;font-weight:700">${title}</p>
 <p style="margin:0 0 16px">${text}</p>
 <p style="color:#6b6661;font-size:13px">Это тестовое уведомление FamilyDent. Категория: ${key}.</p>
 </div>
 `,
 });
 console.log(`Sent: ${key}`);
 }
}

main().catch((error) => {
 console.error('Test notifications failed:', error);
 process.exitCode = 1;
});
