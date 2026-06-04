import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { fileURLToPath } from 'url';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const uploadDir = path.join(__dirname, '..', 'uploads');
fs.mkdirSync(uploadDir, { recursive: true });

const allowedUploadTypes = new Set([
 'image/jpeg',
 'image/png',
 'image/webp',
 'application/pdf'
]);

const storage = multer.diskStorage({
 destination: (_req, _file, cb) => cb(null, uploadDir),
 filename: (_req, file, cb) => {
 const ext = path.extname(file.originalname).toLowerCase();
 const safeBase = path
 .basename(file.originalname, ext)
 .replace(/[^a-zA-Z0-9а-яА-ЯёЁ_-]+/g, '-')
 .slice(0, 50);
 cb(null, `${Date.now()}-${safeBase || 'file'}${ext}`);
 }
});

const upload = multer({
 storage,
 limits: { fileSize: 8 * 1024 * 1024 },
 fileFilter: (_req, file, cb) => {
 if (!allowedUploadTypes.has(file.mimetype)) {
 cb(new Error('Недопустимый тип файла. Разрешены jpg, jpeg, png, webp и pdf.'));
 return;
 }
 cb(null, true);
 }
});

// --- Безопасность и базовые настройки ---
app.use(helmet({
 contentSecurityPolicy: false,
 hsts: process.env.NODE_ENV === 'production' ? { maxAge: 31536000, includeSubDomains: true, preload: true } : false
}));
app.use(cors({
 origin: (origin, cb) => {
 const clientUrl = process.env.CLIENT_URL?.replace(/\/+$/, '');
 if (!origin || !clientUrl || origin === clientUrl) return cb(null, true);
 return cb(new Error('Not allowed by CORS'));
 },
 credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser(process.env.COOKIE_SECRET || 'family-dent-cookie-secret'));
app.use(mongoSanitize());
app.use('/uploads', express.static(uploadDir, {
 maxAge: '7d',
 setHeaders: (res) => {
 res.setHeader('Cache-Control', 'public, max-age=604800');
 }
}));

// --- Документация API ---
const swaggerOptions = {
 definition: {
 openapi: '3.0.0',
 info: {
 title: 'Family Dent API',
 version: '1.0.0',
 description: 'Документация API стоматологии'
 },
 servers: [{ url: 'http://localhost:3000' }],
 components: {
 securitySchemes: {
 bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
 }
 }
 },
 apis: ['./backend/routes/*.ts']
};
const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// --- Загруженные файлы ---
app.post('/api/upload', upload.single('file'), (req, res) => {
 if (!req.file) {
 return res.status(400).json({ error: 'Файл не был загружен' });
 }

 res.json({
 url: `/uploads/${req.file.filename}`,
 path: `/uploads/${req.file.filename}`,
 originalName: req.file.originalname,
 mimeType: req.file.mimetype,
 size: req.file.size
 });
});

app.use((err: any, _req: express.Request, res: express.Response, next: express.NextFunction) => {
 if (!err) return next();
 if (err instanceof multer.MulterError) {
 return res.status(400).json({ error: err.code === 'LIMIT_FILE_SIZE' ? 'Файл слишком большой. Максимум 8 МБ.' : err.message });
 }
 if (err.message?.includes('Недопустимый тип')) {
 return res.status(400).json({ error: err.message });
 }
 return next(err);
});

export default app;
