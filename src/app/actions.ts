'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const ResetFlameSchema = z.object({
  reason: z.string().min(10, { message: 'Por favor, descreva o motivo com mais detalhes.' }),
});

export type ResetFormState = {
  success: boolean;
  message: string;
  error?: string | Record<string, string[] | undefined>;
};

export async function resetHarmonyFlame(
  prevState: ResetFormState,
  formData: FormData
): Promise<ResetFormState> {
  const validatedFields = ResetFlameSchema.safeParse({
    reason: formData.get('reason'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Falha na validação.',
      error: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  const { reason } = validatedFields.data;

  try {
    // Em um aplicativo real, você salvaria o motivo e atualizaria o timestamp no Firestore aqui.
    // Por exemplo:
    // const { getFirestore } = await import('firebase-admin/firestore');
    // const db = getFirestore();
    // await db.collection('partnerships').doc('partner123').collection('resets').add({ reason, timestamp: new Date() });
    // await db.collection('partnerships').doc('partner123').update({ 'harmonyFlame.lastReset': new Date() });
    console.log('Chama da Harmonia reiniciada em uma ação simulada com o motivo:', reason);
    
    revalidatePath('/');
    return { success: true, message: 'A Chama da Harmonia foi reiniciada!' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Falha ao reiniciar a Chama da Harmonia.' };
  }
}
