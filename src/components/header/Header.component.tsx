import { LogInIcon, MenuIcon, Scale } from "lucide-react";
import { ThemeToggle } from "../themeToggle";
import { Button } from "../ui/button";
import { Link, useLocation } from "react-router-dom";

/**
 * Hooks
 */
import { useSidebar } from "@/components/ui/sidebar";

export const Header = () => {
  const { toggleSidebar } = useSidebar();
  const location = useLocation();

  return (
    <header className="
      bg-background text-foreground
      h-24
      flex 
      items-center justify-between 
      border-b border-border
      px-4
      sticky top-0 z-50
    ">

      <div className="grid grid-cols-2 w-auto items-center">
        <div className="flex flex-row items-center gap-3 text-accent">
          <Scale className="w-9 h-9 text-primary shrink-0" />
          <h1 className="lg:text-3xl text-2xl text-primary p-3 whitespace-nowrap">Marcell Ferreira</h1>
        </div>
      </div>

      <div className="flex flex-row items-center w-auto">
        {location.pathname.startsWith("/Dashboard") && (
          <Button
            aria-label="Toggle mobile menu"
            className="rounded-full"
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
          >
            <MenuIcon />
          </Button>
        )}

        <ThemeToggle />

        <Button
          asChild
          className="rounded-full"
          variant="ghost"
          size="icon"
          aria-label="Login"
        >
          <Link to="/Dashboard">
            <LogInIcon className="h-9 w-9 text-primary" />
          </Link>
        </Button>
      </div>
    </header>
  );
};
