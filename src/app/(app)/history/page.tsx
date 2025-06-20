
"use client";

import { usePosts } from "@/contexts/PostContext";
import { PageHeader } from "@/components/PageHeader";
import { Loader2, FileText, PlusSquare, MoreVertical, Edit3, Download, Share2, Trash2, Twitter, Facebook, Instagram, Linkedin, ExternalLink } from "lucide-react";
import type { Post } from "@/lib/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area"; 
import { StatusBadge } from "@/components/post/StatusBadge";
import { format } from 'date-fns';
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { sampleDraftPostsData, sampleFeedbackPostsData, samplePublishablePostsData } from "@/lib/sample-data";


const platformIcons: Record<string, React.ReactElement> = {
  Twitter: <Twitter className="h-5 w-5 text-blue-500" />,
  Facebook: <Facebook className="h-5 w-5 text-blue-700" />,
  Instagram: <Instagram className="h-5 w-5 text-pink-600" />,
  LinkedIn: <Linkedin className="h-5 w-5 text-blue-600" />,
  Default: <ExternalLink className="h-5 w-5 text-muted-foreground" />
};

export default function PostHistoryPage() {
  const { posts, isLoading, deletePost } = usePosts();
  const { toast } = useToast();
  const router = useRouter();

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

  const postsForDrafts = draftPosts.length > 0 || isLoading ? draftPosts : sampleDraftPostsData;
  const postsForSubmitted = submittedPosts.length > 0 || isLoading ? submittedPosts : sampleFeedbackPostsData;
  const postsForPublishable = publishablePosts.length > 0 || isLoading ? publishablePosts : samplePublishablePostsData;

  const handleDelete = (postId: string) => {
    deletePost(postId);
    toast({
      title: "Post Deleted",
      description: "The post has been successfully removed.",
    });
  };

  const handleShare = async (post: Post) => {
    const shareData = {
      title: post.title,
      text: post.description,
      url: typeof window !== 'undefined' ? window.location.origin + `/posts/${post.id}` : '',
    };
    try {
      if (typeof navigator !== 'undefined' && navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        toast({ title: "Post Shared", description: "Content shared successfully!" });
      } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(shareData.url);
        toast({ title: "Link Copied!", description: "Post link copied to clipboard." });
      } else {
        toast({ title: "Share Not Available", description: "Sharing is not supported on this browser or for this content.", variant: "destructive" });
      }
    } catch (error) {
      console.error("Error sharing:", error);
      if ((error as DOMException)?.name !== 'AbortError') {
        toast({ title: "Share Failed", description: "Could not share post at this time.", variant: "destructive" });
      }
    }
  };

  const handleDownload = (post: Post) => {
    if (!post.imageUrl) {
      toast({
        title: "No Image",
        description: "This post does not have an image to download.",
        variant: "destructive",
      });
      return;
    }

    const link = document.createElement('a');
    link.href = post.imageUrl;
    const sanitizedTitle = post.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    let extension = '.png';
    if (post.imageUrl.startsWith('data:image/')) {
      const mimeType = post.imageUrl.substring(post.imageUrl.indexOf(':') + 1, post.imageUrl.indexOf(';'));
      if (mimeType) {
        const ext = mimeType.split('/')[1];
        if (ext) extension = `.${ext}`;
      }
    } else {
      try {
        const url = new URL(post.imageUrl);
        const pathParts = url.pathname.split('.');
        if (pathParts.length > 1) {
          extension = `.${pathParts.pop()}`;
        }
      } catch (e) { /* Not a valid URL or no extension, use default */ }
    }
    link.download = `${sanitizedTitle || 'socialflow_image'}${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({
      title: "Download Started",
      description: "Your image download should begin shortly.",
    });
  };

  const renderPostSection = (title: string, cardDescription: string, postsToDisplay: Post[]) => (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>{title} ({postsToDisplay.length})</CardTitle>
        {cardDescription && <CardDescription>{cardDescription}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[240px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">Name</TableHead>
                <TableHead className="w-[15%]">Type</TableHead>
                <TableHead className="w-[15%]">Status</TableHead>
                <TableHead className="w-[20%]">Last Updated</TableHead>
                <TableHead className="w-[10%] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && postsToDisplay.length === 0 ? ( 
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex justify-center items-center">
                      <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
                      <span>Loading posts...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : postsToDisplay.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    No posts in this category.
                  </TableCell>
                </TableRow>
              ) : (
                postsToDisplay.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {platformIcons[post.platform] || platformIcons.Default}
                        <Link href={`/posts/${post.id}`} className="font-medium hover:underline text-primary">
                          {post.title}
                        </Link>
                      </div>
                      <div className="text-xs text-muted-foreground pl-7 line-clamp-1 mt-0.5">
                        {post.description}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{post.platform}</TableCell>
                    <TableCell>
                      <StatusBadge status={post.status} feedbackNotes={post.feedbackNotes} reviewedBy={post.reviewedBy} />
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(post.updatedAt), "MMM d, yyyy 'at' h:mm a")}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" title="More options">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">More options</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/posts/${post.id}`} className="flex items-center w-full cursor-pointer">
                              <Edit3 className="mr-2 h-4 w-4" />
                              <span>Edit</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDownload(post)} disabled={!post.imageUrl} className="cursor-pointer">
                            <Download className="mr-2 h-4 w-4" />
                            <span>Download Image</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleShare(post)} className="cursor-pointer">
                            <Share2 className="mr-2 h-4 w-4" />
                            <span>Share</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDelete(post.id)}
                            className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );


  if (isLoading && posts.length === 0) { 
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
        description="Manage and review your posts across different stages."
        icon={FileText}
        actions={
          <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href="/create-post">
              <PlusSquare className="mr-2 h-4 w-4" />
              Create New Post
            </Link>
          </Button>
        }
      />
      {renderPostSection("Drafts", "Posts you are currently working on.", postsForDrafts)}
      {renderPostSection("In Review / Feedback", "Posts submitted for review or with feedback.", postsForSubmitted)}
      {renderPostSection("Ready to Publish", "Posts approved and ready for publishing.", postsForPublishable)}
    </div>
  );
}
