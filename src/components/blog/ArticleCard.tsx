import Link from 'next/link';
import { Clock, Lock, BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import type { Article } from '@/lib/types';

interface ArticleCardProps {
  article: Article;
}

function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link
      href={`/blog/${article.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-cream-darker bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      {/* Cover */}
      <div className="relative flex h-44 items-center justify-center bg-gradient-to-br from-primary-50 to-secondary/20">
        {article.cover_image_url ? (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${article.cover_image_url})` }}
          />
        ) : (
          <BookOpen className="h-10 w-10 text-primary/30" />
        )}

        {/* Access level indicator */}
        {article.access_level !== 'free' && (
          <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-xs font-medium text-text-light backdrop-blur-sm">
            <Lock className="h-3 w-3" />
            {article.access_level === 'subscriber' ? '구독자' : '프리미엄'}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <Badge category={article.category} className="w-fit" />

        <h3 className="mt-2 text-base font-semibold leading-snug text-text transition-colors group-hover:text-primary">
          {article.title}
        </h3>

        {article.excerpt && (
          <p className="mt-1.5 flex-1 text-sm leading-relaxed text-text-light line-clamp-2">
            {article.excerpt}
          </p>
        )}

        <div className="mt-3 flex items-center gap-3 text-xs text-text-lighter">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {article.reading_time_min}분
          </span>
          {article.view_count > 0 && (
            <span>조회 {article.view_count.toLocaleString()}</span>
          )}
        </div>
      </div>
    </Link>
  );
}

export { ArticleCard };
