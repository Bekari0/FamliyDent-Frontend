import { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, ChevronLeft, Facebook, Link2, Loader2, Twitter, User } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { EditorialPageHero } from '@/components/shared/editorial-page-hero';
import { MOCK_ARTICLES } from '@/data/mockData';

export function ArticleDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) { setNotFound(true); setLoading(false); return; }
      try {
        const response = await axios.get(`/api/articles/${id}`);
        setPost(response.data);
        setNotFound(false);
      } catch {
        const fallback = MOCK_ARTICLES.find((article: any) => article.id === id || article._id === id);
        if (fallback) { setPost(fallback); setNotFound(false); } else { setNotFound(true); }
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  if (loading) return <main className="flex min-h-screen items-center justify-center bg-paper" role="status"><Loader2 className="h-9 w-9 animate-spin text-accent" /><span className="sr-only">Загрузка статьи...</span></main>;
  if (notFound || !post) return <main className="flex min-h-screen flex-col items-center justify-center bg-paper px-5 text-center text-ink"><h1 className="font-display text-2xl font-bold">Статья не найдена</h1><Link to="/blog" className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-pill border border-rule bg-surface px-5 text-sm font-bold"><ChevronLeft className="h-4 w-4" />Назад к блогу</Link></main>;

  const tags = Array.isArray(post.tags) ? post.tags : [];
  const articleDate = post.date ? new Date(post.date).toLocaleDateString('ru-RU') : 'Дата не указана';
  const image = post.image || 'https://images.unsplash.com/photo-1559839734-2b71f1536780?q=80&w=2070';
  const content = post.content || post.excerpt || '';
  const articleUrl = window.location.href;
  const shareTitle = post.title || 'Статья FamilyDent';
  const openShareWindow = (url: string) => window.open(url, '_blank', 'noopener,noreferrer,width=640,height=520');
  const shareOnFacebook = () => openShareWindow(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`);
  const shareOnTwitter = () => openShareWindow(`https://twitter.com/intent/tweet?url=${encodeURIComponent(articleUrl)}&text=${encodeURIComponent(shareTitle)}`);
  const copyArticleLink = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(articleUrl);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = articleUrl;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Не удалось скопировать ссылку:', error);
    }
  };

  return (
    <main className="min-h-screen bg-paper pb-20 text-ink" data-ui="editorial-page">
      <EditorialPageHero badge={tags[0] || 'Блог FamilyDent'} title={post.title} description={`${post.author || 'FamilyDent'} · ${articleDate}`} />
      <article className="mx-auto w-full max-w-4xl px-5 sm:px-8">
        <Link to="/blog" className="mb-6 inline-flex items-center gap-2 text-xs font-semibold text-accent hover:text-ink"><ChevronLeft className="h-4 w-4" />Назад к блогу</Link>
        <div className="aspect-[16/9] overflow-hidden rounded-3xl border border-rule bg-paper-2 shadow-card"><img src={image} alt={post.title} className="h-full w-full object-cover" loading="eager" decoding="async" /></div>
        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-y border-rule py-4 font-mono text-[10px] uppercase tracking-wider text-editorial-muted"><span className="flex items-center gap-2"><Calendar className="h-4 w-4 text-accent" />{articleDate}</span><span className="flex items-center gap-2"><User className="h-4 w-4 text-accent" />{post.author}</span>{tags.map((tag: string) => <span key={tag} className="rounded-pill border border-accent/25 bg-accent/15 px-3 py-1 text-accent">#{tag}</span>)}</div>
        <div className="mt-6 rounded-3xl border border-rule bg-surface p-7 shadow-whisper sm:p-10">
          {post.excerpt && <p className="border-l-2 border-accent pl-5 font-display text-lg font-semibold leading-relaxed text-ink sm:text-xl">{post.excerpt}</p>}
          <div className="mt-7 whitespace-pre-wrap text-base leading-8 text-editorial-muted">{content}</div>
        </div>
        <section className="mt-8 border-t border-rule pt-6" aria-labelledby="share-title">
          <h2 id="share-title" className="font-display text-lg font-bold">Поделиться статьей</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" onClick={shareOnFacebook} className="inline-flex min-h-11 items-center gap-2 rounded-pill bg-ink px-5 text-xs font-bold text-paper"><Facebook className="h-4 w-4" />Facebook</button>
            <button type="button" onClick={shareOnTwitter} className="inline-flex min-h-11 items-center gap-2 rounded-pill bg-trust px-5 text-xs font-bold text-white"><Twitter className="h-4 w-4" />Twitter</button>
            <button type="button" onClick={copyArticleLink} className="inline-flex min-h-11 items-center gap-2 rounded-pill border border-rule bg-surface px-5 text-xs font-bold text-ink"><Link2 className="h-4 w-4 text-accent" />{copied ? 'Ссылка скопирована' : 'Копировать ссылку'}</button>
          </div>
        </section>
      </article>
    </main>
  );
}
