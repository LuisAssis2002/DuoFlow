'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut, type User } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import type { Partnership } from '@/types';
import { Loader2 } from 'lucide-react';

interface AuthContextType {
  user: User | null;
  partnership: Partnership | null;
  loading: boolean;
  signIn: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Função para converter URL de imagem para Base64
const toBase64 = async (url: string): Promise<string> => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};


export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [partnership, setPartnership] = useState<Partnership | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        setUser(firebaseUser);
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        
        if (!userDocSnap.exists()) {
          const photoBase64 = firebaseUser.photoURL ? await toBase64(firebaseUser.photoURL) : '';
          await setDoc(userDocRef, {
            displayName: firebaseUser.displayName,
            email: firebaseUser.email,
            photoURL: photoBase64,
          });
        }
        
        // Listen for partnership changes
        onSnapshot(doc(db, 'users', firebaseUser.uid), (doc) => {
            const userData = doc.data();
            if(userData && userData.partnershipId) {
                onSnapshot(doc(db, 'partnerships', userData.partnershipId), (partnershipDoc) => {
                    if (partnershipDoc.exists()) {
                        setPartnership(partnershipDoc.data() as Partnership);
                    } else {
                        setPartnership(null);
                    }
                    setLoading(false); // Stop loading after partnership status is known
                });
            } else {
                setPartnership(null);
                setLoading(false); // Stop loading if no partnership
            }
        });

      } else {
        setUser(null);
        setPartnership(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // onAuthStateChanged will handle the rest
    } catch (error) {
      console.error("Error signing in with Google: ", error);
      setLoading(false); // Stop loading on error
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      // onAuthStateChanged will handle the rest
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, partnership, loading, signIn, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
