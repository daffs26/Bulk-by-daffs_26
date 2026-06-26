import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView, 
  ActivityIndicator, 
  Alert, 
  Image, 
  TextInput, 
  ScrollView 
} from 'react-native';
import { useAppState } from '@/hooks/useAppState';
import { Colors, Accent } from '@/constants/theme';
import { Camera, Image as ImageIcon, Sparkles, Check, RotateCcw, Search, ChevronRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeOut, Layout } from 'react-native-reanimated';
import * as ImagePicker from 'expo-image-picker';
import { FOOD_DATABASE, DBFood } from '@/constants/foods';

export default function CameraScanScreen() {
  const { addFoodLog, theme } = useAppState();
  const c = Colors[theme];
  const isDark = theme === 'dark';

  const [scanState, setScanState] = useState<'idle' | 'scanning' | 'result'>('idle');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [portionScale, setPortionScale] = useState(1.0);
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('lunch');
  
  const [candidates, setCandidates] = useState<DBFood[]>([]);
  const [selectedFood, setSelectedFood] = useState<DBFood | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Pick random candidates from different categories to simulate AI classification
  const generateCandidates = () => {
    const meals = FOOD_DATABASE.filter(f => f.category === 'Meals');
    const proteins = FOOD_DATABASE.filter(f => f.category === 'Protein');
    const snacks = FOOD_DATABASE.filter(f => f.category === 'Snacks' || f.category === 'Carbohydrates');

    const c1 = meals[Math.floor(Math.random() * meals.length)] || FOOD_DATABASE[0];
    const c2 = proteins[Math.floor(Math.random() * proteins.length)] || FOOD_DATABASE[1];
    const c3 = snacks[Math.floor(Math.random() * snacks.length)] || FOOD_DATABASE[2];

    const list = [c1, c2, c3];
    setCandidates(list);
    setSelectedFood(list[0]);
  };

  const triggerScan = () => {
    setScanState('scanning');
    setTimeout(() => {
      setScanState('result');
      setPortionScale(1.0);
      setIsSearching(false);
      setSearchQuery('');
      generateCandidates();
    }, 2000);
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestImageLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Izin Ditolak', 'Aplikasi memerlukan izin galeri untuk mengakses foto.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
      triggerScan();
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Izin Ditolak', 'Aplikasi memerlukan izin kamera untuk mengambil foto.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
      triggerScan();
    }
  };

  const handleSaveResult = async () => {
    if (!selectedFood) return;

    await addFoodLog({
      name: `${selectedFood.name} (${portionScale.toFixed(1)}x)`,
      calories: adjustedCalories,
      protein: adjustedProtein,
      carbs: adjustedCarbs,
      fat: adjustedFat,
      mealType: mealType,
    });
    
    const mealLabel = {
      breakfast: 'Sarapan',
      lunch: 'Makan Siang',
      dinner: 'Makan Malam',
      snack: 'Cemilan'
    }[mealType];

    Alert.alert('Log Berhasil', `Makanan hasil scan AI berhasil dicatat di Diary ${mealLabel}!`);
    setScanState('idle');
    setImageUri(null);
  };

  // Calculations reactive to selectedFood and portionScale
  const adjustedCalories = selectedFood ? Math.round(selectedFood.calories * portionScale) : 0;
  const adjustedProtein = selectedFood ? Math.round(selectedFood.protein * portionScale) : 0;
  const adjustedCarbs = selectedFood ? Math.round(selectedFood.carbs * portionScale) : 0;
  const adjustedFat = selectedFood ? Math.round(selectedFood.fat * portionScale) : 0;

  // Filter food database for search override
  const filteredFoods = FOOD_DATABASE.filter(f =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5);

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

      <View style={{ flex: 1, paddingHorizontal: 20, paddingVertical: 16 }}>

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
                Ambil foto makanan Anda atau unggah dari galeri untuk memulai scan nutrisi AI otomatis.
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
                Letakkan tangan atau sendok di sebelah piring sebagai referensi skala agar AI kami dapat mengukur volume makanan dengan lebih presisi.
              </Text>
            </View>

            {/* Action buttons */}
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
              <TouchableOpacity onPress={pickImage} style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                paddingVertical: 16,
                borderRadius: 14,
                backgroundColor: c.surface2,
                borderWidth: 1,
                borderColor: c.border,
              }}>
                <ImageIcon size={18} color={c.text} />
                <Text style={{ fontFamily: 'Outfit_600SemiBold', fontSize: 14, color: c.text }}>Galeri</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={takePhoto} style={{ flex: 1 }}>
                <LinearGradient
                  colors={[Accent.primary, Accent.primaryDark]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    paddingVertical: 16,
                    borderRadius: 14,
                  }}
                >
                  <Camera size={18} color="white" />
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
              Mengestimasi porsi & volume makro nutrisi
            </Text>
          </Animated.View>
        )}

        {/* ── RESULT State ── */}
        {scanState === 'result' && (
          <Animated.View entering={FadeIn} layout={Layout.springify()} style={{ flex: 1 }}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
              
              {/* Real Uploaded Image Preview */}
              <View style={{
                height: 200,
                borderRadius: 20,
                backgroundColor: isDark ? '#161618' : '#E4E4E7',
                overflow: 'hidden',
                marginBottom: 16,
                position: 'relative',
                borderWidth: 1,
                borderColor: c.border,
              }}>
                {imageUri ? (
                  <Image source={{ uri: imageUri }} style={{ width: '100%', height: '100%', resizeMode: 'cover' }} />
                ) : (
                  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <ImageIcon size={36} color={c.textMuted} />
                    <Text style={{ fontSize: 11, fontFamily: 'Outfit_500Medium', color: c.textMuted, marginTop: 8 }}>Tidak ada gambar</Text>
                  </View>
                )}
                
                <View style={{
                  position: 'absolute',
                  bottom: 12,
                  left: 12,
                  backgroundColor: 'rgba(0,0,0,0.65)',
                  paddingHorizontal: 12,
                  paddingVertical: 5,
                  borderRadius: 8,
                }}>
                  <Text style={{ color: '#FFF', fontSize: 10, fontFamily: 'Outfit_600SemiBold' }}>Referensi Piring & Skala Terdeteksi</Text>
                </View>
              </View>

              {/* Candidates selection */}
              <View style={{ marginBottom: 16 }}>
                <Text style={{ fontSize: 11, fontFamily: 'Outfit_600SemiBold', color: c.textMuted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>
                  Hasil Deteksi AI (Pilih yang sesuai):
                </Text>
                <View style={{ gap: 8 }}>
                  {candidates.map((food, idx) => {
                    const isSelected = selectedFood?.id === food.id;
                    return (
                      <TouchableOpacity
                        key={food.id}
                        onPress={() => {
                          setSelectedFood(food);
                          setIsSearching(false);
                        }}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: 14,
                          borderRadius: 12,
                          backgroundColor: isSelected ? Accent.pale : c.surface,
                          borderWidth: 1,
                          borderColor: isSelected ? Accent.primary : c.border,
                        }}
                      >
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                          <View style={{
                            width: 20,
                            height: 20,
                            borderRadius: 10,
                            borderWidth: 2,
                            borderColor: isSelected ? Accent.primary : c.textMuted,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                            {isSelected && <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: Accent.primary }} />}
                          </View>
                          <Text style={{
                            fontSize: 13,
                            fontFamily: isSelected ? 'Outfit_600SemiBold' : 'Outfit_500Medium',
                            color: isSelected ? Accent.primary : c.text,
                          }}>
                            {food.name}
                          </Text>
                        </View>
                        <Text style={{ fontSize: 12, fontFamily: 'Outfit_600SemiBold', color: isSelected ? Accent.primary : c.textSub }}>
                          {food.calories} kcal
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Database search correction */}
              <View style={{ marginBottom: 16, zIndex: 10 }}>
                <Text style={{ fontSize: 11, fontFamily: 'Outfit_600SemiBold', color: c.textMuted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>
                  Bukan salah satu di atas? Koreksi deteksi:
                </Text>
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: c.surface,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: isSearching ? Accent.primary : c.border,
                  paddingHorizontal: 12,
                }}>
                  <Search size={16} color={c.textMuted} style={{ marginRight: 8 }} />
                  <TextInput
                    placeholder="Cari makanan lain di database..."
                    placeholderTextColor={c.textMuted}
                    value={searchQuery}
                    onChangeText={(val) => {
                      setSearchQuery(val);
                      setIsSearching(val.length > 0);
                    }}
                    style={{
                      flex: 1,
                      paddingVertical: 12,
                      fontSize: 13,
                      fontFamily: 'Outfit_500Medium',
                      color: c.text,
                    }}
                  />
                </View>

                {isSearching && searchQuery.length > 0 && (
                  <View style={{
                    backgroundColor: c.surface2,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: c.border,
                    marginTop: 4,
                    overflow: 'hidden',
                  }}>
                    {filteredFoods.length > 0 ? (
                      filteredFoods.map((f) => (
                        <TouchableOpacity
                          key={f.id}
                          onPress={() => {
                            setSelectedFood(f);
                            // Add to candidates so it stays visible in list
                            if (!candidates.find(c => c.id === f.id)) {
                              setCandidates([f, ...candidates.slice(0, 2)]);
                            }
                            setIsSearching(false);
                            setSearchQuery('');
                          }}
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: 12,
                            borderBottomWidth: 1,
                            borderBottomColor: c.border,
                          }}
                        >
                          <Text style={{ fontSize: 12, fontFamily: 'Outfit_500Medium', color: c.text }}>{f.name}</Text>
                          <ChevronRight size={14} color={c.textMuted} />
                        </TouchableOpacity>
                      ))
                    ) : (
                      <View style={{ padding: 12 }}>
                        <Text style={{ fontSize: 12, fontFamily: 'Outfit_500Medium', color: c.textMuted }}>Makanan tidak ditemukan</Text>
                      </View>
                    )}
                  </View>
                )}
              </View>

              {/* Meal Type Selection */}
              <View style={{ marginBottom: 16 }}>
                <Text style={{ fontSize: 11, fontFamily: 'Outfit_600SemiBold', color: c.textMuted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>
                  Waktu Makan:
                </Text>
                <View style={{ flexDirection: 'row', gap: 6 }}>
                  {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map((type) => {
                    const isSelected = mealType === type;
                    const label = {
                      breakfast: 'Sarapan',
                      lunch: 'Siang',
                      dinner: 'Malam',
                      snack: 'Cemilan',
                    }[type];

                    return (
                      <TouchableOpacity
                        key={type}
                        onPress={() => setMealType(type)}
                        style={{
                          flex: 1,
                          paddingVertical: 8,
                          borderRadius: 8,
                          backgroundColor: isSelected ? Accent.primary : c.surface,
                          alignItems: 'center',
                          borderWidth: 1,
                          borderColor: isSelected ? Accent.primary : c.border,
                        }}
                      >
                        <Text style={{
                          fontSize: 11,
                          fontFamily: 'Outfit_600SemiBold',
                          color: isSelected ? '#FFF' : c.text,
                        }}>
                          {label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Macros & Calorie display */}
              {selectedFood && (
                <View style={{
                  backgroundColor: c.surface,
                  borderWidth: 1,
                  borderColor: c.border,
                  borderRadius: 20,
                  padding: 20,
                  marginBottom: 16,
                }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 14 }}>
                    <View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                        <Sparkles size={12} color={Accent.primary} />
                        <Text style={{ fontSize: 10, fontFamily: 'Outfit_600SemiBold', color: Accent.primary, textTransform: 'uppercase' }}>AI Analysis</Text>
                      </View>
                      <Text style={{ fontSize: 14, fontFamily: 'Outfit_700Bold', color: c.text }}>{selectedFood.name}</Text>
                    </View>
                    <Text style={{ fontSize: 26, fontFamily: 'Outfit_800ExtraBold', color: c.text, letterSpacing: -0.5 }}>
                      {adjustedCalories} <Text style={{ fontSize: 12, fontFamily: 'Outfit_500Medium', color: c.textSub }}>kcal</Text>
                    </Text>
                  </View>

                  {/* Macro breakdown */}
                  <View style={{
                    flexDirection: 'row',
                    gap: 24,
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
                          letterSpacing: 0.5,
                          textTransform: 'uppercase',
                          marginBottom: 2,
                        }}>
                          {m.label}
                        </Text>
                        <Text style={{
                          fontSize: 13,
                          fontFamily: 'Outfit_800ExtraBold',
                          color: m.color,
                          letterSpacing: -0.3,
                        }}>
                          {m.value}g
                        </Text>
                      </View>
                    ))}
                  </View>

                  {/* Portion scale controller */}
                  <View style={{ marginTop: 14 }}>
                    <Text style={{ fontSize: 12, fontFamily: 'Outfit_600SemiBold', color: c.text, marginBottom: 8 }}>
                      Porsi Estimasi:{' '}
                      <Text style={{ fontFamily: 'Outfit_800ExtraBold', color: Accent.primary }}>
                        {portionScale.toFixed(1)}x
                      </Text>
                    </Text>
                    <View style={{ flexDirection: 'row', gap: 6 }}>
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
              )}

              {/* Action save/reset buttons */}
              <View style={{ flexDirection: 'row', gap: 10, marginTop: 4 }}>
                <TouchableOpacity
                  onPress={() => {
                    setScanState('idle');
                    setImageUri(null);
                  }}
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

                <TouchableOpacity 
                  onPress={handleSaveResult} 
                  disabled={!selectedFood}
                  style={{ flex: 1 }}
                >
                  <LinearGradient
                    colors={selectedFood ? [Accent.primary, Accent.primaryDark] : [c.border, c.border]}
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

            </ScrollView>
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
