import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, SafeAreaView, FlatList, Modal, Alert } from 'react-native';
import { useAppState, FoodLog } from '@/hooks/useAppState';
import { FOOD_DATABASE, DBFood } from '@/constants/foods';
import { Colors, Accent } from '@/constants/theme';
import { Plus, Search, Trash2, X, ChevronRight, Edit3 } from 'lucide-react-native';
import Animated, { FadeIn, FadeOut, Layout } from 'react-native-reanimated';

const MEAL_COLORS: Record<string, string> = {
  breakfast: Accent.primary,
  lunch: '#3B82F6',
  dinner: '#A855F7',
  snack: '#F59E0B',
};

export default function FoodDiaryScreen() {
  const { foodLogs, addFoodLog, deleteFoodLog, theme } = useAppState();
  const c = Colors[theme];
  const isDark = theme === 'dark';
  const today = new Date().toISOString().split('T')[0];

  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMealType, setSelectedMealType] = useState<FoodLog['mealType']>('breakfast');

  const [isManualInput, setIsManualInput] = useState(false);
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');

  const todayFoods = foodLogs.filter((f) => f.date === today);

  const meals: { title: string; emoji: string; type: FoodLog['mealType'] }[] = [
    { title: 'Sarapan', emoji: '🍳', type: 'breakfast' },
    { title: 'Makan Siang', emoji: '☀️', type: 'lunch' },
    { title: 'Makan Malam', emoji: '🌙', type: 'dinner' },
    { title: 'Snack / Cemilan', emoji: '🍪', type: 'snack' },
  ];

  const filteredDBFoods = FOOD_DATABASE.filter((food) =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectDBFood = async (dbFood: DBFood) => {
    await addFoodLog({
      name: dbFood.name.split(' (')[0],
      calories: dbFood.calories,
      protein: dbFood.protein,
      carbs: dbFood.carbs,
      fat: dbFood.fat,
      mealType: selectedMealType,
    });
    setModalVisible(false);
    setSearchQuery('');
    Alert.alert('Log Berhasil', `${dbFood.name} ditambahkan ke ${selectedMealType.toUpperCase()}`);
  };

  const handleSaveManual = async () => {
    const calNum = parseInt(calories);
    const protNum = parseFloat(protein || '0');
    const carbNum = parseFloat(carbs || '0');
    const fatNum = parseFloat(fat || '0');

    if (!foodName.trim() || isNaN(calNum)) {
      Alert.alert('Input Error', 'Harap isi nama makanan dan jumlah kalori.');
      return;
    }

    await addFoodLog({
      name: foodName,
      calories: calNum,
      protein: protNum,
      carbs: carbNum,
      fat: fatNum,
      mealType: selectedMealType,
    });

    setFoodName('');
    setCalories('');
    setProtein('');
    setCarbs('');
    setFat('');
    setIsManualInput(false);
    setModalVisible(false);
  };

  const renderLoggedFoodItem = (item: FoodLog) => {
    const mealColor = MEAL_COLORS[item.mealType] || Accent.primary;
    return (
      <Animated.View
        layout={Layout.springify()}
        entering={FadeIn}
        exiting={FadeOut}
        key={item.id}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 16,
          borderRadius: 18,
          backgroundColor: c.surface,
          borderWidth: 1,
          borderColor: c.border,
          borderLeftWidth: 3,
          borderLeftColor: mealColor,
          marginBottom: 8,
        }}
      >
        <View style={{ flex: 1, paddingRight: 16 }}>
          <Text style={{
            fontFamily: 'Outfit_600SemiBold',
            fontSize: 14,
            color: c.text,
            letterSpacing: -0.1,
          }}>
            {item.name}
          </Text>
          <Text style={{
            fontSize: 11,
            fontFamily: 'Outfit_500Medium',
            color: c.textMuted,
            marginTop: 3,
            letterSpacing: 0.3,
          }}>
            P: {item.protein}g · K: {item.carbs}g · L: {item.fat}g
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Text style={{
            fontFamily: 'Outfit_800ExtraBold',
            fontSize: 13,
            color: c.text,
            letterSpacing: -0.3,
          }}>
            {item.calories} kcal
          </Text>
          <TouchableOpacity onPress={() => deleteFoodLog(item.id)} hitSlop={8}>
            <Trash2 size={15} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
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
          Diary <Text style={{ color: Accent.primary }}>Makanan</Text>
        </Text>
        <Text style={{
          fontSize: 12,
          fontFamily: 'Outfit_500Medium',
          color: c.textMuted,
          marginTop: 4,
          letterSpacing: 0.2,
        }}>
          Catat konsumsi makanan hari ini
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} style={{ paddingHorizontal: 20 }}>
        {meals.map((meal) => {
          const mealLogs = todayFoods.filter((f) => f.mealType === meal.type);
          const mealCalories = mealLogs.reduce((acc, f) => acc + f.calories, 0);
          const mealColor = MEAL_COLORS[meal.type];

          return (
            <View key={meal.type} style={{ marginTop: 20 }}>
              {/* Meal header */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <View style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: mealColor,
                  }} />
                  <View>
                    <Text style={{
                      fontSize: 15,
                      fontFamily: 'Outfit_600SemiBold',
                      color: c.text,
                      letterSpacing: -0.1,
                    }}>
                      {meal.emoji} {meal.title}
                    </Text>
                    <Text style={{
                      fontSize: 11,
                      fontFamily: 'Outfit_500Medium',
                      color: c.textMuted,
                      letterSpacing: 0.2,
                    }}>
                      {mealCalories} kcal
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedMealType(meal.type);
                    setModalVisible(true);
                  }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 4,
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 10,
                    backgroundColor: Accent.pale,
                  }}
                >
                  <Plus size={14} color={Accent.primary} />
                  <Text style={{
                    fontSize: 12,
                    fontFamily: 'Outfit_600SemiBold',
                    color: Accent.primary,
                  }}>
                    Tambah
                  </Text>
                </TouchableOpacity>
              </View>

              {mealLogs.length > 0 ? (
                <View>{mealLogs.map(renderLoggedFoodItem)}</View>
              ) : (
                <View style={{
                  padding: 16,
                  borderRadius: 18,
                  borderWidth: 1,
                  borderStyle: 'dashed',
                  borderColor: c.border,
                  backgroundColor: isDark ? 'rgba(22,22,24,0.4)' : 'rgba(244,244,245,0.4)',
                }}>
                  <Text style={{
                    fontSize: 12,
                    fontFamily: 'Outfit_500Medium',
                    color: c.textMuted,
                  }}>
                    Belum ada makanan dicatat.
                  </Text>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>

      {/* ── Modal ── */}
      <Modal animationType="slide" transparent visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.75)' }}>
          <View style={{
            height: '80%',
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            backgroundColor: c.surface,
            padding: 24,
            borderTopWidth: 1,
            borderTopColor: c.border,
          }}>
            {/* Modal handle */}
            <View style={{
              width: 40,
              height: 4,
              backgroundColor: c.surface3,
              borderRadius: 999,
              alignSelf: 'center',
              marginBottom: 20,
            }} />

            {/* Modal header */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Text style={{
                fontSize: 18,
                fontFamily: 'Outfit_800ExtraBold',
                color: c.text,
                letterSpacing: -0.3,
              }}>
                Tambah Ke {selectedMealType.toUpperCase()}
              </Text>
              <TouchableOpacity onPress={() => { setModalVisible(false); setIsManualInput(false); }}>
                <X color={c.textSub} size={20} />
              </TouchableOpacity>
            </View>

            {/* Toggle tabs */}
            <View style={{
              flexDirection: 'row',
              gap: 8,
              backgroundColor: c.surface2,
              borderRadius: 14,
              padding: 4,
              marginBottom: 16,
            }}>
              <TouchableOpacity
                onPress={() => setIsManualInput(false)}
                style={{
                  flex: 1,
                  paddingVertical: 10,
                  borderRadius: 10,
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  gap: 6,
                  backgroundColor: !isManualInput ? Accent.primary : 'transparent',
                }}
              >
                <Search size={14} color={!isManualInput ? '#FFF' : c.textMuted} />
                <Text style={{
                  fontSize: 12,
                  fontFamily: 'Outfit_600SemiBold',
                  color: !isManualInput ? '#FFF' : c.textMuted,
                }}>
                  Database
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setIsManualInput(true)}
                style={{
                  flex: 1,
                  paddingVertical: 10,
                  borderRadius: 10,
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  gap: 6,
                  backgroundColor: isManualInput ? Accent.primary : 'transparent',
                }}
              >
                <Edit3 size={14} color={isManualInput ? '#FFF' : c.textMuted} />
                <Text style={{
                  fontSize: 12,
                  fontFamily: 'Outfit_600SemiBold',
                  color: isManualInput ? '#FFF' : c.textMuted,
                }}>
                  Manual
                </Text>
              </TouchableOpacity>
            </View>

            {/* Search mode */}
            {!isManualInput ? (
              <View style={{ flex: 1 }}>
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 14,
                  borderRadius: 14,
                  backgroundColor: c.surface2,
                  borderWidth: 1,
                  borderColor: c.border,
                  marginBottom: 16,
                }}>
                  <Search size={16} color={c.textMuted} />
                  <TextInput
                    placeholder="Cari makanan (misal: Nasi, Telur)..."
                    placeholderTextColor={c.textMuted}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    style={{
                      flex: 1,
                      height: 44,
                      marginLeft: 8,
                      fontFamily: 'Outfit_500Medium',
                      fontSize: 14,
                      color: c.text,
                    }}
                  />
                </View>
                <FlatList
                  data={filteredDBFoods}
                  keyExtractor={(item) => item.id}
                  contentContainerStyle={{ paddingBottom: 20 }}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => handleSelectDBFood(item)}
                      style={{
                        paddingVertical: 14,
                        paddingHorizontal: 16,
                        borderRadius: 14,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderBottomWidth: 1,
                        borderBottomColor: isDark ? 'rgba(42,42,46,0.4)' : c.border,
                      }}
                    >
                      <View style={{ flex: 1, paddingRight: 16 }}>
                        <Text style={{
                          fontSize: 14,
                          fontFamily: 'Outfit_600SemiBold',
                          color: c.text,
                          letterSpacing: -0.1,
                        }}>
                          {item.name}
                        </Text>
                        <Text style={{
                          fontSize: 11,
                          fontFamily: 'Outfit_500Medium',
                          color: c.textMuted,
                          marginTop: 2,
                        }}>
                          P: {item.protein}g · K: {item.carbs}g · L: {item.fat}g
                        </Text>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        <Text style={{
                          fontSize: 13,
                          fontFamily: 'Outfit_800ExtraBold',
                          color: c.text,
                          letterSpacing: -0.3,
                        }}>
                          {item.calories} kcal
                        </Text>
                        <ChevronRight size={14} color={c.textMuted} />
                      </View>
                    </TouchableOpacity>
                  )}
                />
              </View>
            ) : (
              /* Manual entry */
              <ScrollView style={{ flex: 1 }}>
                <View style={{ gap: 14 }}>
                  <View>
                    <Text style={inputLabelStyle(c)}>Nama Makanan</Text>
                    <TextInput
                      placeholder="Contoh: Ayam Bakar Bumbu Rujak"
                      placeholderTextColor={c.textMuted}
                      value={foodName}
                      onChangeText={setFoodName}
                      style={inputStyle(c)}
                    />
                  </View>
                  <View>
                    <Text style={inputLabelStyle(c)}>Kalori (kcal)</Text>
                    <TextInput
                      placeholder="Contoh: 220"
                      placeholderTextColor={c.textMuted}
                      keyboardType="numeric"
                      value={calories}
                      onChangeText={setCalories}
                      style={inputStyle(c)}
                    />
                  </View>
                  <View style={{ flexDirection: 'row', gap: 10 }}>
                    <View style={{ flex: 1 }}>
                      <Text style={inputLabelStyle(c)}>Protein (g)</Text>
                      <TextInput placeholder="0" placeholderTextColor={c.textMuted} keyboardType="numeric" value={protein} onChangeText={setProtein} style={inputStyle(c)} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={inputLabelStyle(c)}>Karbo (g)</Text>
                      <TextInput placeholder="0" placeholderTextColor={c.textMuted} keyboardType="numeric" value={carbs} onChangeText={setCarbs} style={inputStyle(c)} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={inputLabelStyle(c)}>Lemak (g)</Text>
                      <TextInput placeholder="0" placeholderTextColor={c.textMuted} keyboardType="numeric" value={fat} onChangeText={setFat} style={inputStyle(c)} />
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={handleSaveManual}
                    style={{
                      paddingVertical: 16,
                      borderRadius: 14,
                      alignItems: 'center',
                      backgroundColor: Accent.primary,
                      marginTop: 16,
                    }}
                  >
                    <Text style={{
                      color: '#FFF',
                      fontFamily: 'Outfit_600SemiBold',
                      fontSize: 15,
                    }}>
                      Simpan Log
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

/* ── Shared input styles ── */
const inputLabelStyle = (c: typeof Colors.dark) => ({
  fontSize: 12,
  fontFamily: 'Outfit_600SemiBold' as const,
  color: c.text,
  marginBottom: 6,
  letterSpacing: 0.2,
});

const inputStyle = (c: typeof Colors.dark) => ({
  paddingHorizontal: 16,
  paddingVertical: 12,
  borderRadius: 14,
  backgroundColor: c.surface2,
  borderWidth: 1,
  borderColor: c.border,
  fontFamily: 'Outfit_500Medium' as const,
  fontSize: 14,
  color: c.text,
});
