import { createClient } from '@/lib/supabase/server';
import { getGatedContent } from '@/lib/mdx';
import { Badge } from '@/components/ui/Badge';
import { ContentGate } from '@/components/blog/ContentGate';
import { ArticleCard } from '@/components/blog/ArticleCard';
import { ArrowLeft, Clock, Eye } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import type { Article } from '@/lib/types';
import { LikeButton } from './LikeButton';
import { ViewTracker } from './ViewTracker';

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const supabase = await createClient();

    const { data: article } = await supabase
      .from('articles')
      .select('title, meta_title, meta_description, excerpt')
      .eq('slug', slug)
      .eq('is_published', true)
      .single();

    if (!article) {
      return { title: '글을 찾을 수 없습니다' };
    }

  return {
    title: article.meta_title || article.title,
    description: article.meta_description || article.excerpt || '',
    openGraph: {
      title: article.meta_title || article.title,
      description: article.meta_description || article.excerpt || '',
      type: 'article',
    },
  };
  } catch {
    return { title: '블로그' };
  }
}

export default async function BlogDetailPage({
  params,
}: BlogDetailPageProps) {
  const { slug } = await params;

  // eslint-disable-next-line prefer-const
  let supabase!: Awaited<ReturnType<typeof createClient>>;
  try {
    supabase = await createClient();
  } catch {
    notFound();
  }

  // Fetch the article
  const { data: article } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (!article) {
    notFound();
  }

  const typedArticle = article as Article;

  // Determine content visibility based on access level
  let visibleContent = typedArticle.content;
  let isGated = false;

  if (typedArticle.access_level === 'subscriber') {
    const gated = getGatedContent(typedArticle.content, 30);
    visibleContent = gated.visible;
    isGated = gated.hasMore;
  } else if (typedArticle.access_level === 'premium') {
    const gated = getGatedContent(typedArticle.content, 20);
    visibleContent = gated.visible;
    isGated = gated.hasMore;
  }

  // Fetch related articles (same category, excluding current)
  const { data: relatedArticles } = await supabase
    .from('articles')
    .select('*')
    .eq('is_published', true)
    .eq('category', typedArticle.category)
    .neq('slug', slug)
    .order('published_at', { ascending: false })
    .limit(3);

  const typedRelated = (relatedArticles ?? []) as Article[];

  return (
    <article className="mx-auto max-w-3xl px-4 py-8 md:py-12">
      {/* View tracker (client component that fires on mount) */}
      <ViewTracker slug={slug} />

      {/* Back link */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-1 text-sm font-medium text-text-light transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        블로그로 돌아가기
      </Link>

      {/* Article header */}
      <header className="mt-6">
        <Badge category={typedArticle.category} />

        <h1 className="mt-3 text-2xl font-bold leading-tight text-text md:text-3xl">
          {typedArticle.title}
        </h1>

        {typedArticle.subtitle && (
          <p className="mt-2 text-lg text-text-light">
            {typedArticle.subtitle}
          </p>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-text-lighter">
          <span>{typedArticle.author_name}</span>
          {typedArticle.published_at && (
            <span>
              {new Date(typedArticle.published_at).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {typedArticle.reading_time_min}분 읽기
          </span>
          <span className="flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" />
            {typedArticle.view_count.toLocaleString()}
          </span>
        </div>
      </header>

      {/* Divider */}
      <hr className="my-8 border-cream-darker" />

      {/* Article content */}
      <div className="prose prose-slate max-w-none">
        <div
          className="whitespace-pre-wrap text-base leading-relaxed text-text"
          style={{ wordBreak: 'keep-all' }}
        >
          {visibleContent}
        </div>
      </div>

      {/* Content gate overlay */}
      {isGated && (
        <ContentGate
          type={typedArticle.access_level as 'subscriber' | 'premium'}
        />
      )}

      {/* Like button */}
      <div className="mt-10 flex justify-center border-t border-cream-darker pt-8">
        <LikeButton
          slug={slug}
          initialCount={typedArticle.like_count}
        />
      </div>

      {/* Tags */}
      {typedArticle.tags && typedArticle.tags.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {typedArticle.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-cream-dark px-3 py-1 text-xs text-text-light"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Related articles */}
      {typedRelated.length > 0 && (
        <section className="mt-12 border-t border-cream-darker pt-8">
          <h2 className="text-xl font-bold text-text">관련 글</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {typedRelated.map((related) => (
              <ArticleCard key={related.id} article={related} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
