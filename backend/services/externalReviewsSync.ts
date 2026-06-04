import crypto from 'crypto';
import { Review as ReviewModel } from '../models/Review';

type ReviewSource = 'google' | 'yandex';
type ReviewsProvider = 'apify' | 'outscraper';

type ExternalReview = {
 source: ReviewSource;
 externalId: string;
 authorName: string;
 rating: number;
 text: string;
 date?: Date;
 externalUrl?: string;
};

type SyncResult = {
 source: ReviewSource;
 provider: string;
 fetched: number;
 created: number;
 skipped: number;
 updated: number;
 error?: string;
};

const Review = ReviewModel as any;
const SYNC_INTERVAL_MS = 60 * 60 * 1000;

function getProvider(): ReviewsProvider | null {
 const provider = String(process.env.REVIEWS_PROVIDER || '').toLowerCase().trim();
 if (provider === 'apify' || provider === 'outscraper') return provider;
 return null;
}

function getPlaceUrl(source: ReviewSource) {
 return source === 'google'
 ? process.env.GOOGLE_MAPS_PLACE_URL?.trim()
 : process.env.YANDEX_MAPS_PLACE_URL?.trim();
}

function createExternalId(source: ReviewSource, raw: any) {
 const value = [
 raw.review_id,
 raw.reviewId,
 raw.id,
 raw.review_url,
 raw.reviewUrl,
 raw.author_url,
 raw.authorUrl,
 raw.author_name,
 raw.authorName,
 raw.name,
 raw.text,
 raw.review_text,
 raw.time,
 raw.date,
 ].filter(Boolean).join('|');

 return crypto.createHash('sha256').update(`${source}|${value}`).digest('hex');
}

function toDate(value: unknown): Date | undefined {
 if (!value) return undefined;

 if (value instanceof Date) {
 const date = new Date(value);
 return Number.isNaN(date.getTime()) ? undefined : date;
 }

 if (typeof value === 'object') {
 const raw = value as Record<string, unknown>;
 return toDate(raw.$date || raw.date || raw.datetime || raw.timestamp || raw.seconds || raw._seconds);
 }

 if (typeof value === 'number') {
 const date = new Date(value > 10_000_000_000 ? value : value * 1000);
 return Number.isNaN(date.getTime()) ? undefined : date;
 }

 const normalized = String(value).trim();
 if (!normalized) return undefined;

 const partialNumericDate = parsePartialNumericDate(normalized);
 if (partialNumericDate) return partialNumericDate;

 const date = new Date(normalized);
 return Number.isNaN(date.getTime()) ? undefined : date;
}

function parsePartialNumericDate(value: string) {
 const match = value.match(/^(\d{1,2})[./-](\d{1,2})$/);
 if (!match) return undefined;

 const first = Number(match[1]);
 const second = Number(match[2]);
 if (!Number.isInteger(first) || !Number.isInteger(second)) return undefined;

 const isDayMonth = first > 12;
 const month = isDayMonth ? second : first;
 const day = isDayMonth ? first : second;
 if (month < 1 || month > 12 || day < 1 || day > 31) return undefined;

 const now = new Date();
 let date = new Date(now.getFullYear(), month - 1, day);

 if (date.getTime() > now.getTime() + 24 * 60 * 60 * 1000) {
 date = new Date(now.getFullYear() - 1, month - 1, day);
 }

 return Number.isNaN(date.getTime()) ? undefined : date;
}

function pickFirst(...values: unknown[]) {
 return values.find((value) => value !== undefined && value !== null && String(value).trim() !== '');
}

function getPublishedDate(raw: any) {
 return toDate(pickFirst(
 raw.publishedAtDate,
 raw.published_at_date,
 raw.reviewPublishedAtDate,
 raw.review_published_at_date,
 raw.review_datetime_utc,
 raw.datetime_utc,
 raw.reviewDate,
 raw.review_date,
 raw.publishedAt,
 raw.published_at,
 raw.date,
 raw.time,
 raw.timestamp,
 raw.reviewTimestamp,
 raw.review_timestamp,
 raw.createdTime,
 raw.created_time,
 ));
}

function toRating(value: unknown) {
 const rating = Number(value);
 if (!Number.isFinite(rating)) return 5;
 return Math.max(1, Math.min(5, Math.round(rating)));
}

function flattenReviews(payload: any): any[] {
 if (Array.isArray(payload)) {
 return payload.flatMap((item) => {
 if (Array.isArray(item?.reviews)) return item.reviews;
 if (Array.isArray(item?.reviews_data)) return item.reviews_data;
 if (Array.isArray(item?.data)) return item.data;
 return [item];
 });
 }

 if (Array.isArray(payload?.reviews)) return payload.reviews;
 if (Array.isArray(payload?.reviews_data)) return payload.reviews_data;
 if (Array.isArray(payload?.data)) return flattenReviews(payload.data);
 if (Array.isArray(payload?.result)) return flattenReviews(payload.result);
 if (Array.isArray(payload?.items)) return flattenReviews(payload.items);
 return [];
}

function normalizeReviews(source: ReviewSource, payload: any, placeUrl: string): ExternalReview[] {
 return flattenReviews(payload)
 .map((raw) => {
 const text = String(raw.text || raw.review_text || raw.reviewText || raw.comment || raw.content || '').trim();
 const authorName = String(raw.authorName || raw.author_name || raw.name || raw.userName || raw.user_name || 'Пользователь').trim();
 const externalUrl = String(raw.reviewUrl || raw.review_url || raw.url || raw.link || placeUrl || '').trim();
 const externalId = String(raw.externalId || raw.review_id || raw.reviewId || raw.id || '').trim() || createExternalId(source, raw);

 return {
 source,
 externalId,
 authorName,
 rating: toRating(raw.rating || raw.stars || raw.score),
 text,
 date: getPublishedDate(raw),
 externalUrl,
 };
 })
 .filter((review) => review.externalId && review.text && review.rating >= 1 && review.rating <= 5);
}

async function fetchOutscraperReviews(source: ReviewSource, placeUrl: string, apiKey: string) {
 const endpoint = source === 'google'
 ? 'https://api.app.outscraper.com/maps/reviews-v3'
 : 'https://api.app.outscraper.com/yandex/reviews';
 const url = new URL(endpoint);
 url.searchParams.set('query', placeUrl);
 url.searchParams.set('reviewsLimit', String(Number(process.env.REVIEWS_SYNC_LIMIT) || 100));
 url.searchParams.set('async', 'false');

 const response = await fetch(url, {
 headers: { 'X-API-KEY': apiKey },
 });

 if (!response.ok) {
 throw new Error(`Outscraper ${source} failed: ${response.status} ${await response.text()}`);
 }

 return response.json();
}

async function fetchApifyReviews(source: ReviewSource, placeUrl: string, apiKey: string) {
 const actor = source === 'google'
 ? (process.env.APIFY_GOOGLE_REVIEWS_ACTOR || 'compass/google-maps-reviews-scraper')
 : (process.env.APIFY_YANDEX_REVIEWS_ACTOR || 'drobnikj/yandex-maps-reviews-scraper');
 const actorId = actor.replace('/', '~');
 const url = new URL(`https://api.apify.com/v2/acts/${actorId}/run-sync-get-dataset-items`);
 url.searchParams.set('token', apiKey);

 const response = await fetch(url, {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({
 startUrls: [{ url: placeUrl }],
 maxReviews: Number(process.env.REVIEWS_SYNC_LIMIT) || 100,
 reviewsLimit: Number(process.env.REVIEWS_SYNC_LIMIT) || 100,
 }),
 });

 if (!response.ok) {
 throw new Error(`Apify ${source} failed: ${response.status} ${await response.text()}`);
 }

 return response.json();
}

async function fetchProviderReviews(source: ReviewSource) {
 const provider = getProvider();
 const apiKey = process.env.REVIEWS_API_KEY?.trim();
 const placeUrl = getPlaceUrl(source);

 if (!provider) throw new Error('REVIEWS_PROVIDER must be apify or outscraper');
 if (!apiKey) throw new Error('REVIEWS_API_KEY is missing');
 if (!placeUrl) throw new Error(`${source === 'google' ? 'GOOGLE_MAPS_PLACE_URL' : 'YANDEX_MAPS_PLACE_URL'} is missing`);

 const payload = provider === 'outscraper'
 ? await fetchOutscraperReviews(source, placeUrl, apiKey)
 : await fetchApifyReviews(source, placeUrl, apiKey);

 return {
 provider,
 reviews: normalizeReviews(source, payload, placeUrl),
 };
}

async function saveReviews(source: ReviewSource, reviews: ExternalReview[]) {
 let created = 0;
 let skipped = 0;
 let updated = 0;

 for (const review of reviews) {
 const externalKey = `${source}:${review.externalId}`;
 const exists = await Review.findOne({ externalKey }).select('_id date');
 if (exists) {
 if (review.date && (!exists.date || new Date(exists.date).getTime() !== review.date.getTime())) {
 await Review.updateOne({ _id: exists._id }, { $set: { date: review.date } });
 updated += 1;
 }
 skipped += 1;
 continue;
 }

 await Review.create({
 _id: `external-${source}-${crypto.randomUUID()}`,
 patientId: `external-${source}`,
 appointmentId: externalKey,
 patientName: review.authorName,
 authorName: review.authorName,
 source,
 externalId: review.externalId,
 externalKey,
 externalUrl: review.externalUrl,
 sourceUrl: review.externalUrl,
 rating: review.rating,
 text: review.text,
 comment: review.text,
 date: review.date,
 importedAt: new Date(),
 status: 'approved',
 moderationStatus: 'approved',
 moderationReason: 'Внешний отзыв импортирован и одобрен',
 moderationScore: 100,
 moderatedAt: new Date(),
 moderatedBy: 'external-sync',
 });
 created += 1;
 }

 return { created, skipped, updated };
}

async function syncSource(source: ReviewSource): Promise<SyncResult> {
 const provider = getProvider() || 'not-configured';

 try {
 const result = await fetchProviderReviews(source);
 const saved = await saveReviews(source, result.reviews);
 return {
 source,
 provider: result.provider,
 fetched: result.reviews.length,
 created: saved.created,
 skipped: saved.skipped,
 updated: saved.updated,
 };
 } catch (error: any) {
 const message = error?.message || String(error);
 console.error(`[ExternalReviews] ${source} sync failed:`, message);
 return { source, provider, fetched: 0, created: 0, skipped: 0, updated: 0, error: message };
 }
}

export function syncGoogleReviews() {
 return syncSource('google');
}

export function syncYandexReviews() {
 return syncSource('yandex');
}

export async function syncExternalReviews() {
 const [google, yandex] = await Promise.all([
 syncGoogleReviews(),
 syncYandexReviews(),
 ]);
 return { google, yandex };
}

export function startExternalReviewsSyncScheduler() {
 const run = async () => {
 try {
 const result = await syncExternalReviews();
 console.log('[ExternalReviews] sync completed:', JSON.stringify(result));
 } catch (error) {
 console.error('[ExternalReviews] scheduler failed:', error);
 }
 };

 const timer = setInterval(run, SYNC_INTERVAL_MS);
 windowlessSetTimeout(run, 30_000);
 return () => clearInterval(timer);
}

function windowlessSetTimeout(callback: () => void, ms: number) {
 setTimeout(callback, ms);
}
