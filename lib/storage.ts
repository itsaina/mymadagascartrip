import { db } from './db';
import { blogPosts } from '@shared/schema';
import { eq } from 'drizzle-orm';
import type { BlogPost, InsertBlogPost } from '@shared/schema';

export const storage = {
  async getBlogPosts(): Promise<BlogPost[]> {
    return db().select().from(blogPosts).orderBy(blogPosts.createdAt);
  },

  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    const results = await db().select().from(blogPosts).where(eq(blogPosts.id, id));
    return results[0];
  },

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const results = await db().select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return results[0];
  },

  async createBlogPost(data: InsertBlogPost): Promise<BlogPost> {
    const results = await db().insert(blogPosts).values(data).returning();
    return results[0];
  },

  async updateBlogPost(id: number, data: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const results = await db().update(blogPosts).set(data).where(eq(blogPosts.id, id)).returning();
    return results[0];
  },

  async deleteBlogPost(id: number): Promise<boolean> {
    const results = await db().delete(blogPosts).where(eq(blogPosts.id, id)).returning();
    return results.length > 0;
  },
};
