import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, Alert } from 'react-native';
import { useAppState } from '@/hooks/useAppState';
import { User, Sun, Moon, RefreshCw, Award, Activity, Scale, Info } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function SettingsScreen() {
  const { userProfile, theme, toggleTheme, resetAllData } = useAppState();

  const isDark = theme === 'dark';

  // Theme styling
  const bgClass = isDark ? 'bg-dark-bg' : 'bg-light-bg';
  const textClass = isDark ? 'text-white' : 'text-slate-900';
  const textMutedClass = isDark ? 'text-gray-400' : 'text-slate-500';
  const cardClass = isDark ? 'bg-dark-card border-neutral-900' : 'bg-white border-slate-100 shadow-sm';
  const accentColor = isDark ? '#F97316' : '#2563EB';

  const handleReset = () => {
    Alert.alert(
      'Reset Semua Data',
      'Apakah Anda yakin ingin menghapus seluruh log data dan mengulang kembali onboarding?',
      [
        { text: 'Batal', style: 'cancel' },
        { text: 'Hapus Semua', style: 'destructive', onPress: resetAllData }
      ]
    );
  };

  const getGoalLabel = (goal: string) => {
    switch (goal) {
      case 'cutting': return 'Fat Loss / Cutting';
      case 'bulking': return 'Muscle Gain / Bulking';
      default: return 'Weight Maintenance';
    }
  };

  const getActivityLabel = (activity: string) => {
    switch (activity) {
      case 'sedentary': return 'Sedentary (Jarang olahraga)';
      case 'light': return 'Lightly Active (1-3x / minggu)';
      case 'active': return 'Active (3-5x / minggu)';
      default: return 'Very Active (Fisik berat)';
    }
  };

  return (
    <SafeAreaView className={`flex-1 ${bgClass}`}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} className="px-6 pt-6">
        
        {/* Header */}
        <View className="mb-6">
          <Text className={`text-2xl font-black ${textClass}`}>Profil & Pengaturan</Text>
          <Text className={`text-xs mt-1 ${textMutedClass}`}>Kelola data fisik dan pengaturan tema</Text>
        </View>

        {/* Theme Toggler Card */}
        <Animated.View entering={FadeInDown.duration(400)} className={`p-5 rounded-3xl border flex-row justify-between items-center ${cardClass} mb-6`}>
          <View className="flex-row items-center space-x-3">
            {isDark ? <Moon color={accentColor} size={22} /> : <Sun color={accentColor} size={22} />}
            <View>
              <Text className={`text-sm font-bold ${textClass}`}>Mode Tampilan</Text>
              <Text className={`text-xs ${textMutedClass}`}>Ganti tema terang atau gelap</Text>
            </View>
          </View>
          
          <TouchableOpacity 
            onPress={toggleTheme}
            className={`px-4 py-2.5 rounded-xl border-2 flex-row items-center space-x-1.5 ${
              isDark ? 'border-neutral-800 bg-neutral-900' : 'border-slate-200 bg-slate-50'
            }`}
          >
            <Text className={`text-xs font-bold ${textClass}`}>{isDark ? 'Tema Gelap' : 'Tema Terang'}</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* User Physical Details Profile Card */}
        {userProfile && (
          <Animated.View entering={FadeInDown.duration(450)} className={`p-6 rounded-3xl border ${cardClass} mb-6`}>
            <View className="flex-row items-center space-x-3 border-b border-neutral-800/10 pb-4 mb-4">
              <View className="w-10 h-10 rounded-full items-center justify-center bg-orange-500/15">
                <User color={accentColor} size={20} />
              </View>
              <View>
                <Text className={`text-base font-black ${textClass}`}>Status Target Fisik</Text>
                <Text className={`text-xs ${textMutedClass}`}>{getGoalLabel(userProfile.goal)}</Text>
              </View>
            </View>

            <View className="space-y-4">
              <View className="flex-row justify-between">
                <View className="flex-row items-center space-x-2">
                  <User color={isDark ? '#6B7280' : '#9CA3AF'} size={16} />
                  <Text className={`text-xs ${textMutedClass}`}>Gender & Usia</Text>
                </View>
                <Text className={`text-xs font-bold ${textClass}`}>
                  {userProfile.gender === 'male' ? 'Laki-laki' : 'Perempuan'}, {userProfile.age} Th
                </Text>
              </View>

              <View className="flex-row justify-between">
                <View className="flex-row items-center space-x-2">
                  <Scale color={isDark ? '#6B7280' : '#9CA3AF'} size={16} />
                  <Text className={`text-xs ${textMutedClass}`}>Tinggi / Berat</Text>
                </View>
                <Text className={`text-xs font-bold ${textClass}`}>
                  {userProfile.height} cm / {userProfile.weightCurrent} kg (Target: {userProfile.weightTarget} kg)
                </Text>
              </View>

              <View className="flex-row justify-between">
                <View className="flex-row items-center space-x-2">
                  <Activity color={isDark ? '#6B7280' : '#9CA3AF'} size={16} />
                  <Text className={`text-xs ${textMutedClass}`}>Aktivitas</Text>
                </View>
                <Text className={`text-xs font-bold ${textClass}`}>
                  {userProfile.activityLevel === 'sedentary' ? 'Ringan (Sedentary)' : userProfile.activityLevel === 'light' ? 'Lightly Active' : 'Active'}
                </Text>
              </View>

              <View className="flex-row justify-between pt-3 border-t border-neutral-800/10">
                <Text className={`text-xs font-semibold ${textClass}`}>BMI (Indeks Massa Tubuh)</Text>
                <Text className={`text-xs font-black ${isDark ? 'text-orange-500' : 'text-blue-600'}`}>{userProfile.bmi}</Text>
              </View>

              <View className="flex-row justify-between">
                <Text className={`text-xs font-semibold ${textClass}`}>TDEE (Daily Energy Target)</Text>
                <Text className={`text-xs font-black ${isDark ? 'text-orange-500' : 'text-blue-600'}`}>{userProfile.tdee} kcal</Text>
              </View>
            </View>
          </Animated.View>
        )}

        {/* Reset settings and debug */}
        <Animated.View entering={FadeInDown.duration(500)} className="space-y-3">
          <TouchableOpacity
            onPress={handleReset}
            className="w-full py-4 rounded-xl border border-transparent bg-red-500/10 flex-row items-center justify-center space-x-2"
          >
            <RefreshCw size={16} color="#EF4444" />
            <Text className="text-red-500 font-bold text-sm">Hapus Semua & Ulang Onboarding</Text>
          </TouchableOpacity>

          <View className="flex-row items-center justify-center space-x-1 mt-4">
            <Info size={12} color={isDark ? '#4B5563' : '#9CA3AF'} />
            <Text className={`text-[10px] ${textMutedClass}`}>BULK App v1.0.0 (by @daffs_26)</Text>
          </View>
        </Animated.View>

      </ScrollView>
    </SafeAreaView>
  );
}
