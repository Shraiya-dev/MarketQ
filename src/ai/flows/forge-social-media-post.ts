
'use server';
/**
 * @fileOverview AI agent to forge a complete social media post.
 *
 * - forgeSocialMediaPost - Generates title, description, and hashtags.
 * - ForgeSocialMediaPostInput - Input type.
 * - ForgeSocialMediaPostOutput - Output type.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
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

export async function forgeSocialMediaPost(input: ForgeSocialMediaPostInput): Promise<ForgeSocialMediaPostOutput> {
  return forgeSocialMediaPostFlow(input);
}

const CUSTOM_AI_API_URL = 'https://qnmmr5l4w4.execute-api.us-east-1.amazonaws.com/api';

const forgeSocialMediaPostFlow = ai.defineFlow(
  {
    name: 'forgeSocialMediaPostFlow',
    inputSchema: ForgeSocialMediaPostInputSchema,
    outputSchema: ForgeSocialMediaPostOutputSchema,
  },
  async (input) => {
    const apiKey = process.env.CUSTOM_AI_AGENT_API_KEY;
    if (!apiKey) {
      throw new Error("Custom AI Agent API key is not configured.");
    }

    const requestPayload = {
        message: `Generate a social media post about: ${input.prompt}. The tone should be ${input.tone} for the platform ${input.platform}.`,
        userId: "04589468-c0b1-70f3-ab24-95287c196159"
    };
    
    const response = await fetch(CUSTOM_AI_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestPayload),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Custom AI Agent API request failed with status ${response.status}: ${errorBody}`);
    }

    const result = await response.json();

    // The provided API returns a flat JSON object like { title, description, hashtags }
    // but the 'description' field in the API response corresponds to our 'refinedDescription'
    const output: ForgeSocialMediaPostOutput = {
      title: result.title,
      refinedDescription: result.description,
      hashtags: result.hashtags,
    };

    if (!output || !output.title || !output.refinedDescription || !output.hashtags) {
        console.warn("Custom AI agent did not return the expected format. Using a mock response.");
        return {
            title: `Mock Title for: ${input.prompt.substring(0, 20)}...`,
            refinedDescription: `This is a mock description generated because the custom AI agent's response was not in the expected format. The original prompt was about "${input.prompt}". The requested tone was ${input.tone} for ${input.platform}.`,
            hashtags: ['mock', 'customAI', 'fallback'],
        };
    }

    // Ensure hashtags are single words if AI includes # or spaces
    const cleanedHashtags = output.hashtags.map(tag => tag.replace(/[\s#]/g, '')).filter(tag => tag.length > 0);
    return {...output, hashtags: cleanedHashtags};
  }
);
