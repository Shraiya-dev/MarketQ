
"use client";

import type { Post, PostStatus } from '@/lib/types';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface PostContextType {
  posts: Post[];
  addPost: (post: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => Post;
  updatePost: (id: string, updates: Partial<Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'status'>>) => void;
  updatePostStatus: (id: string, status: PostStatus) => void;
  deletePost: (id: string) => void;
  getPost: (id: string) => Post | undefined;
  isLoading: boolean;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'socialflow-posts';

export const PostProvider = ({ children }: { children: ReactNode }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedPosts = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedPosts) {
        setPosts(JSON.parse(storedPosts));
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

  const addPost = (postData: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Post => {
    const newPost: Post = {
      ...postData,
      id: Date.now().toString(), // Simple ID generation
      status: "Draft", // Default status for new post
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setPosts(prevPosts => [newPost, ...prevPosts]);
    return newPost;
  };

  const updatePost = (id: string, updates: Partial<Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'status'>>) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === id ? { ...post, ...updates, updatedAt: new Date().toISOString() } : post
      )
    );
  };

  const updatePostStatus = (id: string, status: PostStatus) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === id ? { ...post, status, updatedAt: new Date().toISOString() } : post
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
