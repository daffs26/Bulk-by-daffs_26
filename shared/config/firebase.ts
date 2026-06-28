import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, memoryLocalCache } from 'firebase/firestore';
import { Platform } from 'react-native';

const getFirebaseConfig = () => {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    // If accessing via the website/landing page domain
    if (hostname.includes('bulk-website')) {
      return {
        apiKey: process.env.EXPO_PUBLIC_FIREBASE_WEB_API_KEY,
        authDomain: process.env.EXPO_PUBLIC_FIREBASE_WEB_AUTH_DOMAIN,
        projectId: process.env.EXPO_PUBLIC_FIREBASE_WEB_PROJECT_ID,
        storageBucket: process.env.EXPO_PUBLIC_FIREBASE_WEB_STORAGE_BUCKET,
        messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_WEB_MESSAGING_SENDER_ID,
        appId: process.env.EXPO_PUBLIC_FIREBASE_WEB_APP_ID,
      };
    }
  }

  // Default: Use App credentials (Android/iOS and non-website domains)
  return {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  };
};

const firebaseConfig = getFirebaseConfig();

// Check if we have minimum config keys
const isConfigured = !!firebaseConfig.apiKey;

// Initialize Firebase App safely
let app: any = null;
let auth: any = null;
let db: any = null;

if (isConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = initializeFirestore(app, {
      localCache: memoryLocalCache(),
    });
  } catch (e) {
    console.warn('Firebase initialization failed, running offline', e);
  }
}

export { app, auth, db, isConfigured };

