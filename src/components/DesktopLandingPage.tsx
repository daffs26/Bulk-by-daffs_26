import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  StyleSheet,
  Platform,
} from 'react-native';
import { Accent } from '@/constants/theme';

const O = '#FF6B00';
const BG = '#0B0B0C';
const BG2 = '#0F0F10';
const SURF = '#161618';
const SURF2 = '#1E1E21';
const BORD = '#242426';
const TXT = '#FFFFFF';
const MUTED = '#A0A0A5';
const DIM = '#505055';

/* ─── Static Screen Illustrations ─── */

function IlluDashboard() {
  return (
    <View style={{ flex: 1, backgroundColor: BG, padding: 14 }}>
      <Text style={{ color: MUTED, fontSize: 7.5, fontFamily: 'Outfit_600SemiBold', letterSpacing: 1.2, marginBottom: 2 }}>SELAMAT DATANG</Text>
      <Text style={{ color: TXT, fontSize: 15, fontFamily: 'Outfit_800ExtraBold', letterSpacing: -0.3, marginBottom: 12 }}>
        BULK <Text style={{ color: O }}>Dashboard</Text>
      </Text>
      {/* Calorie card */}
      <View style={{ backgroundColor: O, borderRadius: 16, padding: 14, marginBottom: 8 }}>
        <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: 7.5, fontFamily: 'Outfit_600SemiBold', letterSpacing: 0.8 }}>KALORI HARI INI</Text>
        <Text style={{ color: TXT, fontSize: 26, fontFamily: 'Outfit_800ExtraBold', lineHeight: 30, marginVertical: 4 }}>1,247</Text>
        <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: 7.5 }}>dari 2,000 kcal target</Text>
        <View style={{ height: 4, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 2, marginTop: 8 }}>
          <View style={{ height: 4, width: '62%', backgroundColor: TXT, borderRadius: 2 }} />
        </View>
      </View>
      {/* Macro row */}
      <View style={{ flexDirection: 'row', gap: 6, marginBottom: 8 }}>
        {[['Protein', '87g', O], ['Karbo', '142g', '#3B82F6'], ['Lemak', '45g', '#10B981']] .map(([l, v, c]) => (
          <View key={l} style={{ flex: 1, backgroundColor: SURF, borderRadius: 10, padding: 8 }}>
            <Text style={{ color: c, fontSize: 12, fontFamily: 'Outfit_700Bold' }}>{v}</Text>
            <Text style={{ color: DIM, fontSize: 7 }}>{l}</Text>
          </View>
        ))}
      </View>
      {/* Water */}
      <View style={{ backgroundColor: SURF, borderRadius: 10, padding: 8, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Text style={{ fontSize: 14 }}>💧</Text>
        <View style={{ flex: 1 }}>
          <Text style={{ color: '#3B82F6', fontSize: 10, fontFamily: 'Outfit_700Bold' }}>1,750 ml</Text>
          <Text style={{ color: DIM, fontSize: 7 }}>Air Minum · target 2,310 ml</Text>
        </View>
      </View>
    </View>
  );
}

function IlluFoodLog() {
  const foods = [
    { name: 'Nasi Putih (200g)', cal: 260 },
    { name: 'Ayam Bakar', cal: 180 },
    { name: 'Tahu Goreng', cal: 90 },
    { name: 'Sayur Bayam', cal: 45 },
  ];
  return (
    <View style={{ flex: 1, backgroundColor: BG, padding: 14 }}>
      <Text style={{ color: TXT, fontSize: 15, fontFamily: 'Outfit_800ExtraBold', marginBottom: 12 }}>
        Food <Text style={{ color: O }}>Diary</Text>
      </Text>
      {foods.map((f, i) => (
        <View key={i} style={{ backgroundColor: SURF, borderRadius: 10, padding: 8, marginBottom: 6, flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 12 }}>🍽️</Text>
          <View style={{ flex: 1, marginLeft: 8 }}>
            <Text style={{ color: TXT, fontSize: 9, fontFamily: 'Outfit_600SemiBold' }}>{f.name}</Text>
          </View>
          <Text style={{ color: O, fontSize: 9, fontFamily: 'Outfit_700Bold' }}>{f.cal} kcal</Text>
        </View>
      ))}
      <View style={[{
        marginTop: 4, backgroundColor: 'rgba(255,107,0,0.06)',
        borderRadius: 10, borderWidth: 1, borderColor: 'rgba(255,107,0,0.2)',
        padding: 8, alignItems: 'center',
      }, Platform.select({ web: { borderStyle: 'dashed' } }) as any]}>
        <Text style={{ color: O, fontSize: 9, fontFamily: 'Outfit_600SemiBold' }}>+ Tambah Makanan</Text>
      </View>
    </View>
  );
}

function IlluProgress() {
  const bars = [65, 80, 55, 90, 70, 85, 60];
  const days = ['S', 'S', 'R', 'K', 'J', 'S', 'M'];
  return (
    <View style={{ flex: 1, backgroundColor: BG, padding: 14 }}>
      <Text style={{ color: TXT, fontSize: 15, fontFamily: 'Outfit_800ExtraBold', marginBottom: 12 }}>
        Progress <Text style={{ color: O }}>Kamu</Text>
      </Text>
      <View style={{ backgroundColor: SURF, borderRadius: 12, padding: 10, marginBottom: 8 }}>
        <Text style={{ color: MUTED, fontSize: 7, fontFamily: 'Outfit_600SemiBold', letterSpacing: 0.8, marginBottom: 8 }}>KALORI 7 HARI TERAKHIR</Text>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 4, height: 44 }}>
          {bars.map((h, i) => (
            <View key={i} style={{ flex: 1, alignItems: 'center' }}>
              <View style={{ height: (h / 100) * 36, backgroundColor: i === 3 ? O : '#2A2A2E', borderRadius: 3, width: '100%' }} />
              <Text style={{ color: DIM, fontSize: 6, marginTop: 2 }}>{days[i]}</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={{ flexDirection: 'row', gap: 6 }}>
        <View style={{ flex: 1, backgroundColor: SURF, borderRadius: 10, padding: 10 }}>
          <Text style={{ fontSize: 14, marginBottom: 4 }}>⚖️</Text>
          <Text style={{ color: TXT, fontSize: 14, fontFamily: 'Outfit_700Bold' }}>68.2 kg</Text>
          <Text style={{ color: '#10B981', fontSize: 8 }}>↓ 1.8 kg bulan ini</Text>
        </View>
        <View style={{ flex: 1, backgroundColor: SURF, borderRadius: 10, padding: 10 }}>
          <Text style={{ fontSize: 14, marginBottom: 4 }}>🔥</Text>
          <Text style={{ color: O, fontSize: 14, fontFamily: 'Outfit_700Bold' }}>12 Hari</Text>
          <Text style={{ color: MUTED, fontSize: 8 }}>Streak aktif</Text>
        </View>
      </View>
    </View>
  );
}

/* ─── Phone Mockup Container ─── */

function PhoneMockup({ children, size = 'md' }: { children: React.ReactNode; size?: 'sm' | 'md' | 'lg' }) {
  const dims = { sm: { w: 220, h: 448 }, md: { w: 280, h: 572 }, lg: { w: 320, h: 654 } }[size];
  return (
    <View style={[s.phoneShell, { width: dims.w, height: dims.h }, Platform.select({
      web: { boxShadow: '0 32px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.05), inset 0 0 0 1px rgba(255,255,255,0.03)' }
    }) as any]}>
      <View style={s.phoneNotch} />
      <View style={{ flex: 1, borderRadius: 38, overflow: 'hidden' }}>
        {children}
      </View>
    </View>
  );
}

/* ─── Feature Card ─── */
const FEATURES = [
  { emoji: '📸', title: 'AI Photo Recognition', desc: 'Foto makanan kamu dan AI langsung mengidentifikasi kalori, protein, karbo, dan lemaknya secara instan.', accent: O },
  { emoji: '📊', title: 'Macro Tracker Real-Time', desc: 'Lacak Protein, Karbohidrat, Lemak, dan Air Minum harian dengan visualisasi ring dan bar yang detail.', accent: '#3B82F6' },
  { emoji: '📱', title: 'Barcode Scanner', desc: 'Scan barcode produk makanan kemasan untuk mendapatkan info nutrisi akurat dari database global.', accent: '#10B981' },
  { emoji: '🎯', title: 'Custom Fitness Target', desc: 'Kalkulasi BMI & TDEE otomatis. Dapatkan rekomendasi kalori personal berdasarkan goal spesifik kamu.', accent: '#8B5CF6' },
  { emoji: '📴', title: 'Offline Mode Penuh', desc: 'Install sekali dan pakai tanpa internet. Semua data tersimpan aman dan privat di perangkatmu sendiri.', accent: '#F59E0B' },
  { emoji: '📈', title: 'Progress Charts', desc: 'Grafik berat badan, tren kalori harian, dan streak kebiasaan makan untuk memonitor perjalananmu.', accent: '#EC4899' },
];

/* ─── Main Component ─── */

interface Props {
  appContent: React.ReactNode;
  onInstallClick: () => void;
  isInstalled: boolean;
}

export default function DesktopLandingPage({ appContent, onInstallClick, isInstalled }: Props) {
  const installBtnLabel = isInstalled ? '✓ Aplikasi Sudah Terinstall' : '📥 Install BULK — Gratis';

  return (
    <ScrollView style={s.root} showsVerticalScrollIndicator={false}>

      {/* ── Navbar ── */}
      <View style={s.nav}>
        <View style={s.navBrand}>
          <Image source={require('@/assets/images/icon.png')} style={s.navIcon} />
          <View>
            <Text style={s.navTitle}>BULK</Text>
            <Text style={s.navSub}>AI Nutrition Tracker</Text>
          </View>
        </View>
        <Pressable
          onPress={onInstallClick}
          style={({ pressed }) => [s.navBtn, pressed && { opacity: 0.8 }]}
        >
          <Text style={s.navBtnTxt}>{isInstalled ? '✓ Terinstall' : '📥 Install App'}</Text>
        </Pressable>
      </View>

      {/* ── Hero ── */}
      <View style={s.hero}>
        {/* Glow blob */}
        <View style={s.heroGlow} />

        <View style={s.heroLeft}>
          <View style={s.heroBadge}>
            <Text style={s.heroBadgeTxt}>🔥 AI-Powered · Gratis · Offline</Text>
          </View>

          <Text style={s.heroH1}>
            Lacak Kalori &{'\n'}Nutrisi dengan{'\n'}
            <Text style={{ color: O }}>Kecerdasan AI</Text>
          </Text>

          <Text style={s.heroDesc}>
            BULK adalah asisten nutrisi AI yang membantu kamu mencapai target kebugaran — dari scan makanan otomatis, hitung makro, hingga pantau progres harian. Gratis. Offline. Selalu siap.
          </Text>

          <Pressable
            onPress={onInstallClick}
            style={({ pressed }) => [s.heroCTA, pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }]}
          >
            <Text style={s.heroCTATxt}>{installBtnLabel}</Text>
          </Pressable>

          <View style={s.heroStats}>
            {[['100%', 'Gratis'], ['AI', 'Powered'], ['Offline', 'Support']].map(([val, lbl], i) => (
              <React.Fragment key={i}>
                {i > 0 && <View style={s.statDivider} />}
                <View style={s.statItem}>
                  <Text style={s.statVal}>{val}</Text>
                  <Text style={s.statLbl}>{lbl}</Text>
                </View>
              </React.Fragment>
            ))}
          </View>
        </View>

        <View style={s.heroRight}>
          <PhoneMockup size="lg">
            {appContent}
          </PhoneMockup>
        </View>
      </View>

      {/* ── Features ── */}
      <View style={s.section}>
        <View style={s.sectionHead}>
          <Text style={s.sectionLabel}>FITUR UTAMA</Text>
          <Text style={s.sectionH2}>Semua yang Kamu Butuhkan{'\n'}untuk Hidup Lebih Sehat</Text>
          <Text style={s.sectionDesc}>
            BULK menggabungkan teknologi AI terkini dengan UX yang intuitif agar proses mencapai goal kebugaranmu terasa mudah dan menyenangkan.
          </Text>
        </View>
        <View style={s.featGrid}>
          {FEATURES.map((f, i) => (
            <View key={i} style={s.featCard}>
              <View style={[s.featIconBox, { backgroundColor: f.accent + '22' }]}>
                <Text style={s.featEmoji}>{f.emoji}</Text>
              </View>
              <Text style={s.featTitle}>{f.title}</Text>
              <Text style={s.featDesc}>{f.desc}</Text>
              <View style={[s.featAccentLine, { backgroundColor: f.accent }]} />
            </View>
          ))}
        </View>
      </View>

      {/* ── App Preview ── */}
      <View style={[s.section, s.previewSection]}>
        <View style={s.sectionHead}>
          <Text style={s.sectionLabel}>TAMPILAN MOBILE</Text>
          <Text style={s.sectionH2}>Dirancang untuk Pengalaman{'\n'}
            <Text style={{ color: O }}>Mobile yang Sempurna</Text>
          </Text>
          <Text style={s.sectionDesc}>
            Setiap layar dioptimalkan untuk kemudahan penggunaan. Dark mode premium, animasi halus, dan navigasi tab yang intuitif — siap digunakan kapan saja, di mana saja.
          </Text>
        </View>
        <View style={s.previewPhones}>
          {/* Screen 1: Dashboard */}
          <View style={s.previewPhoneWrap}>
            <PhoneMockup size="md">
              <IlluDashboard />
            </PhoneMockup>
            <Text style={s.previewPhoneLabel}>🏠 Dashboard</Text>
          </View>

          {/* Screen 2: Food Log — center, slightly larger */}
          <View style={[s.previewPhoneWrap, s.previewPhoneCenter]}>
            <PhoneMockup size="lg">
              <IlluFoodLog />
            </PhoneMockup>
            <Text style={s.previewPhoneLabel}>📋 Food Diary</Text>
          </View>

          {/* Screen 3: Progress */}
          <View style={s.previewPhoneWrap}>
            <PhoneMockup size="md">
              <IlluProgress />
            </PhoneMockup>
            <Text style={s.previewPhoneLabel}>📈 Progress</Text>
          </View>
        </View>
      </View>

      {/* ── CTA Section ── */}
      <View style={s.ctaSection}>
        <View style={s.ctaGlow} />
        <Image source={require('@/assets/images/icon.png')} style={s.ctaLogo} />
        <Text style={s.ctaH2}>
          Mulai Perjalanan Kebugaranmu{'\n'}
          Sekarang — <Text style={{ color: O }}>Gratis!</Text>
        </Text>
        <Text style={s.ctaDesc}>
          Install BULK sebagai aplikasi di HP atau laptop kamu. Tidak butuh internet setelah install. Tidak ada langganan. Tidak ada iklan. Tidak ada biaya tersembunyi.
        </Text>
        <Pressable
          onPress={onInstallClick}
          style={({ pressed }) => [s.ctaBtn, pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }]}
        >
          <Text style={s.ctaBtnTxt}>{installBtnLabel}</Text>
        </Pressable>
        <Text style={s.ctaNote}>
          Tersedia untuk Chrome, Edge, dan semua browser modern. Di iPhone: Safari → Share → "Tambahkan ke Layar Utama"
        </Text>
      </View>

      {/* ── Footer ── */}
      <View style={s.footer}>
        <View style={s.footerBrand}>
          <Image source={require('@/assets/images/icon.png')} style={s.footerIcon} />
          <Text style={s.footerTitle}>BULK</Text>
        </View>
        <Text style={s.footerTagline}>AI Nutrition Tracker · by @daffs_26</Text>
        <Text style={s.footerCopy}>© 2026 BULK. Made with ❤️ in Indonesia.</Text>
      </View>

    </ScrollView>
  );
}

/* ─── Styles ─── */
const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BG,
  },

  /* Navbar */
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 64,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: BORD,
    backgroundColor: BG,
    ...Platform.select({ web: { position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(20px)', backgroundColor: 'rgba(11,11,12,0.85)' } }) as any,
  },
  navBrand: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  navIcon: { width: 40, height: 40, borderRadius: 10 },
  navTitle: { fontSize: 20, fontFamily: 'Outfit_800ExtraBold', color: TXT, letterSpacing: -0.5 },
  navSub: { fontSize: 11, fontFamily: 'Outfit_500Medium', color: O, letterSpacing: 0.3 },
  navBtn: {
    backgroundColor: O,
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 12,
    ...Platform.select({ web: { boxShadow: '0 4px 16px rgba(255,107,0,0.3)' } }) as any,
  },
  navBtnTxt: { color: TXT, fontFamily: 'Outfit_700Bold', fontSize: 14 },

  /* Hero */
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 680,
    paddingHorizontal: 80,
    paddingVertical: 80,
    overflow: 'hidden',
    position: 'relative',
    gap: 60,
  },
  heroGlow: {
    position: 'absolute',
    top: -200,
    right: 100,
    width: 600,
    height: 600,
    borderRadius: 300,
    backgroundColor: 'rgba(255,107,0,0.06)',
    ...Platform.select({ web: { filter: 'blur(80px)', pointerEvents: 'none' } }) as any,
  },
  heroLeft: { flex: 1.1, zIndex: 2 },
  heroRight: { flex: 0.9, alignItems: 'center', zIndex: 2 },

  heroBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,107,0,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,107,0,0.25)',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 100,
    marginBottom: 24,
  },
  heroBadgeTxt: { color: O, fontFamily: 'Outfit_600SemiBold', fontSize: 12 },

  heroH1: {
    fontSize: 52,
    fontFamily: 'Outfit_800ExtraBold',
    color: TXT,
    lineHeight: 60,
    letterSpacing: -1.5,
    marginBottom: 20,
  },
  heroDesc: {
    fontSize: 16,
    fontFamily: 'Outfit_500Medium',
    color: MUTED,
    lineHeight: 26,
    marginBottom: 32,
    maxWidth: 480,
  },
  heroCTA: {
    alignSelf: 'flex-start',
    backgroundColor: O,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    marginBottom: 32,
    ...Platform.select({ web: { boxShadow: '0 8px 32px rgba(255,107,0,0.35)', transition: 'all 0.2s ease' } }) as any,
  },
  heroCTATxt: { color: TXT, fontFamily: 'Outfit_700Bold', fontSize: 16 },

  heroStats: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  statItem: { alignItems: 'center', gap: 2 },
  statVal: { fontSize: 18, fontFamily: 'Outfit_800ExtraBold', color: TXT },
  statLbl: { fontSize: 11, fontFamily: 'Outfit_500Medium', color: MUTED },
  statDivider: { width: 1, height: 32, backgroundColor: BORD },

  /* Phone */
  phoneShell: {
    borderRadius: 44,
    borderWidth: 10,
    borderColor: '#2A2A2E',
    backgroundColor: BG,
    overflow: 'hidden',
    position: 'relative',
  },
  phoneNotch: {
    position: 'absolute',
    top: 0,
    left: '50%',
    width: 100,
    height: 22,
    backgroundColor: '#2A2A2E',
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    zIndex: 10,
    transform: [{ translateX: -50 }],
  },

  /* Sections */
  section: {
    paddingHorizontal: 80,
    paddingVertical: 80,
    borderTopWidth: 1,
    borderTopColor: BORD,
  },
  sectionHead: { alignItems: 'center', marginBottom: 56 },
  sectionLabel: {
    fontSize: 11,
    fontFamily: 'Outfit_700Bold',
    color: O,
    letterSpacing: 2.5,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  sectionH2: {
    fontSize: 36,
    fontFamily: 'Outfit_800ExtraBold',
    color: TXT,
    letterSpacing: -0.8,
    lineHeight: 44,
    textAlign: 'center',
    marginBottom: 16,
  },
  sectionDesc: {
    fontSize: 15,
    fontFamily: 'Outfit_500Medium',
    color: MUTED,
    lineHeight: 24,
    textAlign: 'center',
    maxWidth: 560,
  },

  /* Features Grid */
  featGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    justifyContent: 'center',
  },
  featCard: {
    width: '30%',
    minWidth: 240,
    backgroundColor: SURF,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: BORD,
    overflow: 'hidden',
    ...Platform.select({ web: { boxShadow: '0 4px 20px rgba(0,0,0,0.3)', transition: 'transform 0.2s ease' } }) as any,
  },
  featIconBox: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  featEmoji: { fontSize: 24 },
  featTitle: { fontSize: 16, fontFamily: 'Outfit_700Bold', color: TXT, marginBottom: 8 },
  featDesc: { fontSize: 13, fontFamily: 'Outfit_500Medium', color: MUTED, lineHeight: 20 },
  featAccentLine: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, opacity: 0.6 },

  /* Preview Section */
  previewSection: { backgroundColor: BG2 },
  previewPhones: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    gap: 20,
    flexWrap: 'wrap',
  },
  previewPhoneWrap: { alignItems: 'center', gap: 16 },
  previewPhoneCenter: { marginBottom: 0, zIndex: 2 },
  previewPhoneLabel: {
    fontSize: 13,
    fontFamily: 'Outfit_600SemiBold',
    color: MUTED,
    marginTop: 8,
  },

  /* CTA Section */
  ctaSection: {
    paddingHorizontal: 80,
    paddingVertical: 100,
    borderTopWidth: 1,
    borderTopColor: BORD,
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  ctaGlow: {
    position: 'absolute',
    top: '30%',
    width: 800,
    height: 400,
    borderRadius: 400,
    backgroundColor: 'rgba(255,107,0,0.05)',
    ...Platform.select({ web: { filter: 'blur(80px)', pointerEvents: 'none' } }) as any,
  },
  ctaLogo: { width: 72, height: 72, borderRadius: 18, marginBottom: 24 },
  ctaH2: {
    fontSize: 40,
    fontFamily: 'Outfit_800ExtraBold',
    color: TXT,
    textAlign: 'center',
    lineHeight: 50,
    letterSpacing: -1,
    marginBottom: 16,
    zIndex: 1,
  },
  ctaDesc: {
    fontSize: 15,
    fontFamily: 'Outfit_500Medium',
    color: MUTED,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 520,
    marginBottom: 36,
    zIndex: 1,
  },
  ctaBtn: {
    backgroundColor: O,
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 18,
    marginBottom: 20,
    zIndex: 1,
    ...Platform.select({ web: { boxShadow: '0 12px 40px rgba(255,107,0,0.4)', transition: 'all 0.2s ease' } }) as any,
  },
  ctaBtnTxt: { color: TXT, fontFamily: 'Outfit_700Bold', fontSize: 18 },
  ctaNote: {
    fontSize: 12,
    fontFamily: 'Outfit_500Medium',
    color: DIM,
    textAlign: 'center',
    zIndex: 1,
  },

  /* Footer */
  footer: {
    paddingHorizontal: 80,
    paddingVertical: 40,
    borderTopWidth: 1,
    borderTopColor: BORD,
    alignItems: 'center',
    gap: 8,
    backgroundColor: BG,
  },
  footerBrand: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 4 },
  footerIcon: { width: 32, height: 32, borderRadius: 8 },
  footerTitle: { fontSize: 20, fontFamily: 'Outfit_800ExtraBold', color: TXT },
  footerTagline: { fontSize: 13, fontFamily: 'Outfit_500Medium', color: MUTED },
  footerCopy: { fontSize: 12, fontFamily: 'Outfit_500Medium', color: DIM },
});
