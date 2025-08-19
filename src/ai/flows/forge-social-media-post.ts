
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

const CUSTOM_AI_API_URL = 'https://qnmmr5l4w4.execute-api.us-east-1.amazonaws.com/api';

/**
 * Calls a custom AI agent to generate social media post content.
 * This function is a server action and does not use Genkit.
 * @param input The details for the post to be generated.
 * @returns A promise that resolves to the generated post content.
 */
export async function forgeSocialMediaPost(input: ForgeSocialMediaPostInput): Promise<ForgeSocialMediaPostOutput> {
  const apiKey = "QpUDXlzzVg59zbF7pl47K4rq4U2oZ7W35ST6SQTX"; // Hardcoded for testing
  
  const requestPayload = {
      message: `Generate a social media post about: ${input.prompt}. The tone should be ${input.tone} for the platform ${input.platform}.`,
      userId: "anonymous"
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
    console.error("Custom AI Agent Error:", errorBody);
    throw new Error(`Custom AI Agent API request failed with status ${response.status}.`);
  }

  const rawResult = await response.text();

  try {
      // The agent seems to return a simple text string that is the post draft.
      // We will parse it to fit the expected output structure.
      const postDraft = rawResult;
      
      const lines = postDraft.split('\n').filter(line => line.trim() !== '');
      
      // Assume the first non-empty line is the title.
      const title = lines[0] || `Post about ${input.prompt.substring(0, 30)}...`;
      
      // Extract hashtags from the text.
      const hashtags = postDraft.match(/#(\w+)/g)?.map(h => h.substring(1)) || [];
      
      // The rest is the description.
      const refinedDescription = postDraft;

      return {
        title,
        refinedDescription,
        hashtags,
      };

  } catch (e) {
    console.error("Failed to parse response from custom AI agent:", e);
    console.error("Raw response was:", rawResult);
    // Fallback in case of parsing errors
    return {
        title: `Mock Title for: ${input.prompt.substring(0, 20)}...`,
        refinedDescription: `This is a mock description because the custom AI agent's response could not be parsed. The prompt was about "${input.prompt}".`,
        hashtags: ['mock', 'customAI', 'fallback'],
    };
  }
}
