import { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, RefreshControl, StyleSheet, Alert } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { apiFetch, ApiError } from '@/lib/api';
import { useAuthStore } from '@/lib/auth-store';
import { Post } from '@/lib/types';
import { PostCard } from '@/components/PostCard';

export default function BrowseScreen() {
  const token = useAuthStore((s) => s.token);
  const [posts, setPosts] = useState<Post[]>([]);
  const [favoritedIds, setFavoritedIds] = useState<Set<string>>(new Set());
  const [refreshing, setRefreshing] = useState(false);

  const loadPosts = useCallback(async () => {
    try {
      const [openPosts, myFavorites] = await Promise.all([
        apiFetch<Post[]>('/api/posts'),
        token ? apiFetch<Post[]>('/api/favorites', { token }) : Promise.resolve([]),
      ]);
      setPosts(openPosts);
      setFavoritedIds(new Set(myFavorites.map((p) => p.id)));
    } catch (err) {
      Alert.alert('Error', err instanceof ApiError ? err.message : 'Failed to load posts.');
    } finally {
      setRefreshing(false);
    }
  }, [token]);

  // Refetch every time this tab comes into focus — e.g. after accepting a
  // post from here, or favoriting/unfavoriting from the Favorites tab.
  useFocusEffect(
    useCallback(() => {
      loadPosts();
    }, [loadPosts])
  );

  async function handleToggleFavorite(post: Post) {
    if (!token) return;
    const isFavorited = favoritedIds.has(post.id);

    try {
      await apiFetch(`/api/posts/${post.id}/favorite`, {
        method: isFavorited ? 'DELETE' : 'POST',
        token,
      });
      setFavoritedIds((prev) => {
        const next = new Set(prev);
        isFavorited ? next.delete(post.id) : next.add(post.id);
        return next;
      });
    } catch (err) {
      Alert.alert('Error', err instanceof ApiError ? err.message : 'Failed to update favorite.');
    }
  }

  async function handleAccept(post: Post) {
    if (!token) return;
    try {
      await apiFetch<Post>(`/api/posts/${post.id}/accept`, { method: 'POST', token });
      Alert.alert('Accepted!', `You've accepted "${post.title}".`);
      loadPosts();
    } catch (err) {
      Alert.alert('Error', err instanceof ApiError ? err.message : 'Failed to accept post.');
    }
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              loadPosts();
            }}
          />
        }
        ListEmptyComponent={<Text style={styles.empty}>No open posts right now.</Text>}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            isFavorited={favoritedIds.has(item.id)}
            onToggleFavorite={handleToggleFavorite}
            onAccept={handleAccept}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  list: { padding: 16 },
  empty: { textAlign: 'center', color: '#9ca3af', marginTop: 40 },
});
