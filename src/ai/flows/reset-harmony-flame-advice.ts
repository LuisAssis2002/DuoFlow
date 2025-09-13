'use server';
/**
 * @fileOverview Provides AI advice on whether to reset the Harmony Flame.
 *
 * - getResetHarmonyFlameAdvice - A function that determines if it's a good time to reset the Harmony Flame using AI.
 * - GetResetHarmonyFlameAdviceInput - The input type for the getResetHarmonyFlameAdvice function.
 * - GetResetHarmonyFlameAdviceOutput - The return type for the getResetHarmonyFlameAdvice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetResetHarmonyFlameAdviceInputSchema = z.object({
  recentEvents: z
    .string()
    .describe(
      'A description of recent events and interactions between the user and their partner.'
    ),
});
export type GetResetHarmonyFlameAdviceInput = z.infer<typeof GetResetHarmonyFlameAdviceInputSchema>;

const GetResetHarmonyFlameAdviceOutputSchema = z.object({
  advice: z
    .string()
    .describe(
      'AI-generated advice on whether it is a good time to reset the Harmony Flame, or whether the users should wait.'
    ),
});
export type GetResetHarmonyFlameAdviceOutput = z.infer<typeof GetResetHarmonyFlameAdviceOutputSchema>;

export async function getResetHarmonyFlameAdvice(
  input: GetResetHarmonyFlameAdviceInput
): Promise<GetResetHarmonyFlameAdviceOutput> {
  return resetHarmonyFlameAdviceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'resetHarmonyFlameAdvicePrompt',
  input: {schema: GetResetHarmonyFlameAdviceInputSchema},
  output: {schema: GetResetHarmonyFlameAdviceOutputSchema},
  prompt: `You are an AI assistant that gives advice to users on whether or not they should reset their Harmony Flame.

The Harmony Flame is a counter that tracks how many days a user and their partner have gone without disputes. Resetting the counter is a significant action that should be considered carefully.

Based on the recent events between the user and their partner, provide advice on whether it is a good time to reset the Harmony Flame. Be direct and to the point. Do not introduce yourself or be too verbose.

Recent Events: {{{recentEvents}}}`,
});

const resetHarmonyFlameAdviceFlow = ai.defineFlow(
  {
    name: 'resetHarmonyFlameAdviceFlow',
    inputSchema: GetResetHarmonyFlameAdviceInputSchema,
    outputSchema: GetResetHarmonyFlameAdviceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
