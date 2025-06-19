
export type SocialPlatform = "Twitter" | "Facebook" | "Instagram" | "LinkedIn";

export const PostStatusValues = [
  "Draft",
  "Submitted",
  "Under Review",
  "Approved",
  "Feedback",
  "Ready to Publish",
] as const;

export type PostStatus = (typeof PostStatusValues)[number];

export interface Post {
  id: string;
  title: string;
  description: string;
  hashtags: string[];
  platform: SocialPlatform;
  imageUrl?: string; // URL or base64 data URI
  status: PostStatus;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}
