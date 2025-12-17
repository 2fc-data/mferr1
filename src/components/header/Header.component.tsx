import { LogInIcon, Scale } from "lucide-react";
import { ThemeToggle } from "../themeToggle";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { MenuIcon } from "lucide-react";

/**
 * Hooks
 */
import { useSidebar } from "@/components/ui/sidebar";


export const Header = () => {
  const { toggleSidebar } = useSidebar();

  return (
    <header className="
      bg-background text-foreground
      h-18
      flex 
      items-center justify-between 
      border-b border-border
      px-4
      sticky top-0 z-50
    ">

      <div className="grid grid-cols-2 w-auto items-center">
        <div className="flex flex-row items-center gap-3 text-accent">
          <Scale className="w-9 h-9 text-primary" />
          <h1 className="text-3xl text-primary p-3">Marcell Ferreira</h1>
        </div>
      </div>

      <div className="flex flex-row items-center w-auto">
        <Button
          aria-label="Toggle mobile menu"
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
        >
          <MenuIcon />
        </Button>

        <ThemeToggle />

        <Button
          asChild
          variant="ghost"
          size="icon"
          aria-label="Login"
        >
          <Link to="/dashboard">
            <LogInIcon className="h-9 w-9 text-primary" />
          </Link>
        </Button>
      </div>
    </header>
  );
};
