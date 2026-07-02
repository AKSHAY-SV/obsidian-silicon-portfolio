import { initializeApp, getApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// Safely access import.meta.env supporting both dev and build states
const env = (import.meta as any).env || {};

// Required Firebase configuration keys for standard web app functionality
const REQUIRED_KEYS = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_APP_ID'
] as const;

// Optional but recommended Firebase configuration keys
const OPTIONAL_KEYS = [
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_MEASUREMENT_ID',
  'VITE_FIREBASE_DATABASE_ID'
] as const;

/**
 * Checks if the Firebase client SDK is fully and correctly configured.
 * 
 * @returns {boolean} True if all required environment variables are present, false otherwise.
 */
export function isFirebaseConfigured(): boolean {
  return REQUIRED_KEYS.every(key => !!env[key]);
}

// Perform verification on module load to warn developers early
const missingRequired = REQUIRED_KEYS.filter(key => !env[key]);
const missingOptional = OPTIONAL_KEYS.filter(key => !env[key]);

if (missingRequired.length > 0) {
  console.error(
    `[Firebase Configuration Error] Missing required Firebase environment variables:\n` +
    missingRequired.map(key => `  - ${key}`).join('\n') +
    `\nPlease define these in your .env or platform settings. Access to database services may be unavailable or fail.`
  );
}

if (missingOptional.length > 0) {
  console.info(
    `[Firebase Configuration Info] Missing optional Firebase environment variables:\n` +
    missingOptional.map(key => `  - ${key}`).join('\n')
  );
}

// Safe default/dummy config for environment initialization to prevent early module load crash if variables are omitted
const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || 'MISSING_API_KEY',
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || 'MISSING_AUTH_DOMAIN',
  projectId: env.VITE_FIREBASE_PROJECT_ID || 'placeholder-project-id',
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || undefined,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || undefined,
  appId: env.VITE_FIREBASE_APP_ID || 'MISSING_APP_ID',
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID || undefined,
};

/**
 * The initialized FirebaseApp instance.
 * Ensures a single shared instance is used across the client lifetime.
 */
export const app: FirebaseApp = getApps().length === 0 
  ? initializeApp(firebaseConfig) 
  : getApp();

/**
 * The initialized Firestore Database instance.
 * Supports custom database IDs via VITE_FIREBASE_DATABASE_ID if provided.
 */
const databaseId = env.VITE_FIREBASE_DATABASE_ID;
export const db: Firestore = databaseId 
  ? getFirestore(app, databaseId) 
  : getFirestore(app);

/**
 * The initialized Firebase Authentication instance.
 */
export const auth: Auth = getAuth(app);

