import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, SafeAreaView, Alert } from 'react-native';
import { useAppState } from '@/hooks/useAppState';
import { Colors, Accent } from '@/constants/theme';
import { Scale, Plus, Calendar, ChevronRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function ProgressScreen() {
  const { userProfile, foodLogs, weightLogs, addWeightLog, theme } = useAppState();
  const c = Colors[theme];
  const isDark = theme === 'dark';

  const [inputWeight, setInputWeight] = useState('');

  const currentWeight = userProfile?.weightCurrent || 70;
  const targetWeight = userProfile?.weightTarget || 65;
  const startWeight = weightLogs.length > 0 ? weightLogs[weightLogs.length - 1].weight : currentWeight;

  let progressPercent = 0;
  const totalDifference = startWeight - targetWeight;
  const completedDifference = startWeight - currentWeight;
  if (totalDifference !== 0) {
    progressPercent = Math.min(100, Math.max(0, Math.round((completedDifference / totalDifference) * 100)));
  }

  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('id-ID', { weekday: 'short' });
    const dayFoods = foodLogs.filter((f) => f.date === dateStr);
    const calSum = dayFoods.reduce((acc, f) => acc + f.calories, 0);
    const mockVals = [1850, 2100, 1950, 1600, 2250, 1800, calSum];
    const finalVal = calSum > 0 ? calSum : mockVals[i % mockVals.length];
    return { date: dateStr, day: dayName, calories: finalVal };
  }).reverse();

  const maxCalories = Math.max(...last7Days.map((d) => d.calories), userProfile?.targetCalories || 2000);

  const handleLogWeight = async () => {
    const weightNum = parseFloat(inputWeight);
    if (isNaN(weightNum) || weightNum < 30 || weightNum > 300) {
      Alert.alert('Input Error', 'Harap isi berat badan yang valid (30-300 kg).');
      return;
    }
    await addWeightLog(weightNum);
    setInputWeight('');
    Alert.alert('Sukses', `Berat badan ${weightNum} kg berhasil dicatat.`);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} style={{ paddingHorizontal: 20, paddingTop: 20 }}>

        {/* Header */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{
            fontSize: 22,
            fontFamily: 'Outfit_800ExtraBold',
            color: c.text,
            letterSpacing: -0.3,
          }}>
            Progress & <Text style={{ color: Accent.primary }}>Grafik</Text>
          </Text>
          <Text style={{
            fontSize: 12,
            fontFamily: 'Outfit_500Medium',
            color: c.textMuted,
            marginTop: 4,
            letterSpacing: 0.2,
          }}>
            Statistik pencapaian tubuh kamu
          </Text>
        </View>

        {/* ── Weight Progress Card ── */}
        <Animated.View entering={FadeInDown.duration(400)}>
          <View style={{
            backgroundColor: c.surface,
            borderWidth: 1,
            borderColor: c.border,
            borderRadius: 24,
            padding: 24,
            marginBottom: 16,
          }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <View>
                <Text style={{
                  fontSize: 10,
                  fontFamily: 'Outfit_600SemiBold',
                  color: c.textMuted,
                  letterSpacing: 0.8,
                  textTransform: 'uppercase',
                  marginBottom: 4,
                }}>
                  Weight Progression
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4 }}>
                  <Text style={{
                    fontSize: 36,
                    fontFamily: 'Outfit_800ExtraBold',
                    color: c.text,
                    letterSpacing: -1,
                  }}>
                    {currentWeight}
                  </Text>
                  <Text style={{
                    fontSize: 14,
                    fontFamily: 'Outfit_500Medium',
                    color: c.textSub,
                  }}>
                    kg
                  </Text>
                </View>
              </View>
              <Scale color={Accent.primary} size={28} />
            </View>

            {/* Progress bar */}
            <View style={{ marginBottom: 16 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                <Text style={{ fontSize: 11, fontFamily: 'Outfit_500Medium', color: c.textMuted }}>Start: {startWeight} kg</Text>
                <Text style={{ fontSize: 11, fontFamily: 'Outfit_800ExtraBold', color: Accent.primary }}>{progressPercent}%</Text>
                <Text style={{ fontSize: 11, fontFamily: 'Outfit_500Medium', color: c.textMuted }}>Target: {targetWeight} kg</Text>
              </View>
              <View style={{ height: 6, backgroundColor: c.surface3, borderRadius: 999, overflow: 'hidden' }}>
                <LinearGradient
                  colors={[Accent.primary, Accent.primaryLight]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    height: '100%',
                    width: `${progressPercent}%`,
                    borderRadius: 999,
                  }}
                />
              </View>
            </View>

            {/* Quick weight input */}
            <View style={{
              flexDirection: 'row',
              gap: 10,
              alignItems: 'center',
              paddingTop: 12,
              borderTopWidth: 1,
              borderTopColor: c.border,
            }}>
              <TextInput
                placeholder="Log berat baru..."
                placeholderTextColor={c.textMuted}
                keyboardType="numeric"
                value={inputWeight}
                onChangeText={setInputWeight}
                style={{
                  flex: 1,
                  paddingHorizontal: 16,
                  height: 40,
                  borderRadius: 14,
                  backgroundColor: c.surface2,
                  borderWidth: 1,
                  borderColor: c.border,
                  fontFamily: 'Outfit_500Medium',
                  fontSize: 13,
                  color: c.text,
                }}
              />
              <TouchableOpacity
                onPress={handleLogWeight}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 4,
                  paddingHorizontal: 16,
                  height: 40,
                  borderRadius: 14,
                  backgroundColor: Accent.primary,
                }}
              >
                <Plus size={14} color="white" />
                <Text style={{ fontSize: 12, fontFamily: 'Outfit_600SemiBold', color: '#FFF' }}>Catat</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        {/* ── Bar Chart Card ── */}
        <Animated.View entering={FadeInDown.duration(450)}>
          <View style={{
            backgroundColor: c.surface,
            borderWidth: 1,
            borderColor: c.border,
            borderRadius: 24,
            padding: 24,
            marginBottom: 16,
          }}>
            <Text style={{
              fontSize: 13,
              fontFamily: 'Outfit_600SemiBold',
              color: c.text,
              letterSpacing: 0.2,
              marginBottom: 24,
            }}>
              Calorie Tracker (Last 7 Days)
            </Text>

            {/* Chart */}
            <View style={{
              height: 140,
              flexDirection: 'row',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              paddingHorizontal: 4,
              marginBottom: 12,
            }}>
              {last7Days.map((day, idx) => {
                const barHeight = Math.max(8, Math.round((day.calories / maxCalories) * 120));
                const isToday = idx === 6;

                return (
                  <View key={day.date} style={{ alignItems: 'center', flex: 1 }}>
                    {isToday ? (
                      <LinearGradient
                        colors={[Accent.primaryLight, Accent.primary]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                        style={{
                          height: barHeight,
                          width: 16,
                          borderTopLeftRadius: 4,
                          borderTopRightRadius: 4,
                        }}
                      />
                    ) : (
                      <View style={{
                        height: barHeight,
                        width: 16,
                        borderTopLeftRadius: 4,
                        borderTopRightRadius: 4,
                        backgroundColor: c.surface3,
                      }} />
                    )}
                    <Text style={{
                      fontSize: 10,
                      fontFamily: 'Outfit_600SemiBold',
                      marginTop: 8,
                      color: isToday ? Accent.primary : c.textMuted,
                      letterSpacing: 0.2,
                    }}>
                      {day.day}
                    </Text>
                  </View>
                );
              })}
            </View>

            {/* Chart legend */}
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTopWidth: 1,
              borderTopColor: c.border,
              paddingTop: 12,
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: Accent.primary }} />
                <Text style={{ fontSize: 11, fontFamily: 'Outfit_500Medium', color: c.textMuted }}>Hari ini</Text>
              </View>
              <Text style={{
                fontSize: 12,
                fontFamily: 'Outfit_600SemiBold',
                color: c.text,
                letterSpacing: -0.2,
              }}>
                Avg: {Math.round(last7Days.reduce((acc, d) => acc + d.calories, 0) / 7)} kcal/day
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* ── Weight Log History ── */}
        <Animated.View entering={FadeInDown.duration(500)}>
          <View style={{
            backgroundColor: c.surface,
            borderWidth: 1,
            borderColor: c.border,
            borderRadius: 24,
            padding: 24,
          }}>
            <Text style={{
              fontSize: 13,
              fontFamily: 'Outfit_600SemiBold',
              color: c.text,
              letterSpacing: 0.2,
              marginBottom: 16,
            }}>
              Log History
            </Text>

            {weightLogs.slice(0, 4).map((log, idx) => (
              <View
                key={log.id || idx}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingVertical: 10,
                  borderBottomWidth: idx < Math.min(weightLogs.length, 4) - 1 ? 1 : 0,
                  borderBottomColor: c.border,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Calendar size={14} color={c.textMuted} />
                  <Text style={{
                    fontSize: 12,
                    fontFamily: 'Outfit_500Medium',
                    color: c.textSub,
                  }}>
                    {log.date}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={{
                    fontSize: 13,
                    fontFamily: 'Outfit_800ExtraBold',
                    color: c.text,
                    letterSpacing: -0.3,
                  }}>
                    {log.weight} kg
                  </Text>
                  <ChevronRight size={12} color={c.textMuted} />
                </View>
              </View>
            ))}
          </View>
        </Animated.View>

      </ScrollView>
    </SafeAreaView>
  );
}
