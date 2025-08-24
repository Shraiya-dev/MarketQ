
'use server';
/**
 * @fileOverview AI agent to forge a complete social media post.
 *
 * - forgeSocialMediaPost - A function that handles the post generation process.
 * - ForgeSocialMediaPostInput - The input type for the forgeSocialMediaPost function.
 * - ForgeSocialMediaPostOutput - The return type for the forgeSocialMediaPost function.
 */
import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { postTones } from '@/lib/types';

// Input schema remains the same from the form
const ForgeSocialMediaPostInputSchema = z.object({
  prompt: z.string().describe('The initial idea or prompt for the social media post.'),
  platform: z.string().describe('The target social media platform (e.g., Twitter, LinkedIn).'),
  tone: z.enum(postTones).describe('The desired tone of the post.'),
});
export type ForgeSocialMediaPostInput = z.infer<typeof ForgeSocialMediaPostInputSchema>;


// Define the schema for a single post suggestion
const PostSuggestionSchema = z.object({
    title: z.string().describe('A catchy and relevant title for the post.'),
    refinedDescription: z.string().describe('A well-crafted description for the post.'),
    hashtags: z.array(z.string()).describe('An array of relevant hashtags.'),
});
export type PostSuggestion = z.infer<typeof PostSuggestionSchema>;


// Update the output schema to expect an array of two suggestions
const ForgeSocialMediaPostOutputSchema = z.object({
  suggestions: z.array(PostSuggestionSchema).length(2).describe("An array containing exactly two distinct social media post suggestions."),
});
export type ForgeSocialMediaPostOutput = z.infer<typeof ForgeSocialMediaPostOutputSchema>;


/**
 * Calls the Genkit flow to generate social media post content.
 * @param input The details for the post to be generated.
 * @returns A promise that resolves to the generated post content.
 */
export async function forgeSocialMediaPost(input: ForgeSocialMediaPostInput): Promise<ForgeSocialMediaPostOutput> {
  return forgeSocialMediaPostFlow(input);
}

const prompt = ai.definePrompt({
    name: 'forgeSocialMediaPostPrompt',
    input: {schema: ForgeSocialMediaPostInputSchema},
    output: {schema: ForgeSocialMediaPostOutputSchema},
    prompt: `You are a social media expert. Generate two distinct and creative social media post suggestions based on the provided prompt, platform, and tone.

    Prompt: {{{prompt}}}
    Platform: {{{platform}}}
    Tone: {{{tone}}}

    For each suggestion, provide a compelling title, a refined description, and a list of relevant hashtags. Ensure the two suggestions offer different angles or styles.`,
});


const forgeSocialMediaPostFlow = ai.defineFlow(
  {
    name: 'forgeSocialMediaPostFlow',
    inputSchema: ForgeSocialMediaPostInputSchema,
    outputSchema: ForgeSocialMediaPostOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    
    if (!output || !output.suggestions || output.suggestions.length < 2) {
        // Fallback in case the model doesn't return two suggestions.
        // This could be improved with a more robust retry or repair mechanism.
        console.warn("AI did not return two suggestions, creating a fallback.");
        const fallbackSuggestion = {
            title: 'AI Generated Title',
            refinedDescription: 'Could not generate a second distinct suggestion. Please try re-forging with a more specific prompt.',
            hashtags: ['ai', 'fallback', 'content'],
        };
        const suggestions = output?.suggestions || [];
        while (suggestions.length < 2) {
            suggestions.push(fallbackSuggestion);
        }
        return { suggestions: suggestions.slice(0, 2) };
    }

    return output;
  }
);
