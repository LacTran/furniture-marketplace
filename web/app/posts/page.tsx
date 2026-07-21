'use client';

import { useEffect, useState, useCallback } from 'react';
import { apiFetch, ApiError } from '@/lib/api';
import { Post, PostType } from '@/lib/types';
import { useAuthStore } from '@/lib/auth-store';
import { useDebouncedCallback } from '@/lib/use-debounce';
import { EmptyState } from '@/components/ui/EmptyState';
import { PostsHeader } from '@/components/posts/PostsHeader';
import { PostsTabBar, ViewTab } from '@/components/posts/PostsTabBar';
import { PostsToolbar } from '@/components/posts/PostsToolbar';
import { PostItemCard } from '@/components/posts/PostItemCard';

export default function PostsBrowsePage() {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);

  const [posts, setPosts] = useState<Post[]>([]);
  const [favoritedIds, setFavoritedIds] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<ViewTab>('market');
  const [filterType, setFilterType] = useState<PostType | 'All'>('All');
  const [searchArea, setSearchArea] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const updateSearch = useDebouncedCallback((val: string) => {
    setDebouncedSearch(val.trim());
  }, 350);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchArea(e.target.value);
    updateSearch(e.target.value);
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let favsList: Post[] = [];
      if (token) {
        favsList = await apiFetch<Post[]>('/api/favorites', { token });
        setFavoritedIds(new Set(favsList.map((p) => p.id)));
      }

      let list: Post[] = [];
      if (activeTab === 'market') {
        const typeQuery = filterType !== 'All' ? `&type=${filterType}` : '';
        const searchCtx = debouncedSearch ? `&pickupArea=${encodeURIComponent(debouncedSearch)}` : '';
        list = await apiFetch<Post[]>(`/api/posts?status=Open${typeQuery}${searchCtx}`);
      } else if (activeTab === 'favorites') {
        list = favsList;
      } else if (activeTab === 'mine') {
        if (!token) throw new Error('Authentication required.');
        list = await apiFetch<Post[]>('/api/posts/mine', { token });
      }

      setPosts(list);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load listings.');
    } finally {
      setLoading(false);
    }
  }, [token, activeTab, filterType, debouncedSearch]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleAccept(postId: string) {
    if (!token) return;
    if (window.confirm('Are you sure you want to accept this delivery? You will be responsible for completing it.')) {
      try {
        const updated = await apiFetch<Post>(`/api/posts/${postId}/accept`, {
          method: 'POST',
          token,
        });
        setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
        alert(`Successfully accepted "${updated.title}"!`);
        loadData();
      } catch (err) {
        alert(err instanceof ApiError ? err.message : 'Failed to accept delivery.');
      }
    }
  }

  async function handleToggleFavorite(post: Post) {
    if (!token) {
      alert('Please sign in to add items to your saved list.');
      return;
    }
    const isFav = favoritedIds.has(post.id);
    try {
      await apiFetch(`/api/posts/${post.id}/favorite`, {
        method: isFav ? 'DELETE' : 'POST',
        token,
      });
      setFavoritedIds((prev) => {
        const next = new Set(prev);
        isFav ? next.delete(post.id) : next.add(post.id);
        return next;
      });

      if (activeTab === 'favorites' && isFav) {
        setPosts((prev) => prev.filter((p) => p.id !== post.id));
      }
    } catch {
      alert('Failed to update favorite status.');
    }
  }

  return (
    <div className="space-y-8">
      <PostsHeader token={token} />

      {token && (
        <PostsTabBar
          activeTab={activeTab}
          favoritedCount={favoritedIds.size}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            setError(null);
          }}
        />
      )}

      {activeTab === 'market' && (
        <PostsToolbar
          filterType={filterType}
          searchArea={searchArea}
          onFilterTypeChange={setFilterType}
          onSearchChange={handleSearchChange}
          onClearSearch={() => {
            setSearchArea('');
            setDebouncedSearch('');
          }}
        />
      )}

      {/* Main Grid */}
      {loading ? (
        <div className="text-center py-16 space-y-3">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent align-[-0.125em]" />
          <p className="text-slate-500 text-sm font-medium">Scanning delivery listings...</p>
        </div>
      ) : error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-700 text-sm text-center">
          {error}
        </div>
      ) : posts.length === 0 ? (
        <EmptyState
          icon={
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          }
          title="No requests found"
          description={
            activeTab === 'market'
              ? 'No listings match this filter combination.'
              : activeTab === 'favorites'
              ? 'You have not saved any posts yet.'
              : 'You have not submitted any delivery requests yet.'
          }
        />
      ) : (
        <div className="grid sm:grid-cols-2 gap-6">
          {posts.map((post) => (
            <PostItemCard
              key={post.id}
              post={post}
              isOwner={user?.userId === post.ownerId}
              isFavorited={favoritedIds.has(post.id)}
              token={token}
              onToggleFavorite={handleToggleFavorite}
              onAccept={handleAccept}
            />
          ))}
        </div>
      )}
    </div>
  );
}