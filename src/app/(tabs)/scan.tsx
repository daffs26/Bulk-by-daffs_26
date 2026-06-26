import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ActivityIndicator, Image, Alert } from 'react-native';
import { useAppState } from '@/hooks/useAppState';
import { Camera, Image as ImageIcon, Sparkles, Check, X, RotateCcw } from 'lucide-react-native';
import Animated, { FadeIn, FadeOut, Layout } from 'react-native-reanimated';

export default function CameraScanScreen() {
  const { addFoodLog, theme } = useAppState();
  const isDark = theme === 'dark';

  // Scanner UI States
  const [scanState, setScanState] = useState<'idle' | 'scanning' | 'result'>('idle');
  const [portionScale, setPortionScale] = useState(1.0);

  // Mock Result from AI
  const mockBaseResult = {
    name: 'Nasi Rames Daging Rendang',
    calories: 520,
    protein: 26,
    carbs: 62,
    fat: 16
  };

  // Adjusted results based on slider/portion multiplier
  const adjustedCalories = Math.round(mockBaseResult.calories * portionScale);
  const adjustedProtein = Math.round(mockBaseResult.protein * portionScale);
  const adjustedCarbs = Math.round(mockBaseResult.carbs * portionScale);
  const adjustedFat = Math.round(mockBaseResult.fat * portionScale);

  // Theme styling
  const bgClass = isDark ? 'bg-dark-bg' : 'bg-light-bg';
  const textClass = isDark ? 'text-white' : 'text-slate-900';
  const textMutedClass = isDark ? 'text-gray-400' : 'text-slate-500';
  const cardClass = isDark ? 'bg-dark-card border-neutral-900' : 'bg-white border-slate-100 shadow-sm';
  const accentColor = isDark ? '#F97316' : '#2563EB';
  const accentBgClass = isDark ? 'bg-orange-500/10 border-orange-500/20' : 'bg-blue-50 border-blue-100';

  const triggerScan = () => {
    setScanState('scanning');
    
    // Simulate AI parsing image (2.5 seconds)
    setTimeout(() => {
      setScanState('result');
      setPortionScale(1.0);
    }, 2500);
  };

  const handleSaveResult = async () => {
    await addFoodLog({
      name: `${mockBaseResult.name} (${portionScale.toFixed(1)}x)`,
      calories: adjustedCalories,
      protein: adjustedProtein,
      carbs: adjustedCarbs,
      fat: adjustedFat,
      mealType: 'lunch' // Default to lunch for mock
    });

    Alert.alert('Log Berhasil', 'Makanan hasil scan AI berhasil dicatat di Diary Makan Siang!');
    setScanState('idle');
  };

  return (
    <SafeAreaView className={`flex-1 ${bgClass}`}>
      <View className="px-6 pt-6 pb-2">
        <Text className={`text-2xl font-black ${textClass}`}>AI Scan Porsi</Text>
        <Text className={`text-xs mt-1 ${textMutedClass}`}>Deteksi porsi & makro makanan via foto</Text>
      </View>

      <View className="flex-1 px-6 py-4 justify-center">
        {scanState === 'idle' && (
          <Animated.View entering={FadeIn} exiting={FadeOut} className="flex-1 justify-between py-6">
            {/* Camera Viewfinder Mock */}
            <View className={`flex-1 rounded-3xl border-2 border-dashed relative items-center justify-center overflow-hidden bg-neutral-950 ${
              isDark ? 'border-neutral-800' : 'border-slate-200'
            }`}>
              {/* Guides */}
              <View className="absolute top-8 left-8 w-8 h-8 border-t-4 border-l-4 border-orange-500 rounded-tl-lg" />
              <View className="absolute top-8 right-8 w-8 h-8 border-t-4 border-r-4 border-orange-500 rounded-tr-lg" />
              <View className="absolute bottom-8 left-8 w-8 h-8 border-b-4 border-l-4 border-orange-500 rounded-bl-lg" />
              <View className="absolute bottom-8 right-8 w-8 h-8 border-b-4 border-r-4 border-orange-500 rounded-br-lg" />

              <Camera size={48} color={isDark ? '#4B5563' : '#9CA3AF'} />
              <Text className="text-gray-500 text-xs mt-4 font-semibold text-center px-8 leading-relaxed">
                Posisikan piring makanan tepat di dalam kotak pembatas.
              </Text>
            </View>

            {/* Instruction Banner */}
            <View className={`p-4 rounded-2xl border mt-4 ${cardClass}`}>
              <Text className={`text-xs font-semibold ${isDark ? 'text-amber-500' : 'text-blue-600'} mb-1`}>
                💡 Tips Akurasi Porsi
              </Text>
              <Text className={`text-xs leading-relaxed ${textMutedClass}`}>
                Letakkan tangan Anda atau koin di sebelah piring sebagai acuan ukuran skala objek agar AI dapat menghitung porsi secara presisi.
              </Text>
            </View>

            {/* Action buttons */}
            <View className="flex-row space-x-3 mt-5">
              <TouchableOpacity
                className={`flex-1 py-4 rounded-xl border-2 items-center flex-row justify-center space-x-2 ${
                  isDark ? 'border-neutral-800 bg-neutral-900' : 'border-slate-200 bg-white'
                }`}
              >
                <ImageIcon size={20} color={isDark ? '#FFF' : '#334155'} />
                <Text className={`font-bold ${textClass}`}>Unggah Galeri</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={triggerScan}
                className="flex-1 py-4 rounded-xl flex-row items-center justify-center space-x-2"
                style={{ backgroundColor: accentColor }}
              >
                <Sparkles size={20} color="white" />
                <Text className="text-white font-bold text-base">Ambil Foto</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}

        {scanState === 'scanning' && (
          <Animated.View entering={FadeIn} exiting={FadeOut} className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color={accentColor} />
            <Text className={`text-base font-bold mt-6 ${textClass}`}>Menganalisis Foto Makanan...</Text>
            <Text className={`text-xs mt-1.5 ${textMutedClass}`}>Mengestimasi porsi pembanding & volume makro</Text>
          </Animated.View>
        )}

        {scanState === 'result' && (
          <Animated.View entering={FadeIn} layout={Layout.springify()} className="flex-1 justify-between py-4">
            
            {/* Mock Image Taken */}
            <View className="h-44 w-full rounded-2xl overflow-hidden bg-neutral-800 relative mb-4">
              {/* Display a simple placeholder for food or styled graphics */}
              <View className="absolute inset-0 bg-neutral-950 items-center justify-center">
                <ImageIcon size={40} color="#4B5563" />
                <Text className="text-gray-500 text-xs mt-2 font-semibold">Hasil Foto Teranalisis</Text>
              </View>
              <View className="absolute bottom-3 left-3 bg-black/60 px-2.5 py-1 rounded-md">
                <Text className="text-white text-[10px] font-bold">Skala Referensi Terdeteksi</Text>
              </View>
            </View>

            {/* Analysis Results Card */}
            <View className={`p-6 rounded-3xl border flex-1 justify-between ${cardClass} mb-4`}>
              <View>
                <View className="flex-row items-center space-x-1.5 mb-1">
                  <Sparkles size={16} color={accentColor} />
                  <Text className={`text-xs font-semibold ${isDark ? 'text-orange-500' : 'text-blue-600'}`}>
                    AI Detection Success
                  </Text>
                </View>
                
                <Text className={`text-xl font-black ${textClass}`}>{mockBaseResult.name}</Text>
                
                {/* Calories Display */}
                <Text className={`text-3xl font-extrabold mt-3 ${textClass}`}>
                  {adjustedCalories} <Text className="text-sm font-normal text-gray-500">kcal</Text>
                </Text>

                {/* Macro breakdown */}
                <View className="flex-row space-x-6 mt-4 py-3 border-t border-b border-neutral-800/10">
                  <View>
                    <Text className="text-[10px] text-gray-500 uppercase font-semibold">Protein</Text>
                    <Text className={`text-sm font-bold ${textClass}`}>{adjustedProtein}g</Text>
                  </View>
                  <View>
                    <Text className="text-[10px] text-gray-500 uppercase font-semibold">Karbohidrat</Text>
                    <Text className={`text-sm font-bold ${textClass}`}>{adjustedCarbs}g</Text>
                  </View>
                  <View>
                    <Text className="text-[10px] text-gray-500 uppercase font-semibold">Lemak</Text>
                    <Text className={`text-sm font-bold ${textClass}`}>{adjustedFat}g</Text>
                  </View>
                </View>
              </View>

              {/* Dynamic Portion Adjustment slider layout */}
              <View className="mt-4">
                <Text className={`text-xs font-semibold mb-2 ${textClass}`}>
                  Sesuaikan Porsi: <Text className="font-extrabold" style={{ color: accentColor }}>{portionScale.toFixed(1)}x</Text>
                </Text>
                
                {/* Custom Mock Slider via buttons for precision on React Native */}
                <View className="flex-row items-center space-x-2">
                  <TouchableOpacity
                    onPress={() => setPortionScale(prev => Math.max(0.5, prev - 0.1))}
                    className={`flex-1 py-2.5 rounded-xl border items-center bg-neutral-900 border-neutral-800`}
                  >
                    <Text className="text-white font-bold text-xs">-0.1x</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setPortionScale(1.0)}
                    className={`flex-1 py-2.5 rounded-xl border items-center bg-neutral-900 border-neutral-800`}
                  >
                    <Text className="text-white font-bold text-xs">Reset (1.0x)</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setPortionScale(prev => Math.min(3.0, prev + 0.1))}
                    className={`flex-1 py-2.5 rounded-xl border items-center bg-neutral-900 border-neutral-800`}
                  >
                    <Text className="text-white font-bold text-xs">+0.1x</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Save Buttons */}
            <View className="flex-row space-x-3">
              <TouchableOpacity
                onPress={() => setScanState('idle')}
                className={`py-4 px-6 rounded-xl border-2 items-center justify-center ${
                  isDark ? 'border-neutral-800 bg-neutral-900' : 'border-slate-200 bg-white'
                }`}
              >
                <RotateCcw size={20} color={isDark ? '#FFF' : '#334155'} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSaveResult}
                className="flex-1 py-4 rounded-xl flex-row items-center justify-center space-x-2"
                style={{ backgroundColor: accentColor }}
              >
                <Check size={20} color="white" />
                <Text className="text-white font-bold text-base">Simpan ke Diary</Text>
              </TouchableOpacity>
            </View>

          </Animated.View>
        )}
      </View>
    </SafeAreaView>
  );
}
