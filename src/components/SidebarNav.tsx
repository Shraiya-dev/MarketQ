
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, PlusSquare, Globe, History } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AppLogo } from '@/components/AppLogo';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/create-post', label: 'Create Post', icon: PlusSquare },
  { href: '/history', label: 'Post History', icon: History },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="group-data-[collapsible=icon]:hidden">
          <AppLogo />
        </div>
        <div className="hidden group-data-[collapsible=icon]:block">
           <Link href="/dashboard" aria-label="Axcess.io Home">
            <Button variant="ghost" size="icon" className="bg-primary hover:bg-accent text-primary-foreground h-10 w-10">
                <Globe className="h-5 w-5" />
            </Button>
           </Link>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <SidebarMenuItem key={item.label}>
                <Link href={item.href}>
                  <SidebarMenuButton
                    isActive={isActive}
                    tooltip={{ children: item.label, className: "font-body" }}
                    className="font-body"
                  >
                    <item.icon className={cn("h-5 w-5", isActive ? "text-sidebar-primary" : "")} />
                    <span className={cn(isActive ? "text-sidebar-primary font-semibold" : "")}>
                      {item.label}
                    </span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4 group-data-[collapsible=icon]:hidden">
        <p className="text-xs text-sidebar-foreground/70">&copy; {new Date().getFullYear()} Axcess.io</p>
      </SidebarFooter>
    </Sidebar>
  );
}
