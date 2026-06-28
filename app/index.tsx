import React, { useEffect } from 'react';
import { Platform, View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppState } from '@/hooks/useAppState';
import DesktopLandingPage from '@/web/components/DesktopLandingPage';
import { Colors } from '@/constants/theme';

export default function RootIndex() {
  const { isOnboarded, theme } = useAppState();
  const router = useRouter();
  const c = Colors[theme];

  useEffect(() => {
    // If onboarded, redirect to tabs dashboard
    if (isOnboarded) {
      router.replace('/(tabs)');
      return;
    }

    // If mobile platform, go directly to login/signup screen
    if (Platform.OS !== 'web') {
      router.replace('/(onboarding)/login');
    }
  }, [isOnboarded]);

  // Loading state while redirecting on mobile
  if (Platform.OS !== 'web') {
    return (
      <View style={{ flex: 1, backgroundColor: c.bg, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#FF6B00" />
      </View>
    );
  }

  // If already onboarded, wait for redirect
  if (isOnboarded) {
    return (
      <View style={{ flex: 1, backgroundColor: c.bg, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#FF6B00" />
      </View>
    );
  }

  // Render the responsive landing page for guest web visitors
  return <DesktopLandingPage />;
}
