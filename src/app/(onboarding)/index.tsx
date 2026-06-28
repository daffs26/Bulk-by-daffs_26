import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppState, calculateFitnessMetrics, UserProfile } from '@/hooks/useAppState';
import { Colors, Accent } from '@/constants/theme';
import { ChevronRight, ChevronLeft, Award, Scale, Activity, ArrowRight, User as UserIcon, Flame, Sparkles, Barcode } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function OnboardingScreen() {
  const { setOnboardingData, theme, user, loginWithEmailAndPassword, registerWithEmailAndPassword } = useAppState();
  const router = useRouter();
  const c = Colors[theme];
  const isDark = theme === 'dark';
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');

  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState<UserProfile['goal']>('maintenance');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weightCurrent, setWeightCurrent] = useState('');
  const [activityLevel, setActivityLevel] = useState<UserProfile['activityLevel']>('sedentary');
  const [weightTarget, setWeightTarget] = useState('');

  const [bmiDetails, setBmiDetails] = useState<{
    bmi: number;
    tdee: number;
    targetCalories: number;
    category: string;
    isCompatible: boolean;
    warningMsg: string;
  } | null>(null);

  const validateStep2 = () => {
    const ageNum = parseInt(age);
    const heightNum = parseFloat(height);
    const weightNum = parseFloat(weightCurrent);

    if (isNaN(ageNum) || ageNum < 12 || ageNum > 100) {
      Alert.alert('Invalid Age', 'Please enter a valid age between 12 and 100.');
      return false;
    }
    if (isNaN(heightNum) || heightNum < 100 || heightNum > 250) {
      Alert.alert('Invalid Height', 'Please enter a valid height between 100 and 250 cm.');
      return false;
    }
    if (isNaN(weightNum) || weightNum < 30 || weightNum > 300) {
      Alert.alert('Invalid Weight', 'Please enter a valid weight between 30 and 300 kg.');
      return false;
    }
    return true;
  };

  const processMetrics = () => {
    if (!validateStep2()) return;

    const ageNum = parseInt(age);
    const heightNum = parseFloat(height);
    const weightNum = parseFloat(weightCurrent);

    const metrics = calculateFitnessMetrics(gender, ageNum, heightNum, weightNum, activityLevel, goal);

    let category = '';
    if (metrics.bmi < 18.5) category = 'Underweight';
    else if (metrics.bmi < 25) category = 'Normal';
    else if (metrics.bmi < 30) category = 'Overweight';
    else category = 'Obese';

    let isCompatible = true;
    let warningMsg = '';

    if (goal === 'bulking' && metrics.bmi >= 25) {
      isCompatible = false;
      warningMsg = `BMI kamu ${metrics.bmi} (${category}). Bulking tidak direkomendasikan saat overweight. Coba maintenance atau cutting.`;
    } else if (goal === 'cutting' && metrics.bmi < 18.5) {
      isCompatible = false;
      warningMsg = `BMI kamu ${metrics.bmi} (${category}). Cutting tidak direkomendasikan saat underweight. Coba bulking atau maintenance.`;
    }

    setBmiDetails({ bmi: metrics.bmi, tdee: metrics.tdee, targetCalories: metrics.targetCalories, category, isCompatible, warningMsg });
    setStep(3);
  };

  const handleConfirmGoal = () => setStep(5);

  const calculateEstimation = () => {
    const targetW = parseFloat(weightTarget);
    const currentW = parseFloat(weightCurrent);
    if (isNaN(targetW) || targetW < 30 || targetW > 300) return null;
    const diff = Math.abs(targetW - currentW);
    if (diff === 0) return { weeks: 0, text: 'You are at your target!' };
    const daysNeeded = Math.round(diff * 19.25);
    const weeksNeeded = Number((daysNeeded / 7).toFixed(1));
    return { weeks: weeksNeeded, text: `${weeksNeeded} weeks (${daysNeeded} days)` };
  };

  const handleFinishOnboarding = async () => {
    const ageNum = parseInt(age);
    const heightNum = parseFloat(height);
    const weightNum = parseFloat(weightCurrent);
    const targetW = parseFloat(weightTarget);

    if (isNaN(targetW) || targetW < 30 || targetW > 300) {
      Alert.alert('Invalid Target Weight', 'Please enter a valid target weight between 30 and 300 kg.');
      return;
    }
    if (goal === 'cutting' && targetW >= weightNum) {
      Alert.alert('Goal Mismatch', 'Target weight must be lower than current weight for Cutting.');
      return;
    }
    if (goal === 'bulking' && targetW <= weightNum) {
      Alert.alert('Goal Mismatch', 'Target weight must be higher than current weight for Bulking.');
      return;
    }

    const finalMetrics = calculateFitnessMetrics(gender, ageNum, heightNum, weightNum, activityLevel, goal);

    const profile: UserProfile = {
      name: 'User',
      gender,
      age: ageNum,
      height: heightNum,
      weightCurrent: weightNum,
      weightTarget: targetW,
      activityLevel,
      goal,
      bmi: finalMetrics.bmi,
      tdee: finalMetrics.tdee,
      targetCalories: finalMetrics.targetCalories,
      targetMacros: finalMetrics.targetMacros,
    };

    await setOnboardingData(profile);
    router.replace('/(tabs)');
  };

  /* ── Shared Styles ── */
  const inputStyle = {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: c.surface2,
    borderWidth: 1,
    borderColor: c.border,
    fontFamily: 'Outfit_500Medium' as const,
    fontSize: 15,
    color: c.text,
  };

  const primaryBtnStyle = {
    flex: 1,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: 6,
    paddingVertical: 16,
    borderRadius: 14,
  };

  const secondaryBtnStyle = {
    flex: 1,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: 6,
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: c.surface2,
    borderWidth: 1,
    borderColor: c.border,
  };

  /* ── Step Progress Dots ── */
  const totalSteps = 4;
  const currentStep = step === 1 ? 1 : step === 2 ? 2 : step === 3 ? 3 : 4;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.bg }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        {/* Top bar */}
      <View style={{
        paddingHorizontal: 20,
        paddingVertical: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: c.border,
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
          <Text style={{
            fontSize: 20,
            fontFamily: 'Outfit_800ExtraBold',
            color: c.text,
            letterSpacing: -0.3,
          }}>
            B
          </Text>
          <Text style={{
            fontSize: 20,
            fontFamily: 'Outfit_800ExtraBold',
            color: Accent.primary,
            letterSpacing: -0.3,
          }}>
            ULK
          </Text>
        </View>
        {/* Progress dots */}
        {user && (
          <View style={{ flexDirection: 'row', gap: 6 }}>
            {[1, 2, 3, 4].map((s) => (
              <View
                key={s}
                style={{
                  width: s <= currentStep ? 20 : 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: s <= currentStep ? Accent.primary : c.surface3,
                }}
              />
            ))}
          </View>
        )}
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }} style={{ paddingHorizontal: 20, paddingVertical: 16 }}>

        {/* ══════════ STEP 0: Google Login ══════════ */}
        {!user && (
          <View style={{ flexGrow: 1, justifyContent: 'space-between', paddingVertical: 16 }}>
            {/* Branding Header */}
            <View style={{ alignItems: 'center', marginTop: 30, marginBottom: 20 }}>
              <View style={{
                width: 70,
                height: 70,
                borderRadius: 22,
                backgroundColor: Accent.pale,
                borderWidth: 1,
                borderColor: Accent.glow,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 20,
              }}>
                <Flame size={36} color={Accent.primary} />
              </View>
              <Text style={{
                fontSize: 32,
                fontFamily: 'Outfit_800ExtraBold',
                color: c.text,
                letterSpacing: -1,
                textAlign: 'center',
              }}>
                Selamat Datang di <Text style={{ color: Accent.primary }}>BULK</Text>
              </Text>
              <Text style={{
                fontSize: 13,
                fontFamily: 'Outfit_500Medium',
                color: c.textSub,
                marginTop: 8,
                textAlign: 'center',
                paddingHorizontal: 24,
                lineHeight: 20,
              }}>
                Pindai porsi makan, analisis gizi mikro/makro, dan raih target kebugaran Anda secara presisi dengan AI.
              </Text>
            </View>

            {/* Feature Showcase Grid */}
            <View style={{ gap: 12, marginVertical: 16 }}>
              {[
                {
                  title: '📸 AI Photo Recognition',
                  desc: 'Pindai piring makan Anda via kamera untuk deteksi porsi & makronutrisi instan.',
                  icon: Sparkles,
                },
                {
                  title: '📊 Real-Time Barcode Scanner',
                  desc: 'Scan produk kemasan menggunakan database global Open Food Facts.',
                  icon: Barcode,
                },
                {
                  title: '🔥 Custom Fitness Targets',
                  desc: 'Formulasi kalori target & makro (Protein, Karbo, Lemak) personal harian.',
                  icon: Scale,
                },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <View
                    key={idx}
                    style={{
                      flexDirection: 'row',
                      gap: 12,
                      padding: 16,
                      borderRadius: 18,
                      backgroundColor: c.surface,
                      borderWidth: 1,
                      borderColor: c.border,
                      alignItems: 'center',
                    }}
                  >
                    <View style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      backgroundColor: isDark ? '#1C1C1E' : '#E5E7EB',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <Icon size={18} color={Accent.primary} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 13, fontFamily: 'Outfit_600SemiBold', color: c.text }}>
                        {item.title}
                      </Text>
                      <Text style={{ fontSize: 11, fontFamily: 'Outfit_500Medium', color: c.textMuted, marginTop: 2, lineHeight: 16 }}>
                        {item.desc}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>

            {/* Bottom Login Action Area (Custom ID & Password Form) */}
            <View style={{ gap: 14, marginTop: 12 }}>
              {authMode === 'register' && (
                <View style={{ gap: 6 }}>
                  <Text style={{ fontSize: 12, fontFamily: 'Outfit_600SemiBold', color: c.textSub }}>Nama Lengkap</Text>
                  <TextInput
                    value={authName}
                    onChangeText={setAuthName}
                    placeholder="Masukkan nama Anda"
                    placeholderTextColor={c.textMuted}
                    style={{
                      backgroundColor: c.surface,
                      color: c.text,
                      paddingVertical: 12,
                      paddingHorizontal: 16,
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: c.border,
                      fontFamily: 'Outfit_500Medium',
                      fontSize: 14,
                    }}
                  />
                </View>
              )}

              <View style={{ gap: 6 }}>
                <Text style={{ fontSize: 12, fontFamily: 'Outfit_600SemiBold', color: c.textSub }}>Email / ID</Text>
                <TextInput
                  value={authEmail}
                  onChangeText={setAuthEmail}
                  placeholder="Email atau Username / ID"
                  placeholderTextColor={c.textMuted}
                  autoCapitalize="none"
                  keyboardType="default"
                  style={{
                    backgroundColor: c.surface,
                    color: c.text,
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: c.border,
                    fontFamily: 'Outfit_500Medium',
                    fontSize: 14,
                  }}
                />
              </View>

              <View style={{ gap: 6 }}>
                <Text style={{ fontSize: 12, fontFamily: 'Outfit_600SemiBold', color: c.textSub }}>Password</Text>
                <TextInput
                  value={authPassword}
                  onChangeText={setAuthPassword}
                  placeholder="••••••"
                  placeholderTextColor={c.textMuted}
                  secureTextEntry
                  autoCapitalize="none"
                  style={{
                    backgroundColor: c.surface,
                    color: c.text,
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: c.border,
                    fontFamily: 'Outfit_500Medium',
                    fontSize: 14,
                  }}
                />
              </View>

              {isLoggingIn ? (
                <View style={{
                  paddingVertical: 14,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: Accent.pale,
                  borderRadius: 12,
                }}>
                  <ActivityIndicator size="small" color={Accent.primary} />
                </View>
              ) : (
                <TouchableOpacity
                  onPress={async () => {
                    if (!authEmail || !authPassword) {
                      Alert.alert('Form Belum Lengkap', 'Silakan masukkan email/ID dan password.');
                      return;
                    }
                    setIsLoggingIn(true);
                    try {
                      // Preprocess email: if it's just a username/ID, format as ID@bulk.app
                      let emailToUse = authEmail.trim();
                      if (!emailToUse.includes('@')) {
                        emailToUse = `${emailToUse.toLowerCase()}@bulk.app`;
                      }

                      if (authMode === 'login') {
                        await loginWithEmailAndPassword(emailToUse, authPassword);
                      } else {
                        if (!authName) {
                          Alert.alert('Form Belum Lengkap', 'Silakan masukkan nama Anda.');
                          setIsLoggingIn(false);
                          return;
                        }
                        await registerWithEmailAndPassword(authName, emailToUse, authPassword);
                      }
                    } catch (err: any) {
                      Alert.alert('Gagal', err.message || 'Terjadi kesalahan sistem.');
                    } finally {
                      setIsLoggingIn(false);
                    }
                  }}
                  style={{
                    backgroundColor: Accent.primary,
                    paddingVertical: 14,
                    borderRadius: 12,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 8,
                  }}
                >
                  <Text style={{
                    fontFamily: 'Outfit_700Bold',
                    fontSize: 14,
                    color: '#FFFFFF',
                  }}>
                    {authMode === 'login' ? 'Masuk' : 'Daftar Akun'}
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                onPress={() => {
                  setAuthMode(authMode === 'login' ? 'register' : 'login');
                }}
                style={{ alignSelf: 'center', marginTop: 4 }}
              >
                <Text style={{ fontSize: 13, fontFamily: 'Outfit_600SemiBold', color: Accent.primary }}>
                  {authMode === 'login' ? 'Belum punya akun? Daftar sekarang' : 'Sudah punya akun? Masuk'}
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={{
              fontSize: 10,
              fontFamily: 'Outfit_500Medium',
              color: c.textMuted,
              textAlign: 'center',
              lineHeight: 14,
              paddingHorizontal: 20,
              marginTop: 16,
            }}>
              Dengan masuk, Anda menyetujui sinkronisasi data kebugaran Anda secara aman ke server Cloud Firestore kami.
            </Text>
          </View>
        )}

        {/* ══════════ STEP 1: Goal ══════════ */}
        {user && step === 1 && (
          <View style={{ flexGrow: 1, justifyContent: 'center', gap: 24 }}>
            <View style={{ marginBottom: 8 }}>
              <Text style={{
                fontSize: 28,
                fontFamily: 'Outfit_800ExtraBold',
                color: c.text,
                letterSpacing: -0.5,
              }}>
                Pilih Goal Kamu
              </Text>
              <Text style={{
                fontSize: 14,
                fontFamily: 'Outfit_500Medium',
                color: c.textSub,
                marginTop: 8,
                lineHeight: 22,
              }}>
                Tentukan target utama kesehatan tubuhmu saat ini.
              </Text>
            </View>

            <View style={{ gap: 12 }}>
              {[
                { id: 'cutting' as const, title: 'Cutting', desc: 'Menurunkan berat badan & kadar lemak tubuh secara bertahap.', icon: Activity },
                { id: 'bulking' as const, title: 'Bulking', desc: 'Meningkatkan massa otot & berat badan secara terkontrol.', icon: Award },
                { id: 'maintenance' as const, title: 'Maintenance', desc: 'Menjaga berat badan stabil & komposisi tubuh saat ini.', icon: Scale },
              ].map((g) => {
                const isActive = goal === g.id;
                const IconComp = g.icon;
                return (
                  <TouchableOpacity
                    key={g.id}
                    onPress={() => setGoal(g.id)}
                    style={{
                      padding: 20,
                      borderRadius: 18,
                      borderWidth: 2,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderColor: isActive ? Accent.primary : c.border,
                      backgroundColor: isActive ? Accent.pale : c.surface,
                    }}
                  >
                    <View style={{ flex: 1, paddingRight: 16 }}>
                      <Text style={{
                        fontSize: 16,
                        fontFamily: 'Outfit_600SemiBold',
                        color: c.text,
                        letterSpacing: -0.1,
                      }}>
                        {g.title}
                      </Text>
                      <Text style={{
                        fontSize: 13,
                        fontFamily: 'Outfit_500Medium',
                        color: c.textSub,
                        marginTop: 4,
                        lineHeight: 20,
                      }}>
                        {g.desc}
                      </Text>
                    </View>
                    <IconComp color={isActive ? Accent.primary : c.textMuted} size={22} />
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity onPress={() => setStep(2)} style={{ marginTop: 16 }}>
              <LinearGradient colors={[Accent.primary, Accent.primaryDark]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={primaryBtnStyle}>
                <Text style={{ color: '#FFF', fontFamily: 'Outfit_600SemiBold', fontSize: 15 }}>Lanjut</Text>
                <ChevronRight color="white" size={18} />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        {/* ══════════ STEP 2: Data Diri ══════════ */}
        {user && step === 2 && (
          <View style={{ flexGrow: 1, justifyContent: 'center' }}>
            <View style={{ marginBottom: 24 }}>
              <Text style={{ fontSize: 28, fontFamily: 'Outfit_800ExtraBold', color: c.text, letterSpacing: -0.5 }}>Data Diri Kamu</Text>
              <Text style={{ fontSize: 14, fontFamily: 'Outfit_500Medium', color: c.textSub, marginTop: 8, lineHeight: 22 }}>
                Isi data fisik untuk kalkulasi kalori target yang akurat.
              </Text>
            </View>

            <View style={{ gap: 16 }}>
              {/* Gender */}
              <View style={{ flexDirection: 'row', gap: 10, marginBottom: 4 }}>
                {['male', 'female'].map((g) => (
                  <TouchableOpacity
                    key={g}
                    onPress={() => setGender(g as any)}
                    style={{
                      flex: 1,
                      paddingVertical: 16,
                      borderRadius: 14,
                      borderWidth: 2,
                      alignItems: 'center',
                      borderColor: gender === g ? Accent.primary : c.border,
                      backgroundColor: gender === g ? Accent.pale : c.surface,
                    }}
                  >
                    <Text style={{ fontFamily: 'Outfit_600SemiBold', fontSize: 14, color: c.text }}>
                      {g === 'male' ? 'Laki-laki' : 'Perempuan'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Age */}
              <View>
                <Text style={{ fontSize: 13, fontFamily: 'Outfit_600SemiBold', color: c.text, marginBottom: 6 }}>Usia (Tahun)</Text>
                <TextInput placeholder="Contoh: 24" placeholderTextColor={c.textMuted} keyboardType="numeric" value={age} onChangeText={setAge} style={inputStyle} />
              </View>

              {/* Height */}
              <View>
                <Text style={{ fontSize: 13, fontFamily: 'Outfit_600SemiBold', color: c.text, marginBottom: 6 }}>Tinggi Badan (cm)</Text>
                <TextInput placeholder="Contoh: 172" placeholderTextColor={c.textMuted} keyboardType="numeric" value={height} onChangeText={setHeight} style={inputStyle} />
              </View>

              {/* Weight */}
              <View>
                <Text style={{ fontSize: 13, fontFamily: 'Outfit_600SemiBold', color: c.text, marginBottom: 6 }}>Berat Badan Sekarang (kg)</Text>
                <TextInput placeholder="Contoh: 70" placeholderTextColor={c.textMuted} keyboardType="numeric" value={weightCurrent} onChangeText={setWeightCurrent} style={inputStyle} />
              </View>

              {/* Activity Level */}
              <View>
                <Text style={{ fontSize: 13, fontFamily: 'Outfit_600SemiBold', color: c.text, marginBottom: 8 }}>Level Aktivitas Harian</Text>
                <View style={{ gap: 8 }}>
                  {[
                    { id: 'sedentary', label: 'Sedentary (Jarang olahraga)' },
                    { id: 'light', label: 'Lightly Active (1-3x / minggu)' },
                    { id: 'active', label: 'Active (3-5x / minggu)' },
                    { id: 'very_active', label: 'Very Active (Fisik berat)' },
                  ].map((level) => (
                    <TouchableOpacity
                      key={level.id}
                      onPress={() => setActivityLevel(level.id as any)}
                      style={{
                        paddingHorizontal: 16,
                        paddingVertical: 14,
                        borderRadius: 14,
                        borderWidth: 2,
                        borderColor: activityLevel === level.id ? Accent.primary : c.border,
                        backgroundColor: activityLevel === level.id ? Accent.pale : c.surface,
                      }}
                    >
                      <Text style={{ fontSize: 13, fontFamily: 'Outfit_500Medium', color: c.text }}>{level.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            {/* Navigation */}
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 24 }}>
              <TouchableOpacity onPress={() => setStep(1)} style={secondaryBtnStyle}>
                <ChevronLeft color={c.text} size={18} />
                <Text style={{ fontFamily: 'Outfit_600SemiBold', fontSize: 15, color: c.text }}>Kembali</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={processMetrics} style={{ flex: 1 }}>
                <LinearGradient colors={[Accent.primary, Accent.primaryDark]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={primaryBtnStyle}>
                  <Text style={{ color: '#FFF', fontFamily: 'Outfit_600SemiBold', fontSize: 15 }}>Lanjut</Text>
                  <ChevronRight color="white" size={18} />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ══════════ STEP 3: BMI Check ══════════ */}
        {user && step === 3 && bmiDetails && (
          <View style={{ flexGrow: 1, justifyContent: 'center' }}>
            <View style={{ marginBottom: 24 }}>
              <Text style={{ fontSize: 28, fontFamily: 'Outfit_800ExtraBold', color: c.text, letterSpacing: -0.5 }}>Pemeriksaan BMI</Text>
              <Text style={{ fontSize: 14, fontFamily: 'Outfit_500Medium', color: c.textSub, marginTop: 8 }}>Hasil hitung komposisi tubuh otomatis.</Text>
            </View>

            {/* BMI Card */}
            <View style={{
              padding: 24,
              borderRadius: 18,
              borderWidth: 2,
              borderColor: c.border,
              backgroundColor: c.surface,
              marginBottom: 16,
            }}>
              <View style={{
                alignItems: 'center',
                paddingVertical: 16,
                borderBottomWidth: 1,
                borderBottomColor: c.border,
                marginBottom: 16,
              }}>
                <Text style={{
                  fontSize: 10,
                  fontFamily: 'Outfit_600SemiBold',
                  color: c.textMuted,
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                  marginBottom: 4,
                }}>
                  BMI Anda
                </Text>
                <Text style={{
                  fontSize: 52,
                  fontFamily: 'Outfit_800ExtraBold',
                  color: c.text,
                  letterSpacing: -1.5,
                }}>
                  {bmiDetails.bmi}
                </Text>
                <Text style={{
                  fontSize: 16,
                  fontFamily: 'Outfit_600SemiBold',
                  color: bmiDetails.bmi < 18.5 || bmiDetails.bmi >= 25 ? '#F59E0B' : '#22C55E',
                  marginTop: 4,
                }}>
                  Kategori: {bmiDetails.category}
                </Text>
              </View>

              <View style={{ gap: 10 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: 13, fontFamily: 'Outfit_500Medium', color: c.textSub }}>TDEE Harian</Text>
                  <Text style={{ fontSize: 13, fontFamily: 'Outfit_600SemiBold', color: c.text }}>{bmiDetails.tdee} kcal</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: 13, fontFamily: 'Outfit_500Medium', color: c.textSub }}>Target Kalori</Text>
                  <Text style={{ fontSize: 13, fontFamily: 'Outfit_600SemiBold', color: c.text }}>{bmiDetails.targetCalories} kcal</Text>
                </View>
              </View>
            </View>

            {/* Warning or Success */}
            {!bmiDetails.isCompatible ? (
              <View style={{
                padding: 20,
                borderRadius: 18,
                backgroundColor: 'rgba(245,158,11,0.12)',
                borderWidth: 2,
                borderColor: 'rgba(245,158,11,0.3)',
                marginBottom: 16,
              }}>
                <Text style={{ fontSize: 15, fontFamily: 'Outfit_600SemiBold', color: '#F59E0B', marginBottom: 6 }}>⚠️ Goal Kurang Sesuai</Text>
                <Text style={{ fontSize: 13, fontFamily: 'Outfit_500Medium', color: isDark ? 'rgba(253,224,71,0.8)' : 'rgba(146,64,14,0.8)', lineHeight: 20 }}>
                  {bmiDetails.warningMsg}
                </Text>
              </View>
            ) : (
              <View style={{
                padding: 20,
                borderRadius: 18,
                backgroundColor: 'rgba(34,197,94,0.12)',
                borderWidth: 2,
                borderColor: 'rgba(34,197,94,0.3)',
                marginBottom: 16,
              }}>
                <Text style={{ fontSize: 15, fontFamily: 'Outfit_600SemiBold', color: '#22C55E', marginBottom: 6 }}>✅ Goal Sesuai</Text>
                <Text style={{ fontSize: 13, fontFamily: 'Outfit_500Medium', color: isDark ? 'rgba(134,239,172,0.8)' : 'rgba(22,101,52,0.8)', lineHeight: 20 }}>
                  Goal kamu ({goal}) sangat sesuai dengan kategori BMI tubuhmu saat ini. Mari lanjutkan!
                </Text>
              </View>
            )}

            {/* Navigation */}
            <View style={{ flexDirection: 'row', gap: 10 }}>
              {!bmiDetails.isCompatible ? (
                <>
                  <TouchableOpacity onPress={() => setStep(1)} style={secondaryBtnStyle}>
                    <Text style={{ fontFamily: 'Outfit_600SemiBold', fontSize: 15, color: c.text }}>Ubah Goal</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleConfirmGoal} style={{
                    flex: 1,
                    paddingVertical: 16,
                    borderRadius: 14,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#F59E0B',
                  }}>
                    <Text style={{ fontFamily: 'Outfit_600SemiBold', fontSize: 15, color: '#000' }}>Tetap Lanjut</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <TouchableOpacity onPress={() => setStep(2)} style={secondaryBtnStyle}>
                    <ChevronLeft color={c.text} size={18} />
                    <Text style={{ fontFamily: 'Outfit_600SemiBold', fontSize: 15, color: c.text }}>Ubah Data</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleConfirmGoal} style={{ flex: 1 }}>
                    <LinearGradient colors={[Accent.primary, Accent.primaryDark]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={primaryBtnStyle}>
                      <Text style={{ color: '#FFF', fontFamily: 'Outfit_600SemiBold', fontSize: 15 }}>Lanjut</Text>
                      <ChevronRight color="white" size={18} />
                    </LinearGradient>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        )}

        {/* ══════════ STEP 5: Target Weight ══════════ */}
        {user && step === 5 && bmiDetails && (
          <View style={{ flexGrow: 1, justifyContent: 'center' }}>
            <View style={{ marginBottom: 24 }}>
              <Text style={{ fontSize: 28, fontFamily: 'Outfit_800ExtraBold', color: c.text, letterSpacing: -0.5 }}>Target Berat Badan</Text>
              <Text style={{ fontSize: 14, fontFamily: 'Outfit_500Medium', color: c.textSub, marginTop: 8 }}>Tentukan berat badan yang ingin kamu capai.</Text>
            </View>

            <View style={{ gap: 16 }}>
              <View>
                <Text style={{ fontSize: 13, fontFamily: 'Outfit_600SemiBold', color: c.text, marginBottom: 6 }}>Berat Target (kg)</Text>
                <TextInput
                  placeholder={`Contoh: ${goal === 'cutting' ? '65' : '75'}`}
                  placeholderTextColor={c.textMuted}
                  keyboardType="numeric"
                  value={weightTarget}
                  onChangeText={setWeightTarget}
                  style={inputStyle}
                />
              </View>

              {calculateEstimation() && (
                <View>
                  <View style={{
                    padding: 20,
                    borderRadius: 18,
                    borderWidth: 2,
                    borderColor: c.border,
                    backgroundColor: c.surface,
                  }}>
                    <Text style={{ fontSize: 12, fontFamily: 'Outfit_500Medium', color: c.textSub }}>Estimasi Waktu Realistis</Text>
                    <Text style={{
                      fontSize: 24,
                      fontFamily: 'Outfit_800ExtraBold',
                      color: Accent.primary,
                      marginTop: 4,
                      letterSpacing: -0.5,
                    }}>
                      {calculateEstimation()?.weeks} Minggu
                    </Text>
                    <Text style={{
                      fontSize: 11,
                      fontFamily: 'Outfit_500Medium',
                      color: c.textMuted,
                      marginTop: 6,
                      lineHeight: 18,
                    }}>
                      Dihitung berdasarkan target kalori harian {bmiDetails.targetCalories} kcal.
                    </Text>
                  </View>
                </View>
              )}
            </View>

            {/* Navigation */}
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 24 }}>
              <TouchableOpacity onPress={() => setStep(3)} style={secondaryBtnStyle}>
                <ChevronLeft color={c.text} size={18} />
                <Text style={{ fontFamily: 'Outfit_600SemiBold', fontSize: 15, color: c.text }}>Kembali</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleFinishOnboarding} style={{ flex: 1 }}>
                <LinearGradient colors={[Accent.primary, Accent.primaryDark]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={primaryBtnStyle}>
                  <Text style={{ color: '#FFF', fontFamily: 'Outfit_600SemiBold', fontSize: 15 }}>Selesai</Text>
                  <ArrowRight color="white" size={18} />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

