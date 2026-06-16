import { useCallback, useState } from 'react';
import { View, Text, FlatList, RefreshControl, StyleSheet, Alert } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { apiFetch, ApiError } from '@/lib/api';
import { useAuthStore } from '@/lib/auth-store';
import { Post } from '@/lib/types';
import { PostCard } from '@/components/PostCard';

export default function FavoritesScreen() {
  const token = useAuthStore((s) => s.token);
  const [favorites, setFavorites] = useState<Post[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadFavorites = useCallback(async () => {
    if (!token) return;
    try {
      const data = await apiFetch<Post[]>('/api/favorites', { token });
      setFavorites(data);
    } catch (err) {
      Alert.alert('Error', err instanceof ApiError ? err.message : 'Failed to load favorites.');
    } finally {
      setRefreshing(false);
    }
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [loadFavorites])
  );

  async function handleToggleFavorite(post: Post) {
    if (!token) return;
    try {
      // Always a removal here, since everything on this screen is already favorited.
      await apiFetch(`/api/posts/${post.id}/favorite`, { method: 'DELETE', token });
      setFavorites((prev) => prev.filter((p) => p.id !== post.id));
    } catch (err) {
      Alert.alert('Error', err instanceof ApiError ? err.message : 'Failed to remove favorite.');
    }
  }

  async function handleAccept(post: Post) {
    if (!token) return;
    try {
      await apiFetch<Post>(`/api/posts/${post.id}/accept`, { method: 'POST', token });
      Alert.alert('Accepted!', `You've accepted "${post.title}".`);
      loadFavorites();
    } catch (err) {
      Alert.alert('Error', err instanceof ApiError ? err.message : 'Failed to accept post.');
    }
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              loadFavorites();
            }}
          />
        }
        ListEmptyComponent={
          <Text style={styles.empty}>
            No favorites yet — tap the heart on a post in Browse to save it for later.
          </Text>
        }
        renderItem={({ item }) => (
          <PostCard
            post={item}
            isFavorited={true}
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
  empty: { textAlign: 'center', color: '#9ca3af', marginTop: 40, paddingHorizontal: 32 },
});
