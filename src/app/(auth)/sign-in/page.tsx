
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckCircle2, Eye, EyeOff } from 'lucide-react'; 
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// SVGs for social icons
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    <path d="M1 1h22v22H1z" fill="none"/>
  </svg>
);

const MicrosoftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 23 23">
    <rect x="1" y="1" width="10" height="10" fill="#F25022" /> {/* Red */}
    <rect x="12" y="1" width="10" height="10" fill="#7FBA00" /> {/* Green */}
    <rect x="1" y="12" width="10" height="10" fill="#00A4EF" /> {/* Blue */}
    <rect x="12" y="12" width="10" height="10" fill="#FFB900" /> {/* Yellow */}
  </svg>
);

const AmazonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.15.11C15.65.11 14.2.77 14.2.77s-.76 2.11-1.39 3.49c-.62 1.38-1.87 4.92-1.87 4.92s-.16.27-.47.27c-.31 0-.47-.27-.47-.27S8.13 5.64 6.75 2.88C6.06 1.5 5.09.11 5.09.11c-2.5 0-5.09 1.1-5.09 3.86 0 2.22 1.39 3.33 2.18 4.07.63.63 3.49 3.17 3.49 3.17s.31.28.31.63c0 .35-.15.63-.15.63s-1.88.94-3.02 1.57c-1.13.62-2.03 1.25-2.03 2.5 0 2.03 2.5 2.83 5.09 2.83 2.59 0 4.45-.81 4.45-2.83 0-1.25-.9-1.88-2.03-2.5C7.77 14.1 6 13.16 6 13.16s.16-.27.16-.63c0-.35.31-.63.31-.63s2.86-2.54 3.49-3.17c.79-.74 2.18-1.85 2.18-4.07 0-2.75-2.59-3.86-5.09-3.86-.01 0-.01 0-.02 0h.02c.08 0 .16-.08.16-.08s1.1.94 1.73 2.5c1.25 2.94 3.33 7.39 3.33 7.39s.16.42.52.42c.36 0 .52-.42.52-.42s2.08-4.45 3.33-7.39c.63-1.56 1.73-2.5 1.73-2.5s.08.08.16.08c2.59 0 5.09 1.11 5.09 3.86 0 2.22-1.39 3.33-2.18 4.07-.63.63-3.49 3.17-3.49 3.17s-.31.28-.31.63c0 .35.15.63.15.63s1.88.94 3.02 1.57c1.13.62 2.03 1.25 2.03 2.5 0 2.03-2.5 2.83-5.09 2.83-2.59 0-4.45-.81-4.45-2.83 0-1.25.9-1.88 2.03-2.5 1.14-.63 3.02-1.57 3.02-1.57s-.16-.27-.16-.63c0-.35-.31-.63-.31-.63s-2.86-2.54-3.49-3.17c-.79-.74-2.18-1.85-2.18-4.07C19.24 1.11 20.65.1 23.15.1c.01 0 .01 0 .02 0h-.02c-.08 0-.16.08-.16.08S21.87.8 21.24 2.37c-.98 2.38-2.61 5.86-3.23 7.23-.62 1.38-1.24 2.76-1.87 4.14-.62 1.38-1.39 2.76-1.39 2.76s-.16.28-.47.28c-.31 0-.47-.28-.47-.28s-1.25-2.82-1.87-4.15c-.63-1.33-1.25-2.76-1.87-4.14-.63-1.38-1.25-2.76-1.25-2.76s-.76-1.85-1.39-3.23C7.23.8 6.13.11 6.13.11s-.08-.08-.16-.08C3.56.03 1 .94 1 3.97c0 2.5 1.56 4.07 2.95 5.18C5.33 10.25 6 10.88 6 11.51c0 .36-.16.94-.16.94s-1.4.63-2.65 1.25C1.45 14.53 0 15.78 0 17.65c0 2.94 3.23 4.24 6.13 4.24 2.89 0 6.12-1.3 6.12-4.24 0-1.72-1.44-2.97-3.17-3.92C7.32 13.16 6 12.45 6 11.51c0-.63.68-1.26 2.07-2.36C9.46 8.05 11 6.48 11 3.97 11 .94 8.56.03 6 .03h-.02c2.5 0 3.95.66 3.95.66s.76 2.11 1.39 3.49c.62 1.38 1.87 4.92 1.87 4.92s.16.27.47.27c.31 0 .47-.27.47-.27s1.87-3.54 3.25-6.3C18.06 1.5 19.03.11 19.03.11s1.1-.94 2.65-.94c.01 0 .01 0 .02 0Z"/>
  </svg>
);

const signInSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }).min(1, {message: "Email is required."}),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  rememberMe: z.boolean().optional(),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const features = [
    'Access your personalized dashboard',
    'Manage your organization',
    'View analytics and reports',
  ];

  function onSubmit(data: SignInFormValues) {
    console.log("Form submitted:", data);
    // Simulate API call
    toast({
      title: "Sign In Successful",
      description: "Welcome back! Redirecting to dashboard...",
    });
    router.push('/dashboard');
  }

  return (
    <div className="w-full max-w-4xl lg:max-w-5xl">
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-[70vh] md:min-h-[auto] rounded-xl shadow-2xl overflow-hidden">
        {/* Left Panel */}
        <div className="bg-[hsl(var(--auth-panel-background))] text-[hsl(var(--auth-panel-foreground))] p-8 sm:p-12 flex flex-col justify-between">
          <div>
            <div className="mb-10">
              <svg
                viewBox="0 0 800 266"
                xmlns="http://www.w3.org/2000/svg"
                className="w-32 h-auto text-[hsl(var(--auth-panel-foreground))]" 
              >
                <g transform="translate(5, -17) scale(12.5)">
                  <path d="M2 4 L14 12 L2 20 L7 20 L14 15 L22 12 L14 9 L7 4 Z" fill="currentColor"/>
                </g>
                <text
                  x="310"
                  y="170"
                  fontFamily="Outfit, sans-serif"
                  fontSize="110"
                  fontWeight="500"
                  fill="currentColor"
                  letterSpacing="0.5"
                >
                  axcess.io
                </text>
              </svg>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-3">Welcome Back</h1>
            <p className="text-base sm:text-lg text-[hsl(var(--auth-panel-foreground))]/80 mb-8 sm:mb-12">
              Sign in to access your dashboard
            </p>
            <ul className="space-y-3">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-[hsl(var(--auth-panel-accent))] mr-3 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="text-xs text-[hsl(var(--auth-panel-foreground))]/60 mt-8 text-center md:text-left">
            &copy; {new Date().getFullYear()} Axcess.io. All rights reserved.
          </p>
        </div>

        {/* Right Panel - Form */}
        <div className="bg-card p-8 sm:p-12 flex flex-col justify-center">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                          tabIndex={-1}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex items-center justify-between">
                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal">Remember me</FormLabel>
                    </FormItem>
                  )}
                />
                <Link href="#" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" className="w-full bg-[hsl(var(--auth-panel-background))] hover:bg-[hsl(var(--auth-panel-background))]/90 text-[hsl(var(--auth-panel-foreground))]" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Signing In..." : "Sign In"}
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <Button variant="outline" type="button">
                  <GoogleIcon />
                  <span className="sr-only">Google</span>
                </Button>
                <Button variant="outline" type="button">
                  <MicrosoftIcon />
                  <span className="sr-only">Microsoft</span>
                </Button>
                <Button variant="outline" type="button">
                  <AmazonIcon />
                  <span className="sr-only">Amazon</span>
                </Button>
              </div>

              <p className="text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{' '}
                <Link href="#" className="font-semibold text-primary hover:underline">
                  Sign Up
                </Link>
              </p>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

    
