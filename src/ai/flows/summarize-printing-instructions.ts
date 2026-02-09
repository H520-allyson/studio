'use server';

/**
 * @fileOverview Summarizes printing instructions using Genkit.
 *
 * - summarizePrintingInstructions - A function that summarizes client notes.
 * - SummarizePrintingInstructionsInput - The input type for the summarizePrintingInstructions function.
 * - SummarizePrintingInstructionsOutput - The return type for the summarizePrintingInstructions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizePrintingInstructionsInputSchema = z.object({
  notes: z.string().describe('The printing instructions provided by the client.'),
});
export type SummarizePrintingInstructionsInput = z.infer<
  typeof SummarizePrintingInstructionsInputSchema
>;

const SummarizePrintingInstructionsOutputSchema = z.object({
  summary: z
    .string()
    .describe('A concise summary of the printing instructions.'),
});
export type SummarizePrintingInstructionsOutput = z.infer<
  typeof SummarizePrintingInstructionsOutputSchema
>;

export async function summarizePrintingInstructions(
  input: SummarizePrintingInstructionsInput
): Promise<SummarizePrintingInstructionsOutput> {
  return summarizePrintingInstructionsFlow(input);
}

const summarizePrintingInstructionsPrompt = ai.definePrompt({
  name: 'summarizePrintingInstructionsPrompt',
  input: {schema: SummarizePrintingInstructionsInputSchema},
  output: {schema: SummarizePrintingInstructionsOutputSchema},
  prompt: `Summarize the following printing instructions in 1-2 sentences:\n\n{{notes}}`,
});

const summarizePrintingInstructionsFlow = ai.defineFlow(
  {
    name: 'summarizePrintingInstructionsFlow',
    inputSchema: SummarizePrintingInstructionsInputSchema,
    outputSchema: SummarizePrintingInstructionsOutputSchema,
  },
  async input => {
    const {output} = await summarizePrintingInstructionsPrompt(input);
    return output!;
  }
);
