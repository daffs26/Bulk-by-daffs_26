import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppStateProvider, useAppState } from '@/hooks/useAppState';
import { useFonts, Outfit_300Light, Outfit_400Regular, Outfit_500Medium, Outfit_600SemiBold, Outfit_700Bold, Outfit_800ExtraBold } from '@expo-google-fonts/outfit';
import { Platform, useWindowDimensions, View, Text, Pressable, Image, StyleSheet } from 'react-native';
import { Colors, Accent } from '@/constants/theme';
import '../global.css';

function AppLayoutContent() {
  const { isOnboarded, theme } = useAppState();
  const segments = useSegments();
  const router = useRouter();
  const { width } = useWindowDimensions();

  const [deferredPrompt, setDeferredPrompt] = React.useState<any>(null);
  const [isInstalled, setIsInstalled] = React.useState(false);

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

  useEffect(() => {
    if (Platform.OS !== 'web') return;

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsInstalled(true);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };
    
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert('PWA tidak didukung secara otomatis di browser ini atau sudah terinstall.\n\nUntuk menginstall secara manual:\n- Di Chrome/Edge: Klik ikon unduh di sebelah kanan address bar.\n- Di Safari iOS: Klik tombol Share lalu pilih "Tambahkan ke Layar Utama".');
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setDeferredPrompt(null);
    }
  };

  const c = Colors[theme];
  const isLargeScreen = Platform.OS === 'web' && width >= 1024;

  const appContent = (
    <View style={[styles.phoneScreen, { backgroundColor: c.bg }]}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(onboarding)" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false, animation: 'fade' }} />
      </Stack>
    </View>
  );

  if (isLargeScreen) {
    return (
      <View style={styles.desktopLayout}>
        {/* Left Column: Branding and PWA Install */}
        <View style={styles.desktopLeft}>
          {/* Logo Header */}
          <View style={styles.logoHeader}>
            <Image 
              source={require('@/assets/images/icon.png')} 
              style={styles.logoImage} 
            />
            <View>
              <Text style={styles.brandTitle}>BULK</Text>
              <Text style={styles.brandSubtitle}>AI Nutrition Tracker</Text>
            </View>
          </View>

          {/* Tagline */}
          <Text style={styles.tagline}>
            Kesehatan & Nutrisi,{'\n'}
            <Text style={{ color: Accent.primary }}>Terotomatisasi dengan AI.</Text>
          </Text>

          {/* Description */}
          <Text style={styles.description}>
            BULK adalah aplikasi pelacak porsi makanan dan kalori modern berbasis kecerdasan buatan. Scan makanan Anda lewat kamera atau barcode, hitung kebutuhan kalori harian secara akurat, dan simpan data Anda secara offline kapan saja.
          </Text>

          {/* Install Card */}
          <View style={styles.installCard}>
            <Text style={styles.cardTitle}>Unduh Aplikasi Offline (PWA)</Text>
            <Text style={styles.cardDesc}>
              Instal aplikasi ini langsung ke HP atau komputer Anda untuk menikmati akses instan, loading super cepat, dan penggunaan offline penuh tanpa internet.
            </Text>

            {isInstalled ? (
              <View style={styles.installedBadge}>
                <Text style={styles.installedText}>✓ Aplikasi Siap Digunakan Secara Offline</Text>
              </View>
            ) : (
              <Pressable 
                onPress={handleInstallClick}
                style={({ pressed }) => [
                  styles.installButton,
                  pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }
                ]}
              >
                <Text style={styles.installButtonText}>📥 Install Aplikasi Sekarang</Text>
              </Pressable>
            )}

            <Text style={styles.installNote}>
              * Jika tombol tidak merespon, buka menu browser Anda (titik tiga di kanan atas) dan klik "Instal Aplikasi" atau "Tambahkan ke layar utama".
            </Text>
          </View>

          {/* Features Grid */}
          <View style={styles.featuresGrid}>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>📸</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.featureTitle}>AI Food Scan</Text>
                <Text style={styles.featureDesc}>Ambil foto makanan dan dapatkan detail kalori instan.</Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>📴</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.featureTitle}>100% Offline</Text>
                <Text style={styles.featureDesc}>Bekerja tanpa koneksi internet setelah di-install.</Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>⚡</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.featureTitle}>Macro Tracker</Text>
                <Text style={styles.featureDesc}>Lacak Protein, Karbohidrat, Lemak, dan Air Minum harian.</Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>📈</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.featureTitle}>Grafik Kemajuan</Text>
                <Text style={styles.featureDesc}>Lihat statistik berat badan dan asupan kalori Anda.</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Right Column: Centered Realistic Phone Mockup */}
        <View style={styles.desktopRight}>
          <View style={styles.phoneMockup}>
            {/* Camera / Speaker Notch */}
            <View style={styles.phoneNotch} />
            
            {/* App Screen inside phone mockup */}
            {appContent}
          </View>
        </View>
      </View>
    );
  }

  return appContent;
}

const styles = StyleSheet.create({
  desktopLayout: {
    flexDirection: 'row',
    width: '100%',
    height: '100%',
    minHeight: '100vh',
    backgroundColor: '#0B0B0C',
    overflow: 'hidden',
  },
  desktopLeft: {
    flex: 1.2,
    paddingHorizontal: 64,
    paddingVertical: 48,
    justifyContent: 'center',
    maxWidth: 680,
  },
  desktopRight: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    ...Platform.select({
      web: {
        backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255, 107, 0, 0.08) 0%, rgba(11, 11, 12, 0) 70%)',
      }
    }),
  },
  logoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 32,
  },
  logoImage: {
    width: 64,
    height: 64,
    borderRadius: 16,
    ...Platform.select({
      web: {
        boxShadow: '0 8px 16px rgba(255, 107, 0, 0.2)',
      }
    }),
  },
  brandTitle: {
    fontSize: 32,
    fontFamily: 'Outfit_800ExtraBold',
    color: '#FFFFFF',
    letterSpacing: -1,
  },
  brandSubtitle: {
    fontSize: 14,
    fontFamily: 'Outfit_600SemiBold',
    color: '#FF6B00',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  tagline: {
    fontSize: 36,
    fontFamily: 'Outfit_800ExtraBold',
    color: '#FFFFFF',
    lineHeight: 42,
    letterSpacing: -1,
    marginBottom: 16,
  },
  description: {
    fontSize: 15,
    fontFamily: 'Outfit_500Medium',
    color: '#A0A0A5',
    lineHeight: 24,
    marginBottom: 32,
  },
  installCard: {
    backgroundColor: '#161618',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#242426',
    marginBottom: 40,
    ...Platform.select({
      web: {
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
      }
    }),
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'Outfit_700Bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  cardDesc: {
    fontSize: 13,
    fontFamily: 'Outfit_500Medium',
    color: '#A0A0A5',
    lineHeight: 18,
    marginBottom: 20,
  },
  installedBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  installedText: {
    color: '#10B981',
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 14,
  },
  installButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#FF6B00',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 14,
    ...Platform.select({
      web: {
        boxShadow: '0 8px 24px rgba(255, 107, 0, 0.25)',
        transition: 'all 0.2s ease',
      }
    }),
  },
  installButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Outfit_700Bold',
    fontSize: 15,
  },
  installNote: {
    marginTop: 16,
    fontSize: 11,
    fontFamily: 'Outfit_500Medium',
    color: '#707075',
    lineHeight: 14,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  featureItem: {
    width: '47%',
    flexDirection: 'row',
    gap: 12,
  },
  featureIcon: {
    fontSize: 20,
  },
  featureTitle: {
    fontSize: 14,
    fontFamily: 'Outfit_700Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 12,
    fontFamily: 'Outfit_500Medium',
    color: '#707075',
    lineHeight: 16,
  },
  phoneMockup: {
    width: 360,
    height: 740,
    backgroundColor: '#0B0B0C',
    borderRadius: 44,
    borderWidth: 10,
    borderColor: '#242426',
    overflow: 'hidden',
    position: 'relative',
    ...Platform.select({
      web: {
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 0 3px #1a1a1b, inset 0 0 12px rgba(0, 0, 0, 0.8)',
      }
    }),
  },
  phoneNotch: {
    position: 'absolute',
    top: 0,
    left: '50%',
    marginLeft: -55,
    width: 110,
    height: 24,
    backgroundColor: '#242426',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    zIndex: 9999,
  },
  phoneScreen: {
    flex: 1,
    width: '100%',
    height: '100%',
    borderRadius: 34,
    overflow: 'hidden',
  },
});

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

