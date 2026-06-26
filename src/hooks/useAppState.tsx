import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'nativewind';

export interface UserProfile {
  name: string;
  gender: 'male' | 'female';
  age: number;
  height: number;
  weightCurrent: number;
  weightTarget: number;
  activityLevel: 'sedentary' | 'light' | 'active' | 'very_active';
  goal: 'cutting' | 'bulking' | 'maintenance';
  bmi: number;
  tdee: number;
  targetCalories: number;
  targetMacros: {
    protein: number;
    carb: number;
    fat: number;
  };
}

export interface FoodLog {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  date: string; // YYYY-MM-DD
}

export interface WeightLog {
  id: string;
  weight: number;
  date: string; // YYYY-MM-DD
}

interface AppStateContextType {
  isOnboarded: boolean;
  userProfile: UserProfile | null;
  foodLogs: FoodLog[];
  weightLogs: WeightLog[];
  waterLoggedMl: number;
  streak: number;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  setOnboardingData: (profile: UserProfile) => Promise<void>;
  addFoodLog: (food: Omit<FoodLog, 'id' | 'date'>) => Promise<void>;
  deleteFoodLog: (id: string) => Promise<void>;
  addWeightLog: (weight: number) => Promise<void>;
  addWater: (ml: number) => Promise<void>;
  resetWater: () => Promise<void>;
  resetAllData: () => Promise<void>;
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

// BMR (Harris-Benedict Revised) and TDEE formulas
export const calculateFitnessMetrics = (
  gender: 'male' | 'female',
  age: number,
  height: number,
  weight: number,
  activityLevel: UserProfile['activityLevel'],
  goal: UserProfile['goal']
) => {
  // BMI Check
  const heightM = height / 100;
  const bmi = Number((weight / (heightM * heightM)).toFixed(1));

  // BMR Calculation
  let bmr = 0;
  if (gender === 'male') {
    bmr = 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age;
  } else {
    bmr = 447.593 + 9.247 * weight + 3.098 * height - 4.33 * age;
  }

  // Activity Multipliers
  const multipliers = {
    sedentary: 1.2,
    light: 1.375,
    active: 1.55,
    very_active: 1.725,
  };
  const tdee = Math.round(bmr * multipliers[activityLevel]);

  // Calorie Targets based on Goal
  let targetCalories = tdee;
  if (goal === 'cutting') {
    targetCalories = Math.max(1200, tdee - 400); // Prevent going below extreme starvation limit
  } else if (goal === 'bulking') {
    targetCalories = tdee + 400;
  }

  // Macro Distributions
  let targetMacros = { protein: 0, carb: 0, fat: 0 };
  if (goal === 'cutting') {
    // Protein 40% / Carb 30% / Fat 30%
    targetMacros = {
      protein: Math.round((targetCalories * 0.4) / 4),
      carb: Math.round((targetCalories * 0.3) / 4),
      fat: Math.round((targetCalories * 0.3) / 9),
    };
  } else if (goal === 'bulking') {
    // Protein 30% / Carb 50% / Fat 20%
    targetMacros = {
      protein: Math.round((targetCalories * 0.3) / 4),
      carb: Math.round((targetCalories * 0.5) / 4),
      fat: Math.round((targetCalories * 0.2) / 9),
    };
  } else {
    // Maintenance: Protein 30% / Carb 40% / Fat 30%
    targetMacros = {
      protein: Math.round((targetCalories * 0.3) / 4),
      carb: Math.round((targetCalories * 0.4) / 4),
      fat: Math.round((targetCalories * 0.3) / 9),
    };
  }

  return { bmi, tdee: Math.round(tdee), targetCalories, targetMacros };
};

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOnboarded, setIsOnboarded] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [foodLogs, setFoodLogs] = useState<FoodLog[]>([]);
  const [weightLogs, setWeightLogs] = useState<WeightLog[]>([]);
  const [waterLoggedMl, setWaterLoggedMl] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  
  const { colorScheme, setColorScheme } = useColorScheme();
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Load state on mount
  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const storedProfile = await AsyncStorage.getItem('@bulk_user_profile');
        const storedOnboarded = await AsyncStorage.getItem('@bulk_is_onboarded');
        const storedFoods = await AsyncStorage.getItem('@bulk_food_logs');
        const storedWeights = await AsyncStorage.getItem('@bulk_weight_logs');
        const storedWater = await AsyncStorage.getItem('@bulk_water_logged');
        const storedStreak = await AsyncStorage.getItem('@bulk_streak');
        const storedTheme = await AsyncStorage.getItem('@bulk_theme');

        if (storedProfile) setUserProfile(JSON.parse(storedProfile));
        if (storedOnboarded) setIsOnboarded(JSON.parse(storedOnboarded));
        if (storedFoods) setFoodLogs(JSON.parse(storedFoods));
        if (storedWeights) setWeightLogs(JSON.parse(storedWeights));
        if (storedWater) setWaterLoggedMl(JSON.parse(storedWater));
        if (storedStreak) setStreak(JSON.parse(storedStreak));
        
        const initialTheme = (storedTheme as 'dark' | 'light') || 'dark';
        setTheme(initialTheme);
        setColorScheme(initialTheme);
      } catch (e) {
        console.error('Failed to load storage', e);
      }
    };
    loadStoredData();
  }, []);

  const toggleTheme = async () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    setColorScheme(newTheme);
    await AsyncStorage.setItem('@bulk_theme', newTheme);
  };

  const setOnboardingData = async (profile: UserProfile) => {
    setUserProfile(profile);
    setIsOnboarded(true);
    await AsyncStorage.setItem('@bulk_user_profile', JSON.stringify(profile));
    await AsyncStorage.setItem('@bulk_is_onboarded', JSON.stringify(true));
    
    // Seed initial weight log
    const today = new Date().toISOString().split('T')[0];
    const initialLog: WeightLog = {
      id: Math.random().toString(36).substr(2, 9),
      weight: profile.weightCurrent,
      date: today
    };
    const newWeightLogs = [initialLog];
    setWeightLogs(newWeightLogs);
    await AsyncStorage.setItem('@bulk_weight_logs', JSON.stringify(newWeightLogs));
  };

  const addFoodLog = async (food: Omit<FoodLog, 'id' | 'date'>) => {
    const today = new Date().toISOString().split('T')[0];
    const newLog: FoodLog = {
      ...food,
      id: Math.random().toString(36).substr(2, 9),
      date: today
    };
    const updatedFoods = [newLog, ...foodLogs];
    setFoodLogs(updatedFoods);
    await AsyncStorage.setItem('@bulk_food_logs', JSON.stringify(updatedFoods));

    // Update streak if this is the first log of today
    const uniqueDays = new Set(foodLogs.map(f => f.date));
    if (!uniqueDays.has(today)) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      await AsyncStorage.setItem('@bulk_streak', JSON.stringify(newStreak));
    }
  };

  const deleteFoodLog = async (id: string) => {
    const updatedFoods = foodLogs.filter(f => f.id !== id);
    setFoodLogs(updatedFoods);
    await AsyncStorage.setItem('@bulk_food_logs', JSON.stringify(updatedFoods));
  };

  const addWeightLog = async (weight: number) => {
    const today = new Date().toISOString().split('T')[0];
    const newLog: WeightLog = {
      id: Math.random().toString(36).substr(2, 9),
      weight,
      date: today
    };
    // If today's log already exists, replace it, else append
    const existingIndex = weightLogs.findIndex(w => w.date === today);
    let updatedWeights = [...weightLogs];
    if (existingIndex > -1) {
      updatedWeights[existingIndex] = newLog;
    } else {
      updatedWeights = [newLog, ...weightLogs];
    }
    setWeightLogs(updatedWeights);
    await AsyncStorage.setItem('@bulk_weight_logs', JSON.stringify(updatedWeights));

    // Also update current profile weight
    if (userProfile) {
      const updatedProfile = { ...userProfile, weightCurrent: weight };
      setUserProfile(updatedProfile);
      await AsyncStorage.setItem('@bulk_user_profile', JSON.stringify(updatedProfile));
    }
  };

  const addWater = async (ml: number) => {
    const newWater = waterLoggedMl + ml;
    setWaterLoggedMl(newWater);
    await AsyncStorage.setItem('@bulk_water_logged', JSON.stringify(newWater));
  };

  const resetWater = async () => {
    setWaterLoggedMl(0);
    await AsyncStorage.setItem('@bulk_water_logged', JSON.stringify(0));
  };

  const resetAllData = async () => {
    setIsOnboarded(false);
    setUserProfile(null);
    setFoodLogs([]);
    setWeightLogs([]);
    setWaterLoggedMl(0);
    setStreak(0);
    await AsyncStorage.removeItem('@bulk_user_profile');
    await AsyncStorage.removeItem('@bulk_is_onboarded');
    await AsyncStorage.removeItem('@bulk_food_logs');
    await AsyncStorage.removeItem('@bulk_weight_logs');
    await AsyncStorage.removeItem('@bulk_water_logged');
    await AsyncStorage.removeItem('@bulk_streak');
  };

  return (
    <AppStateContext.Provider
      value={{
        isOnboarded,
        userProfile,
        foodLogs,
        weightLogs,
        waterLoggedMl,
        streak,
        theme,
        toggleTheme,
        setOnboardingData,
        addFoodLog,
        deleteFoodLog,
        addWeightLog,
        addWater,
        resetWater,
        resetAllData,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};
