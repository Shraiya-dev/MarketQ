
import { SidebarProvider } from '@/components/ui/sidebar';
import { SidebarNav } from '@/components/SidebarNav';
import { AppHeader } from '@/components/AppHeader';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen bg-background">
        <SidebarNav />
        <div className="flex flex-1 flex-col peer-data-[collapsible=offcanvas]:pl-0 peer-data-[variant!=inset]:md:pl-[var(--sidebar-width)] peer-data-[collapsible=icon]:md:pl-[var(--sidebar-width-icon)] transition-[padding] duration-200 ease-linear">
          <AppHeader />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
