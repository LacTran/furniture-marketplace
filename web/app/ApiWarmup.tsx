'use client';

import { useEffect, useState } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

// How long to wait before assuming we're hitting a cold start, rather than
// just normal network latency. Render's free tier wake-up takes up to ~60s,
// but a healthy/warm instance responds in well under a second.
const SLOW_THRESHOLD_MS = 1500;

type Status = 'checking' | 'ready' | 'slow' | 'error';

export function ApiWarmup() {
  const [status, setStatus] = useState<Status>('checking');

  useEffect(() => {
    let cancelled = false;

    // If /health hasn't responded within SLOW_THRESHOLD_MS, assume cold start
    // and show the banner. Nothing is blocked — this is purely informational.
    const slowTimer = setTimeout(() => {
      if (!cancelled) setStatus((current) => (current === 'checking' ? 'slow' : current));
    }, SLOW_THRESHOLD_MS);

    fetch(`${API_BASE_URL}/health`)
      .then((res) => {
        if (cancelled) return;
        clearTimeout(slowTimer);
        setStatus(res.ok ? 'ready' : 'error');
      })
      .catch(() => {
        if (cancelled) return;
        clearTimeout(slowTimer);
        setStatus('error');
      });

    return () => {
      cancelled = true;
      clearTimeout(slowTimer);
    };
  }, []);

  // Nothing to show once we know the API is warm, or before the slow
  // threshold has elapsed (avoids a flash of the banner on every page load).
  if (status === 'checking' || status === 'ready') return null;

  if (status === 'error') {
    return (
      <div className="bg-amber-50 border-b border-amber-200 px-6 py-2 text-sm text-amber-800">
        Having trouble reaching the demo API right now. If you just opened this
        page, give it a minute — the backend may still be waking up.
      </div>
    );
  }

  // status === 'slow'
  return (
    <div className="bg-blue-50 border-b border-blue-200 px-6 py-2 text-sm text-blue-800 flex items-center gap-2">
      <span
        className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-blue-400 border-t-transparent"
        aria-hidden="true"
      />
      <span>
        Waking up the demo API (it runs on a free tier that sleeps when idle) —
        this can take up to 60 seconds on first load. Thanks for your patience!
      </span>
    </div>
  );
}