
"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { SocialPlatform } from "@/lib/types";
import { Twitter, Facebook, Instagram, Linkedin, Image as ImageIcon, ExternalLink } from "lucide-react";

interface PostPreviewCardProps {
  title: string;
  description: string;
  hashtags: string[];
  platform: SocialPlatform;
  imageUrl?: string;
}

const platformIcons: Record<SocialPlatform, React.ReactElement> = {
  Twitter: <Twitter className="h-6 w-6 text-blue-500" />,
  Facebook: <Facebook className="h-6 w-6 text-blue-700" />,
  Instagram: <Instagram className="h-6 w-6 text-pink-600" />,
  LinkedIn: <Linkedin className="h-6 w-6 text-blue-600" />,
};

export function PostPreviewCard({
  title,
  description,
  hashtags,
  platform,
  imageUrl,
}: PostPreviewCardProps) {
  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-headline">Post Preview</CardTitle>
          {platformIcons[platform] || <ExternalLink className="h-6 w-6 text-muted-foreground" />}
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        {imageUrl ? (
          <div className="relative aspect-video w-full rounded-md overflow-hidden border">
            <Image
              src={imageUrl}
              alt="Generated post image"
              fill
              className="object-contain"
              data-ai-hint="social media preview"
            />
          </div>
        ) : (
          <div className="aspect-video w-full rounded-md bg-muted flex flex-col items-center justify-center text-muted-foreground">
            <ImageIcon className="h-16 w-16 mb-2" />
            <p>Image will appear here</p>
          </div>
        )}

        <div>
          <h3 className="text-lg font-semibold font-headline">{title || "Your Title Here"}</h3>
          <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">
            {description || "Your post description will appear here..."}
          </p>
        </div>

        {hashtags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {hashtags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-primary hover:bg-primary/10">
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
