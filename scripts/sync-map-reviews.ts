import crypto from 'crypto';
import dns from 'dns';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

type ReviewSource = 'google' | 'yandex';

interface NormalizedReview {
 _id: string;
 patientId: string;
 appointmentId: string;
 patientName: string;
 rating: number;
 text: string;
 comment: string;
 status: 'pending';
 source: ReviewSource;
 externalId: string;
 externalKey: string;
 sourceUrl: string;
 importedAt: Date;
 createdAt: Date;
 updatedAt: Date;
}

const rootDir = process.cwd();

dotenv.config({ path: path.join(rootDir, '.env') });
dotenv.config({ path: path.join(rootDir, 'backend', '.env'), override: true });

function stableHash(value: string) {
 return crypto.createHash('sha256').update(value).digest('hex').slice(0, 24);
}

function toReviewDate(value: unknown) {
 if (typeof value === 'number') return new Date(value * 1000);
 if (typeof value === 'string' && value.trim()) {
 const parsed = new Date(value);
 if (!Number.isNaN(parsed.getTime())) return parsed;
 }
 return new Date();
}

function normalizeRating(value: unknown) {
 const rating = Number(value);
 if (!Number.isFinite(rating)) return 5;
 return Math.min(5, Math.max(1, Math.round(rating)));
}

function makeReview(input: {
 source: ReviewSource;
 externalId?: string;
 patientName?: string;
 rating?: unknown;
 text?: string;
 date?: unknown;
 sourceUrl?: string;
 }): NormalizedReview | null {
 const text = String(input.text || '').trim();
 if (!text) return null;

 const source = input.source;
 const patientName = String(input.patientName || 'Пользователь карт').trim();
 const rating = normalizeRating(input.rating);
 const date = toReviewDate(input.date);
 const externalId = String(input.externalId || '').trim();
 const externalKey = externalId
 ? `${source}:${externalId}`
 : `${source}:hash:${stableHash([source, patientName, rating, text, date.toISOString().slice(0, 10)].join('|'))}`;

 return {
 _id: `external-review-${stableHash(externalKey)}`,
 patientId: `external-${source}`,
 appointmentId: externalKey,
 patientName,
 rating,
 text,
 comment: text,
 status: 'pending',
 source,
 externalId,
 externalKey,
 sourceUrl: String(input.sourceUrl || '').trim(),
 importedAt: new Date(),
 createdAt: date,
 updatedAt: new Date(),
 };
}

async function connectMongo() {
 const mongoUri = process.env.MONGODB_URI;
 if (!mongoUri) throw new Error('MONGODB_URI environment variable is not defined.');

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

 return (mongoose.models.Review || mongoose.model('Review', new mongoose.Schema({}, {
 strict: false,
 collection: 'reviews',
 timestamps: true,
 }))) as any;
}

async function findGooglePlaceId(apiKey: string) {
 const configuredPlaceId = process.env.GOOGLE_PLACE_ID || process.env.GOOGLE_PLACE_IDS?.split(',')[0]?.trim();
 if (configuredPlaceId) return configuredPlaceId;

 const query = process.env.GOOGLE_PLACE_QUERY || 'FamilyDent Душанбе';
 const url = new URL('https://maps.googleapis.com/maps/api/place/findplacefromtext/json');
 url.searchParams.set('input', query);
 url.searchParams.set('inputtype', 'textquery');
 url.searchParams.set('fields', 'place_id,name,formatted_address');
 url.searchParams.set('language', 'ru');
 url.searchParams.set('key', apiKey);

 const response = await fetch(url);
 const data: any = await response.json();
 if (data.status !== 'OK' || !data.candidates?.[0]?.place_id) {
 throw new Error(`Google place search failed: ${data.status || response.status}`);
 }

 return data.candidates[0].place_id;
}

async function fetchGoogleReviews() {
 const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.GOOGLE_PLACES_API_KEY;
 if (!apiKey) {
 console.warn('[Google] skipped: GOOGLE_MAPS_API_KEY is not set.');
 return [];
 }

 const placeId = await findGooglePlaceId(apiKey);
 const url = new URL('https://maps.googleapis.com/maps/api/place/details/json');
 url.searchParams.set('place_id', placeId);
 url.searchParams.set('fields', 'name,url,user_ratings_total,reviews');
 url.searchParams.set('language', 'ru');
 url.searchParams.set('reviews_sort', 'newest');
 url.searchParams.set('key', apiKey);

 const response = await fetch(url);
 const data: any = await response.json();
 if (data.status !== 'OK') throw new Error(`Google place details failed: ${data.status || response.status}`);

 const placeUrl = data.result?.url || '';
 const reviews = Array.isArray(data.result?.reviews) ? data.result.reviews : [];
 console.log(`[Google] total ratings reported by Google: ${data.result?.user_ratings_total ?? 'unknown'}`);
 console.log(`[Google] reviews returned by official Place Details API: ${reviews.length}`);

 return reviews
 .map((review: any) => makeReview({
 source: 'google',
 externalId: review.author_url || `${review.author_name}-${review.time}`,
 patientName: review.author_name,
 rating: review.rating,
 text: review.text,
 date: review.time,
 sourceUrl: review.author_url || placeUrl,
 }))
 .filter(Boolean) as NormalizedReview[];
}

async function loadJsonFromPathOrUrl(value: string) {
 if (/^https?:\/\//i.test(value)) {
 const response = await fetch(value);
 if (!response.ok) throw new Error(`Could not download JSON: ${response.status}`);
 return response.json();
 }
 const filePath = path.resolve(rootDir, value);
 return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

async function fetchYandexReviews() {
 const source = process.env.YANDEX_REVIEWS_JSON || process.env.YANDEX_REVIEWS_JSON_URL || process.env.YANDEX_REVIEWS_JSON_PATH;
 if (!source) {
 console.warn('[Yandex] skipped: set YANDEX_REVIEWS_JSON, YANDEX_REVIEWS_JSON_URL, or YANDEX_REVIEWS_JSON_PATH.');
 return [];
 }

 const data = await loadJsonFromPathOrUrl(source);
 const rawReviews = Array.isArray(data) ? data : data.reviews;
 if (!Array.isArray(rawReviews)) throw new Error('Yandex JSON must be an array or an object with reviews array.');

 const defaultSourceUrl = process.env.YANDEX_MAPS_REVIEWS_URL || 'https://yandex.ru/maps/org/femili_dent/16415187433/reviews/';
 return rawReviews
 .map((review: any) => makeReview({
 source: 'yandex',
 externalId: review.externalId || review.id,
 patientName: review.authorName || review.patientName || review.author,
 rating: review.rating,
 text: review.text || review.comment,
 date: review.date || review.createdAt,
 sourceUrl: review.sourceUrl || defaultSourceUrl,
 }))
 .filter(Boolean) as NormalizedReview[];
}

async function saveReviews(reviews: NormalizedReview[]) {
 const Review = await connectMongo();
 let inserted = 0;
 let skipped = 0;

 for (const review of reviews) {
 const duplicateConditions: any[] = [{ externalKey: review.externalKey }];
 if (review.externalId) duplicateConditions.push({ source: review.source, externalId: review.externalId });

 const existing = await Review.findOne({ $or: duplicateConditions });
 if (existing) {
 skipped += 1;
 continue;
 }

 await Review.create(review);
 inserted += 1;
 }

 console.log(`Map reviews sync completed. Sent to moderation: ${inserted}. Skipped duplicates: ${skipped}.`);
}

async function main() {
 const sources = (process.env.MAP_REVIEW_SOURCES || 'google,yandex')
 .split(',')
 .map((source) => source.trim())
 .filter(Boolean);

 const reviews: NormalizedReview[] = [];
 if (sources.includes('google')) reviews.push(...await fetchGoogleReviews());
 if (sources.includes('yandex')) reviews.push(...await fetchYandexReviews());

 await saveReviews(reviews);
}

main()
 .catch((error) => {
 console.error('Map reviews sync failed:', error);
 process.exitCode = 1;
 })
 .finally(async () => {
 await mongoose.disconnect().catch(() => {});
 });
