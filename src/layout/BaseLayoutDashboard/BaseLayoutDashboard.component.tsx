import { AppSidebar } from "@/components/appSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";

export const BaseLayoutDashboard = () => {
  return (
    <SidebarProvider>
      <div className="flex h-full w-full overflow-hidden">
        <AppSidebar />

        <SidebarInset className="flex-1 overflow-y-auto">
          <Outlet />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};
