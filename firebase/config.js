import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Client Firebase config comes ONLY from env — never hardcode keys or service accounts here.
const required = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
];

const missing = required.filter((key) => !process.env[key]);
export const firebaseConfigured = missing.length === 0;

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Soft-init: allow prerender/build without secrets. Call sites must tolerate missing config at runtime.
export const app = firebaseConfigured
  ? getApps().length
    ? getApps()[0]
    : initializeApp(firebaseConfig)
  : null;

/** @type {import('firebase/auth').Auth} */
export const auth = /** @type {any} */ (app ? getAuth(app) : null);
/** @type {import('firebase/firestore').Firestore} */
export const db = /** @type {any} */ (app ? getFirestore(app) : null);

if (!firebaseConfigured && process.env.NODE_ENV !== "production") {
  console.warn(
    `Missing Firebase env var(s): ${missing.join(", ")}. Copy .env.example to .env.local (never commit secrets).`
  );
}
