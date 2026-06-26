import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppStateProvider, useAppState } from '@/hooks/useAppState';
import { useFonts, Outfit_300Light, Outfit_400Regular, Outfit_500Medium, Outfit_600SemiBold, Outfit_700Bold, Outfit_800ExtraBold } from '@expo-google-fonts/outfit';
import '../global.css';

function AppLayoutContent() {
  const { isOnboarded, theme } = useAppState();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Determine if we are in the tabs or onboarding route group
    const inTabsGroup = segments[0] === '(tabs)';
    const inOnboardingGroup = segments[0] === '(onboarding)';

    if (!isOnboarded && !inOnboardingGroup) {
      // If not onboarded and not already on the onboarding page, redirect there
      router.replace('/(onboarding)');
    } else if (isOnboarded && !inTabsGroup) {
      // If onboarded and not in the tabs layout, redirect to tabs
      router.replace('/(tabs)');
    }
  }, [isOnboarded, segments]);

  return (
    <>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(onboarding)" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false, animation: 'fade' }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Outfit_300Light,
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
    Outfit_800ExtraBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AppStateProvider>
      <AppLayoutContent />
    </AppStateProvider>
  );
}
