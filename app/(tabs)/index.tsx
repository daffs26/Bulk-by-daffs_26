import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StyleSheet } from 'react-native';
import { useAppState } from '@/hooks/useAppState';
import { Colors, Accent } from '@/constants/theme';
import { Flame, Droplet, FlameKindling, Plus, Zap } from 'lucide-react-native';
import Svg, { Circle } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';

/* ── Circular Macro Ring Component ── */
function MacroRing({
  label,
  current,
  target,
  color,
  textColor,
}: {
  label: string;
  current: number;
  target: number;
  color: string;
  textColor: string;
}) {
  const pct = target > 0 ? Math.min((current / target) * 100, 100) : 0;
  const r = 26;
  const strokeWidth = 5;
  const size = 72;
  const circumference = 2 * Math.PI * r;
  const dash = (pct / 100) * circumference;

  return (
    <View style={{ alignItems: 'center', gap: 6 }}>
      <View style={{ width: size, height: size, position: 'relative' }}>
        <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={strokeWidth}
          />
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${dash} ${circumference - dash}`}
            strokeLinecap="round"
          />
        </Svg>
        <View style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center' }]}>
          <Text style={{
            fontSize: 13,
            fontFamily: 'Outfit_800ExtraBold',
            color: textColor,
            letterSpacing: -0.3,
          }}>
            {Math.round(pct)}%
          </Text>
        </View>
      </View>
      <View style={{ alignItems: 'center' }}>
        <Text style={{
          fontSize: 14,
          fontFamily: 'Outfit_800ExtraBold',
          color: textColor,
          letterSpacing: -0.3,
        }}>
          {current}g
        </Text>
        <Text style={{
          fontSize: 10,
          fontFamily: 'Outfit_600SemiBold',
          color: 'rgba(255,255,255,0.4)',
          letterSpacing: 0.6,
          textTransform: 'uppercase',
        }}>
          {label}
        </Text>
      </View>
    </View>
  );
}

export default function DashboardScreen() {
  const {
    userProfile,
    foodLogs,
    waterLoggedMl,
    addWater,
    resetWater,
    streak,
    theme,
  } = useAppState();

  const isDark = theme === 'dark';
  const c = Colors[theme];

  const today = new Date().toISOString().split('T')[0];

  // Calculate calories and macros eaten today
  const todayFoods = foodLogs.filter((f) => f.date === today);
  const caloriesEaten = todayFoods.reduce((acc, f) => acc + f.calories, 0);
  const proteinEaten = todayFoods.reduce((acc, f) => acc + f.protein, 0);
  const carbsEaten = todayFoods.reduce((acc, f) => acc + f.carbs, 0);
  const fatEaten = todayFoods.reduce((acc, f) => acc + f.fat, 0);

  const targetCalories = userProfile?.targetCalories || 2000;
  const targetProtein = userProfile?.targetMacros.protein || 120;
  const targetCarbs = userProfile?.targetMacros.carb || 200;
  const targetFat = userProfile?.targetMacros.fat || 65;

  const waterGoal = userProfile ? Math.round(userProfile.weightCurrent * 0.033 * 1000) : 2000;

  const caloriesRemaining = Math.max(0, targetCalories - caloriesEaten);
  const caloriePercent = Math.min(1, caloriesEaten / targetCalories);
  const waterPercent = Math.min(1, waterLoggedMl / waterGoal);

  const handleAddWater = (ml: number) => {
    addWater(ml);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} style={{ paddingHorizontal: 20, paddingTop: 20 }}>

        {/* ── Header ── */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <View>
            <Text style={{
              fontSize: 10,
              fontFamily: 'Outfit_600SemiBold',
              color: c.textMuted,
              letterSpacing: 0.8,
              textTransform: 'uppercase',
              marginBottom: 4,
            }}>
              Welcome Back
            </Text>
            <Text style={{
              fontSize: 22,
              fontFamily: 'Outfit_800ExtraBold',
              color: c.text,
              letterSpacing: -0.3,
            }}>
              BULK <Text style={{ color: Accent.primary }}>Dashboard</Text>
            </Text>
          </View>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 5,
            backgroundColor: Accent.pale,
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 999,
          }}>
            <FlameKindling size={14} color={Accent.primary} />
            <Text style={{
              fontSize: 12,
              fontFamily: 'Outfit_800ExtraBold',
              color: Accent.primary,
              letterSpacing: -0.2,
            }}>
              {streak} Days
            </Text>
          </View>
        </View>

        {/* ── Calorie Hero Card (Gradient Orange) ── */}
        <View>
          <LinearGradient
            colors={[Accent.primary, Accent.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: 24,
              padding: 24,
              marginBottom: 16,
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <View>
                <Text style={{
                  fontSize: 10,
                  fontFamily: 'Outfit_600SemiBold',
                  color: 'rgba(255,255,255,0.7)',
                  letterSpacing: 0.8,
                  textTransform: 'uppercase',
                  marginBottom: 8,
                }}>
                  Energy Balance
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4 }}>
                  <Text style={{
                    fontSize: 52,
                    fontFamily: 'Outfit_800ExtraBold',
                    color: '#FFFFFF',
                    lineHeight: 56,
                    letterSpacing: -1.5,
                  }}>
                    {caloriesEaten}
                  </Text>
                  <Text style={{
                    fontSize: 15,
                    fontFamily: 'Outfit_500Medium',
                    color: 'rgba(255,255,255,0.75)',
                  }}>
                    / {targetCalories} kcal
                  </Text>
                </View>
              </View>
              <View style={{ opacity: 0.75 }}>
                <Flame color="white" size={48} />
              </View>
            </View>

            {/* Progress bar */}
            <View style={{
              height: 6,
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: 999,
              marginTop: 20,
              overflow: 'hidden',
            }}>
              <View style={{
                height: '100%',
                width: `${caloriePercent * 100}%`,
                backgroundColor: '#FFFFFF',
                borderRadius: 999,
              }} />
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
              <Text style={{
                fontSize: 12,
                fontFamily: 'Outfit_500Medium',
                color: 'rgba(255,255,255,0.6)',
              }}>
                Target: {targetCalories} kcal
              </Text>
              <Text style={{
                fontSize: 12,
                fontFamily: 'Outfit_800ExtraBold',
                color: '#FFFFFF',
              }}>
                Remaining: {caloriesRemaining} kcal
              </Text>
            </View>
          </LinearGradient>
        </View>

        {/* ── Macro Rings Card ── */}
        <View>
          <View style={{
            backgroundColor: c.surface,
            borderColor: c.border,
            borderWidth: 1,
            borderRadius: 24,
            padding: 24,
            marginBottom: 16,
          }}>
            <Text style={{
              fontSize: 13,
              fontFamily: 'Outfit_600SemiBold',
              color: c.text,
              letterSpacing: 0.2,
              marginBottom: 20,
            }}>
              Nutrients Distribution
            </Text>

            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
              <MacroRing
                label="Protein"
                current={proteinEaten}
                target={targetProtein}
                color={Accent.primary}
                textColor={c.text}
              />
              <MacroRing
                label="Carbs"
                current={carbsEaten}
                target={targetCarbs}
                color="#3B82F6"
                textColor={c.text}
              />
              <MacroRing
                label="Fat"
                current={fatEaten}
                target={targetFat}
                color="#F59E0B"
                textColor={c.text}
              />
            </View>
          </View>
        </View>

        {/* ── Water Tracker ── */}
        <View>
          <View style={{
            backgroundColor: c.surface,
            borderColor: c.border,
            borderWidth: 1,
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
                  Water Intake
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4 }}>
                  <Text style={{
                    fontSize: 28,
                    fontFamily: 'Outfit_800ExtraBold',
                    color: c.text,
                    letterSpacing: -0.8,
                  }}>
                    {waterLoggedMl}
                  </Text>
                  <Text style={{
                    fontSize: 13,
                    fontFamily: 'Outfit_500Medium',
                    color: c.textSub,
                  }}>
                    / {waterGoal} ml
                  </Text>
                </View>
              </View>
              <View>
                <Droplet color={Accent.primary} size={32} />
              </View>
            </View>

            {/* Water progress */}
            <View style={{
              height: 6,
              backgroundColor: c.surface3,
              borderRadius: 999,
              marginBottom: 16,
              overflow: 'hidden',
            }}>
              <View style={{
                height: '100%',
                width: `${waterPercent * 100}%`,
                backgroundColor: Accent.primary,
                borderRadius: 999,
              }} />
            </View>

            {/* Water buttons */}
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity
                onPress={() => handleAddWater(250)}
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4,
                  paddingVertical: 12,
                  borderRadius: 14,
                  backgroundColor: c.surface2,
                  borderWidth: 1,
                  borderColor: c.border,
                }}
              >
                <Plus size={14} color={c.text} />
                <Text style={{
                  fontSize: 12,
                  fontFamily: 'Outfit_600SemiBold',
                  color: c.text,
                }}>
                  +250ml
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleAddWater(500)}
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4,
                  paddingVertical: 12,
                  borderRadius: 14,
                  backgroundColor: c.surface2,
                  borderWidth: 1,
                  borderColor: c.border,
                }}
              >
                <Plus size={14} color={c.text} />
                <Text style={{
                  fontSize: 12,
                  fontFamily: 'Outfit_600SemiBold',
                  color: c.text,
                }}>
                  +500ml
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={resetWater}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  borderRadius: 14,
                  backgroundColor: 'rgba(239, 68, 68, 0.12)',
                }}
              >
                <Text style={{
                  fontSize: 12,
                  fontFamily: 'Outfit_600SemiBold',
                  color: '#EF4444',
                }}>
                  Reset
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* ── Daily Lifestyle Tip ── */}
        <View>
          <View style={{
            borderRadius: 24,
            padding: 20,
            backgroundColor: Accent.pale,
            borderWidth: 1,
            borderColor: Accent.glow,
            borderLeftWidth: 4,
            borderLeftColor: Accent.primary,
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <Zap size={14} color={Accent.primary} />
              <Text style={{
                fontSize: 13,
                fontFamily: 'Outfit_600SemiBold',
                color: Accent.primary,
                letterSpacing: 0.2,
              }}>
                Daily Lifestyle Tip
              </Text>
            </View>
            <Text style={{
              fontSize: 12,
              fontFamily: 'Outfit_500Medium',
              color: isDark ? 'rgba(255, 140, 51, 0.7)' : 'rgba(224, 92, 0, 0.8)',
              lineHeight: 20,
            }}>
              Untuk memaksimalkan goal {userProfile?.goal.toUpperCase() || 'MAINTENANCE'} kamu, pastikan tidur 7-8 jam malam ini dan pertahankan asupan air minum harianmu.
            </Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
