

export const socialPlatforms = ["Twitter", "Facebook", "Instagram", "LinkedIn"] as const;
export type SocialPlatform = (typeof socialPlatforms)[number];

export const PostStatusValues = [
  "Draft",
  "Submitted",
  "Under Review",
  "Approved",
  "Feedback",
  "Ready to Publish",
] as const;
export type PostStatus = (typeof PostStatusValues)[number];

export const postTones = ["Professional", "Friendly", "Humorous", "Inspirational"] as const;
export type PostTone = (typeof postTones)[number];

export const imageOptions = ["platformDefault", "upload", "generateWithAI"] as const;
export type ImageOption = (typeof imageOptions)[number];

export interface Post {
  id: string;
  title: string;
  description: string;
  hashtags: string[];
  platform: SocialPlatform;
  tone: PostTone; // Added tone
  imageOption: ImageOption; // Added imageOption
  imageUrl?: string;
  status: PostStatus;
  feedbackNotes?: string; // Added for reviewer feedback
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}
