import { AppSidebar } from "@/components/appSidebar";
import { Outlet } from "react-router-dom";

export const BaseLayoutDashboard = () => {
  return (
    <div className="flex h-full w-full overflow-hidden">
      <AppSidebar />
      <Outlet />
    </div>
  );
};
