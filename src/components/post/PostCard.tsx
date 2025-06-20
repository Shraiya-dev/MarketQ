
import type { Post } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { StatusBadge } from "./StatusBadge";
import {
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  ExternalLink,
  Edit3,
  Trash2,
  Share2,
  Download,
  MoreVertical
} from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import { usePosts } from "@/contexts/PostContext";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const platformIcons: Record<string, React.ReactElement> = {
  Twitter: <Twitter className="h-5 w-5" />,
  Facebook: <Facebook className="h-5 w-5" />,
  Instagram: <Instagram className="h-5 w-5" />,
  LinkedIn: <Linkedin className="h-5 w-5" />,
  Default: <ExternalLink className="h-5 w-5" />
};

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const { deletePost } = usePosts();
  const { toast } = useToast();
  const lastUpdated = formatDistanceToNow(new Date(post.updatedAt), { addSuffix: true });

  const handleDelete = (postId: string) => {
    deletePost(postId);
    toast({
      title: "Post Deleted",
      description: "The post has been successfully removed.",
    });
  };

  const handleShare = async () => {
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

  const handleDownload = () => {
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
      } catch (e) {
        // Not a valid URL or no extension, use default
      }
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


  return (
    <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-lg font-semibold leading-tight font-headline group-hover:text-primary transition-colors">
            <Link href={`/posts/${post.id}`} className="hover:underline">
              {post.title}
            </Link>
          </CardTitle>
          <div className="text-muted-foreground shrink-0">
            {platformIcons[post.platform] || platformIcons.Default}
          </div>
        </div>
        <CardDescription className="text-xs text-muted-foreground">
          Last updated: {lastUpdated}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow pb-4">
        {post.imageUrl && (
          <div className="relative aspect-video rounded-md overflow-hidden mb-3">
            <Image
              src={post.imageUrl}
              alt={`Generated image for ${post.title}`}
              fill
              className="object-cover"
              data-ai-hint={post.dataAiHint || "social media image"}
            />
          </div>
        )}
        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
          {post.description}
        </p>
        <div className="flex flex-wrap gap-1">
          {post.hashtags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              #{tag}
            </Badge>
          ))}
          {post.hashtags.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{post.hashtags.length - 3} more
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center bg-muted/50 p-3">
        <StatusBadge status={post.status} feedbackNotes={post.feedbackNotes} />
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
            <DropdownMenuItem onClick={handleDownload} disabled={!post.imageUrl} className="cursor-pointer">
              <Download className="mr-2 h-4 w-4" />
              <span>Download Image</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleShare} className="cursor-pointer">
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
      </CardFooter>
    </Card>
  );
}

