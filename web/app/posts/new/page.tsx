'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch, ApiError } from '@/lib/api';
import { useAuthStore } from '@/lib/auth-store';
import { CreatePostRequest, Post, PostType } from '@/lib/types';

export default function NewPostPage() {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);

  const [type, setType] = useState<PostType>('ItemAvailable');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [lengthCm, setLengthCm] = useState('');
  const [widthCm, setWidthCm] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [pickupArea, setPickupArea] = useState('');
  const [dropoffArea, setDropoffArea] = useState('');
  const [priceOffered, setPriceOffered] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!token) {
    return (
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">New post</h1>
        <p className="text-gray-600">
          You need to{' '}
          <a href="/login" className="underline">
            log in
          </a>{' '}
          first.
        </p>
      </div>
    );
  }

  // Converts an empty string to undefined, otherwise parses as a number.
  // Keeps optional numeric fields genuinely optional rather than sending 0.
  function toNumber(value: string): number | undefined {
    if (value.trim() === '') return undefined;
    const n = Number(value);
    return Number.isNaN(n) ? undefined : n;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !pickupArea.trim() || !dropoffArea.trim()) {
      setError('Title, pickup area, and dropoff area are required.');
      return;
    }

    setLoading(true);

    const body: CreatePostRequest = {
      type,
      title: title.trim(),
      description: description.trim() || undefined,
      lengthCm: toNumber(lengthCm),
      widthCm: toNumber(widthCm),
      heightCm: toNumber(heightCm),
      weightKg: toNumber(weightKg),
      pickupArea: pickupArea.trim(),
      dropoffArea: dropoffArea.trim(),
      priceOffered: toNumber(priceOffered),
    };

    try {
      const post = await apiFetch<Post>('/api/posts', { method: 'POST', body, token });
      router.push('/posts');
      // (router.push is fire-and-forget; this avoids an unused-var warning
      // if we later want to show "post created: {post.id}")
      void post;
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to create post. Is the API running?');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg">
      <h1 className="mb-4 text-2xl font-bold">New post</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Post type</label>
          <div className="mt-1 space-y-1">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                checked={type === 'ItemAvailable'}
                onChange={() => setType('ItemAvailable')}
              />
              📦 Item available — drivers can favorite for later
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                checked={type === 'PickupRequest'}
                onChange={() => setType('PickupRequest')}
              />
              🚗 ASAP — needs pickup now
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Title *</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Wooden dining chair"
            className="mt-1 w-full rounded border px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Condition, assembly notes, anything a driver should know"
            className="mt-1 w-full rounded border px-3 py-2"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium">Pickup area *</label>
            <input
              type="text"
              required
              value={pickupArea}
              onChange={(e) => setPickupArea(e.target.value)}
              placeholder="e.g. Kallio"
              className="mt-1 w-full rounded border px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Dropoff area *</label>
            <input
              type="text"
              required
              value={dropoffArea}
              onChange={(e) => setDropoffArea(e.target.value)}
              placeholder="e.g. Vallila"
              className="mt-1 w-full rounded border px-3 py-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Dimensions &amp; weight (optional)</label>
          <div className="mt-1 grid grid-cols-4 gap-2">
            <input
              type="number"
              value={lengthCm}
              onChange={(e) => setLengthCm(e.target.value)}
              placeholder="L (cm)"
              className="rounded border px-2 py-2 text-sm"
            />
            <input
              type="number"
              value={widthCm}
              onChange={(e) => setWidthCm(e.target.value)}
              placeholder="W (cm)"
              className="rounded border px-2 py-2 text-sm"
            />
            <input
              type="number"
              value={heightCm}
              onChange={(e) => setHeightCm(e.target.value)}
              placeholder="H (cm)"
              className="rounded border px-2 py-2 text-sm"
            />
            <input
              type="number"
              value={weightKg}
              onChange={(e) => setWeightKg(e.target.value)}
              placeholder="kg"
              className="rounded border px-2 py-2 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Price offered (€, optional)</label>
          <input
            type="number"
            value={priceOffered}
            onChange={(e) => setPriceOffered(e.target.value)}
            placeholder="e.g. 15"
            className="mt-1 w-full rounded border px-3 py-2"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-500 disabled:opacity-50"
        >
          {loading ? 'Posting...' : 'Create post'}
        </button>
      </form>
    </div>
  );
}