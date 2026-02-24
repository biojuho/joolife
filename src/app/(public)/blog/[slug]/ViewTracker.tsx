'use client';

import { useEffect, useRef } from 'react';

interface ViewTrackerProps {
  slug: string;
}

function ViewTracker({ slug }: ViewTrackerProps) {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;

    fetch(`/api/articles/${slug}/views`, { method: 'POST' }).catch(() => {
      // Silently ignore view tracking errors
    });
  }, [slug]);

  return null;
}

export { ViewTracker };
