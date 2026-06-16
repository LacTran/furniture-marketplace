import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuthStore } from '@/lib/auth-store';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{user?.displayName}</Text>
      <Text style={styles.email}>{user?.email}</Text>
      <Text style={styles.roles}>Roles: {user?.roles.join(', ')}</Text>

      <TouchableOpacity style={styles.button} onPress={() => logout()}>
        <Text style={styles.buttonText}>Log out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, paddingTop: 60, alignItems: 'center' },
  name: { fontSize: 22, fontWeight: 'bold' },
  email: { fontSize: 14, color: '#6b7280', marginTop: 4 },
  roles: { fontSize: 13, color: '#9ca3af', marginTop: 8 },
  button: {
    marginTop: 32,
    backgroundColor: '#dc2626',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  buttonText: { color: 'white', fontWeight: '600' },
});
