'use client';

import { useRef, useEffect, useState, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface TabItem {
  key: string;
  label: string;
}

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (key: string) => void;
}

function Tabs({ tabs, activeTab, onTabChange, className, ...props }: TabsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const activeEl = tabRefs.current.get(activeTab);
    const container = containerRef.current;

    if (activeEl && container) {
      const containerRect = container.getBoundingClientRect();
      const tabRect = activeEl.getBoundingClientRect();
      setIndicatorStyle({
        left: tabRect.left - containerRect.left + container.scrollLeft,
        width: tabRect.width,
      });

      // Scroll active tab into view
      activeEl.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [activeTab]);

  return (
    <div className={cn('relative', className)} {...props}>
      <div
        ref={containerRef}
        className="flex overflow-x-auto scrollbar-hide border-b border-cream-darker"
        role="tablist"
      >
        {tabs.map((tab) => (
          <button
            key={tab.key}
            ref={(el) => {
              if (el) tabRefs.current.set(tab.key, el);
            }}
            role="tab"
            aria-selected={activeTab === tab.key}
            onClick={() => onTabChange(tab.key)}
            className={cn(
              'relative shrink-0 px-4 py-2.5 text-sm font-medium transition-colors duration-200 whitespace-nowrap',
              activeTab === tab.key
                ? 'text-primary'
                : 'text-text-lighter hover:text-text-light',
            )}
          >
            {tab.label}
          </button>
        ))}
        {/* Active indicator */}
        <div
          className="absolute bottom-0 h-0.5 bg-primary rounded-full transition-all duration-300 ease-out"
          style={{
            left: indicatorStyle.left,
            width: indicatorStyle.width,
          }}
        />
      </div>
    </div>
  );
}

export { Tabs };
