'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch, ApiError } from '@/lib/api';
import { useAuthStore } from '@/lib/auth-store';
import { CreatePostRequest, Post, PostType } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AuthRequiredBanner } from '@/components/posts/new/AuthRequiredBanner';
import { PostTypeSelector } from '@/components/posts/new/PostTypeSelector';
import { PhysicalDimensionsInput } from '@/components/posts/new/PhysicalDimensionsInput';

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
    return <AuthRequiredBanner />;
  }

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
      await apiFetch<Post>('/api/posts', { method: 'POST', body, token });
      router.push('/posts');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to create post. Is the API running?');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto py-2">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Post Furniture to Rehome</h1>
        <p className="text-slate-500 text-sm mt-1">Specify item details and locations to find a local driver.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <PostTypeSelector selectedType={type} onSelectType={setType} />

        <Input
          label="Item Title *"
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Wooden Dining Chair / IKEA Armchair"
        />

        <div className="space-y-1.5">
          <label className="block text-sm font-bold text-slate-800">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Condition, disassembly notes, stairs/elevator details..."
            className="w-full rounded-xl border border-border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-foreground"
            rows={3}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Input
            label="Pickup Location *"
            type="text"
            required
            value={pickupArea}
            onChange={(e) => setPickupArea(e.target.value)}
            placeholder="e.g. Kallio, Helsinki"
          />
          <Input
            label="Dropoff Location *"
            type="text"
            required
            value={dropoffArea}
            onChange={(e) => setDropoffArea(e.target.value)}
            placeholder="e.g. Vallila, Helsinki"
          />
        </div>

        <PhysicalDimensionsInput
          lengthCm={lengthCm}
          widthCm={widthCm}
          heightCm={heightCm}
          weightKg={weightKg}
          onChangeLength={setLengthCm}
          onChangeWidth={setWidthCm}
          onChangeHeight={setHeightCm}
          onChangeWeight={setWeightKg}
        />

        <Input
          label="Price Offered (€, optional)"
          type="number"
          value={priceOffered}
          onChange={(e) => setPriceOffered(e.target.value)}
          placeholder="e.g. 20"
          leftIcon={<span className="font-bold text-sm">€</span>}
        />

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl">
            {error}
          </div>
        )}

        <Button type="submit" isLoading={loading} variant="primary" className="w-full">
          Publish Rehoming Request
        </Button>
      </form>
    </div>
  );
}