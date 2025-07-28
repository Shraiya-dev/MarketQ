
import { Mail, MessageSquare, AlertTriangle, User, ThumbsUp, Package, CalendarDays, CheckCheck } from 'lucide-react';
import type { Post, User as AppUser } from '@/lib/types';
import { socialPlatforms, postTones, imageOptions } from '@/lib/types';

// Sample Notifications
export const sampleNotifications = [
  {
    id: '1',
    icon: <Mail className="h-5 w-5 text-blue-500" />,
    title: 'New Post Submitted',
    description: '"Summer Campaign Ideas" is now awaiting review.',
    time: '10m ago',
    read: false,
  },
  {
    id: '2',
    icon: <MessageSquare className="h-5 w-5 text-green-500" />,
    title: 'Feedback Received',
    description: 'Reviewer left feedback on "Q3 Report Highlights".',
    time: '1h ago',
    read: false,
  },
  {
    id: '3',
    icon: <AlertTriangle className="h-5 w-5 text-orange-500" />,
    title: 'System Maintenance',
    description: 'Scheduled maintenance tonight at 2 AM.',
    time: '3h ago',
    read: true,
  },
  {
    id: '4',
    icon: <ThumbsUp className="h-5 w-5 text-green-600" />,
    title: 'Post Approved',
    description: '"Welcome Winter Collection" has been approved and is ready to publish.',
    time: '2h ago',
    read: true,
  },
  {
    id: '5',
    icon: <User className="h-5 w-5 text-purple-500" />,
    title: 'Comment on Your Post',
    description: 'User "JaneDoe" commented on your "Productivity Hacks" post.',
    time: '4h ago',
    read: false,
  },
  {
    id: '6',
    icon: <Package className="h-5 w-5 text-teal-500" />,
    title: 'New Feature Update',
    description: 'AI Image generation v2 is now live with improved styles.',
    time: '1 day ago',
    read: true,
  },
  {
    id: '7',
    icon: <CalendarDays className="h-5 w-5 text-indigo-500" />,
    title: 'Scheduled Post Published',
    description: '"Weekend Getaway Ideas" was successfully published.',
    time: '2 days ago',
    read: true,
  },
  {
    id: '8',
    icon: <Mail className="h-5 w-5 text-blue-500" />,
    title: 'Another Post Submitted',
    description: '"Tech Trends 2025" is awaiting your review.',
    time: '3 days ago',
    read: false,
  },
  {
    id: '9',
    icon: <MessageSquare className="h-5 w-5 text-green-500" />,
    title: 'Quick Reminder',
    description: 'Don\'t forget to check your drafts folder for pending posts.',
    time: '4 days ago',
    read: true,
  },
  {
    id: '10',
    icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
    title: 'Action Required: API Key Expiring',
    description: 'Your API key for external integration is expiring in 7 days.',
    time: '5 days ago',
    read: false,
  },
  {
    id: '11',
    icon: <CheckCheck className="h-5 w-5 text-cyan-500" />,
    title: 'Post Published',
    description: '"Weekly Newsletter" has been published on LinkedIn.',
    time: '6 days ago',
    read: true,
  },
  {
    id: '12',
    icon: <ThumbsUp className="h-5 w-5 text-green-600" />,
    title: 'Post Approved',
    description: '"Behind the Scenes" is approved.',
    time: '7 days ago',
    read: true,
  },
];

// Sample Users who can review posts
export const sampleReviewers: AppUser[] = [
    {
        id: 'user-admin-1',
        name: 'Alice Johnson',
        email: 'alice.j@example.com',
        role: 'Admin',
        avatarUrl: 'https://placehold.co/100x100.png?text=A',
    },
    {
        id: 'user-superadmin-1',
        name: 'Bob Williams',
        email: 'bob.w@example.com',
        role: 'Superadmin',
        avatarUrl: 'https://placehold.co/100x100.png?text=B',
    },
    {
        id: 'team-marketing',
        name: 'Marketing Team',
        email: 'marketing@example.com',
        role: 'Admin', // Represents a group
    }
]

// Sample Post Data

export const sampleDraftPostsData: Post[] = [
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
    dataAiHint: "autumn leaves"
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
];

export const sampleFeedbackPostsData: Post[] = [
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
    dataAiHint: "product launch",
    reviewedBy: "Alice Johnson",
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
    reviewedBy: "Marketing Team", 
    feedbackNotes: "Team, please double check the links in this post. One of them seems to be broken. Also, let's consider adding a question to encourage comments.", 
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
    dataAiHint: "community people"
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
    reviewedBy: "Bob Williams",
    feedbackNotes: "Great start! Please add more specific data points from Q3, especially regarding user growth in the APAC region. Also, a stronger call to action at the end would be beneficial. Consider something like 'Download the full report for a deeper dive'. Image choice is good.",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

export const samplePublishablePostsData: Post[] = [
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
    dataAiHint: "tech conference"
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
    dataAiHint: "eco friendly"
  },
];

export const samplePublishedPostsData: Post[] = [
    {
    id: 'sample-published-1',
    title: 'Weekly Roundup: AI in Creative Industries',
    description: 'A look at how AI is transforming design, music, and art. The future is collaborative!',
    hashtags: ['ai', 'creativity', 'futureofwork', 'design'],
    platform: 'LinkedIn',
    tone: 'Professional',
    imageOption: 'generateWithAI',
    imageUrl: 'https://placehold.co/600x400.png',
    status: 'Published',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    dataAiHint: "ai creativity"
  },
  {
    id: 'sample-published-2',
    title: 'Friday Fun: Office Pets Edition',
    description: 'Meet the furry friends that keep our spirits high! Share a picture of your work buddy in the comments.',
    hashtags: ['officepets', 'companyculture', 'tgif', 'worklife'],
    platform: 'Facebook',
    tone: 'Friendly',
    imageOption: 'generateWithAI',
    imageUrl: 'https://placehold.co/600x400.png',
    status: 'Published',
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    dataAiHint: "office dog"
  }
];
