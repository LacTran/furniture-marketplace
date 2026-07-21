import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { apiFetch, ApiError } from '@/lib/api';
import { useAuthStore } from '@/lib/auth-store';

interface AuthResponse {
  token: string;
  userId: string;
  email: string;
  displayName: string;
  roles: string[];
}

export default function LoginScreen() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Validation Error', 'Please enter your email and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await apiFetch<AuthResponse>('/api/auth/login', {
        method: 'POST',
        body: { email: email.trim(), password },
      });

      setAuth(res.token, {
        userId: res.userId,
        email: res.email,
        displayName: res.displayName,
        roles: res.roles,
      });

      router.replace('/(tabs)');
    } catch (err) {
      Alert.alert(
        'Login Failed',
        err instanceof ApiError
          ? err.status === 401
            ? 'Invalid email or password.'
            : err.message
          : 'Could not connect to API server.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <Text style={styles.brandBadgeText}>K</Text>
          </View>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to coordinate your furniture transport.</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Email Address</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={18} color="#94a3b8" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="name@example.com"
                placeholderTextColor="#94a3b8"
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={18} color="#94a3b8" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#94a3b8"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.buttonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don&apos;t have an account?</Text>
            <TouchableOpacity onPress={() => router.push('/register')}>
              <Text style={styles.linkText}>Register here</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#FAF5FF' },
  container: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#DDD6FE',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 12,
  },
  brandBadgeText: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '900',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#4C1D95',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 20,
  },
  formGroup: { marginBottom: 16 },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4C1D95',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#DDD6FE',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 46,
  },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, fontSize: 14, color: '#4C1D95' },
  button: {
    backgroundColor: '#16A34A',
    borderRadius: 12,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  buttonText: { color: '#ffffff', fontSize: 15, fontWeight: '600' },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
    marginTop: 20,
  },
  footerText: { fontSize: 13, color: '#64748b' },
  linkText: { fontSize: 13, fontWeight: '700', color: '#7C3AED' },
});
