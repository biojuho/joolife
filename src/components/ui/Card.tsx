'use client';

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: 'sm' | 'md';
  header?: ReactNode;
  footer?: ReactNode;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, padding = 'md', header, footer, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'bg-white rounded-2xl shadow-sm border border-cream-darker',
          className,
        )}
        {...props}
      >
        {header && (
          <div
            className={cn(
              'border-b border-cream-darker',
              padding === 'sm' ? 'px-4 py-3' : 'px-6 py-4',
            )}
          >
            {header}
          </div>
        )}
        <div className={padding === 'sm' ? 'p-4' : 'p-6'}>{children}</div>
        {footer && (
          <div
            className={cn(
              'border-t border-cream-darker',
              padding === 'sm' ? 'px-4 py-3' : 'px-6 py-4',
            )}
          >
            {footer}
          </div>
        )}
      </div>
    );
  },
);

Card.displayName = 'Card';

export { Card };
