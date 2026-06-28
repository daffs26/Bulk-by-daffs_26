import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Platform } from 'react-native';
import { useColorScheme } from 'nativewind';
import { useSQLiteContext } from 'expo-sqlite';

const useSQLiteSafe = Platform.OS === 'web' ? () => null : useSQLiteContext;
import { auth, db, isConfigured } from '../config/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile,
  signOut, 
  onAuthStateChanged,
} from 'firebase/auth';
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

interface LocalUser {
  uid: string;
  email: string;
  displayName?: string;
}

interface AppStateContextType {
  isOnboarded: boolean;
  userProfile: UserProfile | null;
  foodLogs: FoodLog[];
  weightLogs: WeightLog[];
  waterLoggedMl: number;
  streak: number;
  theme: 'dark' | 'light';
  user: LocalUser | null;
  toggleTheme: () => void;
  setOnboardingData: (profile: UserProfile) => Promise<void>;
  addFoodLog: (food: Omit<FoodLog, 'id' | 'date'>) => Promise<void>;
  deleteFoodLog: (id: string) => Promise<void>;
  addWeightLog: (weight: number) => Promise<void>;
  addWater: (ml: number) => Promise<void>;
  resetWater: () => Promise<void>;
  resetAllData: () => Promise<void>;
  loginWithEmailAndPassword: (email: string, password: string) => Promise<void>;
  registerWithEmailAndPassword: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
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

  // Goal adjustments
  let targetCalories = tdee;
  if (goal === 'cutting') {
    targetCalories = Math.round(tdee - 500);
  } else if (goal === 'bulking') {
    targetCalories = Math.round(tdee + 300);
  }

  // Macros split (Protein: 2g per kg, Fat: 25% of energy, Carbs: remaining)
  const proteinG = Math.round(weight * 2.0);
  const proteinKcal = proteinG * 4;
  const fatKcal = Math.round(targetCalories * 0.25);
  const fatG = Math.round(fatKcal / 9);
  const carbKcal = targetCalories - (proteinKcal + fatKcal);
  const carbG = Math.round(carbKcal / 4);

  return {
    bmi,
    tdee,
    targetCalories,
    targetMacros: {
      protein: proteinG,
      carb: carbG,
      fat: fatG,
    },
  };
};

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dbSqlite = useSQLiteSafe();
  const [user, setUser] = useState<LocalUser | null>(null);
  const [isOnboarded, setIsOnboarded] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [foodLogs, setFoodLogs] = useState<FoodLog[]>([]);
  const [weightLogs, setWeightLogs] = useState<WeightLog[]>([]);
  const [waterLoggedMl, setWaterLoggedMl] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  
  const { colorScheme, setColorScheme } = useColorScheme();
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const getStorageKey = (baseKey: string, activeUser?: LocalUser | null) => {
    const currentUser = activeUser !== undefined ? activeUser : user;
    return currentUser ? `${baseKey}_${currentUser.uid}` : baseKey;
  };

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
          // Offline / Local fallback
          const storedLocalUser = await AsyncStorage.getItem('@bulk_local_active_user');
          if (storedLocalUser) {
            const parsedUser = JSON.parse(storedLocalUser) as LocalUser;
            setUser(parsedUser);
            const uid = parsedUser.uid;

            if (dbSqlite) {
              // 1. Fetch User Profile
              const localDbUser: any = await dbSqlite.getFirstAsync(
                `SELECT * FROM users WHERE uid = ?;`,
                [uid]
              );
              if (localDbUser) {
                const profile: UserProfile = {
                  name: localDbUser.name,
                  gender: localDbUser.gender,
                  age: localDbUser.age,
                  height: localDbUser.height,
                  weightCurrent: localDbUser.weight_current,
                  weightTarget: localDbUser.weight_target,
                  activityLevel: localDbUser.activity_level,
                  goal: localDbUser.goal,
                  bmi: localDbUser.bmi,
                  tdee: localDbUser.tdee,
                  targetCalories: localDbUser.target_calories,
                  targetMacros: {
                    protein: localDbUser.target_protein,
                    carb: localDbUser.target_carb,
                    fat: localDbUser.target_fat,
                  }
                };
                setUserProfile(profile);
                setIsOnboarded(localDbUser.is_onboarded === 1);
                setStreak(localDbUser.streak || 0);
              }

              // 2. Fetch Food Logs
              const dbFoods: any[] = await dbSqlite.getAllAsync(
                `SELECT * FROM food_logs WHERE user_id = ? ORDER BY date DESC;`,
                [uid]
              );
              const mappedFoods: FoodLog[] = dbFoods.map(f => ({
                id: f.id,
                name: f.name,
                calories: f.calories,
                protein: f.protein,
                carbs: f.carbs,
                fat: f.fat,
                mealType: f.meal_type,
                date: f.date
              }));
              setFoodLogs(mappedFoods);

              // 3. Fetch Weight Logs
              const dbWeights: any[] = await dbSqlite.getAllAsync(
                `SELECT * FROM weight_logs WHERE user_id = ? ORDER BY date DESC;`,
                [uid]
              );
              const mappedWeights: WeightLog[] = dbWeights.map(w => ({
                id: w.id,
                weight: w.weight,
                date: w.date
              }));
              setWeightLogs(mappedWeights);

              // 4. Fetch Today's Water
              const today = new Date().toISOString().split('T')[0];
              const dbWater: any = await dbSqlite.getFirstAsync(
                `SELECT ml FROM water_logs WHERE user_id = ? AND date = ?;`,
                [uid, today]
              );
              setWaterLoggedMl(dbWater ? dbWater.ml : 0);
            } else {
              // Web Fallback: Load everything from AsyncStorage
              const storedProfile = await AsyncStorage.getItem(getStorageKey('@bulk_user_profile', parsedUser));
              const storedOnboarded = await AsyncStorage.getItem(getStorageKey('@bulk_is_onboarded', parsedUser));
              const storedFoods = await AsyncStorage.getItem(getStorageKey('@bulk_food_logs', parsedUser));
              const storedWeights = await AsyncStorage.getItem(getStorageKey('@bulk_weight_logs', parsedUser));
              const storedWater = await AsyncStorage.getItem(getStorageKey('@bulk_water_logged', parsedUser));
              const storedStreak = await AsyncStorage.getItem(getStorageKey('@bulk_streak', parsedUser));

              if (storedProfile) setUserProfile(JSON.parse(storedProfile));
              if (storedOnboarded) setIsOnboarded(JSON.parse(storedOnboarded));
              if (storedFoods) setFoodLogs(JSON.parse(storedFoods));
              if (storedWeights) setWeightLogs(JSON.parse(storedWeights));
              if (storedWater) setWaterLoggedMl(JSON.parse(storedWater));
              if (storedStreak) setStreak(JSON.parse(storedStreak));
            }
          }
          return;
        }

        // Firebase Sync mode
        unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
          if (firebaseUser) {
            const mappedUser: LocalUser = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || undefined
            };
            setUser(mappedUser);
            const uid = firebaseUser.uid;

            // 1. Fetch User Profile
            const userDoc = await getDoc(doc(db, 'users', uid));
            if (userDoc.exists()) {
              const data = userDoc.data();
              setUserProfile(data as UserProfile);
              setIsOnboarded(true);
              setStreak(data.streak || 0);
              await AsyncStorage.setItem(getStorageKey('@bulk_user_profile', mappedUser), JSON.stringify(data));
              await AsyncStorage.setItem(getStorageKey('@bulk_is_onboarded', mappedUser), JSON.stringify(true));
              await AsyncStorage.setItem(getStorageKey('@bulk_streak', mappedUser), JSON.stringify(data.streak || 0));
            } else {
              // Sync local profile to Firestore if exists
              const localProfile = await AsyncStorage.getItem(getStorageKey('@bulk_user_profile', mappedUser));
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
              await AsyncStorage.setItem(getStorageKey('@bulk_food_logs', mappedUser), JSON.stringify(foods));
            } else {
              // Sync local food logs to Firestore if exists
              const localFoods = await AsyncStorage.getItem(getStorageKey('@bulk_food_logs', mappedUser));
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
              await AsyncStorage.setItem(getStorageKey('@bulk_weight_logs', mappedUser), JSON.stringify(weights));
            } else {
              // Sync local weight logs to Firestore if exists
              const localWeights = await AsyncStorage.getItem(getStorageKey('@bulk_weight_logs', mappedUser));
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
              await AsyncStorage.setItem(getStorageKey('@bulk_water_logged', mappedUser), JSON.stringify(ml));
            } else {
              // Check if we have a locally stored water log to push
              const localWater = await AsyncStorage.getItem(getStorageKey('@bulk_water_logged', mappedUser));
              if (localWater) {
                const ml = JSON.parse(localWater);
                setWaterLoggedMl(ml);
                await setDoc(doc(db, 'users', uid, 'water_logs', today), { ml, date: today });
              } else {
                setWaterLoggedMl(0);
                await AsyncStorage.setItem(getStorageKey('@bulk_water_logged', mappedUser), JSON.stringify(0));
              }
            }
          } else {
            setUser(null);
            setUserProfile(null);
            setIsOnboarded(false);
            setFoodLogs([]);
            setWeightLogs([]);
            setWaterLoggedMl(0);
            setStreak(0);
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
    await AsyncStorage.setItem(getStorageKey('@bulk_user_profile'), JSON.stringify(profile));
    await AsyncStorage.setItem(getStorageKey('@bulk_is_onboarded'), JSON.stringify(true));
    
    const today = new Date().toISOString().split('T')[0];
    const initialLog: WeightLog = {
      id: Math.random().toString(36).substr(2, 9),
      weight: profile.weightCurrent,
      date: today
    };
    const newWeightLogs = [initialLog];
    setWeightLogs(newWeightLogs);
    await AsyncStorage.setItem(getStorageKey('@bulk_weight_logs'), JSON.stringify(newWeightLogs));

    if (dbSqlite) {
      try {
        const uid = user?.uid || 'local-user';
        await dbSqlite.runAsync(
          `INSERT OR REPLACE INTO users (uid, email, name, gender, age, height, weight_current, weight_target, activity_level, goal, bmi, tdee, target_calories, target_protein, target_carb, target_fat, streak, is_onboarded, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
          [uid, user?.email || '', profile.name, profile.gender, profile.age, profile.height, profile.weightCurrent, profile.weightTarget, profile.activityLevel, profile.goal, profile.bmi, profile.tdee, profile.targetCalories, profile.targetMacros.protein, profile.targetMacros.carb, profile.targetMacros.fat, 0, 1, new Date().toISOString()]
        );
        await dbSqlite.runAsync(
          `INSERT OR REPLACE INTO weight_logs (id, user_id, weight, date) VALUES (?, ?, ?, ?);`,
          [initialLog.id, uid, profile.weightCurrent, today]
        );
      } catch (err) {
        console.error('Error inserting onboarding SQLite:', err);
      }
    }

    if (isConfigured && auth && auth.currentUser) {
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
    await AsyncStorage.setItem(getStorageKey('@bulk_food_logs'), JSON.stringify(updatedFoods));

    const uniqueDays = new Set(foodLogs.map(f => f.date));
    let newStreak = streak;
    if (!uniqueDays.has(today)) {
      newStreak = streak + 1;
      setStreak(newStreak);
      await AsyncStorage.setItem(getStorageKey('@bulk_streak'), JSON.stringify(newStreak));
    }

    if (dbSqlite) {
      try {
        const uid = user?.uid || 'local-user';
        await dbSqlite.runAsync(
          `INSERT INTO food_logs (id, user_id, name, calories, protein, carbs, fat, meal_type, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
          [newLog.id, uid, food.name, food.calories, food.protein || 0, food.carbs || 0, food.fat || 0, food.mealType, today]
        );
        await dbSqlite.runAsync(
          `UPDATE users SET streak = ? WHERE uid = ?;`,
          [newStreak, uid]
        );
      } catch (err) {
        console.error('Error adding food log SQLite:', err);
      }
    }

    if (isConfigured && auth && auth.currentUser) {
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
    await AsyncStorage.setItem(getStorageKey('@bulk_food_logs'), JSON.stringify(updatedFoods));

    if (dbSqlite) {
      try {
        await dbSqlite.runAsync(`DELETE FROM food_logs WHERE id = ?;`, [id]);
      } catch (err) {
        console.error('Error deleting food log SQLite:', err);
      }
    }

    if (isConfigured && auth && auth.currentUser) {
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
    await AsyncStorage.setItem(getStorageKey('@bulk_weight_logs'), JSON.stringify(updatedWeights));

    let updatedProfile = userProfile;
    if (userProfile) {
      updatedProfile = { ...userProfile, weightCurrent: weight };
      setUserProfile(updatedProfile);
      await AsyncStorage.setItem(getStorageKey('@bulk_user_profile'), JSON.stringify(updatedProfile));
    }

    if (dbSqlite) {
      try {
        const uid = user?.uid || 'local-user';
        await dbSqlite.runAsync(
          `INSERT OR REPLACE INTO weight_logs (id, user_id, weight, date) VALUES (?, ?, ?, ?);`,
          [newLog.id, uid, weight, today]
        );
        await dbSqlite.runAsync(
          `UPDATE users SET weight_current = ? WHERE uid = ?;`,
          [weight, uid]
        );
      } catch (err) {
        console.error('Error adding weight log SQLite:', err);
      }
    }

    if (isConfigured && auth && auth.currentUser) {
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
    await AsyncStorage.setItem(getStorageKey('@bulk_water_logged'), JSON.stringify(newWater));

    if (dbSqlite) {
      try {
        const uid = user?.uid || 'local-user';
        const today = new Date().toISOString().split('T')[0];
        await dbSqlite.runAsync(
          `INSERT OR REPLACE INTO water_logs (user_id, date, ml) VALUES (?, ?, ?);`,
          [uid, today, newWater]
        );
      } catch (err) {
        console.error('Error adding water log SQLite:', err);
      }
    }

    if (isConfigured && auth && auth.currentUser) {
      const uid = auth.currentUser.uid;
      const today = new Date().toISOString().split('T')[0];
      await setDoc(doc(db, 'users', uid, 'water_logs', today), { ml: newWater, date: today });
    }
  };

  const resetWater = async () => {
    setWaterLoggedMl(0);
    await AsyncStorage.setItem(getStorageKey('@bulk_water_logged'), JSON.stringify(0));

    if (dbSqlite) {
      try {
        const uid = user?.uid || 'local-user';
        const today = new Date().toISOString().split('T')[0];
        await dbSqlite.runAsync(
          `INSERT OR REPLACE INTO water_logs (user_id, date, ml) VALUES (?, ?, 0);`,
          [uid, today]
        );
      } catch (err) {
        console.error('Error resetting water log SQLite:', err);
      }
    }

    if (isConfigured && auth && auth.currentUser) {
      const uid = auth.currentUser.uid;
      const today = new Date().toISOString().split('T')[0];
      await setDoc(doc(db, 'users', uid, 'water_logs', today), { ml: 0, date: today });
    }
  };

  const resetAllData = async () => {
    const currentUid = user?.uid;
    setIsOnboarded(false);
    setUserProfile(null);
    setFoodLogs([]);
    setWeightLogs([]);
    setWaterLoggedMl(0);
    setStreak(0);
    
    await AsyncStorage.removeItem(getStorageKey('@bulk_user_profile'));
    await AsyncStorage.removeItem(getStorageKey('@bulk_is_onboarded'));
    await AsyncStorage.removeItem(getStorageKey('@bulk_food_logs'));
    await AsyncStorage.removeItem(getStorageKey('@bulk_weight_logs'));
    await AsyncStorage.removeItem(getStorageKey('@bulk_water_logged'));
    await AsyncStorage.removeItem(getStorageKey('@bulk_streak'));

    if (dbSqlite) {
      try {
        const uid = currentUid || 'local-user';
        await dbSqlite.runAsync(`DELETE FROM users WHERE uid = ?;`, [uid]);
        await dbSqlite.runAsync(`DELETE FROM food_logs WHERE user_id = ?;`, [uid]);
        await dbSqlite.runAsync(`DELETE FROM weight_logs WHERE user_id = ?;`, [uid]);
        await dbSqlite.runAsync(`DELETE FROM water_logs WHERE user_id = ?;`, [uid]);
      } catch (err) {
        console.error('Error resetting data SQLite:', err);
      }
    }

    if (isConfigured && auth && auth.currentUser) {
      const uid = auth.currentUser.uid;
      await deleteDoc(doc(db, 'users', uid));
      await auth.signOut();
    } else {
      // Offline mode: clean local user credentials as well
      const storedUsersStr = await AsyncStorage.getItem('@bulk_local_users');
      if (storedUsersStr && currentUid) {
        const users = JSON.parse(storedUsersStr);
        const filtered = users.filter((u: any) => u.uid !== currentUid);
        await AsyncStorage.setItem('@bulk_local_users', JSON.stringify(filtered));
      }
      await AsyncStorage.removeItem('@bulk_local_active_user');
      setUser(null);
    }
  };

  const loginWithEmailAndPassword = async (email: string, password: string) => {
    if (!isConfigured) {
      // Offline mode: check local AsyncStorage database
      const storedUsersStr = await AsyncStorage.getItem('@bulk_local_users');
      const users = storedUsersStr ? JSON.parse(storedUsersStr) : [];
      const matched = users.find((u: any) => u.email === email && u.password === password);
      
      if (!matched) {
        throw new Error('Email atau password salah.');
      }

      const localUser = { uid: matched.uid, email: matched.email, displayName: matched.name };
      setUser(localUser);
      await AsyncStorage.setItem('@bulk_local_active_user', JSON.stringify(localUser));

      // Load user local state data
      if (dbSqlite) {
        const uid = localUser.uid;
        // 1. Fetch User Profile
        const localDbUser: any = await dbSqlite.getFirstAsync(
          `SELECT * FROM users WHERE uid = ?;`,
          [uid]
        );
        if (localDbUser) {
          const profile: UserProfile = {
            name: localDbUser.name,
            gender: localDbUser.gender,
            age: localDbUser.age,
            height: localDbUser.height,
            weightCurrent: localDbUser.weight_current,
            weightTarget: localDbUser.weight_target,
            activityLevel: localDbUser.activity_level,
            goal: localDbUser.goal,
            bmi: localDbUser.bmi,
            tdee: localDbUser.tdee,
            targetCalories: localDbUser.target_calories,
            targetMacros: {
              protein: localDbUser.target_protein,
              carb: localDbUser.target_carb,
              fat: localDbUser.target_fat,
            }
          };
          setUserProfile(profile);
          setIsOnboarded(localDbUser.is_onboarded === 1);
          setStreak(localDbUser.streak || 0);
        } else {
          setUserProfile(null);
          setIsOnboarded(false);
          setStreak(0);
        }

        // 2. Fetch Food Logs
        const dbFoods: any[] = await dbSqlite.getAllAsync(
          `SELECT * FROM food_logs WHERE user_id = ? ORDER BY date DESC;`,
          [uid]
        );
        setFoodLogs(dbFoods.map(f => ({
          id: f.id,
          name: f.name,
          calories: f.calories,
          protein: f.protein,
          carbs: f.carbs,
          fat: f.fat,
          mealType: f.meal_type,
          date: f.date
        })));

        // 3. Fetch Weight Logs
        const dbWeights: any[] = await dbSqlite.getAllAsync(
          `SELECT * FROM weight_logs WHERE user_id = ? ORDER BY date DESC;`,
          [uid]
        );
        setWeightLogs(dbWeights.map(w => ({
          id: w.id,
          weight: w.weight,
          date: w.date
        })));

        // 4. Fetch Today's Water
        const today = new Date().toISOString().split('T')[0];
        const dbWater: any = await dbSqlite.getFirstAsync(
          `SELECT ml FROM water_logs WHERE user_id = ? AND date = ?;`,
          [uid, today]
        );
        setWaterLoggedMl(dbWater ? dbWater.ml : 0);
      } else {
        const storedProfile = await AsyncStorage.getItem(getStorageKey('@bulk_user_profile', localUser));
        const storedOnboarded = await AsyncStorage.getItem(getStorageKey('@bulk_is_onboarded', localUser));
        const storedFoods = await AsyncStorage.getItem(getStorageKey('@bulk_food_logs', localUser));
        const storedWeights = await AsyncStorage.getItem(getStorageKey('@bulk_weight_logs', localUser));
        const storedWater = await AsyncStorage.getItem(getStorageKey('@bulk_water_logged', localUser));
        const storedStreak = await AsyncStorage.getItem(getStorageKey('@bulk_streak', localUser));

        if (storedProfile) setUserProfile(JSON.parse(storedProfile));
        else setUserProfile(null);

        if (storedOnboarded) setIsOnboarded(JSON.parse(storedOnboarded));
        else setIsOnboarded(false);

        setFoodLogs(storedFoods ? JSON.parse(storedFoods) : []);
        setWeightLogs(storedWeights ? JSON.parse(storedWeights) : []);
        setWaterLoggedMl(storedWater ? JSON.parse(storedWater) : 0);
        setStreak(storedStreak ? JSON.parse(storedStreak) : 0);
      }
      return;
    }

    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      setUser({
        uid: res.user.uid,
        email: res.user.email || '',
        displayName: res.user.displayName || undefined
      });
    } catch (error: any) {
      console.error('Firebase login error:', error);
      let errMsg = 'Gagal login.';
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errMsg = 'Email atau password salah.';
      } else if (error.code === 'auth/invalid-email') {
        errMsg = 'Format email tidak valid.';
      }
      throw new Error(errMsg);
    }
  };

  const registerWithEmailAndPassword = async (name: string, email: string, password: string) => {
    if (!email || !email.includes('@')) {
      throw new Error('Masukkan alamat email yang valid.');
    }
    if (!password || password.length < 6) {
      throw new Error('Password minimal harus 6 karakter.');
    }

    if (!isConfigured) {
      // Offline mode: store local credentials
      const storedUsersStr = await AsyncStorage.getItem('@bulk_local_users');
      const users = storedUsersStr ? JSON.parse(storedUsersStr) : [];
      if (users.some((u: any) => u.email === email)) {
        throw new Error('Email sudah terdaftar.');
      }
      const newUid = `local-uid-${Date.now()}`;
      const newUser = { uid: newUid, name, email, password };
      users.push(newUser);
      await AsyncStorage.setItem('@bulk_local_users', JSON.stringify(users));

      // Auto login
      const localUser = { uid: newUid, email, displayName: name };
      setUser(localUser);
      await AsyncStorage.setItem('@bulk_local_active_user', JSON.stringify(localUser));

      // Reset state for new local user
      setUserProfile(null);
      setIsOnboarded(false);
      setFoodLogs([]);
      setWeightLogs([]);
      setWaterLoggedMl(0);
      setStreak(0);
      return;
    }

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(res.user, { displayName: name });
      setUser({
        uid: res.user.uid,
        email: res.user.email || '',
        displayName: name
      });
    } catch (error: any) {
      console.error('Firebase registration error:', error);
      let errMsg = 'Gagal mendaftar.';
      if (error.code === 'auth/email-already-in-use') {
        errMsg = 'Email sudah digunakan oleh akun lain.';
      } else if (error.code === 'auth/weak-password') {
        errMsg = 'Password terlalu lemah (minimal 6 karakter).';
      }
      throw new Error(errMsg);
    }
  };

  const logout = async () => {
    if (isConfigured && auth) {
      await signOut(auth);
    }
    
    // Clear active session
    await AsyncStorage.removeItem('@bulk_local_active_user');
    
    setUser(null);
    setUserProfile(null);
    setIsOnboarded(false);
    setFoodLogs([]);
    setWeightLogs([]);
    setWaterLoggedMl(0);
    setStreak(0);
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
        user,
        toggleTheme,
        setOnboardingData,
        addFoodLog,
        deleteFoodLog,
        addWeightLog,
        addWater,
        resetWater,
        resetAllData,
        loginWithEmailAndPassword,
        registerWithEmailAndPassword,
        logout,
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
