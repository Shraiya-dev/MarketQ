
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
 * Calls a custom AI agent to generate social media post content.
 * @param input The details for the post to be generated.
 * @returns A promise that resolves to the generated post content.
 */
export async function forgeSocialMediaPost(input: ForgeSocialMediaPostInput): Promise<ForgeSocialMediaPostOutput> {
  const apiKey = 'QpUDXlzzVg59zbF7pl47K4rq4U2oZ7W35ST6SQTX';
  const apiEndpoint = 'https://qnmmr5l4w4.execute-api.us-east-1.amazonaws.com/api';

  const requestPayload = {
    message: `Generate a social media post for ${input.platform} with a ${input.tone} tone about: ${input.prompt}`,
    userId: "anonymous"
  };

  const response = await fetch(apiEndpoint, {
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
  
  // Attempt to parse the structured response
  try {
    const result = JSON.parse(rawResult);
    
    // Assuming the API returns a JSON object with a structure like { title: "...", description: "...", hashtags: ["..."] }
    // Or it might be inside a nested object, e.g., result.data. We'll check for top-level fields first.
    if (result.title && result.refinedDescription && Array.isArray(result.hashtags)) {
        return ForgeSocialMediaPostOutputSchema.parse({
            title: result.title,
            refinedDescription: result.refinedDescription,
            hashtags: result.hashtags,
        });
    }

    // Fallback if the structure is different, you might need to adjust this logic
    // For now, we'll try to create a response from what we have.
    return {
      title: result.title || "AI Generated Title",
      refinedDescription: result.refinedDescription || result.message || "AI generated description based on your prompt.",
      hashtags: result.hashtags || ['generated', 'ai', 'post'],
    };

  } catch (e) {
    console.error("Failed to parse JSON from custom AI agent:", e);
    // If JSON parsing fails, treat the whole response as the description
    return {
        title: "AI Response (Unstructured)",
        refinedDescription: rawResult,
        hashtags: ["unstructured", "ai", "response"],
    };
  }
}
