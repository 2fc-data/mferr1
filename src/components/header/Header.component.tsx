import { LogInIcon, Scale } from "lucide-react";
import { ThemeToggle } from "../themeToggle";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <header className="
      bg-background
      h-16 
      flex 
      items-center justify-between 
      border-b 
      px-4
      sticky top-0 z-50
    ">

      <div className="grid grid-cols-2 w-auto items-center justify-start text-accent">
        <div className="flex flex-row items-center gap-3">
          <Scale className="w-9 h-9 text-primary" />
          <h3 className="text-primary p-3">Marcell Ferreira</h3>
        </div>

      </div>

      <div className="ml-auto">
        <ThemeToggle />

        <Button
          asChild
          variant="ghost"
          size="icon"
          aria-label="Login"
        >
          <Link to="/dashboard">
            <LogInIcon className="h-9 w-9" />
          </Link>
        </Button>
      </div>
    </header>
  );
};
