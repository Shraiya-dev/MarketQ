
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckCircle2, Eye, EyeOff, LogIn } from 'lucide-react';
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
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    <path fill="none" d="M1 1h22v22H1z"/>
  </svg>
);

const MicrosoftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.396 11.396H3V3h8.396v8.396zm0 9.208H3v-8.396h8.396v8.396zm9.208-9.208H12.21V3h8.396v8.396zm0 9.208H12.21v-8.396h8.396v8.396z"/>
  </svg>
);

const AmazonIcon = () => (
 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-a-large">
    <path d="M2 20V4h6l4 12 4-12h6v16"/>
    <path d="M12 12H6"/>
    <path d="M12 12h6"/>
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
            <div className="flex items-center space-x-2 mb-10">
              <div className="bg-white/10 p-2 rounded-lg">
                <LogIn className="h-6 w-6 text-[hsl(var(--auth-panel-foreground))]" />
              </div>
              <span className="text-2xl font-semibold">Axcess.io</span>
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
