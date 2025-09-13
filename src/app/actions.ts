'use server';

import { getResetHarmonyFlameAdvice as getResetAdvice } from '@/ai/flows/reset-harmony-flame-advice';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const ResetFlameAdviceSchema = z.object({
  recentEvents: z.string().min(10, { message: 'Por favor, descreva os eventos recentes com mais detalhes.' }),
});

export type AdviceFormState = {
  advice?: string;
  error?: string | Record<string, string[] | undefined>;
};

export async function getResetHarmonyFlameAdvice(
  prevState: AdviceFormState,
  formData: FormData
): Promise<AdviceFormState> {
  const validatedFields = ResetFlameAdviceSchema.safeParse({
    recentEvents: formData.get('recentEvents'),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await getResetAdvice({ recentEvents: validatedFields.data.recentEvents });
    return { advice: result.advice };
  } catch (error) {
    console.error(error);
    return { error: 'Falha ao obter conselho da IA. Tente novamente.' };
  }
}

export async function resetHarmonyFlame() {
  try {
    // In a real app, you would update the timestamp in Firestore here.
    // For example:
    // const { getFirestore } = await import('firebase-admin/firestore');
    // const db = getFirestore();
    // await db.collection('partnerships').doc('partner123').update({ 'harmonyFlame.lastReset': new Date() });
    console.log('Harmony Flame has been reset in mock action!');
    
    revalidatePath('/');
    return { success: true, message: 'A Chama da Harmonia foi reiniciada!' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Falha ao reiniciar a Chama da Harmonia.' };
  }
}
