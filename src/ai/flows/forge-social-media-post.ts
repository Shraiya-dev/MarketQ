
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
    
    // The new prompt requires `user_input` and `image_url`.
    // We can map our existing `input.prompt` to `user_input`.
    // We'll send a placeholder for the image URL for now.
    const requestPayload = {
        user_input: `Generate a social media post about: ${input.prompt}. The tone should be ${input.tone} for the platform ${input.platform}.`,
        image_url: "https://placehold.co/600x400.png"
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

    const rawResult = await response.text();

    // The new response has two parts: a JSON block and a draft block.
    // We need to parse them separately.
    const draftStartDelimiter = "---POST DRAFT START---";
    const draftEndDelimiter = "---POST DRAFT END---";

    const jsonPartMatch = rawResult.match(/(\{[\s\S]*?\})/);
    const draftStartIndex = rawResult.indexOf(draftStartDelimiter);
    const draftEndIndex = rawResult.indexOf(draftEndDelimiter);

    if (!jsonPartMatch || draftStartIndex === -1 || draftEndIndex === -1) {
        console.warn("Custom AI agent response did not contain the expected format (JSON + Draft). Using a mock response.");
        return {
            title: `Mock Title for: ${input.prompt.substring(0, 20)}...`,
            refinedDescription: `This is a mock description generated because the custom AI agent's response was malformed. The original prompt was about "${input.prompt}". The requested tone was ${input.tone} for ${input.platform}.`,
            hashtags: ['mock', 'customAI', 'fallback'],
        };
    }

    // Extract the content from the draft block
    const postDraft = rawResult.substring(draftStartIndex + draftStartDelimiter.length, draftEndIndex).trim();

    // The agent now generates the full post text, so we use it for the description.
    // We can derive a title and hashtags from the content.
    const lines = postDraft.split('\n').filter(line => line.trim() !== '');
    const title = lines[0] || `Post about ${input.prompt || 'your topic'}`;
    const refinedDescription = postDraft;
    
    // Extract hashtags from the generated post draft
    const hashtags = postDraft.match(/#(\w+)/g)?.map(h => h.substring(1)) || [];
    
    const output: ForgeSocialMediaPostOutput = {
      title,
      refinedDescription,
      hashtags,
    };

    return output;
  }
);
