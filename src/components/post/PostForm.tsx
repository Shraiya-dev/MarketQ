
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
import { forgeSocialMediaPost, type PostSuggestion } from "@/ai/flows/forge-social-media-post";
import type { Post, SocialPlatform, PostStatus, PostTone, ImageOption } from "@/lib/types";
import { PostStatusValues, socialPlatforms, postTones, imageOptions } from "@/lib/types";
import { PostPreviewCard } from "./PostPreviewCard";
import React, { useState, useEffect } from "react";
import { Loader2, Sparkles, Image as ImageIcon, Send, Save, Wand2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePosts } from "@/contexts/PostContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ReviewerSelectionDialog } from "./ReviewerSelectionDialog";
import { Badge } from "@/components/ui/badge";


const formSchema = z.object({
  title: z.string().optional(), // Will be AI generated and set programmatically
  description: z.string().min(10, "Description must be at least 10 characters.").max(1000, "Description must be 1000 characters or less."),
  platform: z.enum(socialPlatforms as [SocialPlatform, ...SocialPlatform[]]),
  tone: z.enum(postTones as [PostTone, ...PostTone[]]),
  imageOption: z.enum(imageOptions as [ImageOption, ...ImageOption[]]).default("platformDefault"),
  imageUrl: z.string().optional(),
  hashtags: z.string().optional(), // Comma-separated, AI-generated, user can potentially edit
  dataAiHint: z.string().optional(), // Added for image hint
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
  const [postSuggestions, setPostSuggestions] = useState<PostSuggestion[]>([]);

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
      dataAiHint: initialData?.dataAiHint || "",
    },
  });

  const watchedValues = form.watch();
  const currentImageOption = form.watch("imageOption");

  useEffect(() => {
    if (initialData?.imageUrl) {
      setGeneratedImageUrl(initialData.imageUrl);
      form.setValue('imageUrl', initialData.imageUrl);
    }
  }, [initialData, form]);

  const applySuggestion = (suggestion: PostSuggestion) => {
    form.setValue("title", suggestion.title);
    form.setValue("description", suggestion.refinedDescription);
    form.setValue("hashtags", suggestion.hashtags.join(","));
    const hint = suggestion.title.toLowerCase().split(" ").slice(0,2).join(" ");
    form.setValue("dataAiHint", hint);
    setPostForged(true);
    toast({ title: "Suggestion Applied", description: "The selected post content has been applied to the form." });
  }

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
    setPostSuggestions([]);
    
    // Don't reset fields on re-forge
    if (!postForged) {
        form.setValue("title", "");
        form.setValue("hashtags", "");
    }
    setPostForged(false);

    try {
      const result = await forgeSocialMediaPost({ prompt: currentPrompt, platform, tone });
      
      if (result.suggestions && result.suggestions.length > 0) {
        setPostSuggestions(result.suggestions);
        toast({
          title: "Post Forged!",
          description: `AI has crafted ${result.suggestions.length} suggestion(s). Choose one to apply.`,
        });
      } else {
        throw new Error("AI did not return any suggestions.");
      }

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
        if (!form.getValues("dataAiHint")) {
             const hint = title.toLowerCase().split(" ").slice(0,2).join(" ");
             form.setValue("dataAiHint", hint);
        }
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

  const processSubmit = async (values: PostFormValues, status: PostStatus, reviewer?: string) => {
    if (!postForged && !initialData) {
      toast({ title: "Forge Post First", description: "Please use 'Forge Post with AI' and apply a suggestion before saving or submitting.", variant: "destructive" });
      return;
    }
    if (status === "Submitted" && !values.imageUrl && values.imageOption !== "platformDefault") {
      toast({ title: "Image Required", description: "Please generate or upload an image, or select 'Use Platform Default' before submitting.", variant: "destructive"});
      return;
    }

    setIsSubmitting(true);
    const postDataForStorage: Partial<Post> = {
      title: values.title || "Untitled Post",
      description: values.description,
      platform: values.platform,
      tone: values.tone,
      imageOption: values.imageOption,
      hashtags: values.hashtags ? values.hashtags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
      imageUrl: generatedImageUrl,
      dataAiHint: values.dataAiHint || values.title?.toLowerCase().split(" ").slice(0,2).join(" ") || "abstract",
      reviewedBy: reviewer,
    };

    try {
      let postIdToNavigate = initialData?.id;
      if (initialData?.id) {
        updatePost(initialData.id, postDataForStorage as Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'status'>);
        updatePostStatus(initialData.id, status, { reviewedBy: reviewer });
        toast({ title: "Post Updated!", description: `Your post "${postDataForStorage.title}" has been saved with status: ${status}.` });
      } else {
        const newPostData = {
            ...postDataForStorage,
            title: postDataForStorage.title!, 
            description: postDataForStorage.description!,
            platform: postDataForStorage.platform!,
            tone: postDataForStorage.tone!,
            imageOption: postDataForStorage.imageOption!,
        } as Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'feedbackNotes'>;

        const newPost = addPost(newPostData);
        updatePostStatus(newPost.id, status, { reviewedBy: reviewer });
        postIdToNavigate = newPost.id;
        toast({ title: "Post Created!", description: `Your new post "${newPostData.title}" has been saved with status: ${status}.` });
      }

      if (onSubmitSuccess && postIdToNavigate) {
        onSubmitSuccess(postIdToNavigate);
      } else {
        router.push('/history');
      }
    } catch (error) {
      console.error("Post submission error:", error);
      toast({ title: "Submission Failed", description: "Could not save post. Please try again.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReviewSubmission = (reviewer: string) => {
    processSubmit(form.getValues(), "Submitted", reviewer);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <div className="lg:col-span-2 min-w-0">
        <Card>
          <CardHeader>
            <CardTitle>{initialData ? "Edit Your Post" : "Create Your Post"}</CardTitle>
            <CardDescription>{initialData ? "Modify the details of your existing post." : "Fill in the details below to generate a social media post with AI."}</CardDescription>
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
                        This content will be used as the initial prompt for AI content generation. After forging, you can edit the refined description here.
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
                  {initialData && postForged ? "Re-Forge Post with AI" : "Forge Post with AI"}
                </Button>

                {postSuggestions.length > 0 && (
                  <Card className="bg-muted/50">
                    <CardHeader>
                      <CardTitle className="text-lg">Choose a Suggestion</CardTitle>
                      <CardDescription>The AI generated two options. Select one to use.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {postSuggestions.map((suggestion, index) => (
                        <div key={index} className="p-3 border rounded-md bg-background relative">
                           <h4 className="font-semibold text-md mb-1">{suggestion.title}</h4>
                           <p className="text-sm text-muted-foreground whitespace-pre-wrap">{suggestion.refinedDescription}</p>
                           <div className="flex flex-wrap gap-1 mt-2">
                              {suggestion.hashtags.map(tag => <Badge key={tag} variant="secondary">#{tag}</Badge>)}
                           </div>
                           <Button
                              variant="outline"
                              size="sm"
                              className="mt-3"
                              onClick={() => applySuggestion(suggestion)}
                           >
                              Use Suggestion {index + 1}
                           </Button>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}
                
                {postForged && (
                  <>
                     <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="AI will generate the title here" {...field} disabled={isSubmitting} />
                          </FormControl>
                          <FormDescription>
                            You can edit this AI-generated title.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="imageOption"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Image Options</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={(value) => {
                                  field.onChange(value);
                                  if (value !== "generateWithAI" && value !== "upload") {
                                      setGeneratedImageUrl(undefined); // Clear AI generated image if not selected
                                      form.setValue("imageUrl", undefined);
                                  }
                              }}
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
                          { generatedImageUrl ? "Re-generate Image" : "Generate Image" }
                        </Button>
                    )}
                    {currentImageOption === 'upload' && (
                      <FormItem>
                        <FormLabel>Upload Your Image</FormLabel>
                        <FormControl>
                          <Input 
                            type="file" 
                            accept="image/*" 
                            disabled={isSubmitting} 
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                const file = e.target.files[0];
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  const dataUri = reader.result as string;
                                  setGeneratedImageUrl(dataUri);
                                  form.setValue("imageUrl", dataUri);
                                  const hint = file.name.split('.')[0].toLowerCase().split(" ").slice(0,2).join(" ");
                                  form.setValue("dataAiHint", hint);
                                  toast({ title: "Image Selected", description: "Image ready for upload with post." });
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                     {currentImageOption !== "platformDefault" && (
                      <FormField
                          control={form.control}
                          name="dataAiHint"
                          render={({ field }) => (
                          <FormItem>
                              <FormLabel>Image AI Hint (Optional)</FormLabel>
                              <FormControl>
                              <Input placeholder="e.g., 'sunset beach' or 'modern office'" {...field} disabled={isSubmitting} />
                              </FormControl>
                              <FormDescription>
                              Provide 1-2 keywords to help AI find a relevant stock image later if needed.
                              </FormDescription>
                              <FormMessage />
                          </FormItem>
                          )}
                      />
                     )}


                    <FormField
                      control={form.control}
                      name="hashtags"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hashtags</FormLabel>
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
                  <ReviewerSelectionDialog
                    onSelectReviewer={handleReviewSubmission}
                    trigger={
                      <Button
                        type="button"
                        disabled={isSubmitting || isGeneratingImage || isForgingPost || (!postForged && !initialData) || (watchedValues.imageOption !== "platformDefault" && !generatedImageUrl)}
                        className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground"
                      >
                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                        Submit for Review
                      </Button>
                    }
                   />
                </div>
                {postForged && watchedValues.imageOption !== "platformDefault" && !generatedImageUrl && (
                  <p className="text-sm text-destructive mt-2">
                    Please {watchedValues.imageOption === 'generateWithAI' ? 'generate an image' : 'upload an image'} or select 'Use Platform Default' before submitting for review.
                  </p>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-1 sticky top-24">
        <PostPreviewCard
          title={watchedValues.title || (postForged ? (initialData?.title || "AI Generated Title") : "Title (Pending AI)")}
          description={watchedValues.description || (initialData?.description)}
          hashtags={watchedValues.hashtags ? watchedValues.hashtags.split(',').map(h => h.trim()).filter(h => h) : (initialData?.hashtags || [])}
          platform={watchedValues.platform as SocialPlatform || initialData?.platform}
          imageUrl={generatedImageUrl}
          tone={watchedValues.tone as PostTone || initialData?.tone}
          dataAiHint={watchedValues.dataAiHint || initialData?.dataAiHint}
        />
      </div>
    </div>
  );
}
