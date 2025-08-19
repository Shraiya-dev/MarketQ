
'use server';
/**
 * @fileOverview AI agent to forge a complete social media post.
 *
 * - forgeSocialMediaPost - Generates title, description, and hashtags using Genkit and Google AI.
 * - ForgeSocialMediaPostInput - Input type.
 * - ForgeSocialMediaPostOutput - Output type.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import { postTones } from '@/lib/types'; 

const ForgeSocialMediaPostInputSchema = z.object({
  prompt: z.string().describe('The initial idea or prompt for the social media post.'),
  platform: z.string().describe('The target social media platform (e.g., Twitter, LinkedIn).'),
  tone: z.enum(postTones).describe('The desired tone of the post.'),
});
export type ForgeSocialMediaPostInput = z.infer<typeof ForgeSocialMediaPostInputSchema>;


const PostSuggestionSchema = z.object({
    title: z.string().describe('A catchy and relevant title for the post. Max 100 characters.'),
    refinedDescription: z.string().describe('A well-crafted description for the post, based on the prompt and tone. Max 500 characters for most platforms, but can be longer for articles.'),
    hashtags: z.array(z.string()).describe('An array of 3-5 relevant hashtags for the post. Each hashtag should be a single word without spaces or special characters other than the leading # (which you should not include).'),
});

export type PostSuggestion = z.infer<typeof PostSuggestionSchema>;

const ForgeSocialMediaPostOutputSchema = z.object({
  suggestions: z.array(PostSuggestionSchema).length(2).describe("An array containing exactly two distinct social media post suggestions."),
});
export type ForgeSocialMediaPostOutput = z.infer<typeof ForgeSocialMediaPostOutputSchema>;


/**
 * Calls Genkit AI to generate social media post content.
 * @param input The details for the post to be generated.
 * @returns A promise that resolves to the generated post content.
 */
export async function forgeSocialMediaPost(input: ForgeSocialMediaPostInput): Promise<ForgeSocialMediaPostOutput> {
  return forgeSocialMediaPostFlow(input);
}

const prompt = ai.definePrompt({
    name: 'forgeSocialMediaPostPrompt',
    input: { schema: ForgeSocialMediaPostInputSchema },
    output: { schema: ForgeSocialMediaPostOutputSchema },
    prompt: `You are a professional social media manager. Your task is to generate two distinct social media post suggestions based on the user's prompt.

    **Platform:** {{{platform}}}
    **Tone:** {{{tone}}}
    **User's Prompt/Description:**
    "{{{prompt}}}"

    Based on the information above, please generate an array of two different post suggestions. Each suggestion should have:
    1.  **Title:** A catchy and relevant title.
    2.  **Refined Description:** A well-crafted description that fits the platform and tone.
    3.  **Hashtags:** An array of 3-5 relevant hashtags (do not include the '#' symbol).

    Return ONLY the structured JSON output with a 'suggestions' array containing the two options.`,
});

const forgeSocialMediaPostFlow = ai.defineFlow(
  {
    name: 'forgeSocialMediaPostFlow',
    inputSchema: ForgeSocialMediaPostInputSchema,
    outputSchema: ForgeSocialMediaPostOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
        throw new Error("AI failed to generate a response.");
    }
    return output;
  }
);
