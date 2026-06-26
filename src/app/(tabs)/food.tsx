import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, SafeAreaView, FlatList, Modal, Alert } from 'react-native';
import { useAppState, FoodLog } from '@/hooks/useAppState';
import { FOOD_DATABASE, DBFood } from '@/constants/foods';
import { Plus, Search, Trash2, X, ChevronRight, Calculator, Edit3 } from 'lucide-react-native';
import Animated, { FadeIn, FadeOut, Layout } from 'react-native-reanimated';

export default function FoodDiaryScreen() {
  const { foodLogs, addFoodLog, deleteFoodLog, theme } = useAppState();
  const isDark = theme === 'dark';
  const today = new Date().toISOString().split('T')[0];

  // UI state
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMealType, setSelectedMealType] = useState<FoodLog['mealType']>('breakfast');
  
  // Manual form inputs
  const [isManualInput, setIsManualInput] = useState(false);
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');

  // Filter logged foods for today
  const todayFoods = foodLogs.filter(f => f.date === today);

  // Group logged foods
  const meals: { title: string; type: FoodLog['mealType'] }[] = [
    { title: '🍳 Sarapan', type: 'breakfast' },
    { title: '☀️ Makan Siang', type: 'lunch' },
    { title: '🌙 Makan Malam', type: 'dinner' },
    { title: '🍪 Snack / Cemilan', type: 'snack' }
  ];

  // Theme-specific styles
  const bgClass = isDark ? 'bg-dark-bg' : 'bg-light-bg';
  const textClass = isDark ? 'text-white' : 'text-slate-900';
  const textMutedClass = isDark ? 'text-gray-400' : 'text-slate-500';
  const cardClass = isDark ? 'bg-dark-card border-neutral-900' : 'bg-white border-slate-100 shadow-sm';
  const inputClass = isDark 
    ? 'bg-neutral-900 border-neutral-800 text-white focus:border-dark-accent' 
    : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-light-accent';
  const accentColor = isDark ? '#F97316' : '#2563EB';
  const accentBgClass = isDark ? 'bg-orange-500/10 border-orange-500/20' : 'bg-blue-50 border-blue-100';

  // Filtered DB foods for searching
  const filteredDBFoods = FOOD_DATABASE.filter(food =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectDBFood = async (dbFood: DBFood) => {
    await addFoodLog({
      name: dbFood.name.split(' (')[0], // Clean name prefix
      calories: dbFood.calories,
      protein: dbFood.protein,
      carbs: dbFood.carbs,
      fat: dbFood.fat,
      mealType: selectedMealType
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
      mealType: selectedMealType
    });

    // Reset inputs
    setFoodName('');
    setCalories('');
    setProtein('');
    setCarbs('');
    setFat('');
    setIsManualInput(false);
    setModalVisible(false);
  };

  const renderLoggedFoodItem = (item: FoodLog) => {
    return (
      <Animated.View 
        layout={Layout.springify()} 
        entering={FadeIn} 
        exiting={FadeOut} 
        key={item.id} 
        className={`flex-row justify-between items-center p-4 rounded-2xl border ${cardClass} mb-2.5`}
      >
        <View className="flex-1 pr-4">
          <Text className={`font-bold text-sm ${textClass}`}>{item.name}</Text>
          <Text className={`text-xs mt-1 ${textMutedClass}`}>
            P: {item.protein}g | K: {item.carbs}g | L: {item.fat}g
          </Text>
        </View>
        <View className="flex-row items-center space-x-3">
          <Text className={`font-extrabold text-sm ${textClass}`}>{item.calories} kcal</Text>
          <TouchableOpacity onPress={() => deleteFoodLog(item.id)} className="p-1">
            <Trash2 size={16} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView className={`flex-1 ${bgClass}`}>
      <View className="px-6 pt-6 pb-2">
        <Text className={`text-2xl font-black ${textClass}`}>Diary Makanan</Text>
        <Text className={`text-xs mt-1 ${textMutedClass}`}>Catat konsumsi makanan hari ini</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} className="px-6">
        {meals.map((meal) => {
          const mealLogs = todayFoods.filter(f => f.mealType === meal.type);
          const mealCalories = mealLogs.reduce((acc, f) => acc + f.calories, 0);

          return (
            <View key={meal.type} className="mt-5">
              <View className="flex-row justify-between items-center mb-3">
                <View>
                  <Text className={`text-base font-bold ${textClass}`}>{meal.title}</Text>
                  <Text className={`text-xs ${textMutedClass}`}>{mealCalories} kcal</Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedMealType(meal.type);
                    setModalVisible(true);
                  }}
                  className={`p-2 rounded-xl border flex-row items-center space-x-1 ${cardClass}`}
                >
                  <Plus size={16} color={accentColor} />
                  <Text className={`text-xs font-bold ${textClass}`}>Tambah</Text>
                </TouchableOpacity>
              </View>

              {mealLogs.length > 0 ? (
                <View className="space-y-1">
                  {mealLogs.map(renderLoggedFoodItem)}
                </View>
              ) : (
                <View className={`p-4 rounded-2xl border border-dashed flex-row items-center justify-between ${
                  isDark ? 'border-neutral-800 bg-neutral-950/20' : 'border-slate-200 bg-slate-50/20'
                }`}>
                  <Text className={`text-xs ${textMutedClass}`}>Belum ada makanan dicatat.</Text>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>

      {/* Modal for adding food */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/60">
          <View className={`h-[80%] rounded-t-3xl border-t p-6 ${isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-slate-200'}`}>
            {/* Modal Header */}
            <View className="flex-row justify-between items-center mb-4">
              <Text className={`text-lg font-black ${textClass}`}>
                Tambah Ke {selectedMealType.toUpperCase()}
              </Text>
              <TouchableOpacity onPress={() => { setModalVisible(false); setIsManualInput(false); }} className="p-1">
                <X color={isDark ? '#FFF' : '#334155'} size={20} />
              </TouchableOpacity>
            </View>

            {/* Toggle Input Mode */}
            <View className="flex-row space-x-3 mb-4">
              <TouchableOpacity
                onPress={() => setIsManualInput(false)}
                className={`flex-1 py-2.5 rounded-xl border-2 items-center flex-row justify-center space-x-1 ${
                  !isManualInput 
                    ? isDark ? 'border-orange-500 bg-neutral-800' : 'border-blue-500 bg-blue-50'
                    : isDark ? 'border-neutral-800 bg-neutral-950' : 'border-slate-200 bg-white'
                }`}
              >
                <Search size={16} color={!isManualInput ? accentColor : (isDark ? '#FFF' : '#334155')} />
                <Text className={`text-xs font-bold ${textClass}`}>Database Makanan</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setIsManualInput(true)}
                className={`flex-1 py-2.5 rounded-xl border-2 items-center flex-row justify-center space-x-1 ${
                  isManualInput 
                    ? isDark ? 'border-orange-500 bg-neutral-800' : 'border-blue-500 bg-blue-50'
                    : isDark ? 'border-neutral-800 bg-neutral-950' : 'border-slate-200 bg-white'
                }`}
              >
                <Edit3 size={16} color={isManualInput ? accentColor : (isDark ? '#FFF' : '#334155')} />
                <Text className={`text-xs font-bold ${textClass}`}>Log Manual</Text>
              </TouchableOpacity>
            </View>

            {/* Search Database Mode */}
            {!isManualInput ? (
              <View className="flex-1">
                <View className="flex-row items-center px-3.5 py-1.5 rounded-xl border-2 mb-4 bg-neutral-950/20 border-neutral-800/10">
                  <Search size={16} color={isDark ? '#9CA3AF' : '#6B7280'} className="mr-2" />
                  <TextInput
                    placeholder="Cari makanan (misal: Nasi, Telur)..."
                    placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    className={`flex-1 h-9 ${textClass}`}
                  />
                </View>

                <FlatList
                  data={filteredDBFoods}
                  keyExtractor={(item) => item.id}
                  contentContainerStyle={{ paddingBottom: 20 }}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => handleSelectDBFood(item)}
                      className={`py-3.5 px-4 rounded-xl border-b flex-row justify-between items-center ${
                        isDark ? 'border-neutral-800/40' : 'border-slate-100'
                      }`}
                    >
                      <View className="flex-1 pr-4">
                        <Text className={`text-sm font-bold ${textClass}`}>{item.name}</Text>
                        <Text className={`text-xs mt-0.5 ${textMutedClass}`}>
                          P: {item.protein}g | K: {item.carbs}g | L: {item.fat}g
                        </Text>
                      </View>
                      <View className="flex-row items-center space-x-1">
                        <Text className={`text-sm font-extrabold ${textClass}`}>{item.calories} kcal</Text>
                        <ChevronRight size={16} color={isDark ? '#6B7280' : '#9CA3AF'} />
                      </View>
                    </TouchableOpacity>
                  )}
                />
              </View>
            ) : (
              // Manual Entry Mode
              <ScrollView className="flex-1">
                <View className="space-y-3.5">
                  <View>
                    <Text className={`text-xs font-bold mb-1.5 ${textClass}`}>Nama Makanan</Text>
                    <TextInput
                      placeholder="Contoh: Ayam Bakar Bumbu Rujak"
                      placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                      value={foodName}
                      onChangeText={setFoodName}
                      className={`px-4 py-3 rounded-xl border-2 ${inputClass}`}
                    />
                  </View>
                  <View>
                    <Text className={`text-xs font-bold mb-1.5 ${textClass}`}>Kalori (kcal)</Text>
                    <TextInput
                      placeholder="Contoh: 220"
                      placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                      keyboardType="numeric"
                      value={calories}
                      onChangeText={setCalories}
                      className={`px-4 py-3 rounded-xl border-2 ${inputClass}`}
                    />
                  </View>
                  <View className="flex-row space-x-3">
                    <View className="flex-1">
                      <Text className={`text-xs font-bold mb-1.5 ${textClass}`}>Protein (g)</Text>
                      <TextInput
                        placeholder="0"
                        placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                        keyboardType="numeric"
                        value={protein}
                        onChangeText={setProtein}
                        className={`px-4 py-3 rounded-xl border-2 ${inputClass}`}
                      />
                    </View>
                    <View className="flex-1">
                      <Text className={`text-xs font-bold mb-1.5 ${textClass}`}>Karbohidrat (g)</Text>
                      <TextInput
                        placeholder="0"
                        placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                        keyboardType="numeric"
                        value={carbs}
                        onChangeText={setCarbs}
                        className={`px-4 py-3 rounded-xl border-2 ${inputClass}`}
                      />
                    </View>
                    <View className="flex-1">
                      <Text className={`text-xs font-bold mb-1.5 ${textClass}`}>Lemak (g)</Text>
                      <TextInput
                        placeholder="0"
                        placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                        keyboardType="numeric"
                        value={fat}
                        onChangeText={setFat}
                        className={`px-4 py-3 rounded-xl border-2 ${inputClass}`}
                      />
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={handleSaveManual}
                    className="py-4 rounded-xl items-center mt-6"
                    style={{ backgroundColor: accentColor }}
                  >
                    <Text className="text-white font-bold text-base">Simpan Log</Text>
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
