import type { BlogPost } from "./types";
import { loadContent } from "../api";

export async function getBlogPosts(): Promise<BlogPost[]> {
  return loadContent<BlogPost>("blogPosts");
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  return (await getBlogPosts()).find((post) => post.slug === slug) ?? null;
}
