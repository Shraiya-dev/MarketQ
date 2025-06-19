
"use client";

import { usePosts } from "@/contexts/PostContext";
import { PostList } from "@/components/post/PostList";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutDashboard, PlusSquare, Loader2 } from "lucide-react";
import Link from "next/link";
import type { Post } from "@/lib/types";

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
          <PostList posts={draftPosts} emptyStateMessage="No drafts yet. Start by creating a new post!" />
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
