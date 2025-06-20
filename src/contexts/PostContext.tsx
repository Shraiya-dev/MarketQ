
"use client";

import type { Post, PostStatus, PostTone, ImageOption, SocialPlatform } from '@/lib/types';
import { socialPlatforms, postTones, imageOptions } from '@/lib/types';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface PostContextType {
  posts: Post[];
  addPost: (post: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'feedbackNotes'>) => Post;
  updatePost: (id: string, updates: Partial<Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'status'>>) => void;
  updatePostStatus: (id: string, status: PostStatus, feedbackNotes?: string) => void;
  deletePost: (id: string) => void;
  getPost: (id: string) => Post | undefined;
  isLoading: boolean;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'socialflow-posts-v2';

export const PostProvider = ({ children }: { children: ReactNode }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedPosts = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedPosts) {
        const parsedPosts = JSON.parse(storedPosts) as Post[];
        const migratedPosts = parsedPosts.map(post => ({
          ...post,
          tone: post.tone || postTones[0],
          imageOption: post.imageOption || imageOptions[0],
          feedbackNotes: post.feedbackNotes || undefined, // Ensure feedbackNotes is present or undefined
        }));
        setPosts(migratedPosts);
      }
    } catch (error) {
      console.error("Failed to load posts from local storage", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(posts));
      } catch (error) {
        console.error("Failed to save posts to local storage", error);
      }
    }
  }, [posts, isLoading]);

  const addPost = (postData: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'feedbackNotes'>): Post => {
    const newPost: Post = {
      title: postData.title,
      description: postData.description,
      hashtags: postData.hashtags || [],
      platform: postData.platform || socialPlatforms[0],
      tone: postData.tone || postTones[0],
      imageOption: postData.imageOption || imageOptions[0],
      imageUrl: postData.imageUrl,
      id: Date.now().toString(), 
      status: "Draft",
      feedbackNotes: undefined, 
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setPosts(prevPosts => [newPost, ...prevPosts]);
    return newPost;
  };

  const updatePost = (id: string, updates: Partial<Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'status'>>) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === id ? { 
            ...post, 
            ...updates, 
            tone: updates.tone || post.tone || postTones[0],
            imageOption: updates.imageOption || post.imageOption || imageOptions[0],
            feedbackNotes: 'feedbackNotes' in updates ? updates.feedbackNotes : post.feedbackNotes, // Handle feedbackNotes update
            updatedAt: new Date().toISOString() 
        } : post
      )
    );
  };

  const updatePostStatus = (id: string, status: PostStatus, feedbackNotes?: string) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === id ? { 
          ...post, 
          status, 
          feedbackNotes: status === "Feedback" ? (feedbackNotes || post.feedbackNotes) : post.feedbackNotes, // Only update/keep if status is Feedback
          updatedAt: new Date().toISOString() 
        } : post
      )
    );
  };

  const deletePost = (id: string) => {
    setPosts(prevPosts => prevPosts.filter(post => post.id !== id));
  };

  const getPost = (id: string): Post | undefined => {
    return posts.find(post => post.id === id);
  };

  return (
    <PostContext.Provider value={{ posts, addPost, updatePost, updatePostStatus, deletePost, getPost, isLoading }}>
      {children}
    </PostContext.Provider>
  );
};

export const usePosts = () => {
  const context = useContext(PostContext);
  if (context === undefined) {
    throw new Error('usePosts must be used within a PostProvider');
  }
  return context;
};
