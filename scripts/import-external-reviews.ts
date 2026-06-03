import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import dns from 'dns';

type ReviewSource = 'google' | 'yandex';

interface ExternalReviewInput {
 source?: ReviewSource;
 externalId?: string;
 authorName?: string;
 patientName?: string;
 rating?: number;
 text?: string;
 comment?: string;
 date?: string;
 sourceUrl?: string;
 doctorName?: string;
}

const rootDir = path.resolve(process.cwd());

dotenv.config({ path: path.join(rootDir, '.env') });
dotenv.config({ path: path.join(rootDir, 'backend', '.env'), override: true });

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const inputPath = args.find((arg) => arg !== '--dry-run');

if (!inputPath) {
 console.error('Usage: npm run import:reviews -- scripts/reviews.import.example.json');
 console.error('Dry run: npm run import:reviews -- scripts/reviews.import.example.json --dry-run');
 process.exit(1);
}

function stableHash(value: string) {
 return crypto.createHash('sha256').update(value).digest('hex').slice(0, 24);
}

function normalizeSource(value?: string): ReviewSource {
 if (value === 'google' || value === 'yandex') return value;
 throw new Error(`Unsupported review source: ${value || 'empty'}`);
}

function normalizeRating(value: unknown) {
 const rating = Number(value);
 if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
 throw new Error(`Invalid rating: ${String(value)}`);
 }
 return Math.round(rating);
}

function normalizeReview(item: ExternalReviewInput) {
 const source = normalizeSource(item.source);
 const patientName = String(item.patientName || item.authorName || 'Пользователь карт').trim();
 const text = String(item.text || item.comment || '').trim();
 const rating = normalizeRating(item.rating);
 const date = item.date ? new Date(item.date) : new Date();

 if (!text) throw new Error('Review text is required');
 if (Number.isNaN(date.getTime())) throw new Error(`Invalid review date: ${item.date}`);

 const externalId = item.externalId ? String(item.externalId).trim() : '';
 const externalKey = externalId
 ? `${source}:${externalId}`
 : `${source}:hash:${stableHash([source, patientName, rating, text, date.toISOString().slice(0, 10)].join('|'))}`;

 const id = `external-review-${stableHash(externalKey)}`;

 return {
 _id: id,
 patientId: `external-${source}`,
 appointmentId: externalKey,
 patientName,
 doctorName: item.doctorName ? String(item.doctorName).trim() : '',
 rating,
 text,
 comment: text,
 status: 'pending',
 source,
 externalId,
 externalKey,
 sourceUrl: item.sourceUrl ? String(item.sourceUrl).trim() : '',
 importedAt: new Date(),
 createdAt: date,
 updatedAt: new Date(),
 };
}

async function main() {
 const resolvedPath = path.resolve(rootDir, inputPath);
 const raw = fs.readFileSync(resolvedPath, 'utf8');
 const parsed = JSON.parse(raw);
 const items: ExternalReviewInput[] = Array.isArray(parsed) ? parsed : parsed.reviews;

 if (!Array.isArray(items)) {
 throw new Error('Import JSON must be an array or an object with a reviews array.');
 }

 const normalizedReviews = items.map(normalizeReview);

 if (dryRun) {
 console.log(`Dry run completed. Valid reviews in file: ${normalizedReviews.length}. Nothing was written.`);
 return;
 }

 const mongoUri = process.env.MONGODB_URI;
 if (!mongoUri) {
 throw new Error('MONGODB_URI environment variable is not defined.');
 }

 const dnsServers = (process.env.MONGODB_DNS_SERVERS || '8.8.8.8,1.1.1.1')
 .split(',')
 .map((server) => server.trim())
 .filter(Boolean);

 if (dnsServers.length > 0) dns.setServers(dnsServers);

 await mongoose.connect(mongoUri, {
 serverSelectionTimeoutMS: 15000,
 connectTimeoutMS: 15000,
 socketTimeoutMS: 30000,
 });

 const Review = mongoose.models.Review || mongoose.model('Review', new mongoose.Schema({}, {
 strict: false,
 collection: 'reviews',
 timestamps: true,
 }));

 let inserted = 0;
 let skipped = 0;

 for (const review of normalizedReviews) {
 const duplicateConditions: any[] = [{ externalKey: review.externalKey }];
 if (review.externalId) {
 duplicateConditions.push({ source: review.source, externalId: review.externalId });
 }

 const existing = await (Review as any).findOne({
 $or: duplicateConditions,
 });

 if (existing) {
 skipped += 1;
 continue;
 }

 await (Review as any).create(review);
 inserted += 1;
 }

 console.log(`External reviews import completed. Inserted: ${inserted}. Skipped duplicates: ${skipped}.`);
}

main()
 .catch((error) => {
 console.error('External reviews import failed:', error);
 process.exitCode = 1;
 })
 .finally(async () => {
 await mongoose.disconnect().catch(() => {});
 });
