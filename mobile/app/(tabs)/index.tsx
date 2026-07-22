import { useCallback, useState } from 'react';
import { View, Text, FlatList, RefreshControl, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { apiFetch, ApiError } from '@/lib/api';
import { useAuthStore } from '@/lib/auth-store';
import { Post, PostType } from '@/lib/types';
import { PostCard } from '@/components/PostCard';
import { SearchHeader } from '@/components/SearchHeader';
import { useDebouncedCallback } from '@/lib/use-debounce';

export default function BrowseScreen() {
  const token = useAuthStore((s) => s.token);
  const [posts, setPosts] = useState<Post[]>([]);
  const [favoritedIds, setFavoritedIds] = useState<Set<string>>(new Set());
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [filterType, setFilterType] = useState<PostType | 'All'>('All');
  const [searchText, setSearchText] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const updateSearch = useDebouncedCallback((val: string) => {
    setDebouncedSearch(val.trim());
  }, 350);

  const handleSearchChange = (text: string) => {
    setSearchText(text);
    updateSearch(text);
  };

  const loadPosts = useCallback(async (showSkeleton = false) => {
    if (showSkeleton) setLoading(true);
    try {
      const typeQuery = filterType !== 'All' ? `&type=${filterType}` : '';
      const searchQuery = debouncedSearch ? `&pickupArea=${encodeURIComponent(debouncedSearch)}` : '';
      
      const [openPosts, myFavorites] = await Promise.all([
        apiFetch<Post[]>(`/api/posts?status=Open${typeQuery}${searchQuery}`),
        token ? apiFetch<Post[]>('/api/favorites', { token }) : Promise.resolve([]),
      ]);
      
      setPosts(openPosts);
      setFavoritedIds(new Set(myFavorites.map((p) => p.id)));
    } catch (err) {
      Alert.alert('Error', err instanceof ApiError ? err.message : 'Failed to load posts.');
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  }, [token, filterType, debouncedSearch]);

  useFocusEffect(
    useCallback(() => {
      loadPosts(true);
    }, [loadPosts])
  );

  async function handleToggleFavorite(post: Post) {
    if (!token) {
      Alert.alert('Sign in required', 'Please sign in or register to save delivery posts.');
      return;
    }
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
              loadPosts(false);
            } catch (err) {
              Alert.alert('Error', err instanceof ApiError ? err.message : 'Failed to accept post.');
            }
          }
        }
      ]
    );
  }

  return (
    <View style={styles.container}>
      <SearchHeader
        searchText={searchText}
        filterType={filterType}
        onSearchChange={handleSearchChange}
        onFilterTypeChange={setFilterType}
      />

      {loading && !refreshing ? (
        <View style={styles.skeletonContainer}>
          <ActivityIndicator size="large" color="#7C3AED" />
          <Text style={styles.skeletonText}>Scanning rehoming listings...</Text>
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                loadPosts(false);
              }}
              colors={['#7C3AED']}
              tintColor="#7C3AED"
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="file-tray-outline" size={48} color="#cbd5e1" />
              <Text style={styles.empty}>No open listings match this filter.</Text>
            </View>
          }
          renderItem={({ item }) => (
            <PostCard
              post={item}
              isFavorited={favoritedIds.has(item.id)}
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
  list: { padding: 16, paddingBottom: 40 },
  skeletonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  skeletonText: {
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
