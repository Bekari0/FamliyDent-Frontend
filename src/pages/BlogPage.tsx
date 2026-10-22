import { Container, Heading, Reveal, RevealGroup, Text } from "@/ui-kit";
import { ArrowRight, Calendar, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { EditorialPageHero } from "../components/shared/editorial-page-hero";
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
    <div
      className="w-full flex flex-col min-h-screen bg-paper text-ink"
      data-ui-scheme="default"
    >
      <EditorialPageHero
        badge="Полезные материалы"
        title="Блог и советы стоматологов"
        description="Экспертные статьи наших врачей о гигиене, винирах, брекетах, имплантации и детской стоматологии."
      />

      <Container className="my-8">
        <RevealGroup className="grid grid-cols-1 tablet:grid-cols-2 gap-8">
          {posts.map((post) => (
            <Reveal
              as={Link}
              key={post.id}
              to={`/blog/${post.slug}`}
              className="bg-surface border border-rule rounded-3xl overflow-hidden shadow-card flex flex-col group hover:border-accent/40 transition-colors"
              data-ui-scheme="default"
            >
              <div
                className="aspect-[16/9] w-full overflow-hidden bg-paper"
                data-ui-scheme="default"
              >
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
                  <span className="type-overline uppercase text-brand-text block mb-2">
                    {post.category}
                  </span>
                  <Heading
                    level={2}
                    variant="heading-5"
                    className="text-ink mb-2 group-hover:text-brand-text transition-colors"
                  >
                    {post.title}
                  </Heading>
                  <Text variant="body-sm" className="text-muted mb-4">
                    {post.excerpt}
                  </Text>
                </div>

                <div className="type-caption flex flex-wrap gap-3 items-center justify-between text-muted border-t border-rule pt-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-brand-text" />
                      <span>{post.author}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{post.date}</span>
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-brand-text group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Reveal>
          ))}
        </RevealGroup>
      </Container>
    </div>
  );
}
