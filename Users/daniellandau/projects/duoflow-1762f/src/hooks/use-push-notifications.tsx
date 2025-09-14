
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from './use-auth';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import { useToast } from './use-toast';

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

function urlBase64ToUint8Array(base64String: string) {  
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export function usePushNotifications() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window && 'serviceWorker' in navigator && VAPID_PUBLIC_KEY) {
      setIsSupported(true);
      setPermissionStatus(Notification.permission);
      navigator.serviceWorker.register('/sw.js');
    }
  }, []);

  useEffect(() => {
    const checkSubscription = async () => {
      if (!isSupported) return;
      try {
        const registration = await navigator.serviceWorker.ready;
        const currentSubscription = await registration.pushManager.getSubscription();
        setIsSubscribed(!!currentSubscription);
        setSubscription(currentSubscription);
      } catch (error) {
        console.error("Error checking push subscription:", error);
      }
    };

    if (permissionStatus === 'granted') {
      checkSubscription();
    }
  }, [isSupported, permissionStatus]);


  const subscribe = async () => {
    if (!isSupported || !user) return;
    
    if (Notification.permission === 'denied') {
        toast({
            title: 'Permissão Negada',
            description: 'Você precisa permitir notificações nas configurações do seu navegador.',
            variant: 'destructive'
        });
        return;
    }

    try {
        const registration = await navigator.serviceWorker.ready;
        let sub = await registration.pushManager.getSubscription();
        
        if (!sub) {
            sub = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY!),
            });
        }
        
        const subJson = sub.toJSON();

        const userSubscriptionsRef = collection(db, 'users', user.uid, 'subscriptions');
        const q = query(userSubscriptionsRef, where('endpoint', '==', subJson.endpoint));
        const existingSub = await getDocs(q);

        if (existingSub.empty) {
            await addDoc(userSubscriptionsRef, subJson);
        }
        
        setIsSubscribed(true);
        setSubscription(sub);
        toast({
            title: 'Notificações Ativadas!',
            description: 'Você receberá lembretes sobre suas tarefas.',
        });

    } catch (error) {
        console.error('Failed to subscribe to push notifications', error);
        toast({
            title: 'Erro ao Ativar',
            description: 'Não foi possível ativar as notificações.',
            variant: 'destructive',
        });
    }
  };

  const unsubscribe = async () => {
    if (!subscription || !user) return;

    try {
        await subscription.unsubscribe();

        const userSubscriptionsRef = collection(db, 'users', user.uid, 'subscriptions');
        const q = query(userSubscriptionsRef, where('endpoint', '==', subscription.endpoint));
        const querySnapshot = await getDocs(q);
        
        querySnapshot.forEach(async (docSnapshot) => {
            await deleteDoc(doc(db, 'users', user.uid, 'subscriptions', docSnapshot.id));
        });

        setIsSubscribed(false);
        setSubscription(null);
        toast({
            title: 'Notificações Desativadas',
        });
    } catch (error) {
        console.error('Failed to unsubscribe from push notifications', error);
    }
  };

  return { isSubscribed, subscribe, unsubscribe, permissionStatus, isSupported };
}
