import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView, 
  ActivityIndicator, 
  Alert, 
  Image, 
  TextInput, 
  ScrollView,
  useWindowDimensions
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppState } from '@/hooks/useAppState';
import { Colors, Accent, Semantic } from '@/constants/theme';
import { 
  Camera, 
  Image as ImageIcon, 
  Sparkles, 
  Check, 
  RotateCcw, 
  Search, 
  ChevronRight, 
  Barcode, 
  AlertCircle, 
  RefreshCw,
  Plus,
  Info
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { FOOD_DATABASE, DBFood } from '@/constants/foods';

type BarcodeProduct = {
  name: string;
  brand: string;
  imageUrl: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  barcode: string;
  isManualEntry?: boolean;
};

export default function CameraScanScreen() {
  const { addFoodLog, theme } = useAppState();
  const c = Colors[theme];
  const isDark = theme === 'dark';

  const [geminiApiKey, setGeminiApiKey] = useState<string | null>(null);
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [tempKey, setTempKey] = useState('');

  useEffect(() => {
    const loadKey = async () => {
      try {
        const key = await AsyncStorage.getItem('@bulk_gemini_api_key');
        setGeminiApiKey(key);
      } catch (err) {
        console.error('Failed to load Gemini key:', err);
      }
    };
    loadKey();
  }, []);

  // Mode: 'photo' (AI Scan Foto) or 'barcode' (Scan Barcode)
  const [mode, setMode] = useState<'photo' | 'barcode'>('photo');

  /* ────────────────────────────────────────────────────────
     1. PHOTO SCAN MODE STATE & LOGIC
     ──────────────────────────────────────────────────────── */
  const [photoScanState, setPhotoScanState] = useState<'idle' | 'scanning' | 'result'>('idle');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [portionScale, setPortionScale] = useState(1.0);
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('lunch');
  const [candidates, setCandidates] = useState<DBFood[]>([]);
  const [selectedFood, setSelectedFood] = useState<DBFood | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Pick random candidates to simulate AI visual classification
  const uriToBase64 = async (uri: string): Promise<string> => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          const base64 = reader.result.split(',')[1];
          resolve(base64);
        } else {
          reject(new Error('Failed to read image content as base64'));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const runGeminiScan = async (uri: string) => {
    setPhotoScanState('scanning');
    try {
      const base64Data = await uriToBase64(uri);
      
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Analyze this food image. Provide nutritional estimation for the food items identified in the image. 
You must respond with a JSON array of food items in this format: 
[
  {
    "name": "Food Name in Indonesian (e.g. Nasi Goreng)", 
    "calories": number, 
    "protein": number, 
    "carbs": number, 
    "fat": number, 
    "category": "Meals" | "Protein" | "Snacks" | "Carbohydrates"
  }
]
Return only this JSON array, no markdown wrappers (like \`\`\`json), and no conversational text.`
                  },
                  {
                    inlineData: {
                      mimeType: "image/jpeg",
                      data: base64Data
                    }
                  }
                ]
              }
            ],
            generationConfig: {
              responseMimeType: "application/json"
            }
          })
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const textResult = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!textResult) {
        throw new Error('Gemini API returned an empty response.');
      }

      const parsedFoods = JSON.parse(textResult.trim());
      if (Array.isArray(parsedFoods) && parsedFoods.length > 0) {
        const formattedCandidates: DBFood[] = parsedFoods.map((f: any, idx: number) => ({
          id: `gemini-${Date.now()}-${idx}`,
          name: f.name || 'Makanan Terdeteksi',
          calories: Number(f.calories) || 0,
          protein: Number(f.protein) || 0,
          carbs: Number(f.carbs) || 0,
          fat: Number(f.fat) || 0,
          category: f.category || 'Meals',
        }));

        setCandidates(formattedCandidates);
        setSelectedFood(formattedCandidates[0]);
        setPhotoScanState('result');
        setPortionScale(1.0);
        setIsSearching(false);
        setSearchQuery('');
      } else {
        throw new Error('Invalid JSON format or empty array received from Gemini.');
      }
    } catch (error) {
      console.error('Error in runGeminiScan:', error);
      Alert.alert(
        'Scan AI Gagal',
        'Gagal menganalisis foto menggunakan Gemini AI. Pastikan API Key benar dan Anda memiliki koneksi internet, lalu coba lagi. (Mengalihkan ke mode simulasi...)',
        [
          {
            text: 'OK',
            onPress: () => {
              triggerPhotoScanSimulated();
            }
          }
        ]
      );
    }
  };

  const triggerPhotoScan = (uri: string) => {
    if (geminiApiKey) {
      runGeminiScan(uri);
    } else {
      triggerPhotoScanSimulated();
    }
  };

  const triggerPhotoScanSimulated = () => {
    setPhotoScanState('scanning');
    setTimeout(() => {
      setPhotoScanState('result');
      setPortionScale(1.0);
      setIsSearching(false);
      setSearchQuery('');
      const meals = FOOD_DATABASE.filter(f => f.category === 'Meals');
      const proteins = FOOD_DATABASE.filter(f => f.category === 'Protein');
      const snacks = FOOD_DATABASE.filter(f => f.category === 'Snacks' || f.category === 'Carbohydrates');

      const c1 = meals[Math.floor(Math.random() * meals.length)] || FOOD_DATABASE[0];
      const c2 = proteins[Math.floor(Math.random() * proteins.length)] || FOOD_DATABASE[1];
      const c3 = snacks[Math.floor(Math.random() * snacks.length)] || FOOD_DATABASE[2];

      const list = [c1, c2, c3];
      setCandidates(list);
      setSelectedFood(list[0]);
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
      const uri = result.assets[0].uri;
      setImageUri(uri);
      triggerPhotoScan(uri);
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
      const uri = result.assets[0].uri;
      setImageUri(uri);
      triggerPhotoScan(uri);
    }
  };

  const handleSavePhotoResult = async () => {
    if (!selectedFood) return;

    const adjustedCalories = Math.round(selectedFood.calories * portionScale);
    const adjustedProtein = Math.round(selectedFood.protein * portionScale);
    const adjustedCarbs = Math.round(selectedFood.carbs * portionScale);
    const adjustedFat = Math.round(selectedFood.fat * portionScale);

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
    setPhotoScanState('idle');
    setImageUri(null);
  };

  // Filter food database for search override
  const filteredFoods = FOOD_DATABASE.filter(f =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5);

  /* ────────────────────────────────────────────────────────
     2. BARCODE SCAN MODE STATE & LOGIC
     ──────────────────────────────────────────────────────── */
  const [barcodeQuery, setBarcodeQuery] = useState('');
  const [isSearchingBarcode, setIsSearchingBarcode] = useState(false);
  const [isScanningCamera, setIsScanningCamera] = useState(false);
  const [barcodeResult, setBarcodeResult] = useState<BarcodeProduct | null>(null);
  const [barcodePortionScale, setBarcodePortionScale] = useState(1.0);
  const [barcodeMealType, setBarcodeMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('lunch');

  // Manual Form States if barcode not found
  const [manualName, setManualName] = useState('');
  const [manualBrand, setManualBrand] = useState('');
  const [manualCalories, setManualCalories] = useState('');
  const [manualProtein, setManualProtein] = useState('');
  const [manualCarbs, setManualCarbs] = useState('');
  const [manualFat, setManualFat] = useState('');

  // Popular test barcode shortcuts
  const popularBarcodes = [
    { label: 'Indomie Goreng', code: '8992696404456' },
    { label: 'Coca-Cola', code: '5449000000996' },
    { label: 'Aqua', code: '8992752010102' },
  ];

  const fetchProductByBarcode = async (code: string) => {
    const trimmed = code.trim();
    if (!trimmed) {
      Alert.alert('Error', 'Silakan masukkan nomor barcode terlebih dahulu.');
      return;
    }
    
    setIsSearchingBarcode(true);
    setBarcodeResult(null);
    
    try {
      const response = await fetch(`https://world.openfoodfacts.org/api/v2/product/${trimmed}.json`);
      const data = await response.json();
      
      if (data.status === 1 && data.product) {
        const prod = data.product;
        const name = prod.product_name || prod.product_name_id || prod.product_name_en || 'Produk Kemasan Tanpa Nama';
        const brand = prod.brands || 'Merek Tidak Diketahui';
        const imageUrl = prod.image_url || prod.image_front_url || prod.image_small_url || '';
        
        const nutriments = prod.nutriments || {};
        
        // Helper to extract nutrient value per serving or per 100g
        const getNutrient = (key: string) => {
          if (nutriments[`${key}_serving`] !== undefined) {
            return Math.round(Number(nutriments[`${key}_serving`]));
          }
          if (nutriments[`${key}_100g`] !== undefined) {
            return Math.round(Number(nutriments[`${key}_100g`]));
          }
          if (nutriments[key] !== undefined) {
            return Math.round(Number(nutriments[key]));
          }
          return 0;
        };
        
        const calories = getNutrient('energy-kcal');
        const protein = getNutrient('proteins');
        const carbs = getNutrient('carbohydrates');
        const fat = getNutrient('fat');
        
        setBarcodeResult({
          name,
          brand,
          imageUrl,
          calories,
          protein,
          carbs,
          fat,
          barcode: trimmed,
          isManualEntry: false
        });
        setBarcodePortionScale(1.0);
      } else {
        // Barcode not found, ask to enter manually
        Alert.alert(
          'Produk Tidak Ditemukan',
          `Barcode ${trimmed} tidak terdaftar di database Open Food Facts. Ingin memasukkan informasi nutrisi secara manual?`,
          [
            {
              text: 'Batal',
              style: 'cancel',
              onPress: () => setIsSearchingBarcode(false)
            },
            {
              text: 'Input Manual',
              onPress: () => {
                setBarcodeResult({
                  name: '',
                  brand: '',
                  imageUrl: '',
                  calories: 0,
                  protein: 0,
                  carbs: 0,
                  fat: 0,
                  barcode: trimmed,
                  isManualEntry: true
                });
                setManualName('');
                setManualBrand('');
                setManualCalories('');
                setManualProtein('');
                setManualCarbs('');
                setManualFat('');
                setBarcodePortionScale(1.0);
              }
            }
          ]
        );
      }
    } catch (error) {
      console.error('Error fetching barcode:', error);
      Alert.alert(
        'Koneksi Gagal',
        'Gagal memanggil Open Food Facts API. Silakan periksa koneksi internet Anda atau coba masukkan kode manual.'
      );
    } finally {
      setIsSearchingBarcode(false);
    }
  };

  const simulateCameraScan = () => {
    setIsScanningCamera(true);
    setTimeout(() => {
      setIsScanningCamera(false);
      // Use Indomie Goreng as simulated result
      setBarcodeQuery('8992696404456');
      fetchProductByBarcode('8992696404456');
    }, 1500);
  };

  const handleSaveBarcodeResult = async () => {
    if (!barcodeResult) return;

    let finalName = '';
    let finalBrand = '';
    let finalCal = 0;
    let finalProt = 0;
    let finalCarb = 0;
    let finalFat = 0;

    if (barcodeResult.isManualEntry) {
      if (!manualName.trim()) {
        Alert.alert('Data Belum Lengkap', 'Nama produk wajib diisi.');
        return;
      }
      finalName = manualName.trim();
      finalBrand = manualBrand.trim() || 'Manual Input';
      finalCal = Math.round(Number(manualCalories || 0) * barcodePortionScale);
      finalProt = Math.round(Number(manualProtein || 0) * barcodePortionScale);
      finalCarb = Math.round(Number(manualCarbs || 0) * barcodePortionScale);
      finalFat = Math.round(Number(manualFat || 0) * barcodePortionScale);
    } else {
      finalName = barcodeResult.name;
      finalBrand = barcodeResult.brand;
      finalCal = Math.round(barcodeResult.calories * barcodePortionScale);
      finalProt = Math.round(barcodeResult.protein * barcodePortionScale);
      finalCarb = Math.round(barcodeResult.carbs * barcodePortionScale);
      finalFat = Math.round(barcodeResult.fat * barcodePortionScale);
    }

    await addFoodLog({
      name: `${finalName} (${finalBrand}) (${barcodePortionScale.toFixed(1)}x)`,
      calories: finalCal,
      protein: finalProt,
      carbs: finalCarb,
      fat: finalFat,
      mealType: barcodeMealType,
    });

    const mealLabel = {
      breakfast: 'Sarapan',
      lunch: 'Makan Siang',
      dinner: 'Makan Malam',
      snack: 'Cemilan'
    }[barcodeMealType];

    Alert.alert('Log Berhasil', `Produk kemasan berhasil disimpan ke Diary ${mealLabel}!`);
    setBarcodeResult(null);
    setBarcodeQuery('');
  };

  const { width } = useWindowDimensions();
  const isDesktop = width > 768;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.bg }}>
      <View style={{
        flex: 1,
        alignSelf: isDesktop ? 'center' : 'stretch',
        width: isDesktop ? 650 : '100%',
        maxWidth: '100%',
      }}>
        {/* Header */}
      <View style={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 8 }}>
        <Text style={{
          fontSize: 22,
          fontFamily: 'Outfit_800ExtraBold',
          color: c.text,
          letterSpacing: -0.3,
        }}>
          Pindai <Text style={{ color: Accent.primary }}>Nutrisi</Text>
        </Text>
        <Text style={{
          fontSize: 12,
          fontFamily: 'Outfit_500Medium',
          color: c.textMuted,
          marginTop: 4,
          letterSpacing: 0.2,
        }}>
          {mode === 'photo' 
            ? 'Deteksi porsi & makro makanan via foto piring' 
            : 'Scan barcode produk makanan kemasan via API Open Food Facts'}
        </Text>
      </View>

      <View style={{ flex: 1, paddingHorizontal: 20, paddingVertical: 8 }}>
        
        {/* Top Segmented Tab Switcher */}
        <View style={{ 
          flexDirection: 'row', 
          backgroundColor: c.surface, 
          borderRadius: 14, 
          padding: 4, 
          marginBottom: 16, 
          borderWidth: 1, 
          borderColor: c.border 
        }}>
          <TouchableOpacity 
            onPress={() => setMode('photo')} 
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              paddingVertical: 10,
              borderRadius: 10,
              backgroundColor: mode === 'photo' ? (isDark ? '#252528' : '#E4E4E7') : 'transparent',
            }}
          >
            <Camera size={16} color={mode === 'photo' ? Accent.primary : c.textSub} />
            <Text style={{
              fontSize: 13,
              fontFamily: 'Outfit_600SemiBold',
              color: mode === 'photo' ? c.text : c.textSub,
            }}>
              AI Scan Foto
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => setMode('barcode')} 
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              paddingVertical: 10,
              borderRadius: 10,
              backgroundColor: mode === 'barcode' ? (isDark ? '#252528' : '#E4E4E7') : 'transparent',
            }}
          >
            <Barcode size={16} color={mode === 'barcode' ? Accent.primary : c.textSub} />
            <Text style={{
              fontSize: 13,
              fontFamily: 'Outfit_600SemiBold',
              color: mode === 'barcode' ? c.text : c.textSub,
            }}>
              Scan Barcode
            </Text>
          </TouchableOpacity>
        </View>

        {/* ────────────────────────────────────────────────────────
           MODE 1: PHOTO SCAN
           ──────────────────────────────────────────────────────── */}
        {mode === 'photo' && (
          <View style={{ flex: 1 }}>
            {/* ── IDLE State ── */}
            {photoScanState === 'idle' && (
              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between', paddingVertical: 8 }}>
                
                {/* Gemini API Key Configuration Card */}
                <View style={{
                  backgroundColor: c.surface,
                  borderWidth: 1,
                  borderColor: geminiApiKey ? Accent.glow : c.border,
                  borderRadius: 20,
                  padding: 16,
                  marginBottom: 16,
                }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <Sparkles size={16} color={geminiApiKey ? Accent.primary : c.textMuted} />
                      <Text style={{ fontSize: 13, fontFamily: 'Outfit_700Bold', color: c.text }}>
                        {geminiApiKey ? 'Gemini AI Aktif' : 'Gemini AI (Belum Aktif)'}
                      </Text>
                    </View>
                    {!showKeyInput && (
                      <TouchableOpacity
                        onPress={() => {
                          setTempKey(geminiApiKey || '');
                          setShowKeyInput(true);
                        }}
                        style={{
                          paddingHorizontal: 12,
                          paddingVertical: 6,
                          borderRadius: 8,
                          backgroundColor: geminiApiKey ? 'transparent' : Accent.pale,
                          borderWidth: 1,
                          borderColor: geminiApiKey ? Accent.primary : 'transparent',
                        }}
                      >
                        <Text style={{ fontSize: 11, fontFamily: 'Outfit_600SemiBold', color: Accent.primary }}>
                          {geminiApiKey ? 'Ubah Key' : 'Input Key'}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  {showKeyInput ? (
                    <View style={{ marginTop: 8 }}>
                      <Text style={{ fontSize: 11, fontFamily: 'Outfit_600SemiBold', color: c.textMuted, marginBottom: 6 }}>
                        Tempelkan Gemini API Key Anda:
                      </Text>
                      <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: c.surface2,
                        borderRadius: 10,
                        borderWidth: 1,
                        borderColor: c.border,
                        paddingHorizontal: 10,
                        marginBottom: 10,
                      }}>
                        <TextInput
                          placeholder="AIzaSy..."
                          placeholderTextColor={c.textMuted}
                          value={tempKey}
                          onChangeText={setTempKey}
                          secureTextEntry={true}
                          style={{
                            flex: 1,
                            paddingVertical: 8,
                            fontSize: 12,
                            fontFamily: 'Outfit_500Medium',
                            color: c.text,
                          }}
                        />
                      </View>
                      <View style={{ flexDirection: 'row', gap: 8 }}>
                        <TouchableOpacity
                          onPress={async () => {
                            if (tempKey.trim()) {
                              await AsyncStorage.setItem('@bulk_gemini_api_key', tempKey.trim());
                              setGeminiApiKey(tempKey.trim());
                              Alert.alert('Sukses', 'API Key Gemini berhasil disimpan!');
                            }
                            setShowKeyInput(false);
                          }}
                          style={{
                            flex: 1,
                            backgroundColor: Accent.primary,
                            paddingVertical: 8,
                            borderRadius: 8,
                            alignItems: 'center',
                          }}
                        >
                          <Text style={{ fontSize: 11, fontFamily: 'Outfit_600SemiBold', color: '#FFF' }}>Simpan</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => setShowKeyInput(false)}
                          style={{
                            flex: 1,
                            backgroundColor: c.surface2,
                            paddingVertical: 8,
                            borderRadius: 8,
                            alignItems: 'center',
                            borderWidth: 1,
                            borderColor: c.border,
                          }}
                        >
                          <Text style={{ fontSize: 11, fontFamily: 'Outfit_600SemiBold', color: c.text }}>Batal</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : (
                    <View>
                      <Text style={{ fontSize: 11, fontFamily: 'Outfit_500Medium', color: c.textMuted, lineHeight: 16 }}>
                        {geminiApiKey 
                          ? 'API Key terdeteksi. Foto yang diunggah akan dianalisis secara real-time oleh model AI Gemini.' 
                          : 'Menggunakan mode simulasi offline. Dapatkan API Key gratis di aistudio.google.com lalu klik "Input Key" di atas.'}
                      </Text>
                      
                      {geminiApiKey && (
                        <TouchableOpacity 
                          onPress={async () => {
                            await AsyncStorage.removeItem('@bulk_gemini_api_key');
                            setGeminiApiKey(null);
                            Alert.alert('Sukses', 'API Key berhasil dihapus. Kembali ke mode simulasi.');
                          }}
                          style={{ marginTop: 8, alignSelf: 'flex-start' }}
                        >
                          <Text style={{ fontSize: 11, fontFamily: 'Outfit_600SemiBold', color: '#EF4444' }}>
                            Hapus API Key
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  )}
                </View>

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
                  padding: 20,
                  minHeight: 220,
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
                    paddingHorizontal: 16,
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
              </ScrollView>
            )}

            {/* ── SCANNING State ── */}
            {photoScanState === 'scanning' && (
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
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
              </View>
            )}

            {/* ── RESULT State ── */}
            {photoScanState === 'result' && (
              <View style={{ flex: 1 }}>
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
                      {candidates.map((food) => {
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
                                if (!candidates.find(item => item.id === f.id)) {
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
                          {Math.round(selectedFood.calories * portionScale)} <Text style={{ fontSize: 12, fontFamily: 'Outfit_500Medium', color: c.textSub }}>kcal</Text>
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
                          { label: 'Protein', value: Math.round(selectedFood.protein * portionScale), color: Accent.primary },
                          { label: 'Karbo', value: Math.round(selectedFood.carbs * portionScale), color: '#3B82F6' },
                          { label: 'Lemak', value: Math.round(selectedFood.fat * portionScale), color: '#F59E0B' },
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
                        setPhotoScanState('idle');
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
                      onPress={handleSavePhotoResult} 
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
              </View>
            )}
          </View>
        )}

        {/* ────────────────────────────────────────────────────────
           MODE 2: BARCODE SCAN
           ──────────────────────────────────────────────────────── */}
        {mode === 'barcode' && (
          <View style={{ flex: 1 }}>
            
            {/* ── BARCODE LOADING STATE ── */}
            {isSearchingBarcode && (
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator size="large" color={Accent.primary} />
                <Text style={{
                  fontSize: 16,
                  fontFamily: 'Outfit_600SemiBold',
                  color: c.text,
                  marginTop: 24,
                  letterSpacing: -0.2,
                }}>
                  Mencari di Open Food Facts...
                </Text>
                <Text style={{
                  fontSize: 12,
                  fontFamily: 'Outfit_500Medium',
                  color: c.textMuted,
                  marginTop: 6,
                }}>
                  Mengambil data kandungan gizi produk real-time
                </Text>
              </View>
            )}

            {/* ── BARCODE SCANNING CAMERA SIMULATION STATE ── */}
            {isScanningCamera && !isSearchingBarcode && (
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <View style={{
                  width: 280,
                  height: 180,
                  borderRadius: 16,
                  borderWidth: 2,
                  borderColor: Accent.primary,
                  backgroundColor: 'rgba(0,0,0,0.4)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                }}>
                  {/* Red scanner horizontal laser line */}
                  <View style={{
                    position: 'absolute',
                    width: '90%',
                    height: 2,
                    backgroundColor: '#EF4444',
                    shadowColor: '#EF4444',
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.8,
                    shadowRadius: 5,
                  }} />
                  <Barcode size={48} color={Accent.primary} />
                </View>
                <Text style={{
                  fontSize: 14,
                  fontFamily: 'Outfit_600SemiBold',
                  color: c.text,
                  marginTop: 20,
                }}>
                  Memindai Barcode Kamera...
                </Text>
                <Text style={{
                  fontSize: 11,
                  fontFamily: 'Outfit_500Medium',
                  color: c.textMuted,
                  marginTop: 4,
                }}>
                  Mencocokkan pola laser barcode
                </Text>
              </View>
            )}

            {/* ── BARCODE IDLE/INPUT STATE ── */}
            {!barcodeResult && !isSearchingBarcode && !isScanningCamera && (
              <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
                
                {/* Viewfinder Mock Trigger Card */}
                <TouchableOpacity 
                  onPress={simulateCameraScan}
                  style={{
                    height: 180,
                    borderRadius: 24,
                    borderWidth: 2,
                    borderStyle: 'dashed',
                    borderColor: c.border,
                    backgroundColor: isDark ? '#0A0A0B' : '#F0F0F0',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    marginBottom: 20,
                  }}
                >
                  {/* Corner brackets */}
                  <View style={{ position: 'absolute', top: 20, left: 20, width: 20, height: 20, borderTopWidth: 3, borderLeftWidth: 3, borderColor: Accent.primary, borderTopLeftRadius: 4 }} />
                  <View style={{ position: 'absolute', top: 20, right: 20, width: 20, height: 20, borderTopWidth: 3, borderRightWidth: 3, borderColor: Accent.primary, borderTopRightRadius: 4 }} />
                  <View style={{ position: 'absolute', bottom: 20, left: 20, width: 20, height: 20, borderBottomWidth: 3, borderLeftWidth: 3, borderColor: Accent.primary, borderBottomLeftRadius: 4 }} />
                  <View style={{ position: 'absolute', bottom: 20, right: 20, width: 20, height: 20, borderBottomWidth: 3, borderRightWidth: 3, borderColor: Accent.primary, borderBottomRightRadius: 4 }} />

                  <Barcode size={40} color={c.textMuted} />
                  <Text style={{
                    fontSize: 13,
                    fontFamily: 'Outfit_600SemiBold',
                    color: c.text,
                    marginTop: 12,
                  }}>
                    Simulasikan Scan Kamera
                  </Text>
                  <Text style={{
                    fontSize: 11,
                    fontFamily: 'Outfit_500Medium',
                    color: c.textMuted,
                    marginTop: 4,
                    textAlign: 'center',
                    paddingHorizontal: 20,
                  }}>
                    Klik untuk mensimulasikan bidikan kamera memindai barcode produk kemasan secara otomatis.
                  </Text>
                </TouchableOpacity>

                {/* Manual Barcode Input Card */}
                <View style={{
                  backgroundColor: c.surface,
                  borderWidth: 1,
                  borderColor: c.border,
                  borderRadius: 20,
                  padding: 18,
                  marginBottom: 16,
                }}>
                  <Text style={{
                    fontSize: 11,
                    fontFamily: 'Outfit_600SemiBold',
                    color: c.textMuted,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                    marginBottom: 10,
                  }}>
                    Atau Masukkan Barcode Secara Manual:
                  </Text>

                  {/* Input row */}
                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: c.surface2,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: c.border,
                    paddingHorizontal: 12,
                    marginBottom: 14,
                  }}>
                    <Barcode size={16} color={c.textMuted} style={{ marginRight: 8 }} />
                    <TextInput
                      placeholder="Masukkan 13 digit nomor barcode..."
                      placeholderTextColor={c.textMuted}
                      value={barcodeQuery}
                      onChangeText={setBarcodeQuery}
                      keyboardType="numeric"
                      style={{
                        flex: 1,
                        paddingVertical: 12,
                        fontSize: 13,
                        fontFamily: 'Outfit_500Medium',
                        color: c.text,
                      }}
                    />
                  </View>

                  {/* Quick-test shortcuts */}
                  <Text style={{
                    fontSize: 11,
                    fontFamily: 'Outfit_600SemiBold',
                    color: c.textMuted,
                    marginBottom: 8,
                  }}>
                    Contoh Barcode Cepat (Ketuk untuk Tes):
                  </Text>
                  
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                    {popularBarcodes.map((item) => (
                      <TouchableOpacity
                        key={item.code}
                        onPress={() => {
                          setBarcodeQuery(item.code);
                          fetchProductByBarcode(item.code);
                        }}
                        style={{
                          backgroundColor: isDark ? '#252528' : '#E4E4E7',
                          paddingHorizontal: 12,
                          paddingVertical: 6,
                          borderRadius: 8,
                          borderWidth: 1,
                          borderColor: c.border,
                        }}
                      >
                        <Text style={{
                          fontSize: 11,
                          fontFamily: 'Outfit_600SemiBold',
                          color: Accent.primary,
                        }}>
                          ⚡ {item.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  {/* Search Button */}
                  <TouchableOpacity onPress={() => fetchProductByBarcode(barcodeQuery)}>
                    <LinearGradient
                      colors={[Accent.primary, Accent.primaryDark]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                        paddingVertical: 14,
                        borderRadius: 12,
                      }}
                    >
                      <Search size={16} color="white" />
                      <Text style={{
                        fontFamily: 'Outfit_600SemiBold',
                        fontSize: 14,
                        color: '#FFF',
                      }}>
                        Cari Produk
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>

                {/* Open Food Facts Info box */}
                <View style={{
                  padding: 14,
                  borderRadius: 14,
                  backgroundColor: isDark ? 'rgba(59, 130, 246, 0.08)' : 'rgba(59, 130, 246, 0.1)',
                  borderWidth: 1,
                  borderColor: isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.3)',
                  flexDirection: 'row',
                  gap: 10,
                  alignItems: 'center',
                }}>
                  <Info size={18} color="#3B82F6" />
                  <Text style={{
                    flex: 1,
                    fontSize: 11,
                    fontFamily: 'Outfit_500Medium',
                    color: isDark ? 'rgba(59, 130, 246, 0.85)' : '#1D4ED8',
                    lineHeight: 16,
                  }}>
                    Fitur ini mengambil data gizi real-time dari database crowdsourced pangan terbesar di dunia (Open Food Facts API).
                  </Text>
                </View>
              </ScrollView>
            )}

            {/* ── BARCODE RESULT STATE (FOUND / MANUAL ENTRY) ── */}
            {barcodeResult && !isSearchingBarcode && !isScanningCamera && (
              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
                
                {/* Result Card */}
                <View style={{
                  backgroundColor: c.surface,
                  borderWidth: 1,
                  borderColor: c.border,
                  borderRadius: 24,
                  padding: 20,
                  marginBottom: 16,
                }}>
                  
                  {/* API Data Mode */}
                  {!barcodeResult.isManualEntry ? (
                    <View style={{ flexDirection: 'row', gap: 14, marginBottom: 18 }}>
                      {/* Product Image */}
                      <View style={{
                        width: 80,
                        height: 80,
                        borderRadius: 14,
                        backgroundColor: isDark ? '#1C1C1E' : '#E5E7EB',
                        borderWidth: 1,
                        borderColor: c.border,
                        overflow: 'hidden',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        {barcodeResult.imageUrl ? (
                          <Image source={{ uri: barcodeResult.imageUrl }} style={{ width: '100%', height: '100%', resizeMode: 'cover' }} />
                        ) : (
                          <Barcode size={32} color={c.textMuted} />
                        )}
                      </View>

                      {/* Title & Brand */}
                      <View style={{ flex: 1, justifyContent: 'center' }}>
                        <Text style={{
                          fontSize: 10,
                          fontFamily: 'Outfit_700Bold',
                          color: Accent.primary,
                          textTransform: 'uppercase',
                          marginBottom: 2,
                        }}>
                          {barcodeResult.brand}
                        </Text>
                        <Text style={{
                          fontSize: 15,
                          fontFamily: 'Outfit_700Bold',
                          color: c.text,
                        }}>
                          {barcodeResult.name}
                        </Text>
                        <Text style={{
                          fontSize: 10,
                          fontFamily: 'Outfit_500Medium',
                          color: c.textMuted,
                          marginTop: 4,
                        }}>
                          Barcode: {barcodeResult.barcode}
                        </Text>
                      </View>
                    </View>
                  ) : (
                    // Manual Form Mode (If product not in API database)
                    <View style={{ marginBottom: 18 }}>
                      <View style={{ 
                        flexDirection: 'row', 
                        alignItems: 'center', 
                        gap: 8, 
                        marginBottom: 12, 
                        padding: 10, 
                        backgroundColor: Semantic.warningPale, 
                        borderColor: Semantic.warning, 
                        borderWidth: 1,
                        borderRadius: 10 
                      }}>
                        <AlertCircle size={16} color={Semantic.warning} />
                        <Text style={{
                          flex: 1,
                          fontSize: 11,
                          fontFamily: 'Outfit_600SemiBold',
                          color: Semantic.warning,
                        }}>
                          Barcode tidak terdaftar. Silakan masukkan gizi produk kemasan secara manual:
                        </Text>
                      </View>

                      <Text style={{ fontSize: 10, fontFamily: 'Outfit_600SemiBold', color: c.textMuted, textTransform: 'uppercase', marginBottom: 4 }}>
                        Nama Makanan/Minuman *
                      </Text>
                      <TextInput
                        placeholder="Nama makanan (contoh: Susu Coklat UHT)"
                        placeholderTextColor={c.textMuted}
                        value={manualName}
                        onChangeText={setManualName}
                        style={manualInputStyle(c)}
                      />

                      <Text style={{ fontSize: 10, fontFamily: 'Outfit_600SemiBold', color: c.textMuted, textTransform: 'uppercase', marginBottom: 4, marginTop: 10 }}>
                        Merek/Brand
                      </Text>
                      <TextInput
                        placeholder="Nama merek (contoh: Ultra Milk)"
                        placeholderTextColor={c.textMuted}
                        value={manualBrand}
                        onChangeText={setManualBrand}
                        style={manualInputStyle(c)}
                      />

                      {/* Mini nutrition inputs */}
                      <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontSize: 9, fontFamily: 'Outfit_600SemiBold', color: c.textMuted, textTransform: 'uppercase', marginBottom: 4 }}>
                            Kalori (kcal)
                          </Text>
                          <TextInput
                            placeholder="0"
                            placeholderTextColor={c.textMuted}
                            value={manualCalories}
                            onChangeText={setManualCalories}
                            keyboardType="numeric"
                            style={manualInputStyle(c, true)}
                          />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontSize: 9, fontFamily: 'Outfit_600SemiBold', color: c.textMuted, textTransform: 'uppercase', marginBottom: 4 }}>
                            Protein (g)
                          </Text>
                          <TextInput
                            placeholder="0"
                            placeholderTextColor={c.textMuted}
                            value={manualProtein}
                            onChangeText={setManualProtein}
                            keyboardType="numeric"
                            style={manualInputStyle(c, true)}
                          />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontSize: 9, fontFamily: 'Outfit_600SemiBold', color: c.textMuted, textTransform: 'uppercase', marginBottom: 4 }}>
                            Karbo (g)
                          </Text>
                          <TextInput
                            placeholder="0"
                            placeholderTextColor={c.textMuted}
                            value={manualCarbs}
                            onChangeText={setManualCarbs}
                            keyboardType="numeric"
                            style={manualInputStyle(c, true)}
                          />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontSize: 9, fontFamily: 'Outfit_600SemiBold', color: c.textMuted, textTransform: 'uppercase', marginBottom: 4 }}>
                            Lemak (g)
                          </Text>
                          <TextInput
                            placeholder="0"
                            placeholderTextColor={c.textMuted}
                            value={manualFat}
                            onChangeText={setManualFat}
                            keyboardType="numeric"
                            style={manualInputStyle(c, true)}
                          />
                        </View>
                      </View>
                    </View>
                  )}

                  {/* Calculated Nutrients display */}
                  <View style={{
                    borderTopWidth: 1,
                    borderBottomWidth: 1,
                    borderColor: c.border,
                    paddingVertical: 14,
                    marginBottom: 16,
                  }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <Text style={{ fontSize: 12, fontFamily: 'Outfit_600SemiBold', color: c.textSub }}>Kalori Total:</Text>
                      <Text style={{ fontSize: 24, fontFamily: 'Outfit_800ExtraBold', color: c.text, letterSpacing: -0.5 }}>
                        {barcodeResult.isManualEntry 
                          ? Math.round(Number(manualCalories || 0) * barcodePortionScale) 
                          : Math.round(barcodeResult.calories * barcodePortionScale)}{' '}
                        <Text style={{ fontSize: 12, fontFamily: 'Outfit_500Medium', color: c.textSub }}>kcal</Text>
                      </Text>
                    </View>

                    {/* Macros grid */}
                    <View style={{ flexDirection: 'row', gap: 24 }}>
                      {[
                        { 
                          label: 'Protein', 
                          value: barcodeResult.isManualEntry 
                            ? Math.round(Number(manualProtein || 0) * barcodePortionScale) 
                            : Math.round(barcodeResult.protein * barcodePortionScale), 
                          color: Accent.primary 
                        },
                        { 
                          label: 'Karbo', 
                          value: barcodeResult.isManualEntry 
                            ? Math.round(Number(manualCarbs || 0) * barcodePortionScale) 
                            : Math.round(barcodeResult.carbs * barcodePortionScale), 
                          color: '#3B82F6' 
                        },
                        { 
                          label: 'Lemak', 
                          value: barcodeResult.isManualEntry 
                            ? Math.round(Number(manualFat || 0) * barcodePortionScale) 
                            : Math.round(barcodeResult.fat * barcodePortionScale), 
                          color: '#F59E0B' 
                        },
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
                  </View>

                  {/* Portion scale controller */}
                  <View style={{ marginBottom: 16 }}>
                    <Text style={{ fontSize: 12, fontFamily: 'Outfit_600SemiBold', color: c.text, marginBottom: 8 }}>
                      Jumlah Kemasan / Porsi:{' '}
                      <Text style={{ fontFamily: 'Outfit_800ExtraBold', color: Accent.primary }}>
                        {barcodePortionScale.toFixed(1)}x
                      </Text>
                    </Text>
                    <View style={{ flexDirection: 'row', gap: 6 }}>
                      <TouchableOpacity
                        onPress={() => setBarcodePortionScale((p) => Math.max(0.5, p - 0.1))}
                        style={portionBtnStyle(c)}
                      >
                        <Text style={portionBtnTextStyle(c)}>-0.1x</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => setBarcodePortionScale(1.0)}
                        style={portionBtnStyle(c)}
                      >
                        <Text style={portionBtnTextStyle(c)}>Reset</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => setBarcodePortionScale((p) => Math.min(5.0, p + 0.1))}
                        style={portionBtnStyle(c)}
                      >
                        <Text style={portionBtnTextStyle(c)}>+0.1x</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Meal Type selection */}
                  <View>
                    <Text style={{ fontSize: 11, fontFamily: 'Outfit_600SemiBold', color: c.textMuted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>
                      Log Ke Waktu Makan:
                    </Text>
                    <View style={{ flexDirection: 'row', gap: 6 }}>
                      {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map((type) => {
                        const isSelected = barcodeMealType === type;
                        const label = {
                          breakfast: 'Sarapan',
                          lunch: 'Siang',
                          dinner: 'Malam',
                          snack: 'Cemilan',
                        }[type];

                        return (
                          <TouchableOpacity
                            key={type}
                            onPress={() => setBarcodeMealType(type)}
                            style={{
                              flex: 1,
                              paddingVertical: 8,
                              borderRadius: 8,
                              backgroundColor: isSelected ? Accent.primary : c.surface2,
                              alignItems: 'center',
                              borderWidth: 1,
                              borderColor: isSelected ? Accent.primary : c.border,
                            }}
                          >
                            <Text style={{
                              fontSize: 10,
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

                </View>

                {/* Action save/reset buttons */}
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <TouchableOpacity
                    onPress={() => {
                      setBarcodeResult(null);
                      setBarcodeQuery('');
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
                    onPress={handleSaveBarcodeResult} 
                    style={{ flex: 1 }}
                  >
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

              </ScrollView>
            )}

          </View>
        )}

      </View>
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

const manualInputStyle = (c: typeof Colors.dark, isCenter: boolean = false) => ({
  backgroundColor: c.surface2,
  borderWidth: 1,
  borderColor: c.border,
  borderRadius: 10,
  paddingHorizontal: 12,
  paddingVertical: 8,
  fontSize: 13,
  fontFamily: 'Outfit_500Medium',
  color: c.text,
  textAlign: (isCenter ? 'center' : 'left') as any,
});

