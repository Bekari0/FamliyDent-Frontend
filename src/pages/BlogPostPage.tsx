import { Reveal, RevealHeading, Text } from "@/ui-kit";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { EditorialPageHero } from "../components/shared/editorial-page-hero";
import { getBlogPostBySlug } from "../lib/data/blog";
import type { BlogPost } from "../lib/data/types";

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    void (slug ? getBlogPostBySlug(slug) : Promise.resolve(null)).then(
      (found) => {
        if (cancelled) return;
        setPost(found);
        setLoading(false);
        document.title = found
          ? `${found.title} — Блог Family Dent`
          : "Статья не найдена — Family Dent";
      },
    );
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="page-container section-space" role="status">
        Загрузка статьи…
      </div>
    );
  }

  if (!post) {
    return (
      <div
        className="w-full min-h-screen bg-paper text-ink flex flex-col items-center justify-center p-5"
        data-ui-scheme="default"
      >
        <RevealHeading level={1} className="mb-4">
          Статья не найдена
        </RevealHeading>
        <Link
          to="/blog"
          className="text-brand-text hover:underline flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Вернуться к блогу</span>
        </Link>
      </div>
    );
  }

  return (
    <div
      className="w-full flex flex-col min-h-screen bg-paper text-ink"
      data-ui-scheme="default"
    >
      <EditorialPageHero
        badge={post.category}
        title={post.title}
        description={`Автор: ${post.author} • ${post.date}`}
      />

      <div className="max-w-3xl mx-auto px-5 my-8 w-full">
        <Link
          to="/blog"
          className="type-caption inline-flex items-center gap-2 text-brand-text hover:text-brand-text/80 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Вернуться ко всем статьям</span>
        </Link>

        <Reveal className="aspect-[16/9] w-full rounded-3xl overflow-hidden mb-8 border border-rule shadow-card">
          <img
            src={post.image}
            alt={post.title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover"
          />
        </Reveal>

        <Reveal
          className="type-body-sm bg-surface border border-rule rounded-3xl p-5 sm:p-8 shadow-card space-y-4 text-muted"
          data-ui-scheme="default"
        >
          <Text variant="heading-3" className="text-ink">
            {post.excerpt}
          </Text>
          <Text variant="body">{post.content}</Text>
        </Reveal>
      </div>
    </div>
  );
}
