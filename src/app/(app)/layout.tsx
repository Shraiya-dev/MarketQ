
import { SidebarProvider } from '@/components/ui/sidebar';
import { SidebarNav } from '@/components/SidebarNav';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen">
        <SidebarNav />
        <main className="flex-1 flex flex-col bg-background peer-data-[collapsible=offcanvas]:pl-0 peer-data-[variant!=inset]:md:pl-[var(--sidebar-width)] peer-data-[collapsible=icon]:md:pl-[var(--sidebar-width-icon)] transition-[padding] duration-200 ease-linear">
          {/* Add a simple header here if needed, or integrate into page content */}
          {/* <AppHeader /> */}
          <div className="p-4 sm:p-6 lg:p-8 flex-1">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
