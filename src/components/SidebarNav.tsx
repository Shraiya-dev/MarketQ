
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, PlusSquare, FileText, ShieldCheck } from 'lucide-react'; 
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
import { useAuth } from '@/contexts/AuthContext';


export function SidebarNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['User', 'Admin', 'Superadmin'] },
    { href: '/create-post', label: 'Create Post', icon: PlusSquare, roles: ['User', 'Admin', 'Superadmin'] },
    { href: '/history', label: 'Your Posts', icon: FileText, roles: ['User', 'Admin', 'Superadmin'] },
    { href: '/admin', label: 'Admin', icon: ShieldCheck, roles: ['Admin', 'Superadmin'] },
  ];

  const visibleNavItems = navItems.filter(item => user && item.roles.includes(user.role));

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="group-data-[collapsible=icon]:hidden">
          <AppLogo />
        </div>
        <div className="hidden group-data-[collapsible=icon]:block">
           <Link href="/dashboard" aria-label="Axcess.io Home">
            <Button variant="ghost" size="icon" className="bg-primary hover:bg-accent text-primary-foreground h-10 w-10">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                  <path d="M2 4 L14 12 L2 20 L7 20 L14 15 L22 12 L14 9 L7 4 Z" />
                </svg>
            </Button>
           </Link>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {visibleNavItems.map((item) => {
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
