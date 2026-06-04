import { Router } from 'express';
import { Article as ArticleModel } from '../models/Article';
import { authenticate, authorize } from '../middleware/auth';
import { createSlug } from '../utils/slug';

const Article = ArticleModel as any;
const router = Router();

router.get('/', async (_req, res) => {
 try {
 const articles = await Article.find().sort({ date: -1, createdAt: -1 });
 res.json(articles);
 } catch (err) {
 res.status(500).json({ error: 'Ошибка при получении статей' });
 }
});

router.get('/:id', async (req, res) => {
 try {
 const article = await findArticle(req.params.id);
 if (!article) return res.status(404).json({ error: 'Статья не найдена' });
 res.json(article);
 } catch (err) {
 res.status(500).json({ error: 'Ошибка сервера' });
 }
});

router.post('/', authenticate, authorize('admin'), async (req: any, res) => {
 try {
 const payload = normalizeArticlePayload(req.body);
 if (!payload.title || !payload.content) {
 return res.status(400).json({ error: 'Заполните заголовок и основной текст' });
 }

 const article = new Article(payload);
 await article.save();
 res.status(201).json(article);
 } catch (err) {
 res.status(400).json({ error: 'Ошибка при создании статьи' });
 }
});

router.patch('/:id', authenticate, authorize('admin'), async (req, res) => {
 try {
 const payload = normalizeArticlePayload(req.body);
 if (!payload.title || !payload.content) {
 return res.status(400).json({ error: 'Заполните заголовок и основной текст' });
 }

 const article = await Article.findByIdAndUpdate(req.params.id, payload, {
 new: true,
 runValidators: true
 });
 if (!article) return res.status(404).json({ error: 'Статья не найдена' });
 res.json(article);
 } catch (err) {
 res.status(400).json({ error: 'Ошибка при обновлении статьи' });
 }
});

router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
 try {
 const article = await Article.findByIdAndDelete(req.params.id);
 if (!article) return res.status(404).json({ error: 'Статья не найдена' });
 res.json({ message: 'Статья удалена' });
 } catch (err) {
 res.status(500).json({ error: 'Ошибка при удалении статьи' });
 }
});

function normalizeArticlePayload(body: any) {
 const title = String(body.title || '').trim();
 const requestedSlug = String(body.slug || '').trim();

 return {
 title,
 slug: createSlug(requestedSlug || title),
 excerpt: String(body.excerpt || '').trim(),
 content: String(body.content || '').trim(),
 image: String(body.image || '').trim(),
 category: String(body.category || '').trim(),
 status: body.status === 'draft' ? 'draft' : 'published',
 author: String(body.author || '').trim(),
 readTime: String(body.readTime || '').trim(),
 tags: Array.isArray(body.tags)
 ? body.tags.map((tag: string) => String(tag).trim()).filter(Boolean)
 : String(body.tags || '')
 .split(',')
 .map((tag) => tag.trim())
 .filter(Boolean),
 date: body.date || new Date()
 };
}

function findArticle(idOrSlug: string) {
 if (/^[a-f\d]{24}$/i.test(idOrSlug)) {
 return Article.findById(idOrSlug);
 }

 return Article.findOne({ slug: idOrSlug });
}

export default router;
