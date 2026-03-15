import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { storage } from '@/lib/storage';
import { insertBlogPostSchema } from '@shared/schema';
import { z } from 'zod';

export async function GET() {
  try {
    const posts = await storage.getBlogPosts();
    return NextResponse.json(posts);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = insertBlogPostSchema.parse(body);
    const post = await storage.createBlogPost(validatedData);
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 });
  }
}
