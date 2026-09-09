'use client';

import { onAuthStateChanged } from 'firebase/auth';
import { addDoc, collection, doc, onSnapshot } from 'firebase/firestore';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from './config';
import { coerceeUserObjectintoUserType, user } from './auth';
export type AuthContextTypeProps = {
  user: user | null;
};

export const AuthContext = createContext<AuthContextTypeProps>({ user: null });

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userData, setUserData] = useState<user | null>(null);

  useEffect(() => {
    const authClient = auth;
    const dbClient = db;
    if (!authClient || !dbClient) {
      return;
    }
    const unsubscribe = onAuthStateChanged(authClient, (userCredential) => {
      if (userCredential) {
        // console.log('User is authenticated:', userCredential);
        const docRef = doc(dbClient, 'users', userCredential.uid);

        onSnapshot(
          docRef,
          (documentSnapshot) => {
            if (documentSnapshot.exists()) {
              const data = documentSnapshot.data() as user;
              // console.log('User document data:', data);
              setUserData(data);
            } else {
              const c = collection(dbClient, 'users');

              let d = coerceeUserObjectintoUserType(userCredential);

              for (const [key, value] of Object.entries(d)) {
                if (value == null || value === '' || value === undefined) {
                  delete d[key as keyof typeof d];
                }
              }

              addDoc(c, d);

              setUserData(d as user);
            }
          },
          (error) => {
            if (process.env.NODE_ENV === 'development') {
              // console.error('Error accessing document:', error);
            }
            setUserData(null);
          }
        );
      } else {
        console.warn('User is not authenticated.');
        setUserData(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const value = { user: userData };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
