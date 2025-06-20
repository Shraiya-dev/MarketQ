
"use client";

import { usePosts } from "@/contexts/PostContext";
import { PostList } from "@/components/post/PostList";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutDashboard, PlusSquare, Loader2 } from "lucide-react";
import Link from "next/link";
import type { Post } from "@/lib/types";

// Sample data for draft posts
const sampleDraftPostsData: Post[] = [
  {
    id: 'sample-draft-1',
    title: 'Exploring the Autumn Colors',
    description: 'A visual journey through the vibrant hues of fall. Discover stunning landscapes and cozy moments.',
    hashtags: ['autumn', 'fallcolors', 'naturephotography', 'travel', 'landscape'],
    platform: 'Instagram',
    tone: 'Inspirational',
    imageOption: 'generateWithAI',
    imageUrl: 'https://placehold.co/600x400.png',
    status: 'Draft',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
  },
  {
    id: 'sample-draft-2',
    title: 'My Favorite Productivity Hacks',
    description: 'Sharing a few simple yet effective tips that help me stay focused and achieve more each day.',
    hashtags: ['productivity', 'lifehacks', 'motivation', 'worksmart', 'personalgrowth'],
    platform: 'LinkedIn',
    tone: 'Professional',
    imageOption: 'platformDefault',
    imageUrl: undefined, // Platform default, no specific image
    status: 'Draft',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
  },
  {
    id: 'sample-draft-3',
    title: 'Weekend Culinary Adventure',
    description: 'Tried out a new recipe for homemade pasta and it was delicious! Here’s a sneak peek.',
    hashtags: ['foodie', 'homecooking', 'pasta', 'recipe', 'weekendvibes'],
    platform: 'Facebook',
    tone: 'Friendly',
    imageOption: 'generateWithAI',
    imageUrl: 'https://placehold.co/600x400.png',
    status: 'Draft',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
  }
];


export default function DashboardPage() {
  const { posts, isLoading } = usePosts();

  const draftPosts = posts.filter(post => post.status === "Draft");
  const submittedPosts = posts.filter(post =>
    post.status === "Submitted" ||
    post.status === "Under Review" ||
    post.status === "Feedback"
  );
  const publishablePosts = posts.filter(post =>
    post.status === "Approved" ||
    post.status === "Ready to Publish"
  );

  // If user has no drafts, show sample drafts. Otherwise, show user's drafts.
  const postsForDraftsTab = draftPosts.length > 0 ? draftPosts : sampleDraftPostsData;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <span className="ml-4 text-xl font-semibold">Loading posts...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Creator Dashboard"
        description="Manage your social media posts from draft to publication."
        icon={LayoutDashboard}
        actions={
          <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href="/create-post">
              <PlusSquare className="mr-2 h-4 w-4" />
              Create New Post
            </Link>
          </Button>
        }
      />

      <Tabs defaultValue="drafts" className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 mb-6">
          <TabsTrigger value="drafts" className="font-body">Drafts ({draftPosts.length})</TabsTrigger>
          <TabsTrigger value="submitted" className="font-body">In Review / Feedback ({submittedPosts.length})</TabsTrigger>
          <TabsTrigger value="publishable" className="font-body">Ready to Publish ({publishablePosts.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="drafts">
          <PostList 
            posts={postsForDraftsTab} 
            emptyStateMessage="No drafts yet. Start by creating a new post!" 
          />
        </TabsContent>
        <TabsContent value="submitted">
          <PostList posts={submittedPosts} emptyStateMessage="No posts currently under review or needing feedback." />
        </TabsContent>
        <TabsContent value="publishable">
          <PostList posts={publishablePosts} emptyStateMessage="No posts approved or ready for publishing yet." />
        </TabsContent>
      </Tabs>
    </div>
  );
}
