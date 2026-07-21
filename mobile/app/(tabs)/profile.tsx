import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/lib/auth-store';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, token, logout } = useAuthStore();

  if (!token || !user) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="person-circle-outline" size={64} color="#94a3b8" />
        <Text style={styles.unauthTitle}>Sign in to Kyydissä</Text>
        <Text style={styles.unauthSubtitle}>Manage your profile, view assigned transport jobs, and accept local listings.</Text>
        
        <View style={styles.authButtonRow}>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => router.push('/login')}>
            <Text style={styles.primaryBtnText}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryBtn} onPress={() => router.push('/register')}>
            <Text style={styles.secondaryBtnText}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  function getInitials(name?: string) {
    if (!name) return 'K';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>{getInitials(user.displayName)}</Text>
        </View>
        <Text style={styles.displayName}>{user.displayName}</Text>
        <Text style={styles.email}>{user.email}</Text>
        
        <View style={styles.roleContainer}>
          {user.roles.map((r) => (
            <View key={r} style={styles.roleBadge}>
              <Text style={styles.roleText}>{r}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Driver Status Box */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="car-sport-outline" size={20} color="#7C3AED" />
          <Text style={styles.cardTitle}>Driver Status</Text>
        </View>
        <Text style={styles.cardBody}>
          You are ready to accept furniture transport requests. Browse open listings and click &quot;Accept Delivery&quot; to carry items on your commute.
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionSection}>
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Ionicons name="log-out-outline" size={18} color="#dc2626" />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF5FF' },
  content: { padding: 16, gap: 16 },
  centerContainer: {
    flex: 1,
    backgroundColor: '#FAF5FF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    gap: 12,
  },
  unauthTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4C1D95',
  },
  unauthSubtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
  },
  authButtonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  primaryBtn: {
    backgroundColor: '#16A34A',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  primaryBtnText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  secondaryBtn: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#7C3AED',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  secondaryBtnText: {
    color: '#7C3AED',
    fontWeight: '600',
    fontSize: 14,
  },
  profileHeader: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD6FE',
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '700',
  },
  displayName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4C1D95',
  },
  email: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  roleContainer: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 12,
  },
  roleBadge: {
    backgroundColor: '#FAF5FF',
    borderWidth: 1,
    borderColor: '#DDD6FE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  roleText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#7C3AED',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#DDD6FE',
    gap: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#4C1D95',
  },
  cardBody: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 18,
  },
  actionSection: {
    marginTop: 8,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#fecdd3',
    borderRadius: 12,
    paddingVertical: 12,
  },
  logoutText: {
    color: '#dc2626',
    fontWeight: '600',
    fontSize: 14,
  },
});
