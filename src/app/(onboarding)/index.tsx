import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppState, calculateFitnessMetrics, UserProfile } from '@/hooks/useAppState';
import { ChevronRight, ChevronLeft, Award, Scale, Activity, ArrowRight, User as UserIcon } from 'lucide-react-native';
import Animated, { FadeIn, FadeOut, SlideInRight, SlideOutLeft } from 'react-native-reanimated';

export default function OnboardingScreen() {
  const { setOnboardingData, theme } = useAppState();
  const router = useRouter();

  const isDark = theme === 'dark';

  // State variables for inputs
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState<UserProfile['goal']>('maintenance');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weightCurrent, setWeightCurrent] = useState('');
  const [activityLevel, setActivityLevel] = useState<UserProfile['activityLevel']>('sedentary');
  const [weightTarget, setWeightTarget] = useState('');

  // Local calculation result state for step 3/4
  const [bmiDetails, setBmiDetails] = useState<{
    bmi: number;
    tdee: number;
    targetCalories: number;
    category: string;
    isCompatible: boolean;
    warningMsg: string;
  } | null>(null);

  // Theme-aware styles
  const bgClass = isDark ? 'bg-dark-bg' : 'bg-light-bg';
  const textClass = isDark ? 'text-white' : 'text-slate-900';
  const textMutedClass = isDark ? 'text-gray-400' : 'text-slate-500';
  const cardClass = isDark ? 'bg-dark-card border-neutral-800' : 'bg-light-card border-slate-200';
  const inputClass = isDark 
    ? 'bg-neutral-900 border-neutral-800 text-white focus:border-dark-accent' 
    : 'bg-white border-slate-300 text-slate-900 focus:border-light-accent';
  const accentColor = isDark ? '#F97316' : '#2563EB';

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

    // Validation matching goal with BMI
    let isCompatible = true;
    let warningMsg = '';

    if (goal === 'bulking' && metrics.bmi >= 25) {
      isCompatible = false;
      warningMsg = `Your current BMI is ${metrics.bmi} (${category}). Bulking is not recommended when overweight. A maintenance or cutting goal might be safer for your joints and metabolism.`;
    } else if (goal === 'cutting' && metrics.bmi < 18.5) {
      isCompatible = false;
      warningMsg = `Your current BMI is ${metrics.bmi} (${category}). Cutting is not recommended when underweight. A bulking or maintenance goal is safer to ensure proper body nourishment.`;
    }

    setBmiDetails({
      bmi: metrics.bmi,
      tdee: metrics.tdee,
      targetCalories: metrics.targetCalories,
      category,
      isCompatible,
      warningMsg,
    });

    setStep(3);
  };

  const handleConfirmGoal = () => {
    // If compatible, or user explicitly continued, go to step 5 (target weight)
    setStep(5);
  };

  const calculateEstimation = () => {
    const targetW = parseFloat(weightTarget);
    const currentW = parseFloat(weightCurrent);

    if (isNaN(targetW) || targetW < 30 || targetW > 300) {
      return null;
    }

    const diff = Math.abs(targetW - currentW);
    if (diff === 0) return { weeks: 0, text: 'You are at your target!' };

    // 1 kg = ~7700 kcal. Daily deficit/surplus is 400 kcal.
    // 7700 / 400 = 19.25 days per kg.
    const daysNeeded = Math.round(diff * 19.25);
    const weeksNeeded = Number((daysNeeded / 7).toFixed(1));

    let actionWord = goal === 'cutting' ? 'lose' : 'gain';
    if (goal === 'maintenance') actionWord = 'stabilize';

    return {
      weeks: weeksNeeded,
      text: `${weeksNeeded} weeks to ${actionWord} ${diff.toFixed(1)} kg (${daysNeeded} days total).`
    };
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

    // Goal checks
    if (goal === 'cutting' && targetW >= weightNum) {
      Alert.alert('Goal Mismatch', 'Your target weight must be lower than current weight for Cutting.');
      return;
    }
    if (goal === 'bulking' && targetW <= weightNum) {
      Alert.alert('Goal Mismatch', 'Your target weight must be higher than current weight for Bulking.');
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
      targetMacros: finalMetrics.targetMacros
    };

    await setOnboardingData(profile);
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView className={`flex-1 ${bgClass}`}>
      <View className="px-6 py-4 flex-row items-center justify-between border-b border-neutral-800/10">
        <Text className={`text-xl font-bold ${textClass}`}>BULK</Text>
        <Text className={`text-sm ${textMutedClass}`}>Step {step} of 5</Text>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }} className="px-6 py-4">
        {step === 1 && (
          <Animated.View entering={SlideInRight} exiting={SlideOutLeft} className="flex-1 justify-center space-y-6">
            <View className="mb-6">
              <Text className={`text-3xl font-black ${textClass} tracking-tight`}>Pilih Goal Kamu</Text>
              <Text className={`text-base mt-2 ${textMutedClass}`}>
                Tentukan target utama kesehatan tubuhmu saat ini.
              </Text>
            </View>

            <View className="space-y-4">
              <TouchableOpacity
                onPress={() => setGoal('cutting')}
                className={`p-5 rounded-2xl border-2 flex-row items-center justify-between ${
                  goal === 'cutting' 
                    ? isDark ? 'border-orange-500 bg-neutral-900/60' : 'border-blue-500 bg-blue-50/50' 
                    : isDark ? 'border-neutral-800 bg-neutral-950' : 'border-slate-200 bg-white'
                }`}
              >
                <View className="flex-1 pr-4">
                  <Text className={`text-lg font-bold ${textClass}`}>Cutting</Text>
                  <Text className={`text-sm mt-1 ${textMutedClass}`}>
                    Menurunkan berat badan & kadar lemak tubuh secara bertahap.
                  </Text>
                </View>
                <Activity color={goal === 'cutting' ? accentColor : '#9CA3AF'} size={24} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setGoal('bulking')}
                className={`p-5 rounded-2xl border-2 flex-row items-center justify-between ${
                  goal === 'bulking'
                    ? isDark ? 'border-orange-500 bg-neutral-900/60' : 'border-blue-500 bg-blue-50/50'
                    : isDark ? 'border-neutral-800 bg-neutral-950' : 'border-slate-200 bg-white'
                }`}
              >
                <View className="flex-1 pr-4">
                  <Text className={`text-lg font-bold ${textClass}`}>Bulking</Text>
                  <Text className={`text-sm mt-1 ${textMutedClass}`}>
                    Meningkatkan massa otot & berat badan secara terkontrol.
                  </Text>
                </View>
                <Award color={goal === 'bulking' ? accentColor : '#9CA3AF'} size={24} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setGoal('maintenance')}
                className={`p-5 rounded-2xl border-2 flex-row items-center justify-between ${
                  goal === 'maintenance'
                    ? isDark ? 'border-orange-500 bg-neutral-900/60' : 'border-blue-500 bg-blue-50/50'
                    : isDark ? 'border-neutral-800 bg-neutral-950' : 'border-slate-200 bg-white'
                }`}
              >
                <View className="flex-1 pr-4">
                  <Text className={`text-lg font-bold ${textClass}`}>Maintenance</Text>
                  <Text className={`text-sm mt-1 ${textMutedClass}`}>
                    Menjaga berat badan stabil & komposisi tubuh saat ini.
                  </Text>
                </View>
                <Scale color={goal === 'maintenance' ? accentColor : '#9CA3AF'} size={24} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => setStep(2)}
              className="mt-8 py-4 rounded-xl flex-row items-center justify-center space-x-2"
              style={{ backgroundColor: accentColor }}
            >
              <Text className="text-white font-bold text-base">Lanjut</Text>
              <ChevronRight color="white" size={20} />
            </TouchableOpacity>
          </Animated.View>
        )}

        {step === 2 && (
          <Animated.View entering={SlideInRight} exiting={SlideOutLeft} className="flex-1 justify-center">
            <View className="mb-6">
              <Text className={`text-3xl font-black ${textClass} tracking-tight`}>Data Diri Kamu</Text>
              <Text className={`text-base mt-2 ${textMutedClass}`}>
                Isi data fisik untuk kalkulasi kalori target yang akurat.
              </Text>
            </View>

            <View className="space-y-4">
              {/* Gender */}
              <View className="flex-row space-x-4 mb-2">
                <TouchableOpacity
                  onPress={() => setGender('male')}
                  className={`flex-1 py-4 rounded-xl border-2 items-center ${
                    gender === 'male' 
                      ? isDark ? 'border-orange-500 bg-neutral-900' : 'border-blue-500 bg-blue-50'
                      : isDark ? 'border-neutral-800 bg-neutral-950' : 'border-slate-200 bg-white'
                  }`}
                >
                  <Text className={`font-bold ${textClass}`}>Laki-laki</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setGender('female')}
                  className={`flex-1 py-4 rounded-xl border-2 items-center ${
                    gender === 'female'
                      ? isDark ? 'border-orange-500 bg-neutral-900' : 'border-blue-500 bg-blue-50'
                      : isDark ? 'border-neutral-800 bg-neutral-950' : 'border-slate-200 bg-white'
                  }`}
                >
                  <Text className={`font-bold ${textClass}`}>Perempuan</Text>
                </TouchableOpacity>
              </View>

              {/* Age */}
              <View>
                <Text className={`text-sm font-semibold mb-2 ${textClass}`}>Usia (Tahun)</Text>
                <TextInput
                  placeholder="Contoh: 24"
                  placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                  keyboardType="numeric"
                  value={age}
                  onChangeText={setAge}
                  className={`px-4 py-3 rounded-xl border-2 ${inputClass}`}
                />
              </View>

              {/* Height */}
              <View>
                <Text className={`text-sm font-semibold mb-2 ${textClass}`}>Tinggi Badan (cm)</Text>
                <TextInput
                  placeholder="Contoh: 172"
                  placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                  keyboardType="numeric"
                  value={height}
                  onChangeText={setHeight}
                  className={`px-4 py-3 rounded-xl border-2 ${inputClass}`}
                />
              </View>

              {/* Current Weight */}
              <View>
                <Text className={`text-sm font-semibold mb-2 ${textClass}`}>Berat Badan Sekarang (kg)</Text>
                <TextInput
                  placeholder="Contoh: 70"
                  placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                  keyboardType="numeric"
                  value={weightCurrent}
                  onChangeText={setWeightCurrent}
                  className={`px-4 py-3 rounded-xl border-2 ${inputClass}`}
                />
              </View>

              {/* Activity Level */}
              <View>
                <Text className={`text-sm font-semibold mb-2 ${textClass}`}>Level Aktivitas Harian</Text>
                <View className="space-y-2">
                  {[
                    { id: 'sedentary', label: 'Sedentary (Jarang olahraga)' },
                    { id: 'light', label: 'Lightly Active (Olahraga 1-3x / minggu)' },
                    { id: 'active', label: 'Active (Olahraga 3-5x / minggu)' },
                    { id: 'very_active', label: 'Very Active (Olahraga berat / fisik)' }
                  ].map((level) => (
                    <TouchableOpacity
                      key={level.id}
                      onPress={() => setActivityLevel(level.id as any)}
                      className={`px-4 py-3 rounded-xl border-2 ${
                        activityLevel === level.id
                          ? isDark ? 'border-orange-500 bg-neutral-900' : 'border-blue-500 bg-blue-50'
                          : isDark ? 'border-neutral-800 bg-neutral-950' : 'border-slate-200 bg-white'
                      }`}
                    >
                      <Text className={`text-sm ${textClass}`}>{level.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            {/* Navigation buttons */}
            <View className="flex-row space-x-4 mt-8">
              <TouchableOpacity
                onPress={() => setStep(1)}
                className={`flex-1 py-4 rounded-xl border-2 flex-row items-center justify-center space-x-2 ${
                  isDark ? 'border-neutral-800 bg-neutral-950' : 'border-slate-200 bg-white'
                }`}
              >
                <ChevronLeft color={isDark ? '#FFF' : '#334155'} size={20} />
                <Text className={`font-bold text-base ${textClass}`}>Kembali</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={processMetrics}
                className="flex-1 py-4 rounded-xl flex-row items-center justify-center space-x-2"
                style={{ backgroundColor: accentColor }}
              >
                <Text className="text-white font-bold text-base">Lanjut</Text>
                <ChevronRight color="white" size={20} />
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}

        {step === 3 && bmiDetails && (
          <Animated.View entering={SlideInRight} exiting={SlideOutLeft} className="flex-1 justify-center">
            <View className="mb-6">
              <Text className={`text-3xl font-black ${textClass} tracking-tight`}>Pemeriksaan BMI</Text>
              <Text className={`text-base mt-2 ${textMutedClass}`}>
                Hasil hitung komposisi tubuh otomatis.
              </Text>
            </View>

            <View className={`p-6 rounded-2xl border-2 mb-6 ${cardClass}`}>
              <View className="items-center py-4 border-b border-neutral-800/10 mb-4">
                <Text className={`text-sm uppercase tracking-wider ${textMutedClass}`}>BMI Anda</Text>
                <Text className={`text-5xl font-black mt-1 ${textClass}`}>{bmiDetails.bmi}</Text>
                <Text className={`text-lg font-bold mt-2 ${
                  bmiDetails.bmi < 18.5 || bmiDetails.bmi >= 25 ? 'text-amber-500' : 'text-green-500'
                }`}>
                  Kategori: {bmiDetails.category}
                </Text>
              </View>

              <View className="space-y-3">
                <View className="flex-row justify-between">
                  <Text className={textMutedClass}>Total Kebutuhan Harian (TDEE)</Text>
                  <Text className={`font-bold ${textClass}`}>{bmiDetails.tdee} kcal</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className={textMutedClass}>Rekomendasi Target Kalori</Text>
                  <Text className={`font-bold ${textClass}`}>{bmiDetails.targetCalories} kcal</Text>
                </View>
              </View>
            </View>

            {/* Warning compatibility section */}
            {!bmiDetails.isCompatible ? (
              <View className="p-5 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 mb-6">
                <Text className="text-amber-500 font-bold text-lg mb-2">⚠️ Goal Kurang Sesuai</Text>
                <Text className={`text-sm ${isDark ? 'text-amber-200/80' : 'text-amber-800/80'} leading-relaxed`}>
                  {bmiDetails.warningMsg}
                </Text>
              </View>
            ) : (
              <View className="p-5 rounded-2xl bg-green-500/10 border-2 border-green-500/30 mb-6">
                <Text className="text-green-500 font-bold text-lg mb-2">✅ Goal Sesuai</Text>
                <Text className={`text-sm ${isDark ? 'text-green-200/80' : 'text-green-800/80'} leading-relaxed`}>
                  Goal kamu ({goal}) sangat sesuai dengan kategori BMI tubuhmu saat ini. Mari lanjutkan!
                </Text>
              </View>
            )}

            {/* Navigation buttons */}
            <View className="flex-row space-x-4">
              {!bmiDetails.isCompatible ? (
                <>
                  <TouchableOpacity
                    onPress={() => setStep(1)}
                    className="flex-1 py-4 rounded-xl border-2 items-center justify-center bg-neutral-900 border-neutral-800"
                  >
                    <Text className="text-white font-bold text-base">Ubah Goal</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleConfirmGoal}
                    className="flex-1 py-4 rounded-xl items-center justify-center bg-amber-500"
                  >
                    <Text className="text-black font-bold text-base">Tetap Lanjut</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <TouchableOpacity
                    onPress={() => setStep(2)}
                    className={`flex-1 py-4 rounded-xl border-2 flex-row items-center justify-center space-x-2 ${
                      isDark ? 'border-neutral-800 bg-neutral-950' : 'border-slate-200 bg-white'
                    }`}
                  >
                    <ChevronLeft color={isDark ? '#FFF' : '#334155'} size={20} />
                    <Text className={`font-bold text-base ${textClass}`}>Ubah Data</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleConfirmGoal}
                    className="flex-1 py-4 rounded-xl flex-row items-center justify-center space-x-2"
                    style={{ backgroundColor: accentColor }}
                  >
                    <Text className="text-white font-bold text-base">Lanjut</Text>
                    <ChevronRight color="white" size={20} />
                  </TouchableOpacity>
                </>
              )}
            </View>
          </Animated.View>
        )}

        {step === 5 && bmiDetails && (
          <Animated.View entering={SlideInRight} exiting={SlideOutLeft} className="flex-1 justify-center">
            <View className="mb-6">
              <Text className={`text-3xl font-black ${textClass} tracking-tight`}>Target Berat Badan</Text>
              <Text className={`text-base mt-2 ${textMutedClass}`}>
                Tentukan berat badan yang ingin kamu capai.
              </Text>
            </View>

            <View className="space-y-4">
              <View>
                <Text className={`text-sm font-semibold mb-2 ${textClass}`}>Berat Target (kg)</Text>
                <TextInput
                  placeholder={`Contoh: ${goal === 'cutting' ? '65' : '75'}`}
                  placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                  keyboardType="numeric"
                  value={weightTarget}
                  onChangeText={setWeightTarget}
                  className={`px-4 py-3 rounded-xl border-2 ${inputClass}`}
                />
              </View>

              {calculateEstimation() && (
                <Animated.View entering={FadeIn} exiting={FadeOut} className={`p-5 rounded-2xl border-2 ${cardClass}`}>
                  <Text className={`text-sm ${textMutedClass}`}>Estimasi Waktu Realistis</Text>
                  <Text className={`text-xl font-extrabold mt-1 ${isDark ? 'text-orange-500' : 'text-blue-600'}`}>
                    {calculateEstimation()?.weeks} Minggu
                  </Text>
                  <Text className={`text-xs mt-2 ${textMutedClass} leading-relaxed`}>
                    Dihitung berdasarkan target kalori harian {bmiDetails.targetCalories} kcal dengan deficit/surplus harian asupan.
                  </Text>
                </Animated.View>
              )}
            </View>

            {/* Navigation buttons */}
            <View className="flex-row space-x-4 mt-8">
              <TouchableOpacity
                onPress={() => setStep(3)}
                className={`flex-1 py-4 rounded-xl border-2 flex-row items-center justify-center space-x-2 ${
                  isDark ? 'border-neutral-800 bg-neutral-950' : 'border-slate-200 bg-white'
                }`}
              >
                <ChevronLeft color={isDark ? '#FFF' : '#334155'} size={20} />
                <Text className={`font-bold text-base ${textClass}`}>Kembali</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleFinishOnboarding}
                className="flex-1 py-4 rounded-xl flex-row items-center justify-center space-x-2"
                style={{ backgroundColor: accentColor }}
              >
                <Text className="text-white font-bold text-base">Selesai</Text>
                <ArrowRight color="white" size={20} />
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
