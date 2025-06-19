
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { generateSocialMediaImage } from "@/ai/flows/generate-social-media-image";
import { generateHashtags } from "@/ai/flows/generate-hashtags";
import type { Post, SocialPlatform, PostStatus } from "@/lib/types";
import { PostStatusValues } from "@/lib/types";
import { PostPreviewCard } from "./PostPreviewCard";
import React, { useState, useEffect } from "react";
import { Loader2, Sparkles, Image as ImageIcon, Send, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePosts } from "@/contexts/PostContext";

const socialPlatforms: SocialPlatform[] = ["Twitter", "Facebook", "Instagram", "LinkedIn"];

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters.").max(100, "Title must be 100 characters or less."),
  description: z.string().min(10, "Description must be at least 10 characters.").max(500, "Description must be 500 characters or less."),
  hashtags: z.string().refine(val => val === '' || val.split(',').every(tag => tag.trim().length > 0 && !tag.trim().includes(' ')), {
    message: "Hashtags should be comma-separated, without spaces within a single hashtag (e.g., cool,new,awesome). Leave empty if not needed.",
  }).optional(),
  platform: z.enum(socialPlatforms as [SocialPlatform, ...SocialPlatform[]], {
    required_error: "You need to select a social media platform.",
  }),
  imageUrl: z.string().optional(),
});

type PostFormValues = z.infer<typeof formSchema>;

interface PostFormProps {
  initialData?: Post; // For editing
  onSubmitSuccess?: (postId: string) => void;
}

export function PostForm({ initialData, onSubmitSuccess }: PostFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const { addPost, updatePost, updatePostStatus } = usePosts();
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isGeneratingHashtags, setIsGeneratingHashtags] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | undefined>(initialData?.imageUrl);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PostFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      hashtags: initialData?.hashtags?.join(",") || "",
      platform: initialData?.platform || socialPlatforms[0],
      imageUrl: initialData?.imageUrl || "",
    },
  });

  const watchedValues = form.watch();

  useEffect(() => {
    if (initialData?.imageUrl) {
      setGeneratedImageUrl(initialData.imageUrl);
      form.setValue('imageUrl', initialData.imageUrl);
    }
  }, [initialData, form]);


  const handleGenerateImage = async () => {
    const title = form.getValues("title");
    const description = form.getValues("description");

    if (!title || !description) {
      toast({
        title: "Missing Content",
        description: "Please provide a title and description before generating an image.",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingImage(true);
    try {
      const result = await generateSocialMediaImage({ title, description });
      if (result.imageUrl) {
        setGeneratedImageUrl(result.imageUrl);
        form.setValue("imageUrl", result.imageUrl);
        toast({
          title: "Image Generated!",
          description: "The AI has successfully generated an image for your post.",
        });
      } else {
        throw new Error("AI did not return an image URL.");
      }
    } catch (error) {
      console.error("Image generation error:", error);
      toast({
        title: "Image Generation Failed",
        description: "Could not generate image. Please try again. " + (error instanceof Error ? error.message : ""),
        variant: "destructive",
      });
    } finally {
      setIsGeneratingImage(false);
    }
  };
  
  const handleGenerateHashtags = async () => {
    const title = form.getValues("title");
    const description = form.getValues("description");

    if (!title && !description) {
      toast({
        title: "Missing Content",
        description: "Please provide a title or description to generate hashtags.",
        variant: "destructive",
      });
      return;
    }
    setIsGeneratingHashtags(true);
    try {
      const result = await generateHashtags({ title, description });
      if (result.hashtags && result.hashtags.length > 0) {
        form.setValue("hashtags", result.hashtags.join(","));
        toast({
          title: "Hashtags Generated!",
          description: "AI suggested hashtags have been added.",
        });
      } else {
         toast({
          title: "No Hashtags Generated",
          description: "The AI couldn't find suitable hashtags. Try refining your content.",
        });
      }
    } catch (error) {
      console.error("Hashtag generation error:", error);
      toast({
        title: "Hashtag Generation Failed",
        description: "Could not generate hashtags. Please try again. " + (error instanceof Error ? error.message : ""),
        variant: "destructive",
      });
    } finally {
      setIsGeneratingHashtags(false);
    }
  };

  const processSubmit = async (values: PostFormValues, status: PostStatus) => {
    setIsSubmitting(true);
    const postData = {
      ...values,
      hashtags: values.hashtags ? values.hashtags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
      imageUrl: generatedImageUrl,
    };

    try {
      if (initialData?.id) {
        updatePost(initialData.id, postData);
        updatePostStatus(initialData.id, status);
        toast({ title: "Post Updated!", description: `Your post has been saved as ${status.toLowerCase()}.` });
        if (onSubmitSuccess) onSubmitSuccess(initialData.id); else router.push('/dashboard');
      } else {
        const newPost = addPost(postData);
        updatePostStatus(newPost.id, status);
        toast({ title: "Post Created!", description: `Your post has been saved as ${status.toLowerCase()}.` });
        if (onSubmitSuccess) onSubmitSuccess(newPost.id); else router.push('/dashboard');
      }
    } catch (error) {
      console.error("Post submission error:", error);
      toast({ title: "Submission Failed", description: "Could not save post. Please try again.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <Form {...form}>
        <form onSubmit={(e) => e.preventDefault()} className="lg:col-span-2 space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Post Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter a catchy title for your post" {...field} />
                </FormControl>
                <FormDescription>This will be the main headline.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Post Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe your post content in detail..."
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  This content will be used for the post body and AI image generation.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="space-y-2">
             <Button type="button" variant="outline" onClick={handleGenerateImage} disabled={isGeneratingImage || isSubmitting}>
              {isGeneratingImage ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <ImageIcon className="mr-2 h-4 w-4" />
              )}
              Generate Image with AI
            </Button>
            <FormDescription>
              Uses the title and description to create a unique image.
            </FormDescription>
          </div>


          <FormField
            control={form.control}
            name="hashtags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hashtags</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., tech,innovation,future" {...field} />
                </FormControl>
                <FormDescription>
                  Comma-separated. Example: socialmedia,marketing,growth
                   <Button type="button" variant="link" size="sm" className="p-1 ml-1 h-auto text-accent hover:text-accent/80" onClick={handleGenerateHashtags} disabled={isGeneratingHashtags || isSubmitting}>
                     {isGeneratingHashtags ? ( <Loader2 className="mr-1 h-3 w-3 animate-spin" /> ) : ( <Sparkles className="mr-1 h-3 w-3" /> )}
                    Generate with AI
                  </Button>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="platform"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Target Platform</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a social media platform" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {socialPlatforms.map((platform) => (
                      <SelectItem key={platform} value={platform}>
                        {platform}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>Choose where this post will be published.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => processSubmit(form.getValues(), "Draft")}
              disabled={isSubmitting || isGeneratingImage || isGeneratingHashtags}
              className="w-full sm:w-auto"
            >
              <Save className="mr-2 h-4 w-4" />
              Save as Draft
            </Button>
            <Button
              type="button"
              onClick={() => processSubmit(form.getValues(), "Submitted")}
              disabled={isSubmitting || isGeneratingImage || isGeneratingHashtags || !generatedImageUrl}
              className="w-full sm:w-auto bg-primary hover:bg-primary/90"
            >
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
              Submit for Review
            </Button>
          </div>
           {!generatedImageUrl && (
            <p className="text-sm text-destructive">Please generate an image before submitting for review.</p>
          )}
        </form>
      </Form>

      <div className="lg:col-span-1 sticky top-24">
        <PostPreviewCard
          title={watchedValues.title}
          description={watchedValues.description}
          hashtags={watchedValues.hashtags ? watchedValues.hashtags.split(',').map(h => h.trim()).filter(h => h) : []}
          platform={watchedValues.platform as SocialPlatform}
          imageUrl={generatedImageUrl}
        />
      </div>
    </div>
  );
}
