'use server';

/**
 * @fileOverview Checks if the resolution of an image is sufficient for a given print size.
 *
 * - imageResolutionPrecheck - A function that checks the image resolution.
 * - ImageResolutionPrecheckInput - The input type for the imageResolutionPrecheck function.
 * - ImageResolutionPrecheckOutput - The return type for the imageResolutionPrecheck function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImageResolutionPrecheckInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  printWidthInches: z.number().describe('The desired print width in inches.'),
  printHeightInches: z.number().describe('The desired print height in inches.'),
});

export type ImageResolutionPrecheckInput = z.infer<
  typeof ImageResolutionPrecheckInputSchema
>;

const ImageResolutionPrecheckOutputSchema = z.object({
  isSufficientResolution: z
    .boolean()
    .describe(
      'Whether the image resolution is sufficient for the desired print size.'
    ),
  warningMessage: z
    .string()
    .optional()
    .describe('A warning message if the resolution is not sufficient.'),
});

export type ImageResolutionPrecheckOutput = z.infer<
  typeof ImageResolutionPrecheckOutputSchema
>;

export async function imageResolutionPrecheck(
  input: ImageResolutionPrecheckInput
): Promise<ImageResolutionPrecheckOutput> {
  return imageResolutionPrecheckFlow(input);
}

const prompt = ai.definePrompt({
  name: 'imageResolutionPrecheckPrompt',
  input: {schema: ImageResolutionPrecheckInputSchema},
  output: {schema: ImageResolutionPrecheckOutputSchema},
  prompt: `You are an expert printing assistant.  A user wants to print an image at a certain size.  Determine if the image resolution is high enough to produce a quality print at the specified dimensions.

Here is the information:

Image: {{media url=photoDataUri}}
Print Width: {{{printWidthInches}}} inches
Print Height: {{{printHeightInches}}} inches

Based on the image, its resolution, and the desired print dimensions, determine if the resolution is sufficient to produce a quality print. If not, generate a warning message to the user.

Consider 300 DPI (dots per inch) as the gold standard for high-quality printing.  Lower DPI may be acceptable for large format prints viewed from a distance.
`,
});

const imageResolutionPrecheckFlow = ai.defineFlow(
  {
    name: 'imageResolutionPrecheckFlow',
    inputSchema: ImageResolutionPrecheckInputSchema,
    outputSchema: ImageResolutionPrecheckOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
