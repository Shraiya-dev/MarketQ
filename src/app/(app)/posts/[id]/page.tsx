
"use client";

import { useParams, useRouter } from "next/navigation";
import { usePosts } from "@/contexts/PostContext";
import { PostForm } from "@/components/post/PostForm";
import { PageHeader } from "@/components/PageHeader";
import { Edit3, Loader2 } from "lucide-react";
import { useEffect } from "react";

export default function EditPostPage() {
  const params = useParams();
  const router = useRouter();
  const { getPost, isLoading } = usePosts();
  const postId = typeof params.id === 'string' ? params.id : undefined;
  
  const post = postId ? getPost(postId) : undefined;

  useEffect(() => {
    if (!isLoading && postId && !post) {
      // Post not found, redirect to dashboard or a 404 page
      router.push('/dashboard'); 
    }
  }, [isLoading, postId, post, router]);

  if (isLoading || !post) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <span className="ml-4 text-xl font-semibold">Loading post...</span>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <PageHeader
        title="Edit Social Post"
        description={`You are currently editing "${post.title}".`}
        icon={Edit3}
      />
      <PostForm initialData={post} onSubmitSuccess={() => router.push('/dashboard')} />
    </div>
  );
}
