import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import axios from 'axios';
import { Plus, Edit2, Trash2, Loader2, X, Upload, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';

const emptyForm = {
 title: '',
 excerpt: '',
 content: '',
 image: '',
 category: '',
 status: 'published',
 author: '',
 readTime: '',
 tags: ''
};

export function AdminBlog() {
 const [articles, setArticles] = useState<any[]>([]);
 const [loading, setLoading] = useState(true);
 const [saving, setSaving] = useState(false);
 const [uploading, setUploading] = useState(false);
 const [isModalOpen, setIsModalOpen] = useState(false);
 const [currentArticle, setCurrentArticle] = useState<any>(null);
 const [formData, setFormData] = useState(emptyForm);

 const fetchArticles = async () => {
 setLoading(true);
 try {
 const response = await axios.get('/api/articles');
 setArticles(Array.isArray(response.data) ? response.data : []);
 } catch (error) {
 toast.error('Ошибка загрузки статей');
 } finally {
 setLoading(false);
 }
 };

 useEffect(() => {
 fetchArticles();
 }, []);

 const handleOpenModal = (article: any = null) => {
 if (article) {
 setCurrentArticle(article);
 setFormData({
 title: article.title || '',
 excerpt: article.excerpt || '',
 content: article.content || '',
 image: article.image || '',
 category: article.category || '',
 status: article.status || 'published',
 author: article.author || '',
 readTime: article.readTime || '',
 tags: Array.isArray(article.tags) ? article.tags.join(', ') : article.tags || ''
 });
 } else {
 setCurrentArticle(null);
 setFormData(emptyForm);
 }
 setIsModalOpen(true);
 };

 const uploadImage = async (file: File) => {
 const data = new FormData();
 data.append('file', file);
 setUploading(true);
 try {
 const response = await axios.post('/api/upload', data, {
 headers: { 'Content-Type': 'multipart/form-data' }
 });
 setFormData((prev) => ({ ...prev, image: response.data.url }));
 toast.success('Изображение загружено');
 } catch (error: any) {
 toast.error(error.response?.data?.error || 'Ошибка загрузки изображения');
 } finally {
 setUploading(false);
 }
 };

 const handleSubmit = async (event: React.FormEvent) => {
 event.preventDefault();
 if (!formData.title.trim() || !formData.content.trim()) {
 toast.error('Заполните заголовок и основной текст');
 return;
 }

 const payload = {
 ...formData,
 tags: formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
 };

 setSaving(true);
 try {
 if (currentArticle) {
 await axios.patch(`/api/articles/${currentArticle._id || currentArticle.id}`, payload);
 toast.success('Статья обновлена');
 } else {
 await axios.post('/api/articles', payload);
 toast.success('Статья создана');
 }
 setIsModalOpen(false);
 await fetchArticles();
 } catch (error: any) {
 toast.error(error.response?.data?.error || 'Ошибка при сохранении статьи');
 } finally {
 setSaving(false);
 }
 };

 const deleteArticle = async (id: string) => {
 if (!id) return;
 if (!window.confirm('Удалить эту статью?')) return;

 try {
 await axios.delete(`/api/articles/${id}`);
 setArticles((prev) => prev.filter((article) => (article._id || article.id) !== id));
 toast.success('Статья удалена');
 } catch (error: any) {
 toast.error(error.response?.data?.error || 'Ошибка при удалении статьи');
 }
 };

 return (
 <div className="pt-24 pb-16 bg-background min-h-screen text-foreground">
 <div className="container mx-auto px-4">
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
 <div>
 <h1 className="text-3xl font-semibold text-foreground">Управление статьями</h1>
 <p className="text-muted-foreground">Создание, редактирование и публикация материалов блога</p>
 </div>
 <button
 onClick={() => handleOpenModal()}
 className="px-5 py-3 rounded-md bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:bg-primary-hover transition-all shadow-md"
 >
 <Plus className="w-5 h-5" />
 Новая статья
 </button>
 </div>

 {loading ? (
 <div className="flex flex-col items-center justify-center py-20">
 <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
 <p className="text-muted-foreground">Загрузка...</p>
 </div>
 ) : articles.length === 0 ? (
 <div className="rounded-md border border-dashed border-border bg-card py-16 text-center text-muted-foreground font-semibold">
 Статей пока нет
 </div>
 ) : (
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 {articles.map((article, index) => (
 <motion.div
 key={article._id || article.id}
 initial={{ opacity: 0, y: 16 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: index * 0.04 }}
 className="bg-card rounded-md border border-border shadow-md overflow-hidden flex flex-col"
 >
 <div className="aspect-video relative overflow-hidden bg-secondary">
 {article.image ? (
 <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
 ) : (
 <div className="w-full h-full flex items-center justify-center text-muted-foreground">
 <ImageIcon className="w-10 h-10" />
 </div>
 )}
 <div className="absolute top-2 left-2 px-2 py-1 bg-card/90 text-foreground text-[10px] font-semibold rounded uppercase">
 {article.category || 'Без категории'}
 </div>
 </div>
 <div className="p-5 flex-1 flex flex-col">
 <div className="flex items-center gap-2 mb-2">
 <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground font-semibold">
 {article.status === 'draft' ? 'Черновик' : 'Опубликовано'}
 </span>
 </div>
 <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">{article.title}</h3>
 <p className="text-muted-foreground text-sm mb-5 line-clamp-3 flex-1">{article.excerpt || 'Нет краткого описания'}</p>

 <div className="flex items-center justify-between pt-4 border-t border-border">
 <div className="flex gap-2">
 <button onClick={() => handleOpenModal(article)} className="p-2 bg-secondary text-foreground rounded-lg hover:bg-primary hover:text-primary-foreground transition-all" title="Редактировать">
 <Edit2 size={16} />
 </button>
 <button onClick={() => deleteArticle(article._id || article.id)} className="p-2 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/100 hover:text-primary-foreground transition-all" title="Удалить">
 <Trash2 size={16} />
 </button>
 </div>
 <span className="text-xs text-muted-foreground">
 {new Date(article.updatedAt || article.date || article.createdAt).toLocaleDateString('ru-RU')}
 </span>
 </div>
 </div>
 </motion.div>
 ))}
 </div>
 )}

 <AnimatePresence>
 {isModalOpen && (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 onClick={() => setIsModalOpen(false)}
 className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
 />
 <motion.div
 initial={{ opacity: 0, scale: 0.95, y: 20 }}
 animate={{ opacity: 1, scale: 1, y: 0 }}
 exit={{ opacity: 0, scale: 0.95, y: 20 }}
 className="relative w-full max-w-3xl bg-card rounded-md shadow-2xl overflow-hidden"
 >
 <div className="p-5 bg-secondary border-b border-border flex items-center justify-between">
 <h2 className="text-xl font-semibold">{currentArticle ? 'Редактировать статью' : 'Новая статья'}</h2>
 <button onClick={() => setIsModalOpen(false)} className="p-2 text-muted-foreground hover:text-foreground transition-colors">
 <X size={20} />
 </button>
 </div>
 <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[74vh] overflow-y-auto">
 <div className="grid md:grid-cols-2 gap-4">
 <Field label="Заголовок" required value={formData.title} onChange={(value) => setFormData({ ...formData, title: value })} />
 <Field label="Категория" value={formData.category} onChange={(value) => setFormData({ ...formData, category: value })} />
 </div>

 <div className="grid md:grid-cols-3 gap-4">
 <Field label="Автор" value={formData.author} onChange={(value) => setFormData({ ...formData, author: value })} />
 <Field label="Время чтения" value={formData.readTime} onChange={(value) => setFormData({ ...formData, readTime: value })} />
 <div className="space-y-1">
 <label className="text-sm font-medium text-foreground">Статус</label>
 <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-border outline-none bg-background text-foreground">
 <option value="published">Опубликовано</option>
 <option value="draft">Черновик</option>
 </select>
 </div>
 </div>

 <div className="space-y-2">
 <label className="text-sm font-medium text-foreground">Изображение</label>
 <div className="flex flex-col sm:flex-row gap-3">
 <input value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} placeholder="/uploads/image.webp или URL" className="flex-1 px-4 py-2 rounded-lg border border-border outline-none bg-background" />
 <label className="h-10 px-4 rounded-lg bg-secondary border border-border text-foreground font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer hover:bg-muted">
 {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4 text-primary" />}
 Загрузить
 <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(event) => event.target.files?.[0] && uploadImage(event.target.files[0])} />
 </label>
 </div>
 {formData.image && <img src={formData.image} alt="" className="h-28 w-full object-cover rounded-lg border border-border" />}
 </div>

 <Field label="Краткое описание" textarea required value={formData.excerpt} onChange={(value) => setFormData({ ...formData, excerpt: value })} />
 <Field label="Основной текст" textarea required rows={8} value={formData.content} onChange={(value) => setFormData({ ...formData, content: value })} />
 <Field label="Теги" value={formData.tags} onChange={(value) => setFormData({ ...formData, tags: value })} placeholder="через запятую" />

 <div className="flex gap-3 pt-3">
 <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1 h-11 border-border">
 Отмена
 </Button>
 <Button disabled={saving || uploading} type="submit" className="flex-1 h-11 bg-primary text-primary-foreground">
 {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Сохранить'}
 </Button>
 </div>
 </form>
 </motion.div>
 </div>
 )}
 </AnimatePresence>
 </div>
 </div>
 );
}

function Field({
 label,
 value,
 onChange,
 textarea,
 required,
 rows = 3,
 placeholder = ''
}: {
 label: string;
 value: string;
 onChange: (value: string) => void;
 textarea?: boolean;
 required?: boolean;
 rows?: number;
 placeholder?: string;
}) {
 return (
 <div className="space-y-1">
 <label className="text-sm font-medium text-foreground">{label}</label>
 {textarea ? (
 <textarea required={required} rows={rows} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-border outline-none resize-none bg-background text-foreground" />
 ) : (
 <input required={required} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-border outline-none bg-background text-foreground" />
 )}
 </div>
 );
}

