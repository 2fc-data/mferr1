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
import { Link } from "react-router-dom";
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
  SidebarGroupContent
} from "@/components/ui/sidebar";
import { ChartNoAxesColumnIncreasing } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/dashboard/userMenu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/**
 * Hooks
 */
import { useSidebar } from "@/components/ui/sidebar";

/**
 * Assets
 */
import { LogOutIcon } from "lucide-react";

/**
 * Constantes
 */
import { APP_SIDEBAR } from "@/lib/constants/";
import { useEffect } from "react";

export const AppSidebar = () => {
  const { isMobile, state, toggleSidebar } = useSidebar();

  useEffect(() => {
    if (isMobile && state === 'expanded') {
      toggleSidebar();
    }
  }, [isMobile, state, toggleSidebar]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  }

  return (
    <Sidebar
      variant='floating'
      collapsible="icon"
      className="bg-background h-[calc(100vh-5rem)] top-21"
    >
      <TooltipProvider delayDuration={0}>
        {/* Sidebar Header */}
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem className={cn(
              "flex items-center px-2 py-0 border-b"
            )}>
              {state === 'expanded' ?
                <div className="flex items-center justify-center">
                  <h6>Análise dos dados</h6>
                </div>
                : <ChartNoAxesColumnIncreasing />
              }
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
                      <Link to={item.url}>
                        <item.Icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Admin Nav */}
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {APP_SIDEBAR.adminNav.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton tooltip={item.title} asChild>
                      <Link to={item.url}>
                        <item.Icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Secondary Nav*/}
          {/* {isMobile && ( */}
          <SidebarGroup className="mt-auto">
            <SidebarGroupContent>
              <SidebarMenu>
                {APP_SIDEBAR.secondaryNav.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton tooltip={item.title} asChild>
                      <Link to={item.url}>
                        <item.Icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          {/* )} */}
        </SidebarContent>

        {/* Sidebar Footer */}
        <SidebarFooter className={cn((isMobile || state === 'collapsed') && 'border-t')}>
          <SidebarMenu>
            <SidebarMenuItem className={cn(
              "flex w-full",
              (isMobile || state === 'collapsed')
                ? "flex-col items-center justify-center p-2 gap-4"
                : "p-2 items-center justify-between"
            )}>
              {state === 'expanded' ? (
                <div className="flex justify-between items-start gap-2">
                  <div className="grid grid-cols-[max-content_minmax(0,1fr)]
                  items-center gap-2">
                    <div className="relative">
                      <Avatar
                        src={APP_SIDEBAR.curProfile.src}
                        size="36px"
                        round="50%"
                      />

                      <div className="absolute bottom-0 right-0 size-2 rounded-full bg-emerald-500
                      dark:bg-emerald-500 ring-sidebar ring-1"></div>
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

                </div>
              ) : (
                <div className="relative">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <UserMenu />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="flex flex-col gap-0.5">
                      <p className="font-semibold">{APP_SIDEBAR.curProfile.name}</p>
                      <p className="text-xs text-muted-foreground">{APP_SIDEBAR.curProfile.email}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              )}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    aria-label="Logout"
                    className={cn(
                      "text-white cursor-pointer bg-destructive hover:bg-destructive/80 hover:text-white rounded-full",
                      (!isMobile && state === 'expanded') && "mt-3"
                    )}

                    size="icon-sm"
                    variant="ghost"
                    onClick={handleLogout}
                  >
                    <LogOutIcon />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Sair</p>
                </TooltipContent>
              </Tooltip>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </TooltipProvider>
    </Sidebar >
  )
}
