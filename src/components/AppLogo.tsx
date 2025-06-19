
import { Globe } from 'lucide-react';
import Link from 'next/link';

export function AppLogo() {
  return (
    <Link href="/dashboard" className="flex items-center gap-2 group" aria-label="Axcess.io Home">
      <div className="bg-primary group-hover:bg-accent transition-colors p-2 rounded-lg">
        <Globe className="h-6 w-6 text-primary-foreground" />
      </div>
      <h1 className="text-2xl font-bold text-primary group-hover:text-accent transition-colors font-headline">
        Axcess.io
      </h1>
    </Link>
  );
}
