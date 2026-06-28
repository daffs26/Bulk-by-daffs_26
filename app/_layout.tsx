import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppStateProvider, useAppState } from '@/hooks/useAppState';
import {
  useFonts,
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
} from '@expo-google-fonts/poppins';
import { Platform, useWindowDimensions, View, StyleSheet } from 'react-native';
import { Colors } from '@/constants/theme';
import DesktopLandingPage from '@/web/components/DesktopLandingPage';
import { SQLiteProvider } from 'expo-sqlite';
import { initializeDatabase } from '@/config/db';
import '../global.css';

function AppDatabaseProvider({ children }: { children: React.ReactNode }) {
  if (Platform.OS === 'web') {
    return <>{children}</>;
  }
  return (
    <SQLiteProvider databaseName="bulk.db" onInit={initializeDatabase}>
      {children}
    </SQLiteProvider>
  );
}

function AppLayoutContent() {
  const { isOnboarded, theme } = useAppState();
  const segments = useSegments();
  const router = useRouter();
  const { width } = useWindowDimensions();

  const [deferredPrompt, setDeferredPrompt] = React.useState<any>(null);
  const [isInstalled, setIsInstalled] = React.useState(false);

  /* ── Navigation guard ── */
  useEffect(() => {
    const isWeb = Platform.OS === 'web';
    const atRoot = segments.length === 0 || segments[0] === '';
    const inTabsGroup = segments[0] === '(tabs)';
    const inOnboardingGroup = segments[0] === '(onboarding)';

    if (isOnboarded) {
      if (!inTabsGroup) {
        router.replace('/(tabs)');
      }
    } else {
      // Guest users
      if (isWeb) {
        if (!atRoot && !inOnboardingGroup) {
          router.replace('/');
        }
      } else {
        // Mobile guest users
        if (!inOnboardingGroup) {
          router.replace('/(onboarding)/login');
        }
      }
    }
  }, [isOnboarded, segments]);

  /* ── PWA install prompt capture ── */
  useEffect(() => {
    if (Platform.OS !== 'web') return;

    if (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone
    ) {
      setIsInstalled(true);
    }

    const handlePrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    const handleInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handlePrompt);
    window.addEventListener('appinstalled', handleInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', handlePrompt);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert(
        'PWA tidak didukung secara otomatis di browser ini atau sudah terinstall.\n\n' +
        'Cara install manual:\n' +
        '• Chrome/Edge: Klik ikon unduh di sebelah kanan address bar\n' +
        '• Safari iPhone: Tap Share → "Tambahkan ke Layar Utama"'
      );
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setDeferredPrompt(null);
    }
  };

  const isWeb = Platform.OS === 'web';
  const hostname = isWeb ? window.location.hostname : '';

  const c = Colors[theme];

  return (
    <View style={[s.appContent, { backgroundColor: c.bg }]}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="(onboarding)" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false, animation: 'fade' }} />
      </Stack>
    </View>
  );
}

const s = StyleSheet.create({
  desktopRoot: {
    flex: 1,
    backgroundColor: '#0B0B0C',
    overflow: 'hidden',
  },
  appContent: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    // Load Poppins under Outfit aliases so we don't have to rename hundreds of font family references
    Outfit_300Light: Poppins_300Light,
    Outfit_400Regular: Poppins_400Regular,
    Outfit_500Medium: Poppins_500Medium,
    Outfit_600SemiBold: Poppins_600SemiBold,
    Outfit_700Bold: Poppins_700Bold,
    Outfit_800ExtraBold: Poppins_800ExtraBold,

    // Also support actual Poppins names if needed
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
  });

  if (!fontsLoaded) return null;

  return (
    <AppDatabaseProvider>
      <AppStateProvider>
        <AppLayoutContent />
      </AppStateProvider>
    </AppDatabaseProvider>
  );
}
