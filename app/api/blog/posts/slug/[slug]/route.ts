import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';

export async function GET(_request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const post = await storage.getBlogPostBySlug(params.slug);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    return NextResponse.json(post);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch blog post' }, { status: 500 });
  }
}
