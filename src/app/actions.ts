'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import webpush from 'web-push';
import type { Task, UserProfile } from '@/types';
import { subDays, isToday } from 'date-fns';

// This action is not used directly by forms anymore.
export async function resetHarmonyFlame(
  prevState: any,
  formData: FormData
): Promise<any> {
  console.log("This server action is deprecated. Logic moved to component.");
  return {
      success: false,
      message: 'Esta função foi descontinuada.'
  }
}


export async function sendTaskReminders() {
  console.log('Checking for task reminders to send...');
  if (
    !process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
    !process.env.VAPID_PRIVATE_KEY ||
    !process.env.VAPID_SUBJECT
  ) {
    console.error('VAPID keys not configured. Skipping notifications.');
    return { success: false, message: 'VAPID keys not configured.' };
  }

  // Moved VAPID details setup inside the function to ensure env vars are loaded.
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );

  try {
    const today = new Date();
    const partnershipsSnapshot = await getDocs(collection(db, 'partnerships'));

    for (const partnershipDoc of partnershipsSnapshot.docs) {
      const partnership = partnershipDoc.data();
      const tasksSnapshot = await getDocs(collection(db, 'partnerships', partnershipDoc.id, 'tasks'));
      const tasks: Task[] = tasksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task));

      const upcomingTasks = tasks.filter(task => {
        const endDate = new Date(task.endDate);
        return isToday(endDate) && task.status === 'Pendente';
      });

      if (upcomingTasks.length > 0) {
        for (const member of partnership.members) {
          const userDocRef = doc(db, 'users', member.id);
          const subscriptionsSnapshot = await getDocs(collection(userDocRef, 'subscriptions'));
          
          if (!subscriptionsSnapshot.empty) {
            const notificationPayload = JSON.stringify({
              title: 'Lembrete de Tarefa - DuoFlow',
              body: `Você tem ${upcomingTasks.length} tarefa(s) vencendo hoje!`,
            });
            
            for (const subDoc of subscriptionsSnapshot.docs) {
              const subscription = subDoc.data();
              await webpush.sendNotification(subscription, notificationPayload)
                .catch(error => console.error(`Failed to send notification to ${member.displayName}:`, error));
            }
          }
        }
      }
    }
    return { success: true, message: 'Reminders checked and sent.' };
  } catch (error) {
    console.error('Error sending task reminders:', error);
    return { success: false, message: 'Failed to send reminders.' };
  }
}
