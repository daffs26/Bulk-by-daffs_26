import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { useAppState } from '@/hooks/useAppState';
import { Colors, Accent } from '@/constants/theme';
import { Camera, Image as ImageIcon, Sparkles, Check, RotateCcw } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeOut, Layout } from 'react-native-reanimated';

export default function CameraScanScreen() {
  const { addFoodLog, theme } = useAppState();
  const c = Colors[theme];
  const isDark = theme === 'dark';

  const [scanState, setScanState] = useState<'idle' | 'scanning' | 'result'>('idle');
  const [portionScale, setPortionScale] = useState(1.0);

  const mockBaseResult = {
    name: 'Nasi Rames Daging Rendang',
    calories: 520,
    protein: 26,
    carbs: 62,
    fat: 16,
  };

  const adjustedCalories = Math.round(mockBaseResult.calories * portionScale);
  const adjustedProtein = Math.round(mockBaseResult.protein * portionScale);
  const adjustedCarbs = Math.round(mockBaseResult.carbs * portionScale);
  const adjustedFat = Math.round(mockBaseResult.fat * portionScale);

  const triggerScan = () => {
    setScanState('scanning');
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
      mealType: 'lunch',
    });
    Alert.alert('Log Berhasil', 'Makanan hasil scan AI berhasil dicatat di Diary Makan Siang!');
    setScanState('idle');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.bg }}>
      {/* Header */}
      <View style={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 8 }}>
        <Text style={{
          fontSize: 22,
          fontFamily: 'Outfit_800ExtraBold',
          color: c.text,
          letterSpacing: -0.3,
        }}>
          AI <Text style={{ color: Accent.primary }}>Scan</Text> Porsi
        </Text>
        <Text style={{
          fontSize: 12,
          fontFamily: 'Outfit_500Medium',
          color: c.textMuted,
          marginTop: 4,
          letterSpacing: 0.2,
        }}>
          Deteksi porsi & makro makanan via foto
        </Text>
      </View>

      <View style={{ flex: 1, paddingHorizontal: 20, paddingVertical: 16, justifyContent: 'center' }}>

        {/* ── IDLE State ── */}
        {scanState === 'idle' && (
          <Animated.View entering={FadeIn} exiting={FadeOut} style={{ flex: 1, justifyContent: 'space-between', paddingVertical: 16 }}>
            {/* Camera Viewfinder */}
            <View style={{
              flex: 1,
              borderRadius: 24,
              borderWidth: 2,
              borderStyle: 'dashed',
              borderColor: c.border,
              backgroundColor: isDark ? '#0A0A0B' : '#F0F0F0',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              position: 'relative',
            }}>
              {/* Corner brackets */}
              <View style={{ position: 'absolute', top: 24, left: 24, width: 28, height: 28, borderTopWidth: 3, borderLeftWidth: 3, borderColor: Accent.primary, borderTopLeftRadius: 6 }} />
              <View style={{ position: 'absolute', top: 24, right: 24, width: 28, height: 28, borderTopWidth: 3, borderRightWidth: 3, borderColor: Accent.primary, borderTopRightRadius: 6 }} />
              <View style={{ position: 'absolute', bottom: 24, left: 24, width: 28, height: 28, borderBottomWidth: 3, borderLeftWidth: 3, borderColor: Accent.primary, borderBottomLeftRadius: 6 }} />
              <View style={{ position: 'absolute', bottom: 24, right: 24, width: 28, height: 28, borderBottomWidth: 3, borderRightWidth: 3, borderColor: Accent.primary, borderBottomRightRadius: 6 }} />

              <Camera size={48} color={c.textMuted} />
              <Text style={{
                fontSize: 12,
                fontFamily: 'Outfit_500Medium',
                color: c.textMuted,
                marginTop: 16,
                textAlign: 'center',
                paddingHorizontal: 32,
                lineHeight: 20,
              }}>
                Posisikan piring makanan tepat di dalam kotak pembatas.
              </Text>
            </View>

            {/* Tips card */}
            <View style={{
              padding: 16,
              borderRadius: 18,
              backgroundColor: Accent.pale,
              borderWidth: 1,
              borderColor: Accent.glow,
              marginTop: 16,
            }}>
              <Text style={{
                fontSize: 12,
                fontFamily: 'Outfit_600SemiBold',
                color: Accent.primary,
                marginBottom: 4,
              }}>
                💡 Tips Akurasi Porsi
              </Text>
              <Text style={{
                fontSize: 11,
                fontFamily: 'Outfit_500Medium',
                color: isDark ? 'rgba(255,140,51,0.7)' : 'rgba(224,92,0,0.8)',
                lineHeight: 18,
              }}>
                Letakkan tangan atau koin di sebelah piring sebagai acuan skala agar AI dapat menghitung porsi lebih presisi.
              </Text>
            </View>

            {/* Action buttons */}
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
              <TouchableOpacity style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                paddingVertical: 16,
                borderRadius: 14,
                backgroundColor: c.surface2,
                borderWidth: 1,
                borderColor: c.border,
              }}>
                <ImageIcon size={18} color={c.text} />
                <Text style={{ fontFamily: 'Outfit_600SemiBold', fontSize: 14, color: c.text }}>Galeri</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={triggerScan} style={{ flex: 1 }}>
                <LinearGradient
                  colors={[Accent.primary, Accent.primaryDark]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    paddingVertical: 16,
                    borderRadius: 14,
                  }}
                >
                  <Sparkles size={18} color="white" />
                  <Text style={{ fontFamily: 'Outfit_600SemiBold', fontSize: 14, color: '#FFF' }}>Ambil Foto</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}

        {/* ── SCANNING State ── */}
        {scanState === 'scanning' && (
          <Animated.View entering={FadeIn} exiting={FadeOut} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator size="large" color={Accent.primary} />
            <Text style={{
              fontSize: 16,
              fontFamily: 'Outfit_600SemiBold',
              color: c.text,
              marginTop: 24,
              letterSpacing: -0.2,
            }}>
              Menganalisis Foto Makanan...
            </Text>
            <Text style={{
              fontSize: 12,
              fontFamily: 'Outfit_500Medium',
              color: c.textMuted,
              marginTop: 6,
            }}>
              Mengestimasi porsi & volume makro
            </Text>
          </Animated.View>
        )}

        {/* ── RESULT State ── */}
        {scanState === 'result' && (
          <Animated.View entering={FadeIn} layout={Layout.springify()} style={{ flex: 1, justifyContent: 'space-between', paddingVertical: 8 }}>

            {/* Mock image */}
            <View style={{
              height: 160,
              borderRadius: 18,
              backgroundColor: isDark ? '#0F0F11' : '#E4E4E7',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
              position: 'relative',
            }}>
              <ImageIcon size={36} color={c.textMuted} />
              <Text style={{ fontSize: 11, fontFamily: 'Outfit_500Medium', color: c.textMuted, marginTop: 8 }}>Hasil Foto Teranalisis</Text>
              <View style={{
                position: 'absolute',
                bottom: 10,
                left: 10,
                backgroundColor: 'rgba(0,0,0,0.6)',
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 6,
              }}>
                <Text style={{ color: '#FFF', fontSize: 10, fontFamily: 'Outfit_600SemiBold' }}>Skala Referensi Terdeteksi</Text>
              </View>
            </View>

            {/* Result card */}
            <View style={{
              flex: 1,
              backgroundColor: c.surface,
              borderWidth: 1,
              borderColor: c.border,
              borderRadius: 24,
              padding: 24,
              justifyContent: 'space-between',
              marginBottom: 16,
            }}>
              <View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  <Sparkles size={14} color={Accent.primary} />
                  <Text style={{
                    fontSize: 11,
                    fontFamily: 'Outfit_600SemiBold',
                    color: Accent.primary,
                    letterSpacing: 0.3,
                    textTransform: 'uppercase',
                  }}>
                    AI Detection Success
                  </Text>
                </View>

                <Text style={{
                  fontSize: 18,
                  fontFamily: 'Outfit_800ExtraBold',
                  color: c.text,
                  letterSpacing: -0.3,
                }}>
                  {mockBaseResult.name}
                </Text>

                <Text style={{
                  fontSize: 36,
                  fontFamily: 'Outfit_800ExtraBold',
                  color: c.text,
                  marginTop: 12,
                  letterSpacing: -1,
                }}>
                  {adjustedCalories}{' '}
                  <Text style={{ fontSize: 14, fontFamily: 'Outfit_500Medium', color: c.textSub }}>kcal</Text>
                </Text>

                {/* Macro breakdown */}
                <View style={{
                  flexDirection: 'row',
                  gap: 24,
                  marginTop: 16,
                  paddingVertical: 12,
                  borderTopWidth: 1,
                  borderBottomWidth: 1,
                  borderColor: c.border,
                }}>
                  {[
                    { label: 'Protein', value: adjustedProtein, color: Accent.primary },
                    { label: 'Karbo', value: adjustedCarbs, color: '#3B82F6' },
                    { label: 'Lemak', value: adjustedFat, color: '#F59E0B' },
                  ].map((m) => (
                    <View key={m.label}>
                      <Text style={{
                        fontSize: 10,
                        fontFamily: 'Outfit_600SemiBold',
                        color: c.textMuted,
                        letterSpacing: 0.6,
                        textTransform: 'uppercase',
                        marginBottom: 2,
                      }}>
                        {m.label}
                      </Text>
                      <Text style={{
                        fontSize: 14,
                        fontFamily: 'Outfit_800ExtraBold',
                        color: m.color,
                        letterSpacing: -0.3,
                      }}>
                        {m.value}g
                      </Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Portion adjustment */}
              <View style={{ marginTop: 16 }}>
                <Text style={{
                  fontSize: 12,
                  fontFamily: 'Outfit_600SemiBold',
                  color: c.text,
                  marginBottom: 10,
                }}>
                  Sesuaikan Porsi:{' '}
                  <Text style={{ fontFamily: 'Outfit_800ExtraBold', color: Accent.primary }}>
                    {portionScale.toFixed(1)}x
                  </Text>
                </Text>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <TouchableOpacity
                    onPress={() => setPortionScale((p) => Math.max(0.5, p - 0.1))}
                    style={portionBtnStyle(c)}
                  >
                    <Text style={portionBtnTextStyle(c)}>-0.1x</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setPortionScale(1.0)}
                    style={portionBtnStyle(c)}
                  >
                    <Text style={portionBtnTextStyle(c)}>Reset</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setPortionScale((p) => Math.min(3.0, p + 0.1))}
                    style={portionBtnStyle(c)}
                  >
                    <Text style={portionBtnTextStyle(c)}>+0.1x</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Save buttons */}
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity
                onPress={() => setScanState('idle')}
                style={{
                  paddingHorizontal: 20,
                  paddingVertical: 16,
                  borderRadius: 14,
                  backgroundColor: c.surface2,
                  borderWidth: 1,
                  borderColor: c.border,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <RotateCcw size={18} color={c.text} />
              </TouchableOpacity>

              <TouchableOpacity onPress={handleSaveResult} style={{ flex: 1 }}>
                <LinearGradient
                  colors={[Accent.primary, Accent.primaryDark]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    paddingVertical: 16,
                    borderRadius: 14,
                  }}
                >
                  <Check size={18} color="white" />
                  <Text style={{ fontFamily: 'Outfit_600SemiBold', fontSize: 15, color: '#FFF' }}>Simpan ke Diary</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}
      </View>
    </SafeAreaView>
  );
}

const portionBtnStyle = (c: typeof Colors.dark) => ({
  flex: 1 as const,
  paddingVertical: 10,
  borderRadius: 10,
  alignItems: 'center' as const,
  backgroundColor: c.surface2,
  borderWidth: 1,
  borderColor: c.border,
});

const portionBtnTextStyle = (c: typeof Colors.dark) => ({
  fontSize: 12,
  fontFamily: 'Outfit_600SemiBold' as const,
  color: c.text,
});
