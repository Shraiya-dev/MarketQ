import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { PostProvider } from '@/contexts/PostContext';

export const metadata: Metadata = {
  title: 'SocialFlow',
  description: 'Create and manage your social media posts efficiently.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen bg-background text-foreground">
        <PostProvider>
          {children}
          <Toaster />
        </PostProvider>
      </body>
    </html>
  );
}
