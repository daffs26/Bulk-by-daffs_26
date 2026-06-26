import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useAppState } from '@/hooks/useAppState';
import { Flame, Droplet, Zap, Heart, FlameKindling, Plus } from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  FadeInDown 
} from 'react-native-reanimated';

export default function DashboardScreen() {
  const { 
    userProfile, 
    foodLogs, 
    waterLoggedMl, 
    addWater, 
    resetWater, 
    streak, 
    theme 
  } = useAppState();

  const isDark = theme === 'dark';
  const today = new Date().toISOString().split('T')[0];

  // Calculate calories and macros eaten today
  const todayFoods = foodLogs.filter(f => f.date === today);
  const caloriesEaten = todayFoods.reduce((acc, f) => acc + f.calories, 0);
  const proteinEaten = todayFoods.reduce((acc, f) => acc + f.protein, 0);
  const carbsEaten = todayFoods.reduce((acc, f) => acc + f.carbs, 0);
  const fatEaten = todayFoods.reduce((acc, f) => acc + f.fat, 0);

  const targetCalories = userProfile?.targetCalories || 2000;
  const targetProtein = userProfile?.targetMacros.protein || 120;
  const targetCarbs = userProfile?.targetMacros.carb || 200;
  const targetFat = userProfile?.targetMacros.fat || 65;

  const waterGoal = userProfile ? Math.round(userProfile.weightCurrent * 0.033 * 1000) : 2000;

  // Remaining calories
  const caloriesRemaining = Math.max(0, targetCalories - caloriesEaten);
  const caloriePercent = Math.min(1, caloriesEaten / targetCalories);

  // Theme styles
  const bgClass = isDark ? 'bg-dark-bg' : 'bg-light-bg';
  const textClass = isDark ? 'text-white' : 'text-slate-900';
  const textMutedClass = isDark ? 'text-gray-400' : 'text-slate-500';
  const cardClass = isDark ? 'bg-dark-card border-neutral-900' : 'bg-white border-slate-100 shadow-sm';
  const progressBgClass = isDark ? 'bg-neutral-800' : 'bg-slate-200';
  const headerAccentColor = isDark ? 'text-orange-500' : 'text-blue-600';
  
  // Reanimated Shared Values for dynamic progress styling
  const waterAnimScale = useSharedValue(1);

  const animatedWaterStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: waterAnimScale.value }],
    };
  });

  const handleAddWater = (ml: number) => {
    addWater(ml);
    waterAnimScale.value = 1.15;
    waterAnimScale.value = withSpring(1, { damping: 10, stiffness: 100 });
  };

  return (
    <SafeAreaView className={`flex-1 ${bgClass}`}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} className="px-6 pt-6">
        
        {/* Top Header */}
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className={`text-xs uppercase tracking-widest ${textMutedClass}`}>Welcome Back</Text>
            <Text className={`text-2xl font-black ${textClass}`}>BULK Dashboard</Text>
          </View>
          <View className={`px-3 py-1.5 rounded-full border flex-row items-center space-x-1 ${cardClass}`}>
            <FlameKindling size={16} color={isDark ? '#F97316' : '#2563EB'} />
            <Text className={`text-xs font-bold ${textClass}`}>{streak} Days Streak</Text>
          </View>
        </View>

        {/* Calorie Progress Ring / Card */}
        <Animated.View entering={FadeInDown.duration(400)} className={`p-6 rounded-3xl border ${cardClass} mb-6`}>
          <View className="flex-row justify-between items-center mb-4">
            <View>
              <Text className={`text-sm font-semibold ${textMutedClass}`}>Energy Balance</Text>
              <Text className={`text-3xl font-extrabold mt-1 ${textClass}`}>
                {caloriesEaten} <Text className="text-sm font-normal">/ {targetCalories} kcal</Text>
              </Text>
            </View>
            <Flame color={isDark ? '#F97316' : '#2563EB'} size={32} />
          </View>

          {/* Simple Clean Progress Bar */}
          <View className={`h-3 w-full rounded-full ${progressBgClass} mb-4 overflow-hidden`}>
            <View 
              style={{ width: `${caloriePercent * 100}%` }} 
              className={`h-full rounded-full ${isDark ? 'bg-orange-500' : 'bg-blue-600'}`} 
            />
          </View>

          <View className="flex-row justify-between">
            <View>
              <Text className={`text-xs ${textMutedClass}`}>Target</Text>
              <Text className={`text-sm font-semibold ${textClass}`}>{targetCalories} kcal</Text>
            </View>
            <View className="items-end">
              <Text className={`text-xs ${textMutedClass}`}>Remaining</Text>
              <Text className={`text-sm font-semibold ${isDark ? 'text-orange-500' : 'text-blue-600'}`}>
                {caloriesRemaining} kcal
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Macros Breakdown */}
        <Animated.View entering={FadeInDown.duration(450)} className={`p-6 rounded-3xl border ${cardClass} mb-6`}>
          <Text className={`text-sm font-bold ${textClass} mb-4`}>Nutrients Distribution</Text>

          <View className="space-y-4">
            {/* Protein */}
            <View>
              <View className="flex-row justify-between mb-1.5">
                <Text className={`text-xs font-semibold ${textClass}`}>Protein</Text>
                <Text className={`text-xs ${textMutedClass}`}>{proteinEaten}g / {targetProtein}g</Text>
              </View>
              <View className={`h-2 w-full rounded-full ${progressBgClass} overflow-hidden`}>
                <View 
                  style={{ width: `${Math.min(1, proteinEaten / targetProtein) * 100}%` }} 
                  className={`h-full rounded-full ${isDark ? 'bg-orange-500' : 'bg-blue-600'}`} 
                />
              </View>
            </View>

            {/* Carbs */}
            <View>
              <View className="flex-row justify-between mb-1.5">
                <Text className={`text-xs font-semibold ${textClass}`}>Carbs</Text>
                <Text className={`text-xs ${textMutedClass}`}>{carbsEaten}g / {targetCarbs}g</Text>
              </View>
              <View className={`h-2 w-full rounded-full ${progressBgClass} overflow-hidden`}>
                <View 
                  style={{ width: `${Math.min(1, carbsEaten / targetCarbs) * 100}%` }} 
                  className={`h-full rounded-full ${isDark ? 'bg-orange-600' : 'bg-cyan-500'}`} 
                />
              </View>
            </View>

            {/* Fat */}
            <View>
              <View className="flex-row justify-between mb-1.5">
                <Text className={`text-xs font-semibold ${textClass}`}>Fat</Text>
                <Text className={`text-xs ${textMutedClass}`}>{fatEaten}g / {targetFat}g</Text>
              </View>
              <View className={`h-2 w-full rounded-full ${progressBgClass} overflow-hidden`}>
                <View 
                  style={{ width: `${Math.min(1, fatEaten / targetFat) * 100}%` }} 
                  className={`h-full rounded-full ${isDark ? 'bg-neutral-600' : 'bg-slate-400'}`} 
                />
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Dynamic Water Tracker */}
        <Animated.View entering={FadeInDown.duration(500)} className={`p-6 rounded-3xl border ${cardClass} mb-6`}>
          <View className="flex-row justify-between items-center mb-4">
            <View>
              <Text className={`text-sm font-semibold ${textMutedClass}`}>Water Intake</Text>
              <Text className={`text-2xl font-extrabold mt-1 ${textClass}`}>
                {waterLoggedMl} <Text className="text-sm font-normal">/ {waterGoal} ml</Text>
              </Text>
            </View>
            <Animated.View style={animatedWaterStyle}>
              <Droplet color={isDark ? '#F97316' : '#2563EB'} size={32} />
            </Animated.View>
          </View>

          <View className={`h-2.5 w-full rounded-full ${progressBgClass} mb-4 overflow-hidden`}>
            <View 
              style={{ width: `${Math.min(1, waterLoggedMl / waterGoal) * 100}%` }} 
              className={`h-full rounded-full ${isDark ? 'bg-orange-500' : 'bg-blue-600'}`} 
            />
          </View>

          <View className="flex-row space-x-3">
            <TouchableOpacity 
              onPress={() => handleAddWater(250)}
              className={`flex-1 py-3 rounded-xl border-2 items-center flex-row justify-center space-x-1 ${
                isDark ? 'border-neutral-800 bg-neutral-900' : 'border-slate-200 bg-slate-50'
              }`}
            >
              <Plus size={16} color={isDark ? '#FFF' : '#334155'} />
              <Text className={`text-xs font-bold ${textClass}`}>+250ml</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => handleAddWater(500)}
              className={`flex-1 py-3 rounded-xl border-2 items-center flex-row justify-center space-x-1 ${
                isDark ? 'border-neutral-800 bg-neutral-900' : 'border-slate-200 bg-slate-50'
              }`}
            >
              <Plus size={16} color={isDark ? '#FFF' : '#334155'} />
              <Text className={`text-xs font-bold ${textClass}`}>+500ml</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={resetWater}
              className={`px-4 py-3 rounded-xl border-2 border-transparent bg-red-500/10 items-center justify-center`}
            >
              <Text className="text-red-500 text-xs font-bold">Reset</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Goals / Daily Tips Info */}
        <Animated.View entering={FadeInDown.duration(550)} className={`p-5 rounded-3xl border bg-amber-500/5 ${
          isDark ? 'border-amber-500/10' : 'border-amber-500/20'
        }`}>
          <Text className="text-amber-500 font-bold text-sm mb-1">💪 Daily Lifestyle Tip</Text>
          <Text className={`text-xs leading-relaxed ${isDark ? 'text-amber-200/70' : 'text-amber-800/80'}`}>
            Untuk memaksimalkan goal **{userProfile?.goal.toUpperCase() || 'MAINTENANCE'}** kamu, pastikan tidur 7-8 jam malam ini dan pertahankan asupan air minum harianmu.
          </Text>
        </Animated.View>
        
      </ScrollView>
    </SafeAreaView>
  );
}
