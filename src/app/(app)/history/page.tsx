
"use client";

import { usePosts } from "@/contexts/PostContext";
import { PostList } from "@/components/post/PostList";
import { PageHeader } from "@/components/PageHeader";
import { Loader2 } from "lucide-react";

export default function PostHistoryPage() {
  const { posts, isLoading } = usePosts();

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
        title="Your Posts"
        description="Review, edit, or share your previously generated content."
      />
      <PostList posts={posts} emptyStateMessage="No posts found in your history." />
    </div>
  );
}

