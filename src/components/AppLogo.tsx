
import Link from 'next/link';

export function AppLogo() {
  return (
    <Link href="/dashboard" className="flex items-center gap-2 group" aria-label="Axcess.io Home">
      <div className="bg-primary group-hover:bg-accent transition-colors p-2 rounded-lg text-primary-foreground">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
          <path d="M2 4 L14 12 L2 20 L7 20 L14 15 L22 12 L14 9 L7 4 Z" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-primary-foreground group-hover:text-accent transition-colors font-headline">
        Axcess.io
      </h1>
    </Link>
  );
}
