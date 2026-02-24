import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { error: '슬러그가 필요합니다.' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Try RPC first for atomic increment
    const { error: rpcError } = await supabase.rpc('increment_article_views', {
      article_slug: slug,
    });

    // Fallback if RPC doesn't exist - use direct update
    if (rpcError) {
      const { data: article } = await supabase
        .from('articles')
        .select('view_count')
        .eq('slug', slug)
        .single();

      if (article) {
        await supabase
          .from('articles')
          .update({ view_count: (article.view_count || 0) + 1 })
          .eq('slug', slug);
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error('View count error:', err);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
