import { Review as ReviewModel } from '../models/Review';

export type ReviewModerationStatus = 'approved' | 'pending' | 'rejected';

type ModerationResult = {
 status: ReviewModerationStatus;
 reason: string;
 score: number;
};

const Review = ReviewModel as any;

const forbiddenWords = [
 'хуй',
 'пизд',
 'еба',
 'ёба',
 'сука',
 'бляд',
 'блять',
 'мраз',
 'урод',
 'твар',
 'идиот',
 'дебил',
 'лох',
 'fuck',
 'shit',
 'bitch',
];

const adPhrases = [
 'купить',
 'скидка',
 'акция',
 'заработок',
 'быстрые деньги',
 'подписывайтесь',
 'переходите',
 'лучший способ заработать',
 'реклама',
 'промокод',
 'казино',
 'ставки',
 'кредит',
 'займ',
];

function normalize(text: string) {
 return String(text || '')
 .toLowerCase()
 .replace(/ё/g, 'е')
 .replace(/\s+/g, ' ')
 .trim();
}

function hasUrl(text: string) {
 return /(https?:\/\/|www\.|t\.me\/|@[\w.-]+|[\w.-]+\.(ru|com|net|org|tj|io|biz)\b)/i.test(text);
}

function hasPhone(text: string) {
 return /(?:\+?\d[\s().-]*){8,}/.test(text);
}

function hasRepeatedCharacters(text: string) {
 return /(.)\1{5,}/i.test(text) || /\b(\w+)(?:\s+\1){3,}\b/i.test(text);
}

function hasLowTextQuality(text: string) {
 const compact = text.replace(/\s+/g, '');
 if (compact.length < 10) return true;

 const letters = compact.match(/[a-zа-я]/gi)?.length || 0;
 const vowels = compact.match(/[aeiouyаеёиоуыэюя]/gi)?.length || 0;
 const uniqueChars = new Set(compact.toLowerCase()).size;

 if (letters / Math.max(compact.length, 1) < 0.45) return true;
 if (vowels / Math.max(letters, 1) < 0.18) return true;
 if (uniqueChars <= 4 && compact.length > 12) return true;
 return false;
}

function ruleBasedModeration(text: string): ModerationResult {
 const clean = normalize(text);
 const reasons: string[] = [];
 let score = 100;
 let status: ReviewModerationStatus = 'approved';

 if (clean.length < 10) {
 reasons.push('Слишком короткий текст');
 score -= 35;
 status = 'pending';
 }

 if (forbiddenWords.some((word) => clean.includes(word))) {
 reasons.push('Запрещенные слова или оскорбления');
 score -= 70;
 status = 'rejected';
 }

 if (hasUrl(clean)) {
 reasons.push('Ссылки или внешние контакты');
 score -= 55;
 status = status === 'rejected' ? status : 'pending';
 }

 if (hasPhone(clean)) {
 reasons.push('Телефон в тексте');
 score -= 45;
 status = status === 'rejected' ? status : 'pending';
 }

 if (hasRepeatedCharacters(clean)) {
 reasons.push('Повторяющиеся символы или слова');
 score -= 35;
 status = status === 'rejected' ? status : 'pending';
 }

 if (adPhrases.some((phrase) => clean.includes(phrase))) {
 reasons.push('Похоже на рекламу');
 score -= 55;
 status = status === 'rejected' ? status : 'pending';
 }

 if (hasLowTextQuality(clean)) {
 reasons.push('Подозрительно низкое качество текста');
 score -= 35;
 status = status === 'rejected' ? status : 'pending';
 }

 score = Math.max(0, Math.min(100, score));

 if (status !== 'rejected' && score < 35) status = 'rejected';
 else if (status === 'approved' && score < 75) status = 'pending';

 return {
 status,
 reason: reasons.join('; ') || 'Нарушений не найдено',
 score,
 };
}

async function extendedModeration(text: string, fallback: ModerationResult): Promise<ModerationResult> {
 if (process.env.REVIEW_AI_MODERATION_ENABLED !== 'true') return fallback;
 if (!process.env.OPENROUTER_API_KEY) return fallback;

 try {
 const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
 method: 'POST',
 headers: {
 'Content-Type': 'application/json',
 Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
 'HTTP-Referer': process.env.APP_URL || process.env.CLIENT_URL || 'http://localhost:5000',
 'X-Title': 'FamilyDent Review Moderation',
 },
 body: JSON.stringify({
 model: process.env.REVIEW_AI_MODERATION_MODEL || process.env.OPENROUTER_MODEL || 'qwen/qwen-2.5-7b-instruct',
 temperature: 0,
 max_tokens: 160,
 messages: [
 {
 role: 'system',
 content:
 'Ты модератор отзывов стоматологической клиники. Верни только JSON: {"status":"approved|pending|rejected","reason":"краткая причина","score":0-100}. Отклоняй явный спам, мат, оскорбления, ссылки, рекламу и бессмысленный текст. Сомнительное отправляй в pending.',
 },
 { role: 'user', content: text.slice(0, 2000) },
 ],
 }),
 });

 if (!response.ok) throw new Error(`Проверка отзыва недоступна: ${response.status}`);
 const payload = await response.json();
 const content = payload?.choices?.[0]?.message?.content || '';
 const parsed = JSON.parse(String(content).match(/\{[\s\S]*\}/)?.[0] || '{}');
 const status = parsed.status;

 if (!['approved', 'pending', 'rejected'].includes(status)) return fallback;

 return {
 status,
 reason: String(parsed.reason || fallback.reason).slice(0, 300),
 score: Math.max(0, Math.min(100, Number(parsed.score ?? fallback.score))),
 };
 } catch (error) {
 console.error('[ReviewModeration] Проверка отзыва недоступна:', error);
 return fallback;
 }
}

export async function moderateReview(text: string): Promise<ModerationResult> {
 const ruleResult = ruleBasedModeration(text);
 return extendedModeration(text, ruleResult);
}

export async function migrateReviewModerationStatuses() {
 try {
 const result = await Review.updateMany(
 { moderationStatus: { $exists: false } },
 {
 $set: {
 moderationStatus: 'approved',
 moderationReason: 'Старый отзыв одобрен при обновлении системы',
 moderationScore: 100,
 },
 },
 );

 if (result.modifiedCount > 0) {
 console.log(`[ReviewModeration] Одобрено старых отзывов: ${result.modifiedCount}`);
 }
 } catch (error) {
 console.error('[ReviewModeration] Не удалось обновить старые отзывы:', error);
 }
}
