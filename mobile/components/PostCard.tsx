import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Post } from '@/lib/types';

const TYPE_LABELS: Record<Post['type'], string> = {
  ItemAvailable: '📦 Available',
  PickupRequest: '🚗 ASAP',
};

interface PostCardProps {
  post: Post;
  isFavorited: boolean;
  onToggleFavorite: (post: Post) => void;
  onAccept: (post: Post) => void;
}

export function PostCard({ post, isFavorited, onToggleFavorite, onAccept }: PostCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.typeLabel}>{TYPE_LABELS[post.type]}</Text>
        <TouchableOpacity onPress={() => onToggleFavorite(post)}>
          <Ionicons
            name={isFavorited ? 'heart' : 'heart-outline'}
            size={22}
            color={isFavorited ? '#dc2626' : '#9ca3af'}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>{post.title}</Text>
      {post.description && <Text style={styles.description}>{post.description}</Text>}

      <Text style={styles.route}>
        {post.pickupArea} → {post.dropoffArea}
      </Text>

      {(post.lengthCm || post.weightKg) && (
        <Text style={styles.dimensions}>
          {post.lengthCm ?? '?'}×{post.widthCm ?? '?'}×{post.heightCm ?? '?'} cm
          {post.weightKg != null && ` · ${post.weightKg} kg`}
        </Text>
      )}

      <View style={styles.footerRow}>
        <Text style={styles.owner}>by {post.ownerDisplayName}</Text>
        <View style={styles.footerRight}>
          {post.priceOffered != null && <Text style={styles.price}>€{post.priceOffered}</Text>}
          {post.status === 'Open' && (
            <TouchableOpacity style={styles.acceptButton} onPress={() => onAccept(post)}>
              <Text style={styles.acceptButtonText}>Accept</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  typeLabel: { fontSize: 12, color: '#6b7280', textTransform: 'uppercase' },
  title: { fontSize: 17, fontWeight: '600', marginTop: 4 },
  description: { fontSize: 14, color: '#6b7280', marginTop: 2 },
  route: { fontSize: 14, fontWeight: '500', marginTop: 8 },
  dimensions: { fontSize: 12, color: '#9ca3af', marginTop: 2 },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  owner: { fontSize: 12, color: '#9ca3af' },
  footerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  price: { fontSize: 14, fontWeight: '600', color: '#16a34a' },
  acceptButton: {
    backgroundColor: '#1f2937',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  acceptButtonText: { color: 'white', fontSize: 13, fontWeight: '600' },
});
