import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, Alert, TextInput, useWindowDimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppState } from '@/hooks/useAppState';
import { Colors, Accent } from '@/constants/theme';
import { User, Sun, Moon, RefreshCw, Activity, Scale, Info, LogOut, Key, Sparkles } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';


export default function SettingsScreen() {
  const { userProfile, theme, toggleTheme, resetAllData, logout, user } = useAppState();
  const c = Colors[theme];
  const isDark = theme === 'dark';

  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const loadKey = async () => {
      try {
        const key = await AsyncStorage.getItem('@bulk_gemini_api_key');
        if (key) {
          setGeminiApiKey(key);
          setIsSaved(true);
        }
      } catch (err) {
        console.error('Failed to load Gemini key', err);
      }
    };
    loadKey();
  }, []);

  const saveGeminiKey = async () => {
    try {
      if (geminiApiKey.trim()) {
        await AsyncStorage.setItem('@bulk_gemini_api_key', geminiApiKey.trim());
        setIsSaved(true);
        Alert.alert('Sukses', 'Gemini API Key berhasil disimpan!');
      } else {
        await AsyncStorage.removeItem('@bulk_gemini_api_key');
        setIsSaved(false);
        Alert.alert('Sukses', 'Gemini API Key dihapus.');
      }
    } catch (err) {
      console.error('Failed to save Gemini key', err);
      Alert.alert('Gagal', 'Gagal menyimpan API Key.');
    }
  };

  const handleReset = () => {
    Alert.alert(
      'Reset Semua Data',
      'Apakah Anda yakin ingin menghapus seluruh log data dan mengulang kembali onboarding?',
      [
        { text: 'Batal', style: 'cancel' },
        { text: 'Hapus Semua', style: 'destructive', onPress: resetAllData },
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

  const { width } = useWindowDimensions();
  const isDesktop = width > 768;

  const themeToggler = (
    <View style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 20,
      borderRadius: 24,
      backgroundColor: c.surface,
      borderWidth: 1,
      borderColor: c.border,
    }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        {isDark ? <Moon color={Accent.primary} size={20} /> : <Sun color={Accent.primary} size={20} />}
        <View>
          <Text style={{
            fontSize: 14,
            fontFamily: 'Outfit_600SemiBold',
            color: c.text,
            letterSpacing: -0.1,
          }}>
            Mode Tampilan
          </Text>
          <Text style={{
            fontSize: 11,
            fontFamily: 'Outfit_500Medium',
            color: c.textMuted,
            marginTop: 2,
          }}>
            Ganti tema terang atau gelap
          </Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={toggleTheme}
        style={{
          paddingHorizontal: 14,
          paddingVertical: 8,
          borderRadius: 10,
          backgroundColor: c.surface2,
          borderWidth: 1,
          borderColor: c.border,
        }}
      >
        <Text style={{
          fontSize: 12,
          fontFamily: 'Outfit_600SemiBold',
          color: c.text,
        }}>
          {isDark ? 'Gelap' : 'Terang'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const profileCard = userProfile && (
    <View style={{
      borderRadius: 24,
      backgroundColor: c.surface,
      borderWidth: 1,
      borderColor: c.border,
      padding: 24,
    }}>
      {/* Profile header */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: c.border,
        marginBottom: 16,
      }}>
        <LinearGradient
          colors={[Accent.primary, Accent.primaryDark]}
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <User color="white" size={20} />
        </LinearGradient>
        <View>
          <Text style={{
            fontSize: 16,
            fontFamily: 'Outfit_800ExtraBold',
            color: c.text,
            letterSpacing: -0.2,
          }}>
            {user?.displayName || 'Target Fisik Saya'}
          </Text>
          {user?.email ? (
            <Text style={{
              fontSize: 10,
              fontFamily: 'Outfit_500Medium',
              color: c.textMuted,
              marginTop: 2,
            }}>
              {user.email}
            </Text>
          ) : (
            <Text style={{
              fontSize: 10,
              fontFamily: 'Outfit_500Medium',
              color: c.textMuted,
              marginTop: 2,
            }}>
              Offline / Local Mode
            </Text>
          )}
        </View>
      </View>

      {/* Data rows */}
      <View style={{ gap: 14 }}>
        <DataRow
          icon={<User size={14} color={c.textMuted} />}
          label="Gender & Usia"
          value={`${userProfile.gender === 'male' ? 'Laki-laki' : 'Perempuan'}, ${userProfile.age} Th`}
          c={c}
        />
        <DataRow
          icon={<Scale size={14} color={c.textMuted} />}
          label="Tinggi / Berat"
          value={`${userProfile.height} cm / ${userProfile.weightCurrent} kg (Target: ${userProfile.weightTarget} kg)`}
          c={c}
        />
        <DataRow
          icon={<Activity size={14} color={c.textMuted} />}
          label="Aktivitas"
          value={
            userProfile.activityLevel === 'sedentary' ? 'Ringan (Sedentary)'
            : userProfile.activityLevel === 'light' ? 'Lightly Active'
            : 'Active'
          }
          c={c}
        />

        {/* BMI & TDEE highlight */}
        <View style={{
          paddingTop: 14,
          borderTopWidth: 1,
          borderTopColor: c.border,
          gap: 10,
        }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 12, fontFamily: 'Outfit_600SemiBold', color: c.text }}>BMI (Indeks Massa Tubuh)</Text>
            <Text style={{ fontSize: 13, fontFamily: 'Outfit_800ExtraBold', color: Accent.primary, letterSpacing: -0.3 }}>{userProfile.bmi}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 12, fontFamily: 'Outfit_600SemiBold', color: c.text }}>TDEE (Daily Energy Target)</Text>
            <Text style={{ fontSize: 13, fontFamily: 'Outfit_800ExtraBold', color: Accent.primary, letterSpacing: -0.3 }}>{userProfile.tdee} kcal</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const geminiCard = (
    <View style={{
      borderRadius: 24,
      backgroundColor: c.surface,
      borderWidth: 1,
      borderColor: isSaved ? Accent.glow : c.border,
      padding: 24,
    }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <Sparkles color={Accent.primary} size={20} />
        <View style={{ flex: 1 }}>
          <Text style={{
            fontSize: 14,
            fontFamily: 'Outfit_600SemiBold',
            color: c.text,
            letterSpacing: -0.1,
          }}>
            Google Gemini API Key
          </Text>
          <Text style={{
            fontSize: 11,
            fontFamily: 'Outfit_500Medium',
            color: c.textMuted,
            marginTop: 2,
          }}>
            Untuk fitur scan foto makanan AI real-time
          </Text>
        </View>
      </View>

      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: c.surface2,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: c.border,
        paddingHorizontal: 12,
        marginBottom: 12,
      }}>
        <Key size={16} color={c.textMuted} style={{ marginRight: 8 }} />
        <TextInput
          placeholder="Masukkan API Key Gemini..."
          placeholderTextColor={c.textMuted}
          value={geminiApiKey}
          onChangeText={(val) => {
            setGeminiApiKey(val);
            setIsSaved(false);
          }}
          secureTextEntry={true}
          style={{
            flex: 1,
            paddingVertical: 12,
            fontSize: 13,
            fontFamily: 'Outfit_500Medium',
            color: c.text,
          }}
        />
      </View>

      <TouchableOpacity
        onPress={saveGeminiKey}
        style={{
          paddingVertical: 12,
          borderRadius: 12,
          backgroundColor: isSaved ? 'transparent' : Accent.primary,
          borderWidth: 1,
          borderColor: Accent.primary,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{
          fontSize: 13,
          fontFamily: 'Outfit_600SemiBold',
          color: isSaved ? Accent.primary : '#FFF',
        }}>
          {isSaved ? 'Tersimpan (Klik untuk hapus/ubah)' : 'Simpan API Key'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const logoutCard = !isDesktop && (
    <TouchableOpacity
      onPress={() => {
        Alert.alert(
          'Keluar Akun',
          'Apakah Anda yakin ingin keluar dari akun Anda?',
          [
            { text: 'Batal', style: 'cancel' },
            { 
              text: 'Keluar', 
              style: 'destructive', 
              onPress: async () => {
                await logout();
              } 
            },
          ]
        );
      }}
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        borderRadius: 14,
        backgroundColor: c.surface,
        borderWidth: 1,
        borderColor: c.border,
        gap: 8,
      }}
    >
      <LogOut color={Accent.primary} size={16} />
      <Text style={{
        fontSize: 13,
        fontFamily: 'Outfit_600SemiBold',
        color: c.text,
      }}>
        Keluar dari Akun
      </Text>
    </TouchableOpacity>
  );

  const dangerCard = (
    <View style={{ gap: 16 }}>
      <TouchableOpacity
        onPress={handleReset}
        style={{
          width: '100%',
          paddingVertical: 16,
          borderRadius: 14,
          backgroundColor: 'rgba(239, 68, 68, 0.12)',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          borderWidth: 1,
          borderColor: 'rgba(239, 68, 68, 0.2)',
        }}
      >
        <RefreshCw size={14} color="#EF4444" />
        <Text style={{ fontSize: 13, fontFamily: 'Outfit_600SemiBold', color: '#EF4444' }}>
          Hapus Semua & Ulang Onboarding
        </Text>
      </TouchableOpacity>

      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
      }}>
        <Info size={10} color={c.textMuted} />
        <Text style={{
          fontSize: 10,
          fontFamily: 'Outfit_500Medium',
          color: c.textMuted,
        }}>
          BULK App v1.0.0 (by @daffs_26)
        </Text>
      </View>
    </View>
  );

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
            Profil & <Text style={{ color: Accent.primary }}>Pengaturan</Text>
          </Text>
          <Text style={{
            fontSize: 12,
            fontFamily: 'Outfit_500Medium',
            color: c.textMuted,
            marginTop: 4,
            letterSpacing: 0.2,
          }}>
            Kelola data fisik dan pengaturan tema
          </Text>
        </View>

        {isDesktop ? (
          <View style={{ flexDirection: 'row', gap: 20, alignItems: 'flex-start' }}>
            <View style={{ flex: 1, gap: 16 }}>
              {profileCard}
              {themeToggler}
            </View>
            <View style={{ flex: 1, gap: 16 }}>
              {geminiCard}
              {dangerCard}
            </View>
          </View>
        ) : (
          <View style={{ gap: 16 }}>
            {themeToggler}
            {profileCard}
            {geminiCard}
            {logoutCard}
            {dangerCard}
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

/* ── DataRow Component ── */
function DataRow({
  icon,
  label,
  value,
  c,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  c: typeof Colors.dark;
}) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        {icon}
        <Text style={{ fontSize: 12, fontFamily: 'Outfit_500Medium', color: c.textMuted }}>{label}</Text>
      </View>
      <Text style={{
        fontSize: 12,
        fontFamily: 'Outfit_600SemiBold',
        color: c.text,
        maxWidth: '55%',
        textAlign: 'right',
      }}>
        {value}
      </Text>
    </View>
  );
}

