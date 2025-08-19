
'use server';
/**
 * @fileOverview AI agent to forge a complete social media post.
 *
 * - forgeSocialMediaPost - Generates title, description, and hashtags by calling a custom AI agent.
 * - ForgeSocialMediaPostInput - Input type.
 * - ForgeSocialMediaPostOutput - Output type.
 */

import {z} from 'zod';
import { postTones } from '@/lib/types'; 

const ForgeSocialMediaPostInputSchema = z.object({
  prompt: z.string().describe('The initial idea or prompt for the social media post.'),
  platform: z.string().describe('The target social media platform (e.g., Twitter, LinkedIn).'),
  tone: z.enum(postTones).describe('The desired tone of the post.'),
});
export type ForgeSocialMediaPostInput = z.infer<typeof ForgeSocialMediaPostInputSchema>;

const ForgeSocialMediaPostOutputSchema = z.object({
  title: z.string().describe('A catchy and relevant title for the post. Max 100 characters.'),
  refinedDescription: z.string().describe('A well-crafted description for the post, based on the prompt and tone. Max 500 characters for most platforms, but can be longer for articles.'),
  hashtags: z.array(z.string()).describe('An array of 3-5 relevant hashtags for the post. Each hashtag should be a single word without spaces or special characters other than the leading # (which you should not include).'),
});
export type ForgeSocialMediaPostOutput = z.infer<typeof ForgeSocialMediaPostOutputSchema>;

/**
 * MOCKED FUNCTION: Calls a custom AI agent to generate social media post content.
 * This function is currently mocked to return a sample post and avoid a persistent 403 error
 * from the external API. To re-enable the API call, replace the contents of this function
 * with the fetch request logic.
 * @param input The details for the post to be generated.
 * @returns A promise that resolves to the generated post content.
 */
export async function forgeSocialMediaPost(input: ForgeSocialMediaPostInput): Promise<ForgeSocialMediaPostOutput> {
  console.log("Using mocked forgeSocialMediaPost function due to API issues.");

  // This is a mocked response to bypass the 403 error.
  // You should verify your API key and endpoint configuration.
  return Promise.resolve({
    title: `Mock Post for ${input.platform}`,
    refinedDescription: `This is a sample post generated because the custom AI agent is unavailable. The original prompt was about: "${input.prompt}" with a ${input.tone} tone.`,
    hashtags: ['mockData', 'apiBypass', 'socialflow', input.platform.toLowerCase()],
  });
}
