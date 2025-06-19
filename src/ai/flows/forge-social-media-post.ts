
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
import { postTones } from '@/lib/types'; // Assuming PostTone is also in lib/types or defined here

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

const forgeSocialMediaPostFlow = ai.defineFlow(
  {
    name: 'forgeSocialMediaPostFlow',
    inputSchema: ForgeSocialMediaPostInputSchema,
    outputSchema: ForgeSocialMediaPostOutputSchema,
  },
  async (input) => {
    const {output} = await forgePrompt(input);
    if (!output) {
        throw new Error("AI failed to generate post content.");
    }
    // Ensure hashtags are single words if AI includes # or spaces
    const cleanedHashtags = output.hashtags.map(tag => tag.replace(/[\s#]/g, '')).filter(tag => tag.length > 0);
    return {...output, hashtags: cleanedHashtags};
  }
);
