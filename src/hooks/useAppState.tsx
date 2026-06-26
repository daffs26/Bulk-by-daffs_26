import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'nativewind';
import { auth, db, isConfigured } from '../config/firebase';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  deleteDoc, 
  collection, 
  getDocs, 
  query, 
  orderBy 
} from 'firebase/firestore';

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
    let unsubscribeAuth: () => void = () => {};

    const loadStoredData = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem('@bulk_theme');
        const initialTheme = (storedTheme as 'dark' | 'light') || 'dark';
        setTheme(initialTheme);
        setColorScheme(initialTheme);

        if (!isConfigured) {
          // Offline / Local fallback: Load everything from AsyncStorage
          const storedProfile = await AsyncStorage.getItem('@bulk_user_profile');
          const storedOnboarded = await AsyncStorage.getItem('@bulk_is_onboarded');
          const storedFoods = await AsyncStorage.getItem('@bulk_food_logs');
          const storedWeights = await AsyncStorage.getItem('@bulk_weight_logs');
          const storedWater = await AsyncStorage.getItem('@bulk_water_logged');
          const storedStreak = await AsyncStorage.getItem('@bulk_streak');

          if (storedProfile) setUserProfile(JSON.parse(storedProfile));
          if (storedOnboarded) setIsOnboarded(JSON.parse(storedOnboarded));
          if (storedFoods) setFoodLogs(JSON.parse(storedFoods));
          if (storedWeights) setWeightLogs(JSON.parse(storedWeights));
          if (storedWater) setWaterLoggedMl(JSON.parse(storedWater));
          if (storedStreak) setStreak(JSON.parse(storedStreak));
          return;
        }

        // Firebase Sync mode
        signInAnonymously(auth).catch((err) => {
          console.error('Firebase Auth sign-in failed:', err);
        });

        unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
          if (user) {
            const uid = user.uid;

            // 1. Fetch User Profile
            const userDoc = await getDoc(doc(db, 'users', uid));
            if (userDoc.exists()) {
              const data = userDoc.data();
              setUserProfile(data as UserProfile);
              setIsOnboarded(true);
              setStreak(data.streak || 0);
              await AsyncStorage.setItem('@bulk_user_profile', JSON.stringify(data));
              await AsyncStorage.setItem('@bulk_is_onboarded', JSON.stringify(true));
              await AsyncStorage.setItem('@bulk_streak', JSON.stringify(data.streak || 0));
            } else {
              // Sync local profile to Firestore if exists
              const localProfile = await AsyncStorage.getItem('@bulk_user_profile');
              if (localProfile) {
                const parsed = JSON.parse(localProfile);
                setUserProfile(parsed);
                setIsOnboarded(true);
                await setDoc(doc(db, 'users', uid), { ...parsed, streak: 0 });
              }
            }

            // 2. Fetch Food Logs
            const foodQuery = query(collection(db, 'users', uid, 'food_logs'), orderBy('date', 'desc'));
            const foodSnap = await getDocs(foodQuery);
            const foods: FoodLog[] = [];
            foodSnap.forEach((doc) => {
              foods.push({ id: doc.id, ...doc.data() } as FoodLog);
            });
            if (foods.length > 0) {
              setFoodLogs(foods);
              await AsyncStorage.setItem('@bulk_food_logs', JSON.stringify(foods));
            } else {
              // Sync local food logs to Firestore if exists
              const localFoods = await AsyncStorage.getItem('@bulk_food_logs');
              if (localFoods) {
                const parsed = JSON.parse(localFoods) as FoodLog[];
                setFoodLogs(parsed);
                for (const f of parsed) {
                  await setDoc(doc(db, 'users', uid, 'food_logs', f.id), f);
                }
              }
            }

            // 3. Fetch Weight Logs
            const weightQuery = query(collection(db, 'users', uid, 'weight_logs'), orderBy('date', 'desc'));
            const weightSnap = await getDocs(weightQuery);
            const weights: WeightLog[] = [];
            weightSnap.forEach((doc) => {
              weights.push({ id: doc.id, ...doc.data() } as WeightLog);
            });
            if (weights.length > 0) {
              setWeightLogs(weights);
              await AsyncStorage.setItem('@bulk_weight_logs', JSON.stringify(weights));
            } else {
              // Sync local weight logs to Firestore if exists
              const localWeights = await AsyncStorage.getItem('@bulk_weight_logs');
              if (localWeights) {
                const parsed = JSON.parse(localWeights) as WeightLog[];
                setWeightLogs(parsed);
                for (const w of parsed) {
                  await setDoc(doc(db, 'users', uid, 'weight_logs', w.id), w);
                }
              }
            }

            // 4. Fetch Today's Water Logged
            const today = new Date().toISOString().split('T')[0];
            const waterDoc = await getDoc(doc(db, 'users', uid, 'water_logs', today));
            if (waterDoc.exists()) {
              const ml = waterDoc.data().ml || 0;
              setWaterLoggedMl(ml);
              await AsyncStorage.setItem('@bulk_water_logged', JSON.stringify(ml));
            } else {
              // Check if we have a locally stored water log to push
              const localWater = await AsyncStorage.getItem('@bulk_water_logged');
              if (localWater) {
                const ml = JSON.parse(localWater);
                setWaterLoggedMl(ml);
                await setDoc(doc(db, 'users', uid, 'water_logs', today), { ml, date: today });
              } else {
                setWaterLoggedMl(0);
                await AsyncStorage.setItem('@bulk_water_logged', JSON.stringify(0));
              }
            }
          }
        });
      } catch (e) {
        console.error('Failed to load storage data', e);
      }
    };

    loadStoredData();

    return () => {
      if (unsubscribeAuth) unsubscribeAuth();
    };
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
    
    const today = new Date().toISOString().split('T')[0];
    const initialLog: WeightLog = {
      id: Math.random().toString(36).substr(2, 9),
      weight: profile.weightCurrent,
      date: today
    };
    const newWeightLogs = [initialLog];
    setWeightLogs(newWeightLogs);
    await AsyncStorage.setItem('@bulk_weight_logs', JSON.stringify(newWeightLogs));

    if (isConfigured && auth.currentUser) {
      const uid = auth.currentUser.uid;
      await setDoc(doc(db, 'users', uid), { ...profile, streak: 0 });
      await setDoc(doc(db, 'users', uid, 'weight_logs', initialLog.id), initialLog);
    }
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

    const uniqueDays = new Set(foodLogs.map(f => f.date));
    let newStreak = streak;
    if (!uniqueDays.has(today)) {
      newStreak = streak + 1;
      setStreak(newStreak);
      await AsyncStorage.setItem('@bulk_streak', JSON.stringify(newStreak));
    }

    if (isConfigured && auth.currentUser) {
      const uid = auth.currentUser.uid;
      await setDoc(doc(db, 'users', uid, 'food_logs', newLog.id), newLog);
      if (userProfile) {
        await setDoc(doc(db, 'users', uid), { streak: newStreak }, { merge: true });
      }
    }
  };

  const deleteFoodLog = async (id: string) => {
    const updatedFoods = foodLogs.filter(f => f.id !== id);
    setFoodLogs(updatedFoods);
    await AsyncStorage.setItem('@bulk_food_logs', JSON.stringify(updatedFoods));

    if (isConfigured && auth.currentUser) {
      const uid = auth.currentUser.uid;
      await deleteDoc(doc(db, 'users', uid, 'food_logs', id));
    }
  };

  const addWeightLog = async (weight: number) => {
    const today = new Date().toISOString().split('T')[0];
    const newLog: WeightLog = {
      id: Math.random().toString(36).substr(2, 9),
      weight,
      date: today
    };
    const existingIndex = weightLogs.findIndex(w => w.date === today);
    let updatedWeights = [...weightLogs];
    if (existingIndex > -1) {
      updatedWeights[existingIndex] = newLog;
    } else {
      updatedWeights = [newLog, ...weightLogs];
    }
    setWeightLogs(updatedWeights);
    await AsyncStorage.setItem('@bulk_weight_logs', JSON.stringify(updatedWeights));

    let updatedProfile = userProfile;
    if (userProfile) {
      updatedProfile = { ...userProfile, weightCurrent: weight };
      setUserProfile(updatedProfile);
      await AsyncStorage.setItem('@bulk_user_profile', JSON.stringify(updatedProfile));
    }

    if (isConfigured && auth.currentUser) {
      const uid = auth.currentUser.uid;
      await setDoc(doc(db, 'users', uid, 'weight_logs', newLog.id), newLog);
      if (updatedProfile) {
        await setDoc(doc(db, 'users', uid), { weightCurrent: weight }, { merge: true });
      }
    }
  };

  const addWater = async (ml: number) => {
    const newWater = waterLoggedMl + ml;
    setWaterLoggedMl(newWater);
    await AsyncStorage.setItem('@bulk_water_logged', JSON.stringify(newWater));

    if (isConfigured && auth.currentUser) {
      const uid = auth.currentUser.uid;
      const today = new Date().toISOString().split('T')[0];
      await setDoc(doc(db, 'users', uid, 'water_logs', today), { ml: newWater, date: today });
    }
  };

  const resetWater = async () => {
    setWaterLoggedMl(0);
    await AsyncStorage.setItem('@bulk_water_logged', JSON.stringify(0));

    if (isConfigured && auth.currentUser) {
      const uid = auth.currentUser.uid;
      const today = new Date().toISOString().split('T')[0];
      await setDoc(doc(db, 'users', uid, 'water_logs', today), { ml: 0, date: today });
    }
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

    if (isConfigured && auth.currentUser) {
      const uid = auth.currentUser.uid;
      await deleteDoc(doc(db, 'users', uid));
      await auth.signOut();
    }
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
