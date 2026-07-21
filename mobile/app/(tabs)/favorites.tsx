import { useCallback, useState } from 'react';
import { View, Text, FlatList, RefreshControl, ActivityIndicator, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { apiFetch, ApiError } from '@/lib/api';
import { useAuthStore } from '@/lib/auth-store';
import { Post } from '@/lib/types';
import { PostCard } from '@/components/PostCard';

export default function FavoritesScreen() {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const [favorites, setFavorites] = useState<Post[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadFavorites = useCallback(async () => {
    if (!token) {
      setLoading(false);
      setFavorites([]);
      return;
    }
    try {
      const data = await apiFetch<Post[]>('/api/favorites', { token });
      setFavorites(data);
    } catch (err) {
      Alert.alert('Error', err instanceof ApiError ? err.message : 'Failed to load favorites.');
    } finally {
      setRefreshing(false);
      setLoading(false);
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
      await apiFetch(`/api/posts/${post.id}/favorite`, {
        method: 'DELETE',
        token,
      });
      setFavorites((prev) => prev.filter((p) => p.id !== post.id));
    } catch (err) {
      Alert.alert('Error', err instanceof ApiError ? err.message : 'Failed to remove favorite.');
    }
  }

  async function handleAccept(post: Post) {
    if (!token) return;
    Alert.alert(
      'Accept Job',
      `Are you sure you want to commit to transporting "${post.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Accept',
          style: 'default',
          onPress: async () => {
            try {
              await apiFetch<Post>(`/api/posts/${post.id}/accept`, { method: 'POST', token });
              Alert.alert('Success!', `You've accepted "${post.title}". Check your profile dashboard.`);
              loadFavorites();
            } catch (err) {
              Alert.alert('Error', err instanceof ApiError ? err.message : 'Failed to accept post.');
            }
          }
        }
      ]
    );
  }

  if (!token) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="lock-closed-outline" size={48} color="#94a3b8" />
        <Text style={styles.unauthTitle}>Authentication Required</Text>
        <Text style={styles.unauthSubtitle}>Sign in to save listings for later reference.</Text>
        <TouchableOpacity style={styles.signInButton} onPress={() => router.push('/login')}>
          <Text style={styles.signInButtonText}>Sign In Now</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {loading && !refreshing ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#7C3AED" />
          <Text style={styles.loadingText}>Loading saved posts...</Text>
        </View>
      ) : (
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
              colors={['#7C3AED']}
              tintColor="#7C3AED"
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="heart-dislike-outline" size={48} color="#cbd5e1" />
              <Text style={styles.empty}>You have not saved any rehoming listings yet.</Text>
            </View>
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
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF5FF' },
  list: { padding: 16 },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    gap: 12,
  },
  unauthTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4C1D95',
    marginTop: 8,
  },
  unauthSubtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
  signInButton: {
    marginTop: 12,
    backgroundColor: '#16A34A',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  signInButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  loadingText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
    gap: 12,
  },
  empty: {
    textAlign: 'center',
    color: '#64748b',
    fontSize: 14,
    paddingHorizontal: 32,
  },
});
