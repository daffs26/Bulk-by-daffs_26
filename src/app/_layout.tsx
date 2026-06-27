import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppStateProvider, useAppState } from '@/hooks/useAppState';
import { useFonts, Outfit_300Light, Outfit_400Regular, Outfit_500Medium, Outfit_600SemiBold, Outfit_700Bold, Outfit_800ExtraBold } from '@expo-google-fonts/outfit';
import { Platform, useWindowDimensions } from 'react-native';
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

  const isLargeScreen = Platform.OS === 'web' && width >= 1024;

  const appContent = (
    <>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(onboarding)" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false, animation: 'fade' }} />
      </Stack>
    </>
  );

  if (isLargeScreen) {
    return (
      <div className="desktop-layout">
        {/* Left Side: Marketing and PWA Installation Focus */}
        <div className="desktop-left">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
            <img 
              src="/icons/icon-192.png" 
              alt="BULK Logo" 
              style={{ width: 64, height: 64, borderRadius: 16, boxShadow: '0 8px 16px rgba(255, 107, 0, 0.2)' }} 
            />
            <div>
              <h1 style={{ fontSize: 32, fontWeight: 800, margin: 0, letterSpacing: -1, color: '#FFFFFF', fontFamily: 'Outfit_800ExtraBold' }}>
                BULK
              </h1>
              <p style={{ fontSize: 14, fontWeight: 600, margin: 0, color: '#FF6B00', letterSpacing: 0.5, textTransform: 'uppercase', fontFamily: 'Outfit_600SemiBold' }}>
                AI Nutrition Tracker
              </p>
            </div>
          </div>

          <h2 style={{ fontSize: 40, fontWeight: 800, lineHeight: 1.15, letterSpacing: -1.2, marginBottom: 16, color: '#FFFFFF', fontFamily: 'Outfit_800ExtraBold' }}>
            Kesehatan & Nutrisi,<br />
            <span style={{ color: '#FF6B00' }}>Terotomatisasi dengan AI.</span>
          </h2>

          <p style={{ fontSize: 16, color: '#A0A0A5', lineHeight: 1.6, marginBottom: 32, fontFamily: 'Outfit_500Medium' }}>
            BULK adalah aplikasi pelacak porsi makanan dan kalori modern berbasis kecerdasan buatan. Scan makanan Anda lewat kamera atau barcode, hitung kebutuhan kalori harian secara akurat, dan simpan data Anda secara offline kapan saja.
          </p>

          {/* Action Button Card */}
          <div style={{ 
            backgroundColor: '#161618', 
            borderRadius: 24, 
            padding: 24, 
            border: '1px solid #242426',
            marginBottom: 40,
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
          }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 8px 0', color: '#FFFFFF', fontFamily: 'Outfit_700Bold' }}>
              Unduh Aplikasi Offline (PWA)
            </h3>
            <p style={{ fontSize: 13, color: '#A0A0A5', margin: '0 0 20px 0', lineHeight: 1.4, fontFamily: 'Outfit_500Medium' }}>
              Instal aplikasi ini langsung ke HP atau komputer Anda untuk menikmati akses instan, loading super cepat, dan penggunaan offline penuh tanpa internet.
            </p>

            {isInstalled ? (
              <div style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: 8, 
                backgroundColor: 'rgba(16, 185, 129, 0.1)', 
                border: '1px solid rgba(16, 185, 129, 0.2)', 
                padding: '12px 20px', 
                borderRadius: 12,
                color: '#10B981',
                fontWeight: 600,
                fontSize: 14,
                fontFamily: 'Outfit_600SemiBold'
              }}>
                ✓ Aplikasi Siap Digunakan Secara Offline
              </div>
            ) : (
              <button 
                onClick={handleInstallClick}
                style={{ 
                  backgroundColor: '#FF6B00', 
                  color: '#FFFFFF', 
                  border: 'none', 
                  padding: '14px 28px', 
                  borderRadius: 14, 
                  fontWeight: 700, 
                  fontSize: 15, 
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10,
                  boxShadow: '0 8px 24px rgba(255, 107, 0, 0.25)',
                  transition: 'transform 0.2s, background-color 0.2s',
                  fontFamily: 'Outfit_700Bold'
                }}
                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#FF8224'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#FF6B00'; e.currentTarget.style.transform = 'none'; }}
              >
                📥 Install Aplikasi Sekarang
              </button>
            )}

            <div style={{ marginTop: 16, fontSize: 11, color: '#707075', lineHeight: 1.4, fontFamily: 'Outfit_500Medium' }}>
              * Jika tombol tidak merespon, buka menu browser Anda (titik tiga di kanan atas) dan klik <strong>"Instal Aplikasi"</strong> atau <strong>"Tambahkan ke layar utama"</strong>.
            </div>
          </div>

          {/* Features Checklist */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ display: 'flex', gap: 12 }}>
              <span style={{ color: '#FF6B00', fontWeight: 'bold' }}>📸</span>
              <div>
                <h4 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 4px 0', color: '#FFFFFF', fontFamily: 'Outfit_700Bold' }}>AI Food Scan</h4>
                <p style={{ fontSize: 12, color: '#707075', margin: 0, fontFamily: 'Outfit_500Medium' }}>Ambil foto makanan dan dapatkan detail kalori instan.</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <span style={{ color: '#FF6B00', fontWeight: 'bold' }}>📴</span>
              <div>
                <h4 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 4px 0', color: '#FFFFFF', fontFamily: 'Outfit_700Bold' }}>100% Offline</h4>
                <p style={{ fontSize: 12, color: '#707075', margin: 0, fontFamily: 'Outfit_500Medium' }}>Bekerja tanpa koneksi internet setelah di-install.</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <span style={{ color: '#FF6B00', fontWeight: 'bold' }}>⚡</span>
              <div>
                <h4 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 4px 0', color: '#FFFFFF', fontFamily: 'Outfit_700Bold' }}>Macro Tracker</h4>
                <p style={{ fontSize: 12, color: '#707075', margin: 0, fontFamily: 'Outfit_500Medium' }}>Lacak Protein, Karbohidrat, Lemak, dan Air Minum harian.</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <span style={{ color: '#FF6B00', fontWeight: 'bold' }}>📈</span>
              <div>
                <h4 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 4px 0', color: '#FFFFFF', fontFamily: 'Outfit_700Bold' }}>Grafik Kemajuan</h4>
                <p style={{ fontSize: 12, color: '#707075', margin: 0, fontFamily: 'Outfit_500Medium' }}>Lihat statistik berat badan dan asupan kalori Anda.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Fully Interactive Phone Mockup */}
        <div className="desktop-right">
          <div className="phone-mockup">
            <div className="phone-notch"></div>
            <div className="phone-screen">
              {appContent}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return appContent;
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
