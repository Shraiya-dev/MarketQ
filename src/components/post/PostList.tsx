
import type { Post } from "@/lib/types";
import { PostCard } from "./PostCard";
import { AlertTriangle } from "lucide-react";

interface PostListProps {
  posts: Post[];
  emptyStateMessage?: string;
}

export function PostList({ posts, emptyStateMessage = "No posts found." }: PostListProps) {
  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12 border-2 border-dashed border-border rounded-lg bg-card">
        <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-lg font-medium text-muted-foreground">{emptyStateMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
