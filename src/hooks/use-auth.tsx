'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut, type User } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc, onSnapshot, collection, query, where, updateDoc, writeBatch, collectionGroup } from 'firebase/firestore';
import type { Partnership, Invitation } from '@/types';
import { Loader2 } from 'lucide-react';
import { sendTaskReminders } from '@/app/actions';

interface AuthContextType {
  user: User | null;
  partnership: Partnership | null;
  invitations: Invitation[];
  loading: boolean;
  signIn: () => Promise<void>;
  logout: () => Promise<void>;
  acceptInvitation: (invitationId: string) => Promise<void>;
  declineInvitation: (invitationId: string) => Promise<void>;
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
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        setUser(firebaseUser);
        setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
        setPartnership(null);
        setInvitations([]);
        return;
    }

     // Roda a verificação de tarefas uma vez ao carregar a aplicação se o usuário estiver logado
    const vapidKeys = {
      publicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '',
      privateKey: process.env.VAPID_PRIVATE_KEY || '',
      subject: process.env.VAPID_SUBJECT || ''
    };
    if (vapidKeys.publicKey) {
      sendTaskReminders(vapidKeys);
    }
    
    // Listener for user's partnership
    const userDocRef = doc(db, 'users', user.uid);
    const unsubscribeUser = onSnapshot(userDocRef, (userDoc) => {
        const userData = userDoc.data();
        if (userData && userData.partnershipId) {
            const partnershipDocRef = doc(db, 'partnerships', userData.partnershipId);
            const unsubscribePartnership = onSnapshot(partnershipDocRef, (partnershipDoc) => {
                if (partnershipDoc.exists()) {
                    setPartnership({id: partnershipDoc.id, ...partnershipDoc.data()} as Partnership);
                } else {
                    setPartnership(null);
                }
            });
            return () => unsubscribePartnership();
        } else {
            setPartnership(null);
        }
    });

    // Listener for pending invitations
    const q = query(collection(db, 'invitations'), where('toEmail', '==', user.email), where('status', '==', 'pending'));
    const unsubscribeInvitations = onSnapshot(q, (snapshot) => {
        const invs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Invitation));
        setInvitations(invs);
    });


    return () => {
        unsubscribeUser();
        unsubscribeInvitations();
    };
}, [user]);


  const signIn = async () => {
    const provider = new GoogleAuthProvider();
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;

      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const userDocSnap = await getDoc(userDocRef);
      
      const photoBase64 = firebaseUser.photoURL ? await toBase64(firebaseUser.photoURL) : '';
      const userData = {
        displayName: firebaseUser.displayName,
        email: firebaseUser.email,
        photoURL: photoBase64,
      };

      if (!userDocSnap.exists()) {
          await setDoc(userDocRef, userData);
      } else {
          await updateDoc(userDocRef, userData);
      }
    } catch (error) {
      console.error("Error signing in with Google: ", error);
    } finally {
        // onAuthStateChanged vai ser chamado e vai setar o loading pra false
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out: ", error);
    } finally {
        // onAuthStateChanged vai ser chamado e vai setar o loading pra false
    }
  };

  const acceptInvitation = async (invitationId: string) => {
    if (!user) return;
    const invitation = invitations.find(inv => inv.id === invitationId);
    if (!invitation) return;

    const batch = writeBatch(db);

    // 1. Create new partnership
    const partnershipRef = doc(collection(db, 'partnerships'));
    const userPhoto = user.photoURL ? await toBase64(user.photoURL) : '';
    const newPartnership = {
        members: [
            { id: invitation.from.id, displayName: invitation.from.displayName, photoURL: invitation.from.photoURL },
            { id: user.uid, displayName: user.displayName, email: user.email, photoURL: userPhoto }
        ],
        harmonyFlame: {
            lastReset: new Date().toISOString()
        }
    };
    batch.set(partnershipRef, newPartnership);

    // 2. Update both users with the new partnershipId
    const user1Ref = doc(db, 'users', invitation.from.id);
    batch.update(user1Ref, { partnershipId: partnershipRef.id });

    const user2Ref = doc(db, 'users', user.uid);
    batch.update(user2Ref, { partnershipId: partnershipRef.id });
    
    // 3. Update the invitation status to 'accepted'
    const invitationRef = doc(db, 'invitations', invitationId);
    batch.update(invitationRef, { status: 'accepted' });

    await batch.commit();
  };

  const declineInvitation = async (invitationId: string) => {
    const invitationRef = doc(db, 'invitations', invitationId);
    await updateDoc(invitationRef, { status: 'declined' });
  };


  if (loading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, partnership, loading, invitations, signIn, logout, acceptInvitation, declineInvitation }}>
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
