import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { EditorialPageHero } from "../components/shared/editorial-page-hero";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { getBlogPostBySlug } from "../lib/data/blog";
import type { BlogPost } from "../lib/data/types";

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    async function loadPost() {
      if (slug) {
        const found = await getBlogPostBySlug(slug);
        setPost(found);
        if (found) {
          document.title = `${found.title} — Блог Family Dent`;
        }
      }
    }
    loadPost();
  }, [slug]);

  if (!post) {
    return (
      <div className="w-full min-h-screen bg-paper text-ink flex flex-col items-center justify-center p-5">
        <h1 className="font-display text-2xl font-bold mb-4">Статья не найдена</h1>
        <Link to="/blog" className="text-accent hover:underline flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          <span>Вернуться к блогу</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col min-h-screen bg-paper text-ink">
      <EditorialPageHero
        badge={post.category}
        title={post.title}
        description={`Автор: ${post.author} • ${post.date}`}
      />

      <div className="max-w-3xl mx-auto px-5 my-8 w-full">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-xs text-accent hover:text-accent/80 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Вернуться ко всем статьям</span>
        </Link>

        <div className="aspect-[16/9] w-full rounded-3xl overflow-hidden mb-8 border border-rule shadow-card">
          <img src={post.image} alt={post.title} loading="lazy" decoding="async" className="w-full h-full object-cover" />
        </div>

        <div className="bg-surface border border-rule rounded-3xl p-8 shadow-card space-y-4 text-sm sm:text-base text-muted font-normal leading-relaxed">
          <p className="font-display font-bold text-ink text-base sm:text-lg">{post.excerpt}</p>
          <p>{post.content}</p>
        </div>
      </div>
    </div>
  );
}
