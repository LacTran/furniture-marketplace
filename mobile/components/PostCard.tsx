import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Post } from '@/lib/types';

const TYPE_LABELS: Record<Post['type'], string> = {
  ItemAvailable: 'Item Available',
  PickupRequest: 'ASAP Pickup',
};

interface PostCardProps {
  post: Post;
  isFavorited: boolean;
  onToggleFavorite: (post: Post) => void;
  onAccept: (post: Post) => void;
}

export function PostCard({ post, isFavorited, onToggleFavorite, onAccept }: PostCardProps) {
  const isAvailable = post.type === 'ItemAvailable';

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={[styles.badge, isAvailable ? styles.badgeAvailable : styles.badgeASAP]}>
          <Text style={[styles.badgeText, isAvailable ? styles.badgeTextAvailable : styles.badgeTextASAP]}>
            {TYPE_LABELS[post.type]}
          </Text>
        </View>

        <TouchableOpacity style={styles.favoriteButton} onPress={() => onToggleFavorite(post)}>
          <Ionicons
            name={isFavorited ? 'heart' : 'heart-outline'}
            size={20}
            color={isFavorited ? '#ef4444' : '#94a3b8'}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>{post.title}</Text>
      {post.description ? (
        <Text style={styles.description} numberOfLines={2}>
          {post.description}
        </Text>
      ) : null}

      {/* Route Info */}
      <View style={styles.routeContainer}>
        <View style={styles.routeCol}>
          <Text style={styles.routeLabel}>PICKUP</Text>
          <Text style={styles.routeArea} numberOfLines={1}>{post.pickupArea}</Text>
        </View>
        <Ionicons name="arrow-forward" size={14} color="#cbd5e1" style={styles.routeArrow} />
        <View style={styles.routeCol}>
          <Text style={styles.routeLabel}>DROPOFF</Text>
          <Text style={styles.routeArea} numberOfLines={1}>{post.dropoffArea}</Text>
        </View>
      </View>

      {/* Metrics Row */}
      {(post.lengthCm || post.widthCm || post.heightCm || post.weightKg) ? (
        <View style={styles.metricsRow}>
          {post.lengthCm || post.widthCm || post.heightCm ? (
            <View style={styles.metricBadge}>
              <Text style={styles.metricText}>
                Size: {post.lengthCm ?? '?'}×{post.widthCm ?? '?'}×{post.heightCm ?? '?'} cm
              </Text>
            </View>
          ) : null}
          {post.weightKg != null ? (
            <View style={styles.metricBadge}>
              <Text style={styles.metricText}>Weight: {post.weightKg} kg</Text>
            </View>
          ) : null}
        </View>
      ) : null}

      <View style={styles.footerRow}>
        <Text style={styles.owner}>by {post.ownerDisplayName}</Text>
        <View style={styles.footerRight}>
          {post.priceOffered != null ? (
            <Text style={styles.price}>€{post.priceOffered}</Text>
          ) : null}
          {post.status === 'Open' ? (
            <TouchableOpacity style={styles.acceptButton} onPress={() => onAccept(post)}>
              <Text style={styles.acceptButtonText}>Accept Job</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.acceptedTag}>
              <Text style={styles.acceptedTagText}>Accepted</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeAvailable: {
    backgroundColor: '#e0f2fe',
  },
  badgeASAP: {
    backgroundColor: '#fef3c7',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  badgeTextAvailable: {
    color: '#0369a1',
  },
  badgeTextASAP: {
    color: '#b45309',
  },
  favoriteButton: {
    padding: 4,
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 8,
  },
  description: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 4,
    lineHeight: 18,
  },
  routeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 10,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  routeCol: {
    flex: 1,
  },
  routeLabel: {
    fontSize: 8,
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: 0.5,
  },
  routeArea: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginTop: 2,
  },
  routeArrow: {
    marginHorizontal: 8,
  },
  metricsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
  },
  metricBadge: {
    backgroundColor: '#f1f5f9',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  metricText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '500',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f8fafc',
  },
  owner: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '500',
  },
  footerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  price: {
    fontSize: 15,
    fontWeight: '800',
    color: '#047857',
  },
  acceptButton: {
    backgroundColor: '#0f172a',
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 14,
  },
  acceptButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  acceptedTag: {
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 14,
  },
  acceptedTagText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
  },
});
