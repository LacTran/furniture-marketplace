import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useAuthStore } from '@/lib/auth-store';
import { View, ActivityIndicator } from 'react-native';

export default function RootLayout() {
  const { token, isLoading, loadFromStorage } = useAuthStore();
  const router = useRouter();
  const segments = useSegments();

  // Restore session from SecureStore once, on app launch.
  useEffect(() => {
    loadFromStorage();
  }, []);

  // Simple route guard: redirect to /login if not authenticated and not
  // already on an auth screen. Mirrors the kind of check the web app does
  // per-page, but centralized here since mobile navigation works differently.
  useEffect(() => {
    if (isLoading) return;

    const onAuthScreen = segments[0] === 'login' || segments[0] === 'register';

    if (!token && !onAuthScreen) {
      router.replace('/login');
    } else if (token && onAuthScreen) {
      router.replace('/(tabs)');
    }
  }, [token, isLoading, segments]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
