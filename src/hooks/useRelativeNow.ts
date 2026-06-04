"use client";

import { useEffect, useState } from "react";

export function useRelativeNow() {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setNow(Date.now());
    }, 0);

    return () => window.clearTimeout(timerId);
  }, []);

  return now;
}
