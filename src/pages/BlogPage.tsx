import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { EditorialPageHero } from "../components/shared/editorial-page-hero";
import { Calendar, User, ArrowRight } from "lucide-react";
import { getBlogPosts } from "../lib/data/blog";
import type { BlogPost } from "../lib/data/types";

export function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    document.title = "Блог и статьи — Family Dent Душанбе";
    async function loadPosts() {
      const data = await getBlogPosts();
      setPosts(data);
    }
    loadPosts();
  }, []);

  return (
    <div className="w-full flex flex-col min-h-screen bg-paper text-ink">
      <EditorialPageHero
        badge="Полезные материалы"
        title="Блог и советы стоматологов"
        description="Экспертные статьи наших врачей о гигиене, винирах, брекетах, имплантации и детской стоматологии."
      />

      <div className="page-container my-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.map((post) => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className="bg-surface border border-rule rounded-3xl overflow-hidden shadow-card flex flex-col group hover:border-accent/40 transition-colors"
            >
              <div className="aspect-[16/9] w-full overflow-hidden bg-paper">
                <img
                  src={post.image}
                  alt={post.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-6 flex flex-col justify-between flex-1">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-accent tracking-wider block mb-2 font-mono">
                    {post.category}
                  </span>
                  <h2 className="font-display text-lg sm:text-xl font-bold text-ink mb-2 group-hover:text-accent transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-muted font-normal leading-relaxed mb-4">
                    {post.excerpt}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-muted border-t border-rule pt-4">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-accent" />
                      <span>{post.author}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{post.date}</span>
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-accent group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
