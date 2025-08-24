
"use client";

import { PageHeader } from "@/components/PageHeader";
import { ShieldCheck, User, ThumbsUp, ThumbsDown } from "lucide-react";
import { usePosts } from "@/contexts/PostContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

export default function AdminPage() {
  const { posts, updatePostStatus } = usePosts();
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!user || (user.role !== 'Admin' && user.role !== 'Superadmin')) {
      toast({
        title: "Access Denied",
        description: "You do not have permission to view this page.",
        variant: "destructive",
      });
      router.push('/dashboard');
    }
  }, [user, router, toast]);

  const reviewQueue = posts.filter(p => p.status === 'Submitted' || p.status === 'Under Review');

  const handleApprove = (postId: string) => {
    updatePostStatus(postId, 'Approved');
    toast({
      title: "Post Approved",
      description: "The post is now ready to be published.",
    });
  };
  
  const handleReject = (postId: string) => {
    // In a real app, you'd have a dialog to enter feedback
    const feedback = "The post did not meet our content guidelines. Please revise and resubmit.";
    updatePostStatus(postId, 'Feedback', { feedbackNotes: feedback });
    toast({
      title: "Feedback Provided",
      description: "The post has been sent back to the user with feedback.",
      variant: "destructive"
    });
  };

  if (!user || (user.role !== 'Admin' && user.role !== 'Superadmin')) {
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
            <p>Redirecting...</p>
        </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Admin Review Panel"
        description="Review and approve posts submitted by users."
        icon={ShieldCheck}
      />
      <Card>
        <CardHeader>
          <CardTitle>Review Queue</CardTitle>
          <CardDescription>
            There are {reviewQueue.length} posts awaiting your review.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {reviewQueue.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              The review queue is empty. Great job!
            </p>
          ) : (
            reviewQueue.map(post => (
              <Card key={post.id} className="overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-3">
                    <div className="md:col-span-2 p-6">
                        <h3 className="font-bold text-lg mb-2">{post.title}</h3>
                        <div className="flex flex-wrap gap-1 mb-3">
                            {post.hashtags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                #{tag}
                                </Badge>
                            ))}
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">{post.description}</p>
                        <div className="flex gap-4">
                            <Button size="sm" onClick={() => handleApprove(post.id)}>
                                <ThumbsUp className="mr-2 h-4 w-4" />Approve
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleReject(post.id)}>
                                <ThumbsDown className="mr-2 h-4 w-4" />Reject
                            </Button>
                        </div>
                    </div>
                    <div className="md:col-span-1 bg-muted/50 p-4 flex items-center justify-center">
                       {post.imageUrl ? (
                            <Image
                                src={post.imageUrl}
                                alt={`Image for ${post.title}`}
                                width={300}
                                height={200}
                                className="object-cover rounded-md"
                            />
                       ) : (
                        <div className="text-sm text-muted-foreground">No Image</div>
                       )}
                    </div>
                </div>
              </Card>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
