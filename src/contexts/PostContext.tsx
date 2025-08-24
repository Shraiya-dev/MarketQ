
"use client";

import type { Post, PostStatus } from '@/lib/types';
import { socialPlatforms, postTones, imageOptions } from '@/lib/types';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface PostContextType {
  posts: Post[];
  addPost: (post: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'feedbackNotes' | 'reviewedBy'>) => Post;
  updatePost: (id: string, updates: Partial<Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'status'>>) => void;
  updatePostStatus: (id: string, status: PostStatus, details?: { feedbackNotes?: string; reviewedBy?: string; }) => void;
  publishPost: (id: string) => void;
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
          feedbackNotes: post.feedbackNotes || undefined,
          reviewedBy: post.reviewedBy || undefined,
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

  const addPost = (postData: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'feedbackNotes' | 'reviewedBy'>): Post => {
    const newPost: Post = {
      ...postData,
      id: Date.now().toString(), 
      status: "Draft",
      feedbackNotes: undefined, 
      reviewedBy: undefined,
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
            updatedAt: new Date().toISOString() 
        } : post
      )
    );
  };

  const updatePostStatus = (id: string, status: PostStatus, details?: { feedbackNotes?: string; reviewedBy?: string; }) => {
    setPosts(prevPosts =>
      prevPosts.map(post => {
        if (post.id !== id) return post;
        
        const newPostState: Post = { ...post, status, updatedAt: new Date().toISOString() };

        if (status === "Submitted") {
          newPostState.reviewedBy = details?.reviewedBy;
          newPostState.status = "Under Review"; // Move to Under Review
        }

        if (status === "Feedback") {
          newPostState.feedbackNotes = details?.feedbackNotes;
        } else if (status !== "Submitted" && status !== "Under Review") {
            newPostState.feedbackNotes = undefined;
        }
        
        if (status === 'Approved') {
            newPostState.status = 'Ready to Publish';
        }

        return newPostState;
      })
    );
  };
  

  const publishPost = (id: string) => {
    console.log(`Simulating publishing post ${id}...`);
    // In a real app, this would involve API calls.
    updatePostStatus(id, 'Published');
  };

  const deletePost = (id: string) => {
    setPosts(prevPosts => prevPosts.filter(post => post.id !== id));
  };

  const getPost = (id: string): Post | undefined => {
    return posts.find(post => post.id === id);
  };

  return (
    <PostContext.Provider value={{ posts, addPost, updatePost, updatePostStatus, publishPost, deletePost, getPost, isLoading }}>
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
