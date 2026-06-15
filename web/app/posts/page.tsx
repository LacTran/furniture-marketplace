'use client';

import { useEffect, useState } from 'react';
import { apiFetch, ApiError } from '@/lib/api';
import { Post, PostType } from '@/lib/types';
import { useAuthStore } from '@/lib/auth-store';

const TYPE_LABELS: Record<PostType, string> = {
  ItemAvailable: '📦 Item available (favorite for later)',
  PickupRequest: '🚗 ASAP — needs pickup now',
};

export default function PostsBrowsePage() {
  const token = useAuthStore((s) => s.token);

  const [posts, setPosts] = useState<Post[]>([]);
  const [filterType, setFilterType] = useState<PostType | 'All'>('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Re-fetch whenever the type filter changes.
  useEffect(() => {
    setLoading(true);
    setError(null);

    const query = filterType !== 'All' ? `?type=${filterType}` : '';

    apiFetch<Post[]>(`/api/posts${query}`)
      .then(setPosts)
      .catch((err) => {
        setError(err instanceof ApiError ? err.message : 'Failed to load posts. Is the API running?');
      })
      .finally(() => setLoading(false));
  }, [filterType]);

  async function handleAccept(postId: string) {
    if (!token) return;

    try {
      const updated = await apiFetch<Post>(`/api/posts/${postId}/accept`, {
        method: 'POST',
        token,
      });
      setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    } catch (err) {
      alert(err instanceof ApiError ? err.message : 'Failed to accept post.');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Browse posts</h1>
        {token ? (
          <a
            href="/posts/new"
            className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-500"
          >
            + New post
          </a>
        ) : (
          <a href="/login" className="text-sm underline">
            Log in to post
          </a>
        )}
      </div>

      <div className="flex gap-2 text-sm">
        {(['All', 'ItemAvailable', 'PickupRequest'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`rounded px-3 py-1 border ${
              filterType === t ? 'bg-gray-800 text-white' : 'bg-white hover:bg-gray-100'
            }`}
          >
            {t === 'All' ? 'All' : TYPE_LABELS[t]}
          </button>
        ))}
      </div>

      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && posts.length === 0 && (
        <p className="text-gray-500">No open posts yet — be the first to create one.</p>
      )}

      <div className="space-y-3">
        {posts.map((post) => (
          <div key={post.id} className="rounded border bg-white p-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs uppercase tracking-wide text-gray-500">
                  {TYPE_LABELS[post.type]}
                </span>
                <h2 className="text-lg font-semibold">{post.title}</h2>
              </div>
              {post.priceOffered != null && (
                <span className="rounded bg-green-100 px-2 py-1 text-sm font-medium text-green-800">
                  €{post.priceOffered}
                </span>
              )}
            </div>

            {post.description && <p className="mt-1 text-sm text-gray-600">{post.description}</p>}

            <p className="mt-2 text-sm">
              <span className="font-medium">{post.pickupArea}</span>
              {' → '}
              <span className="font-medium">{post.dropoffArea}</span>
            </p>

            {(post.lengthCm || post.widthCm || post.heightCm || post.weightKg) && (
              <p className="mt-1 text-xs text-gray-500">
                {post.lengthCm ?? '?'}×{post.widthCm ?? '?'}×{post.heightCm ?? '?'} cm
                {post.weightKg != null && ` · ${post.weightKg} kg`}
              </p>
            )}

            <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
              <span>Posted by {post.ownerDisplayName}</span>
              {token && (
                <button
                  onClick={() => handleAccept(post.id)}
                  className="rounded bg-gray-800 px-3 py-1 text-white hover:bg-gray-700"
                >
                  Accept this
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}