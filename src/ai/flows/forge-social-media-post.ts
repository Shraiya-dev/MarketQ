
'use server';
/**
 * @fileOverview AI agent to forge a complete social media post using a custom API.
 *
 * - forgeSocialMediaPost - Generates post suggestions by calling an external AI agent.
 * - ForgeSocialMediaPostInput - Input type.
 * - ForgeSocialMediaPostOutput - Output type.
 */
import { z } from 'zod';
import { postTones } from '@/lib/types';

// Input schema remains the same from the form
const ForgeSocialMediaPostInputSchema = z.object({
  prompt: z.string().describe('The initial idea or prompt for the social media post.'),
  platform: z.string().describe('The target social media platform (e.g., Twitter, LinkedIn).'),
  tone: z.enum(postTones).describe('The desired tone of the post.'),
});
export type ForgeSocialMediaPostInput = z.infer<typeof ForgeSocialMediaPostInputSchema>;


// Output schema remains the same to feed the UI
const PostSuggestionSchema = z.object({
    title: z.string().describe('A catchy and relevant title for the post.'),
    refinedDescription: z.string().describe('A well-crafted description for the post.'),
    hashtags: z.array(z.string()).describe('An array of relevant hashtags.'),
});
export type PostSuggestion = z.infer<typeof PostSuggestionSchema>;

const ForgeSocialMediaPostOutputSchema = z.object({
  suggestions: z.array(PostSuggestionSchema).length(2).describe("An array containing exactly two distinct social media post suggestions."),
});
export type ForgeSocialMediaPostOutput = z.infer<typeof ForgeSocialMediaPostOutputSchema>;


/**
 * Calls a custom AI agent to generate social media post content.
 * @param input The details for the post to be generated.
 * @returns A promise that resolves to the generated post content.
 */
export async function forgeSocialMediaPost(input: ForgeSocialMediaPostInput): Promise<ForgeSocialMediaPostOutput> {
  // Hardcoding the API key for testing purposes
  const apiKey = 'QpUDXlzzVg59zbF7pl47K4rq4U2oZ7W35ST6SQTX';
  const apiEndpoint = 'https://qnmmr5l4w4.execute-api.us-east-1.amazonaws.com/api';

  const requestBody = {
    message: input.prompt, 
    userId: "anonymous", 
  };
  
  const response = await fetch(apiEndpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'org-id': 'anonymous-org', // Added as per dev team feedback
      'user-id': 'anonymous-user', // Added as per dev team feedback
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("Custom AI Agent Error:", errorBody);
    throw new Error(`Custom AI Agent API request failed with status ${response.status}.`);
  }

  const rawResult = await response.text();
  
  // Basic parsing logic based on a simple "Title: ...\nDescription: ...\nHashtags: ..." format.
  // This will need to be adjusted if the API returns a more complex structure.
  // We will assume the API returns two posts separated by a line of '---'.
  const postSections = rawResult.split(/\n---\n/);
  
  const suggestions: PostSuggestion[] = postSections.slice(0, 2).map(section => {
    const titleMatch = section.match(/Title: (.*)/);
    const descriptionMatch = section.match(/Description: ([\s\S]*?)Hashtags:/);
    const hashtagsMatch = section.match(/Hashtags: (.*)/);

    return {
      title: titleMatch ? titleMatch[1].trim() : 'AI Generated Title',
      refinedDescription: descriptionMatch ? descriptionMatch[1].trim() : section.trim(),
      hashtags: hashtagsMatch ? hashtagsMatch[1].split(',').map(h => h.trim().replace(/^#/, '')) : [],
    };
  });
  
  // If we couldn't parse two suggestions, we will duplicate the first one or create placeholders.
  while (suggestions.length < 2) {
    if (suggestions.length === 1) {
      suggestions.push({ ...suggestions[0], title: `${suggestions[0].title} (Option 2)` });
    } else {
      suggestions.push({
        title: 'Placeholder Suggestion',
        refinedDescription: 'Could not parse response from AI. Please check the API output format.',
        hashtags: ['error']
      });
    }
  }

  return { suggestions };
}
