import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  StyleSheet,
  Platform,
  useWindowDimensions,
} from 'react-native';

const O = '#FF6B00';
const BG = '#0B0B0C';
const BG2 = '#0F0F10';
const SURF = '#141416';
const SURF2 = '#1A1A1D';
const BORD = '#222225';
const TXT = '#FFFFFF';
const MUTED = '#A0A0A5';
const DIM = '#4A4A4F';

/* ─── Sleek Static Screen Illustrations (No Emojis, High Contrast) ─── */

function IlluDashboard() {
  return (
    <View style={{ flex: 1, backgroundColor: BG, padding: 18 }}>
      <Text style={{ color: MUTED, fontSize: 8, fontFamily: 'Poppins_600SemiBold', letterSpacing: 1.5, marginBottom: 2 }}>STATUS MONITOR</Text>
      <Text style={{ color: TXT, fontSize: 16, fontFamily: 'Poppins_800ExtraBold', letterSpacing: -0.5, marginBottom: 16 }}>
        BULK / <Text style={{ color: O }}>CORE</Text>
      </Text>
      
      {/* Calorie Progress Ring/Card */}
      <View style={{ backgroundColor: SURF, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: BORD, marginBottom: 12 }}>
        <Text style={{ color: MUTED, fontSize: 8, fontFamily: 'Poppins_600SemiBold', letterSpacing: 1 }}>ENERGI HARIAN</Text>
        <Text style={{ color: TXT, fontSize: 28, fontFamily: 'Poppins_800ExtraBold', marginVertical: 4 }}>1,247 <Text style={{ fontSize: 12, color: DIM }}>kcal</Text></Text>
        <View style={{ height: 3, backgroundColor: '#222', borderRadius: 1.5, marginTop: 10, overflow: 'hidden' }}>
          <View style={{ height: 3, width: '62%', backgroundColor: O, borderRadius: 1.5 }} />
        </View>
        <Text style={{ color: DIM, fontSize: 7.5, marginTop: 8 }}>Target harian: 2,000 kcal · Sisa 753 kcal</Text>
      </View>

      {/* Macro Stats */}
      <View style={{ flexDirection: 'row', gap: 6, marginBottom: 12 }}>
        {[
          ['PRO', '87g', O],
          ['CAR', '142g', '#3B82F6'],
          ['FAT', '45g', '#10B981']
        ].map(([label, val, color]) => (
          <View key={label} style={{ flex: 1, backgroundColor: SURF, borderRadius: 10, padding: 10, borderWidth: 1, borderColor: BORD }}>
            <Text style={{ color, fontSize: 11, fontFamily: 'Poppins_700Bold' }}>{val}</Text>
            <Text style={{ color: DIM, fontSize: 7.5, fontFamily: 'Poppins_600SemiBold', marginTop: 2 }}>{label}</Text>
          </View>
        ))}
      </View>

      {/* Water Tracker */}
      <View style={{ backgroundColor: SURF, borderRadius: 10, padding: 10, borderWidth: 1, borderColor: BORD, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View>
          <Text style={{ color: '#3B82F6', fontSize: 11, fontFamily: 'Poppins_700Bold' }}>1,750 ml</Text>
          <Text style={{ color: DIM, fontSize: 7.5, fontFamily: 'Poppins_600SemiBold', marginTop: 2 }}>HIDRASI / H2O</Text>
        </View>
        <View style={{ width: 14, height: 14, borderRadius: 7, borderWidth: 2, borderColor: '#3B82F6', alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#3B82F6' }} />
        </View>
      </View>
    </View>
  );
}

function IlluFoodLog() {
  const foods = [
    { name: 'Nasi Putih Premium', cal: 260, qty: '200g' },
    { name: 'Dada Ayam Panggang', cal: 180, qty: '120g' },
    { name: 'Tahu Goreng Tepung', cal: 90, qty: '1 pcs' },
    { name: 'Sayur Bayam Bening', cal: 45, qty: '1 mangkok' },
  ];
  return (
    <View style={{ flex: 1, backgroundColor: BG, padding: 18 }}>
      <Text style={{ color: TXT, fontSize: 16, fontFamily: 'Poppins_800ExtraBold', letterSpacing: -0.5, marginBottom: 16 }}>
        JURNAL / <Text style={{ color: O }}>MAKANAN</Text>
      </Text>
      
      {foods.map((f, i) => (
        <View key={i} style={{ backgroundColor: SURF, borderRadius: 10, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: BORD, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={{ color: TXT, fontSize: 9.5, fontFamily: 'Poppins_600SemiBold' }}>{f.name}</Text>
            <Text style={{ color: DIM, fontSize: 7.5, marginTop: 2 }}>{f.qty}</Text>
          </View>
          <Text style={{ color: O, fontSize: 11, fontFamily: 'Poppins_700Bold' }}>+{f.cal} <Text style={{ fontSize: 7, color: MUTED }}>kcal</Text></Text>
        </View>
      ))}
      
      <View style={[{
        marginTop: 4, backgroundColor: 'rgba(255,107,0,0.02)',
        borderRadius: 10, borderWidth: 1, borderColor: 'rgba(255,107,0,0.15)',
        padding: 10, alignItems: 'center',
      }, Platform.select({ web: { borderStyle: 'dashed' } }) as any]}>
        <Text style={{ color: O, fontSize: 9, fontFamily: 'Poppins_600SemiBold', letterSpacing: 0.5 }}>+ INPUT MAKANAN</Text>
      </View>
    </View>
  );
}

function IlluProgress() {
  const bars = [65, 80, 55, 90, 70, 85, 60];
  const days = ['S', 'S', 'R', 'K', 'J', 'S', 'M'];
  return (
    <View style={{ flex: 1, backgroundColor: BG, padding: 18 }}>
      <Text style={{ color: TXT, fontSize: 16, fontFamily: 'Poppins_800ExtraBold', letterSpacing: -0.5, marginBottom: 16 }}>
        METRIKS / <Text style={{ color: O }}>PROGRES</Text>
      </Text>
      
      <View style={{ backgroundColor: SURF, borderRadius: 12, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: BORD }}>
        <Text style={{ color: MUTED, fontSize: 8, fontFamily: 'Poppins_600SemiBold', letterSpacing: 1, marginBottom: 12 }}>RIWAYAT ENERGI HARI H-7</Text>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 6, height: 48 }}>
          {bars.map((h, i) => (
            <View key={i} style={{ flex: 1, alignItems: 'center' }}>
              <View style={{ height: (h / 100) * 38, backgroundColor: i === 3 ? O : '#222', borderRadius: 2, width: '100%' }} />
              <Text style={{ color: DIM, fontSize: 6.5, marginTop: 4, fontFamily: 'Poppins_600SemiBold' }}>{days[i]}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={{ flexDirection: 'row', gap: 8 }}>
        <View style={{ flex: 1, backgroundColor: SURF, borderRadius: 10, padding: 12, borderWidth: 1, borderColor: BORD }}>
          <Text style={{ color: MUTED, fontSize: 7.5, fontFamily: 'Poppins_600SemiBold', marginBottom: 2 }}>BERAT BADAN</Text>
          <Text style={{ color: TXT, fontSize: 14, fontFamily: 'Poppins_700Bold' }}>68.2 kg</Text>
          <Text style={{ color: '#10B981', fontSize: 8, marginTop: 2 }}>-1.8 kg bulan ini</Text>
        </View>
        <View style={{ flex: 1, backgroundColor: SURF, borderRadius: 10, padding: 12, borderWidth: 1, borderColor: BORD }}>
          <Text style={{ color: MUTED, fontSize: 7.5, fontFamily: 'Poppins_600SemiBold', marginBottom: 2 }}>STREAK</Text>
          <Text style={{ color: O, fontSize: 14, fontFamily: 'Poppins_700Bold' }}>12 HARI</Text>
          <Text style={{ color: DIM, fontSize: 8, marginTop: 2 }}>Konsisten log</Text>
        </View>
      </View>
    </View>
  );
}

/* ─── Phone Mockup Container (Sleek Notch & Minimal Outlines) ─── */

function PhoneMockup({ children, size = 'md' }: { children: React.ReactNode; size?: 'sm' | 'md' | 'lg' }) {
  const dims = { sm: { w: 230, h: 460 }, md: { w: 290, h: 580 }, lg: { w: 330, h: 660 } }[size];
  return (
    <View style={[s.phoneShell, { width: dims.w, height: dims.h }, Platform.select({
      web: { boxShadow: '0 40px 90px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.06), inset 0 0 0 1px rgba(255,255,255,0.02)' }
    }) as any]}>
      <View style={s.phoneNotch} />
      <View style={{ flex: 1, borderRadius: 36, overflow: 'hidden' }}>
        {children}
      </View>
    </View>
  );
}

/* ─── Features Definition ─── */
const FEATURES = [
  { id: '01', title: 'AI Photo Engine', tag: 'SCAN', desc: 'Identifikasi makanan instan dengan visual recognition langsung dari perangkat.' },
  { id: '02', title: 'Private Local Storage', tag: 'DATA', desc: '100% data tersimpan lokal. Tidak ada sinkronisasi cloud eksternal jika tidak diinginkan.' },
  { id: '03', title: 'UPC Barcode Decoder', tag: 'SCAN', desc: 'Scan kode makanan kemasan secara cepat dengan kamera internal.' },
  { id: '04', title: 'Dynamic Target Calculator', tag: 'CORE', desc: 'Estimasi BMI dan TDEE terintegrasi untuk kalkulasi target kalori ideal.' },
];

interface Props {
  appContent: React.ReactNode;
  onInstallClick: () => void;
  isInstalled: boolean;
}

export default function DesktopLandingPage({ appContent, onInstallClick, isInstalled }: Props) {
  const { width } = useWindowDimensions();
  const isMobile = width < 1024;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [useTransition, setUseTransition] = useState(true);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setUseTransition(true);
      setCurrentIndex((prev) => prev + 1);
    }, 5000); // 5 seconds per slide

    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    if (currentIndex === 3) {
      const timeout = setTimeout(() => {
        setUseTransition(false);
        setCurrentIndex(0);
      }, 600); // Wait for the transition to finish
      return () => clearTimeout(timeout);
    }
  }, [currentIndex]);

  return (
    <ScrollView style={s.root} showsVerticalScrollIndicator={false} contentContainerStyle={s.scrollContainer}>

      {/* ── Header ── */}
      <View style={[s.header, isMobile && { paddingHorizontal: 20, paddingVertical: 16 }]}>
        <View style={s.headerLeft}>
          <Image source={require('@/assets/images/icon.png')} style={s.logoIcon} />
          <Text style={s.logoText}>BULK</Text>
        </View>
        <View style={s.headerRight}>
          <Pressable
            onPress={onInstallClick}
            style={({ pressed }) => [s.navBtn, pressed && { opacity: 0.8 }]}
          >
            <Text style={s.navBtnText}>{isInstalled ? 'TERINSTALL' : 'INSTALL APP'}</Text>
          </Pressable>
        </View>
      </View>

      {/* ── Main Hero Area (Asymmetrical Grid-Split) ── */}
      <View style={[s.heroGrid, isMobile && { flexDirection: 'column', paddingHorizontal: 20, paddingVertical: 32, gap: 32 }]}>
        
        {/* Left Column: Bold Typographic Pitch & System Info */}
        <View style={[s.heroMain, isMobile && { flex: undefined }]}>

          <Text style={[s.mainHeadline, isMobile && { fontSize: 34, lineHeight: 40, letterSpacing: -1, marginBottom: 16 }]}>
            NUTRISI.<Text style={{ color: O }}>{'\n'}TANPA CLOUD.</Text>{'\n'}100% LOKAL.
          </Text>

          <Text style={[s.mainSubhead, isMobile && { fontSize: 13, lineHeight: 20, marginBottom: 20 }]}>
            Sistem pelacakan kalori mandiri dengan asisten kecerdasan buatan. Berjalan sepenuhnya di peramban, bebas pelacakan data, dan dapat dioperasikan secara luring setelah proses instalasi.
          </Text>

          {/* Installation Terminal Panel */}
          <View style={[s.installTerminal, isMobile && { marginBottom: 20 }]}>
            <View style={s.terminalHeader}>
              <View style={s.terminalButtons}>
                <View style={[s.terminalBtnCircle, { backgroundColor: '#FF5F56' }]} />
                <View style={[s.terminalBtnCircle, { backgroundColor: '#FFBD2E' }]} />
                <View style={[s.terminalBtnCircle, { backgroundColor: '#27C93F' }]} />
              </View>
              <Text style={s.terminalTitle}>install_wizard.sh</Text>
            </View>
            <View style={s.terminalBody}>
              <Text style={s.terminalLine}>$ curl -O https://bulk-website-daffs26.vercel.app/downloads/bulk-app.apk</Text>
              <Text style={s.terminalLine}>$ install bulk-app.apk</Text>
              <Text style={[s.terminalLine, { color: O, marginVertical: 8 }]}>
                &gt;&gt; Ready to install native Android package
              </Text>
              
              <View style={{ gap: 8, marginTop: 8 }}>
                <Pressable
                  onPress={() => {
                    if (Platform.OS === 'web') {
                      window.open('/downloads/bulk-app.apk', '_blank');
                    }
                  }}
                  style={({ pressed }) => [s.terminalCTA, pressed && { opacity: 0.9, transform: [{ translateY: 1 }] }]}
                >
                  <Text style={s.terminalCTAText}>
                    UNDUH ANDROID APK (NATIVE)
                  </Text>
                </Pressable>

                <Pressable
                  onPress={onInstallClick}
                  style={({ pressed }) => [
                    s.terminalCTA,
                    { backgroundColor: 'transparent', borderWidth: 1, borderColor: O, marginTop: 0 },
                    pressed && { opacity: 0.8 }
                  ]}
                >
                  <Text style={[s.terminalCTAText, { color: O }]}>
                    {isInstalled ? 'VERSI WEB SUDAH TERPASANG' : 'PASANG SEBAGAI PWA (MOBILE WEB)'}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>

        </View>

        {/* Right Column: Device Viewport with Infinite Auto Slider */}
        <View style={[s.heroVisual, isMobile && { flex: undefined, minHeight: 480 }]}>
          
          {/* Phone Shell Wrap */}
          <View style={s.mockupWrapper}>
            <PhoneMockup size="lg">
              <View style={{ flex: 1, overflow: 'hidden', backgroundColor: BG }}>
                <View style={[
                  s.slidesWrapper,
                  {
                    transform: [
                      {
                        translateX: -currentIndex * 310
                      }
                    ],
                    transition: useTransition ? 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)' : 'none'
                  } as any
                ]}>
                  <View style={s.slideItem}>
                    <IlluDashboard />
                  </View>
                  <View style={s.slideItem}>
                    <IlluFoodLog />
                  </View>
                  <View style={s.slideItem}>
                    <IlluProgress />
                  </View>
                  {/* Clone of the first slide for seamless loop */}
                  <View style={s.slideItem}>
                    <IlluDashboard />
                  </View>
                </View>
              </View>
            </PhoneMockup>
          </View>

        </View>

      </View>

      {/* ── Asymmetrical Features Section (No generic grid cards) ── */}
      <View style={[s.featuresSection, isMobile && { flexDirection: 'column', paddingHorizontal: 20, paddingVertical: 40, gap: 32 }]}>
        <View style={[s.featLeftPane, isMobile && { flex: undefined }]}>
          <Text style={s.featSectionLabel}>PENGALAMAN PREMIUM</Text>
          <Text style={s.featSectionTitle}>Asisten Nutrisi Terbaik Anda</Text>
          <Text style={s.featSectionDesc}>
            BULK dirancang khusus untuk mempermudah perjalanan kebugaran Anda. Pantau asupan kalori, hitung keseimbangan nutrisi harian, dan raih target tubuh ideal Anda dengan bantuan kecerdasan buatan yang instan dan mudah digunakan.
          </Text>
        </View>
        
        <View style={[s.featRightPane, isMobile && { flex: undefined }]}>
          {FEATURES.map((item) => (
            <View key={item.id} style={s.featRow}>
              <View style={s.featRowLeft}>
                <Text style={s.featId}>{item.id}</Text>
                <Text style={s.featTag}>[ {item.tag} ]</Text>
              </View>
              <View style={s.featRowContent}>
                <Text style={s.featTitle}>{item.title}</Text>
                <Text style={s.featDesc}>{item.desc}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* ── Footer ── */}
      <View style={[s.footer, isMobile && { flexDirection: 'column', gap: 16, paddingHorizontal: 20, alignItems: 'center' }]}>
        <View style={s.footerLeft}>
          <Image source={require('@/assets/images/icon.png')} style={s.footerIcon} />
          <Text style={s.footerBrandText}>BULK · AI NUTRITION ENGINE</Text>
        </View>
        <Text style={s.footerRights}>@daffs_26</Text>
      </View>

    </ScrollView>
  );
}

/* ─── Stylesheet ─── */
const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BG,
  },
  scrollContainer: {
    minHeight: '100%',
  },

  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 48,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderColor: BORD,
    backgroundColor: BG,
    ...Platform.select({
      web: {
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(16px)',
        backgroundColor: 'rgba(11,11,12,0.8)'
      }
    }) as any,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
  },
  logoText: {
    color: TXT,
    fontSize: 16,
    fontFamily: 'Poppins_800ExtraBold',
    letterSpacing: -0.5,
  },
  logoSub: {
    color: O,
    fontSize: 8,
    fontFamily: 'Poppins_700Bold',
    letterSpacing: 1.5,
    marginTop: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#111',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: BORD,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  statusText: {
    color: MUTED,
    fontSize: 8.5,
    fontFamily: 'Poppins_700Bold',
    letterSpacing: 0.8,
  },
  navBtn: {
    backgroundColor: TXT,
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 6,
  },
  navBtnText: {
    color: BG,
    fontSize: 11,
    fontFamily: 'Poppins_700Bold',
    letterSpacing: 0.5,
  },

  /* Asymmetrical Hero Grid */
  heroGrid: {
    flexDirection: 'row',
    paddingHorizontal: 48,
    paddingVertical: 64,
    gap: 48,
    borderBottomWidth: 1,
    borderColor: BORD,
  },
  heroMain: {
    flex: 1.1,
    justifyContent: 'center',
  },
  systemInfo: {
    marginBottom: 16,
  },
  systemInfoText: {
    color: DIM,
    fontSize: 10,
    fontFamily: 'Poppins_700Bold',
    letterSpacing: 2,
  },
  mainHeadline: {
    color: TXT,
    fontSize: 54,
    fontFamily: 'Poppins_800ExtraBold',
    lineHeight: 62,
    letterSpacing: -2,
    marginBottom: 24,
  },
  mainSubhead: {
    color: MUTED,
    fontSize: 15,
    fontFamily: 'Poppins_400Regular',
    lineHeight: 25,
    maxWidth: 520,
    marginBottom: 36,
  },

  /* Terminal Installation Card */
  installTerminal: {
    backgroundColor: SURF,
    borderWidth: 1,
    borderColor: BORD,
    borderRadius: 12,
    overflow: 'hidden',
    maxWidth: 500,
    marginBottom: 44,
  },
  terminalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0E0E10',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: BORD,
  },
  terminalButtons: {
    flexDirection: 'row',
    gap: 6,
  },
  terminalBtnCircle: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
  },
  terminalTitle: {
    color: DIM,
    fontSize: 10,
    fontFamily: 'Poppins_600SemiBold',
    letterSpacing: 0.5,
  },
  terminalBody: {
    padding: 20,
  },
  terminalLine: {
    color: MUTED,
    fontFamily: 'Poppins_500Medium',
    fontSize: 12,
    lineHeight: 20,
  },
  terminalCTA: {
    backgroundColor: O,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  terminalCTAText: {
    color: TXT,
    fontSize: 12,
    fontFamily: 'Poppins_700Bold',
    letterSpacing: 1,
  },

  /* Metric Info Grid */
  metricGrid: {
    flexDirection: 'row',
    gap: 32,
    paddingTop: 12,
  },
  metricUnit: {
    gap: 4,
  },
  metricValue: {
    color: TXT,
    fontSize: 22,
    fontFamily: 'Poppins_800ExtraBold',
    letterSpacing: -0.5,
  },
  metricLabel: {
    color: DIM,
    fontSize: 8.5,
    fontFamily: 'Poppins_700Bold',
    letterSpacing: 0.5,
  },

  /* Hero Visual Pane */
  heroVisual: {
    flex: 0.9,
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'relative',
  },
  viewController: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: SURF,
    borderWidth: 1,
    borderColor: BORD,
    borderRadius: 12,
    padding: 16,
    marginBottom: 28,
  },
  ctrlHeading: {
    color: DIM,
    fontSize: 8,
    fontFamily: 'Poppins_700Bold',
    letterSpacing: 1.5,
    marginBottom: 12,
    textAlign: 'center',
  },
  ctrlList: {
    gap: 6,
  },
  ctrlBtn: {
    backgroundColor: '#0E0E10',
    borderWidth: 1,
    borderColor: BORD,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  ctrlBtnActive: {
    borderColor: O,
    backgroundColor: 'rgba(255, 107, 0, 0.03)',
  },
  ctrlBtnText: {
    color: MUTED,
    fontSize: 10,
    fontFamily: 'Poppins_700Bold',
    letterSpacing: 0.5,
  },
  ctrlBtnTextActive: {
    color: O,
  },
  mockupWrapper: {
    alignItems: 'center',
  },

  /* Phone Shell Styling */
  phoneShell: {
    borderRadius: 44,
    borderWidth: 10,
    borderColor: '#1D1D20',
    backgroundColor: BG,
    overflow: 'hidden',
    position: 'relative',
  },
  phoneNotch: {
    position: 'absolute',
    top: 0,
    left: '50%',
    width: 100,
    height: 20,
    backgroundColor: '#1D1D20',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    zIndex: 99,
    transform: [{ translateX: -50 }],
  },

  /* Asymmetric Features Section */
  featuresSection: {
    flexDirection: 'row',
    paddingHorizontal: 48,
    paddingVertical: 80,
    borderBottomWidth: 1,
    borderColor: BORD,
    backgroundColor: BG2,
    gap: 64,
  },
  featLeftPane: {
    flex: 0.8,
  },
  featSectionLabel: {
    color: O,
    fontSize: 9,
    fontFamily: 'Poppins_700Bold',
    letterSpacing: 2.5,
    marginBottom: 16,
  },
  featSectionTitle: {
    color: TXT,
    fontSize: 32,
    fontFamily: 'Poppins_800ExtraBold',
    letterSpacing: -1,
    lineHeight: 40,
    marginBottom: 20,
  },
  featSectionDesc: {
    color: MUTED,
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    lineHeight: 24,
  },
  featRightPane: {
    flex: 1.2,
    gap: 32,
  },
  featRow: {
    flexDirection: 'row',
    gap: 24,
    borderBottomWidth: 1,
    borderColor: BORD,
    paddingBottom: 24,
  },
  featRowLeft: {
    alignItems: 'flex-start',
    gap: 6,
    width: 90,
  },
  featId: {
    color: O,
    fontSize: 16,
    fontFamily: 'Poppins_800ExtraBold',
  },
  featTag: {
    color: DIM,
    fontSize: 8,
    fontFamily: 'Poppins_700Bold',
    letterSpacing: 0.5,
  },
  featRowContent: {
    flex: 1,
    gap: 4,
  },
  featTitle: {
    color: TXT,
    fontSize: 15,
    fontFamily: 'Poppins_700Bold',
  },
  featDesc: {
    color: MUTED,
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
    lineHeight: 20,
  },

  /* Footer */
  footer: {
    paddingHorizontal: 48,
    paddingVertical: 36,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: BG,
    borderTopWidth: 1,
    borderColor: BORD,
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  footerIcon: {
    width: 24,
    height: 24,
    borderRadius: 5,
  },
  footerBrandText: {
    color: TXT,
    fontSize: 11,
    fontFamily: 'Poppins_800ExtraBold',
    letterSpacing: 0.5,
  },
  footerRights: {
    color: DIM,
    fontSize: 9,
    fontFamily: 'Poppins_600SemiBold',
    letterSpacing: 0.3,
  },
  slidesWrapper: {
    flexDirection: 'row',
    width: 310 * 4,
    height: '100%',
  },
  slideItem: {
    width: 310,
    height: '100%',
  },
});
