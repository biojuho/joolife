import { createClient } from '@/lib/supabase/server';
import { ArticleCard } from '@/components/blog/ArticleCard';
import { ARTICLE_CATEGORIES } from '@/lib/constants';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { Article } from '@/lib/types';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '블로그',
  description:
    '저속노화를 위한 식단, 운동, 수면, 생활습관 정보를 무료로 읽어보세요.',
};

const allCategory = { key: 'all' as const, label: '전체' };

interface BlogPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const activeCategory = params.category || 'all';

  let typedArticles: Article[] = [];
  try {
    const supabase = await createClient();
    let query = supabase
      .from('articles')
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false });

    if (activeCategory !== 'all') {
      query = query.eq('category', activeCategory);
    }

    const { data: articles } = await query;
    typedArticles = (articles ?? []) as Article[];
  } catch {
    // Supabase not configured or connection error — show empty state
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:py-12">
      {/* Page header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-text md:text-3xl">블로그</h1>
        <p className="mt-2 text-text-light">
          저속노화를 위한 과학적 지식과 실천 가이드
        </p>
      </div>

      {/* Category filter tabs */}
      <div className="mt-8 flex flex-wrap justify-center gap-2">
        <Link
          href="/blog"
          className={cn(
            'rounded-full px-4 py-2 text-sm font-medium transition-colors',
            activeCategory === 'all'
              ? 'bg-primary text-white'
              : 'bg-cream-dark text-text-light hover:bg-cream-darker'
          )}
        >
          {allCategory.label}
        </Link>
        {ARTICLE_CATEGORIES.map((cat) => (
          <Link
            key={cat.key}
            href={`/blog?category=${cat.key}`}
            className={cn(
              'rounded-full px-4 py-2 text-sm font-medium transition-colors',
              activeCategory === cat.key
                ? 'bg-primary text-white'
                : 'bg-cream-dark text-text-light hover:bg-cream-darker'
            )}
          >
            {cat.label}
          </Link>
        ))}
      </div>

      {/* Articles grid */}
      {typedArticles.length > 0 ? (
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {typedArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <div className="mt-16 text-center">
          <p className="text-text-light">
            {activeCategory === 'all'
              ? '아직 게시된 글이 없습니다.'
              : '해당 카테고리에 게시된 글이 없습니다.'}
          </p>
          {activeCategory !== 'all' && (
            <Link
              href="/blog"
              className="mt-3 inline-block text-sm font-medium text-primary hover:text-primary-dark"
            >
              전체 글 보기
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
