import { Outlet, useLocation } from 'react-router-dom';
import { Header } from '../../components/header';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/appSidebar';

export const BaseLayout = () => {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/Dashboard");

  return (
    <SidebarProvider defaultOpen={true} className="flex min-h-screen flex-col">
      <Header />

      <div className="flex-1 flex overflow-hidden">
        {isDashboard && <AppSidebar />}
        <SidebarInset className="flex-1 overflow-hidden">
          <main className="w-full h-full py-0 px-2 overflow-y-auto">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};
