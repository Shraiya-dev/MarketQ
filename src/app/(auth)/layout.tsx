
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In - SocialFlow',
  description: 'Sign in to access your SocialFlow dashboard.',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 font-body">
      {children}
    </div>
  );
}
