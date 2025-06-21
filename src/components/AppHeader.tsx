
"use client";

import { Bell, UserCircle, LogOut, Settings, User, Mail, MessageSquare, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SidebarTrigger } from '@/components/ui/sidebar';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { sampleNotifications } from '@/lib/sample-data.tsx';

export function AppHeader() {
  const router = useRouter();
  const { toast } = useToast();

  const handleSignOut = () => {
    // Simulate sign out
    toast({
      title: "Signed Out",
      description: "You have been successfully signed out.",
    });
    router.push('/sign-in');
  };

  const unreadNotificationsCount = sampleNotifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center border-b bg-background/90 px-4 backdrop-blur sm:px-6 lg:px-8">
      <div className="md:hidden">
        <SidebarTrigger />
      </div>
      <div className="hidden md:block">
        {/* Placeholder for breadcrumbs or page title if needed in the future */}
      </div>

      <div className="ml-auto flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
              <Bell className="h-5 w-5" />
              {unreadNotificationsCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-4 w-4 min-w-4 p-0 flex items-center justify-center text-xs rounded-full"
                >
                  {unreadNotificationsCount}
                </Badge>
              )}
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80 md:w-96" align="end">
            <DropdownMenuLabel className="flex justify-between items-center">
              <span>Notifications</span>
              {unreadNotificationsCount > 0 && (
                <Badge variant="secondary" className="text-xs">{unreadNotificationsCount} New</Badge>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup className="max-h-[300px] overflow-y-auto">
              {sampleNotifications.length === 0 && (
                <DropdownMenuItem disabled>
                  <div className="py-4 text-center text-sm text-muted-foreground">
                    No new notifications
                  </div>
                </DropdownMenuItem>
              )}
              {sampleNotifications.slice(0, 5).map((notification) => ( // Show first 5 in dropdown
                <DropdownMenuItem key={notification.id} className={`flex items-start gap-3 p-3 ${!notification.read ? 'bg-muted/50' : ''}`}>
                  <div className="mt-1 shrink-0">{notification.icon}</div>
                  <div className="flex-grow">
                    <p className={`text-sm font-medium ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>{notification.title}</p>
                    <p className={`text-xs ${!notification.read ? 'text-foreground/80' : 'text-muted-foreground/80'}`}>{notification.description}</p>
                    <p className="text-xs text-muted-foreground/60 mt-0.5">{notification.time}</p>
                  </div>
                  {!notification.read && (
                     <div className="mt-1 h-2 w-2 rounded-full bg-primary shrink-0" title="Unread"></div>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            {sampleNotifications.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/notifications" className="flex items-center justify-center cursor-pointer py-2 text-sm text-primary hover:underline">
                    View all notifications
                  </Link>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarImage src="https://placehold.co/100x100.png" alt="User Avatar" data-ai-hint="user avatar" />
                <AvatarFallback>
                  <UserCircle className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Axcess User</p>
                <p className="text-xs leading-none text-muted-foreground">
                  user@example.com
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="#" className="flex items-center cursor-pointer w-full">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings" className="flex items-center cursor-pointer w-full">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
