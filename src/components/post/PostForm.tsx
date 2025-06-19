
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { generateSocialMediaImage } from "@/ai/flows/generate-social-media-image";
import { forgeSocialMediaPost } from "@/ai/flows/forge-social-media-post";
import type { Post, SocialPlatform, PostStatus, PostTone, ImageOption } from "@/lib/types";
import { PostStatusValues, socialPlatforms, postTones, imageOptions } from "@/lib/types";
import { PostPreviewCard } from "./PostPreviewCard";
import React, { useState, useEffect } from "react";
import { Loader2, Sparkles, Image as ImageIcon, Send, Save, Wand2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePosts } from "@/contexts/PostContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";


const formSchema = z.object({
  title: z.string().optional(), // Will be AI generated and set programmatically
  description: z.string().min(10, "Description must be at least 10 characters.").max(1000, "Description must be 1000 characters or less."),
  platform: z.enum(socialPlatforms as [SocialPlatform, ...SocialPlatform[]]),
  tone: z.enum(postTones as [PostTone, ...PostTone[]]),
  imageOption: z.enum(imageOptions as [ImageOption, ...ImageOption[]]).default("platformDefault"),
  imageUrl: z.string().optional(),
  hashtags: z.string().optional(), // Comma-separated, AI-generated, user can potentially edit
});

type PostFormValues = z.infer<typeof formSchema>;

interface PostFormProps {
  initialData?: Post;
  onSubmitSuccess?: (postId: string) => void;
}

export function PostForm({ initialData, onSubmitSuccess }: PostFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const { addPost, updatePost, updatePostStatus } = usePosts();

  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isForgingPost, setIsForgingPost] = useState(false);
  const [postForged, setPostForged] = useState(!!initialData); // If editing, assume it's "forged"
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | undefined>(initialData?.imageUrl);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PostFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      platform: initialData?.platform || socialPlatforms[0],
      tone: initialData?.tone || postTones[0],
      imageOption: initialData?.imageOption || imageOptions[0],
      imageUrl: initialData?.imageUrl || "",
      hashtags: initialData?.hashtags?.join(",") || "",
    },
  });

  const watchedValues = form.watch();
  const currentImageOption = form.watch("imageOption");

  useEffect(() => {
    if (initialData?.imageUrl) {
      setGeneratedImageUrl(initialData.imageUrl);
      form.setValue('imageUrl', initialData.imageUrl);
    }
    if (!initialData && generatedImageUrl) {
      setGeneratedImageUrl(undefined);
      form.setValue('imageUrl', undefined);
    }
  }, [initialData, form, generatedImageUrl]);


  const handleForgePost = async () => {
    const currentPrompt = form.getValues("description");
    const platform = form.getValues("platform");
    const tone = form.getValues("tone");

    if (!currentPrompt) {
      toast({
        title: "Missing Description",
        description: "Please provide an initial description or prompt for your post.",
        variant: "destructive",
      });
      return;
    }

    setIsForgingPost(true);
    try {
      const result = await forgeSocialMediaPost({ prompt: currentPrompt, platform, tone });
      form.setValue("title", result.title);
      form.setValue("description", result.refinedDescription);
      form.setValue("hashtags", result.hashtags.join(","));
      setPostForged(true);

      toast({
        title: "Post Forged!",
        description: "AI has crafted your post. Review and add an image if you like.",
      });
    } catch (error) {
      console.error("Post forging error:", error);
      toast({
        title: "Post Forging Failed",
        description: "Could not forge post. Please try again. " + (error instanceof Error ? error.message : ""),
        variant: "destructive",
      });
    } finally {
      setIsForgingPost(false);
    }
  };

  const handleGenerateImage = async () => {
    const title = form.getValues("title");
    const description = form.getValues("description");

    if (!postForged || !title || !description) {
      toast({
        title: "Missing Content",
        description: "Please forge the post content (title and description) before generating an image.",
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

  const processSubmit = async (values: PostFormValues, status: PostStatus) => {
    if (!postForged && !initialData) {
      toast({ title: "Forge Post First", description: "Please use 'Forge Post with AI' before saving or submitting.", variant: "destructive" });
      return;
    }
    if (status === "Submitted" && !values.imageUrl && values.imageOption !== "platformDefault") {
      toast({ title: "Image Required", description: "Please generate or upload an image, or select 'Use Platform Default' before submitting.", variant: "destructive"});
      return;
    }

    setIsSubmitting(true);
    const postDataForStorage = {
      title: values.title || "Untitled Post", // Ensure title is never empty
      description: values.description,
      platform: values.platform,
      tone: values.tone,
      imageOption: values.imageOption,
      hashtags: values.hashtags ? values.hashtags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
      imageUrl: generatedImageUrl,
    };

    try {
      let postIdToNavigate = initialData?.id;
      if (initialData?.id) {
        updatePost(initialData.id, postDataForStorage);
        updatePostStatus(initialData.id, status);
        toast({ title: "Post Updated!", description: `Your post "${postDataForStorage.title}" has been saved with status: ${status}.` });
      } else {
        const newPost = addPost(postDataForStorage);
        updatePostStatus(newPost.id, status);
        postIdToNavigate = newPost.id;
        toast({ title: "Post Created!", description: `Your new post "${postDataForStorage.title}" has been saved with status: ${status}.` });
      }

      if (onSubmitSuccess && postIdToNavigate) {
        onSubmitSuccess(postIdToNavigate);
      } else {
        router.push('/dashboard');
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
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Create Your Post</CardTitle>
          <CardDescription>Fill in the details below to generate a social media post with AI.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Post Description (Your Prompt)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Start with a prompt or detailed description for your post..."
                        className="min-h-[120px]"
                        {...field}
                        disabled={isForgingPost || isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>
                      This content will be used as the initial prompt for AI content generation.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="platform"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Platform</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isForgingPost || isSubmitting}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a platform" />
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tone</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isForgingPost || isSubmitting}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a tone" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {postTones.map((tone) => (
                            <SelectItem key={tone} value={tone}>
                              {tone}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="button"
                onClick={handleForgePost}
                disabled={isForgingPost || isSubmitting || !watchedValues.description}
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                {isForgingPost ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="mr-2 h-4 w-4" />
                )}
                Forge Post with AI
              </Button>
              
              {postForged && (
                <>
                  <FormField
                    control={form.control}
                    name="imageOption"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Image Options</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4"
                            disabled={isGeneratingImage || isSubmitting}
                          >
                            <FormItem className="flex items-center space-x-2">
                              <FormControl><RadioGroupItem value="platformDefault" /></FormControl>
                              <FormLabel className="font-normal">Use Platform Default</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2">
                              <FormControl><RadioGroupItem value="upload" /></FormControl>
                              <FormLabel className="font-normal">Upload Image</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2">
                              <FormControl><RadioGroupItem value="generateWithAI" /></FormControl>
                              <FormLabel className="font-normal">Generate with AI</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {currentImageOption === 'generateWithAI' && (
                     <Button type="button" variant="outline" onClick={handleGenerateImage} disabled={isGeneratingImage || isSubmitting || !postForged}>
                        {isGeneratingImage ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <ImageIcon className="mr-2 h-4 w-4" />
                        )}
                        Generate Image
                      </Button>
                  )}
                  {currentImageOption === 'upload' && (
                    <FormItem>
                      <FormLabel>Upload Your Image</FormLabel>
                      <FormControl>
                        <Input type="file" accept="image/*" disabled={true} />
                      </FormControl>
                      <FormDescription>Image upload feature is coming soon.</FormDescription>
                    </FormItem>
                  )}


                  <FormField
                    control={form.control}
                    name="hashtags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hashtags (AI Generated)</FormLabel>
                        <FormControl>
                          <Input placeholder="AI will generate hashtags here, e.g., tech,innovation" {...field} disabled={isSubmitting} />
                        </FormControl>
                        <FormDescription>
                          Comma-separated. You can edit these AI-generated hashtags.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}


              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => processSubmit(form.getValues(), "Draft")}
                  disabled={isSubmitting || isGeneratingImage || isForgingPost || (!postForged && !initialData)}
                  className="w-full sm:w-auto"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save as Draft
                </Button>
                <Button
                  type="button"
                  onClick={() => processSubmit(form.getValues(), "Submitted")}
                  disabled={isSubmitting || isGeneratingImage || isForgingPost || (!postForged && !initialData) || (watchedValues.imageOption !== "platformDefault" && !generatedImageUrl)}
                  className="w-full sm:w-auto bg-primary hover:bg-primary/90"
                >
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                  Submit for Review
                </Button>
              </div>
              {postForged && watchedValues.imageOption !== "platformDefault" && !generatedImageUrl && (
                <p className="text-sm text-destructive mt-2">
                  Please {watchedValues.imageOption === 'generateWithAI' ? 'generate an image' : 'upload an image (coming soon)'} or select 'Use Platform Default' before submitting for review.
                </p>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="lg:col-span-1 sticky top-24">
        <PostPreviewCard
          title={watchedValues.title || (postForged ? "AI Generated Title" : "Title (Pending AI)")}
          description={watchedValues.description}
          hashtags={watchedValues.hashtags ? watchedValues.hashtags.split(',').map(h => h.trim()).filter(h => h) : []}
          platform={watchedValues.platform as SocialPlatform}
          imageUrl={generatedImageUrl}
          tone={watchedValues.tone as PostTone}
        />
      </div>
    </div>
  );
}
