import type { BlogPost } from "./types";

/* Mock data for Family Dent blog posts */
const blogPostsData: BlogPost[] = [
  {
    id: "blog-1",
    slug: "kak-vybrat-viniry",
    title: "Как выбрать виниры: E.max или композитные реставрации?",
    excerpt: "Разбираем плюсы, минусы, долговечность и эстетику популярных видов эстетических накладок на зубы.",
    content: "Подробный гид по выбору керамических и композитных виниров...",
    date: "12 июля 2026",
    author: "Др. Парвиз Содиков",
    category: "Эстетика",
    image: "https://images.pexels.com/photos/3762453/pexels-photo-3762453.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: "blog-2",
    slug: "chto-delat-esli-boitse-stomatologa",
    title: "Что делать, если ребенок боится стоматолога?",
    excerpt: "Советы детского врача по мягкой адаптации ребенка к приему без стресса и слез.",
    content: "Практические рекомендации родителям перед визитом в детскую стоматологию...",
    date: "05 июня 2026",
    author: "Др. Малика Шарипова",
    category: "Детская стоматология",
    image: "https://images.pexels.com/photos/3845625/pexels-photo-3845625.jpeg?auto=compress&cs=tinysrgb&w=800"
  }
];

export async function getBlogPosts(): Promise<BlogPost[]> {
  return [...blogPostsData];
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  return blogPostsData.find((b) => b.slug === slug) || null;
}
