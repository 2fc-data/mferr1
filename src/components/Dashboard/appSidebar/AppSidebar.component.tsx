/**
 * @copyright 2025 2FC.Data
 * @license Apache-2.0
 */

/**
 * Custom modules
 */
import { cn } from "@/lib/utils";

/**
 * Components
 */
import Avatar from "react-avatar";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/Dashboard/userMenu";

/**
 * Hooks
 */
import { useSidebar } from "@/components/ui/sidebar";

/**
 * Assets
 */
import { LogOutIcon } from "lucide-react";
// import { Logo } from '@/assets/Logo';
// import { Logo } from "@/assets/Logo";

/**
 * Constantes
 */
import { APP_SIDEBAR } from "@/lib/constants/";

export const AppSidebar = () => {
  const { isMobile } = useSidebar();

  return (
    <Sidebar
      variant='floating'
      collapsible="icon"
      className="top-17 h-[calc(100vh-4rem)] bg-sidebar border-r border-sidebar-border"
    >
      {/* Sidebar Header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="px-1 max-lg:p-2">
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/** Sidebar Content */}
      <SidebarContent>
        {/* Primary Nav*/}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {APP_SIDEBAR.primaryNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton tooltip={item.title} asChild>
                    <a href={item.url}>
                      <item.Icon />

                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Secondary Nav*/}
        {isMobile && (
          <SidebarGroup className="mt-auto">
            <SidebarGroupContent>
              <SidebarMenu>
                {APP_SIDEBAR.secondaryNav.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton tooltip={item.title} asChild>
                      <a href={item.url}>
                        <item.Icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      {/* Sidebar Footer */}
      <SidebarFooter className={cn(isMobile && 'border-t')}>
        <SidebarMenu>
          <SidebarMenuItem className={cn(isMobile && 'p-2')}>
            {isMobile ? (
              <div className="flex justify-between items-start gap-2">
                <div className="grid grid-cols-[max-content_minmax(0,1fr)]
                  items-center gap-2">
                  <div className="relative">
                    <Avatar
                      src={APP_SIDEBAR.curProfile.src}
                      size="36px"
                      round={true}
                    />

                    <div className="absolute bottom-0 right-0 size-2 rounded-full bg-emerald-500
                      dark:bg-emerald-400 ring-sidebar ring-1"></div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold">
                      {APP_SIDEBAR.curProfile.name}
                    </h3>

                    <p className="text-sm text-muted-foreground truncate">
                      {APP_SIDEBAR.curProfile.email}
                    </p>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Logout"
                >
                  <LogOutIcon />
                </Button>
              </div>
            ) : (
              <UserMenu />
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar >
  )
}
