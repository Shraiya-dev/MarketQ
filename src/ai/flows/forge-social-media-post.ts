
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

// This is the original Genkit prompt using Gemini. It's kept here for reference
// but is no longer used by the flow.
const forgePrompt = ai.definePrompt({
  name: 'forgeSocialMediaPostPrompt',
  input: {schema: ForgeSocialMediaPostInputSchema},
  output: {schema: ForgeSocialMediaPostOutputSchema},
  prompt: `You are a creative social media content specialist.
Given the following prompt, target platform, and desired tone, generate a compelling social media post.
The post must include:
1.  A concise title (max 100 characters).
2.  An engaging description (max 500 characters, but adapt if platform suggests longer, like LinkedIn articles).
3.  A list of 3 to 5 relevant hashtags (single words, no spaces, no leading '#').

Platform: {{{platform}}}
Tone: {{{tone}}}
Initial Prompt:
{{{prompt}}}

Generate the title, refined description, and hashtags based on these constraints.
Ensure the refined description expands on or rephrases the prompt to fit the tone and platform.
The title should be brief and impactful.
Hashtags should be relevant and popular for the topic and platform.
Return ONLY the JSON object matching the output schema.
`,
});

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

    // This is a simplified message for the custom agent.
    // In a real scenario, you might construct a more detailed message
    // including the tone and platform.
    const requestPayload = {
        message: `Generate a social media post about: ${input.prompt}. The tone should be ${input.tone} for the platform ${input.platform}.`,
        // The userId seems to be a static value in the example, so we'll use a placeholder.
        // If it needs to be dynamic, it should be passed in the input.
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

    // Assuming the API returns a structure that matches our output schema.
    // This part might need adjustment based on the actual API response format.
    // For this example, we'll assume the API's response body directly maps to our schema.
    const output = result as ForgeSocialMediaPostOutput;

    if (!output || !output.title || !output.refinedDescription || !output.hashtags) {
        // Here we'll simulate a response if the API doesn't return the expected format
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
