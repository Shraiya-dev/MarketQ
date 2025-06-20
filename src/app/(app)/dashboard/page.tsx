
"use client";

import { usePosts } from "@/contexts/PostContext";
import { PostList } from "@/components/post/PostList";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard, PlusSquare, Loader2, FileText, BarChart3, TrendingUp, CalendarCheck, Send, LineChart as LineChartIcon } from "lucide-react";
import Link from "next/link";
import type { Post } from "@/lib/types";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";


// Sample data for draft posts
const sampleDraftPostsData: Post[] = [
  {
    id: 'sample-draft-1',
    title: 'Exploring the Autumn Colors',
    description: 'A visual journey through the vibrant hues of fall. Discover stunning landscapes and cozy moments.',
    hashtags: ['autumn', 'fallcolors', 'naturephotography', 'travel', 'landscape'],
    platform: 'Instagram',
    tone: 'Inspirational',
    imageOption: 'generateWithAI',
    imageUrl: 'https://placehold.co/600x400.png',
    status: 'Draft',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), 
    updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), 
  },
  {
    id: 'sample-draft-2',
    title: 'My Favorite Productivity Hacks',
    description: 'Sharing a few simple yet effective tips that help me stay focused and achieve more each day.',
    hashtags: ['productivity', 'lifehacks', 'motivation', 'worksmart', 'personalgrowth'],
    platform: 'LinkedIn',
    tone: 'Professional',
    imageOption: 'platformDefault',
    imageUrl: undefined,
    status: 'Draft',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), 
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), 
  },
  {
    id: 'sample-draft-3',
    title: 'Weekend Culinary Adventure',
    description: 'Tried out a new recipe for homemade pasta and it was delicious! Here’s a sneak peek.',
    hashtags: ['foodie', 'homecooking', 'pasta', 'recipe', 'weekendvibes'],
    platform: 'Facebook',
    tone: 'Friendly',
    imageOption: 'generateWithAI',
    imageUrl: 'https://placehold.co/600x400.png',
    status: 'Draft',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), 
  }
];

// Sample data for posts under review or with feedback
const sampleFeedbackPostsData: Post[] = [
  {
    id: 'sample-feedback-1',
    title: 'New Product Launch Campaign',
    description: 'Initial draft for our upcoming product launch. Seeking feedback on messaging and visuals.',
    hashtags: ['productlaunch', 'marketing', 'newrelease', 'tech'],
    platform: 'Twitter',
    tone: 'Professional',
    imageOption: 'generateWithAI',
    imageUrl: 'https://placehold.co/600x400.png',
    status: 'Submitted',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'sample-feedback-2',
    title: 'Community Engagement Strategy',
    description: 'This post is under review. The team is checking alignment with our community guidelines and brand voice.',
    hashtags: ['community', 'engagement', 'socialstrategy'],
    platform: 'Facebook',
    tone: 'Friendly',
    imageOption: 'generateWithAI',
    imageUrl: 'https://placehold.co/600x400.png',
    status: 'Under Review',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'sample-feedback-3',
    title: 'Quarterly Report Highlights',
    description: 'Feedback received. Incorporating changes.',
    hashtags: ['business', 'report', 'insights', 'finance'],
    platform: 'LinkedIn',
    tone: 'Professional',
    imageOption: 'platformDefault',
    imageUrl: undefined,
    status: 'Feedback',
    feedbackNotes: "Great start! Please add more specific data points from Q3, especially regarding user growth in the APAC region. Also, a stronger call to action at the end would be beneficial. Consider something like 'Download the full report for a deeper dive'. Image choice is good.",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

// Sample data for posts ready to publish
const samplePublishablePostsData: Post[] = [
  {
    id: 'sample-publish-1',
    title: 'Tech Conference Recap',
    description: 'Key takeaways and highlights from the Global Tech Summit. Exciting innovations ahead!',
    hashtags: ['techsummit', 'innovation', 'futuretech', 'conference'],
    platform: 'LinkedIn',
    tone: 'Professional',
    imageOption: 'generateWithAI',
    imageUrl: 'https://placehold.co/600x400.png',
    status: 'Approved',
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'sample-publish-2',
    title: 'Our New Eco-Friendly Packaging',
    description: 'Excited to announce our new sustainable packaging! Good for your products, better for the planet.',
    hashtags: ['sustainability', 'ecofriendly', 'gogreen', 'packaging'],
    platform: 'Instagram',
    tone: 'Inspirational',
    imageOption: 'generateWithAI',
    imageUrl: 'https://placehold.co/600x400.png',
    status: 'Ready to Publish',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
];

// Sample analytics data
const analyticsData = [
  { title: "Total Posts Created", value: "128", icon: FileText, change: "+12 this month", changeType: "positive" as "positive" | "negative" | "neutral" },
  { title: "Avg. Engagement Rate", value: "5.7%", icon: TrendingUp, change: "+0.5% vs last month", changeType: "positive" as "positive" | "negative" | "neutral" },
  { title: "Posts This Month", value: "15", icon: CalendarCheck, change: "3 scheduled", changeType: "neutral" as "positive" | "negative" | "neutral" },
  { title: "Active Campaigns", value: "3", icon: Send, change: "1 ending soon", changeType: "neutral" as "positive" | "negative" | "neutral" },
];

const postActivityData = [
  { month: "Jan", posts: 12, engagement: 2.5 },
  { month: "Feb", posts: 18, engagement: 3.1 },
  { month: "Mar", posts: 15, engagement: 2.8 },
  { month: "Apr", posts: 22, engagement: 3.5 },
  { month: "May", posts: 19, engagement: 3.2 },
  { month: "Jun", posts: 25, engagement: 4.0 },
];

const chartConfig = {
  posts: {
    label: "Posts",
    color: "hsl(var(--chart-1))",
  },
  engagement: {
    label: "Engagement (%)",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;


export default function DashboardPage() {
  const { posts, isLoading } = usePosts();

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

  const postsForDraftsTab = draftPosts.length > 0 || isLoading ? draftPosts : sampleDraftPostsData;
  const postsForSubmittedTab = submittedPosts.length > 0 || isLoading ? submittedPosts : sampleFeedbackPostsData;
  const postsForPublishableTab = publishablePosts.length > 0 || isLoading ? publishablePosts : samplePublishablePostsData;


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
        title="Creator Dashboard"
        description="Manage your social media posts from draft to publication."
        icon={LayoutDashboard}
        actions={
          <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href="/create-post">
              <PlusSquare className="mr-2 h-4 w-4" />
              Create New Post
            </Link>
          </Button>
        }
      />

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
          <BarChart3 className="mr-2 h-5 w-5 text-primary" />
          Analytics Overview
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {analyticsData.map((item) => (
            <Card key={item.title} className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {item.title}
                </CardTitle>
                <item.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{item.value}</div>
                <p className={`text-xs ${item.changeType === 'positive' ? 'text-green-600' : item.changeType === 'negative' ? 'text-red-600' : 'text-muted-foreground'}`}>
                  {item.change}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="mt-6 col-span-1 md:col-span-2 lg:col-span-4 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <LineChartIcon className="mr-2 h-5 w-5 text-primary" />
              Monthly Performance
            </CardTitle>
            <CardDescription>
              Overview of posts and engagement for the last 6 months.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <BarChart accessibilityLayer data={postActivityData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis yAxisId="left" orientation="left" stroke="hsl(var(--chart-1))"  tickLine={false} axisLine={false} />
                <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--chart-2))" tickLine={false} axisLine={false} />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dashed" />}
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar yAxisId="left" dataKey="posts" fill="var(--color-posts)" radius={4} />
                <Bar yAxisId="right" dataKey="engagement" fill="var(--color-engagement)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="drafts" className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 mb-6">
          <TabsTrigger value="drafts" className="font-body">Drafts ({postsForDraftsTab.length})</TabsTrigger>
          <TabsTrigger value="submitted" className="font-body">In Review / Feedback ({postsForSubmittedTab.length})</TabsTrigger>
          <TabsTrigger value="publishable" className="font-body">Ready to Publish ({postsForPublishableTab.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="drafts">
          <PostList 
            posts={postsForDraftsTab} 
            emptyStateMessage="No drafts yet. Start by creating a new post!" 
          />
        </TabsContent>
        <TabsContent value="submitted">
          <PostList posts={postsForSubmittedTab} emptyStateMessage="No posts currently under review or needing feedback." />
        </TabsContent>
        <TabsContent value="publishable">
          <PostList posts={postsForPublishableTab} emptyStateMessage="No posts approved or ready for publishing yet." />
        </TabsContent>
      </Tabs>
    </div>
  );
}

    
