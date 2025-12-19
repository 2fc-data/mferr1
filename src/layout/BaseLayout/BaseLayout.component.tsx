import { Outlet } from 'react-router-dom';
import { Header } from '../../components/header';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

export const BaseLayout = () => {
  return (
    <SidebarProvider className="flex min-h-screen flex-col">
      <Header />

      {/* Área abaixo do header */}
      <SidebarInset className="flex flex-1 overflow-hidden">
        <main>
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};
