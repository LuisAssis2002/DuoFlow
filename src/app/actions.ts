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

// Esta action não é mais usada diretamente. A lógica foi movida para o componente
// para ter acesso ao `partnership.id` e interagir com o Firestore.
export async function resetHarmonyFlame(
  prevState: ResetFormState,
  formData: FormData
): Promise<ResetFormState> {
  console.log("This server action is deprecated. Logic moved to component.");
  return {
      success: false,
      message: 'Esta função foi descontinuada.'
  }
}
