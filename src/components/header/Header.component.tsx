import { LogInIcon, MenuIcon, Scale } from "lucide-react";
import { ThemeToggle } from "../themeToggle";
import { Button } from "../ui/button";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { Login } from "../login/Login.component";
import { NewPassword } from "../newPassword/NewPassword.component";

/**
 * Hooks
 */
import { useSidebar } from "@/components/ui/sidebar";

export const Header = () => {
  const { toggleSidebar } = useSidebar();
  const location = useLocation();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isNewPasswordOpen, setIsNewPasswordOpen] = useState(false);

  const handleOpenLogin = () => {
    setIsLoginOpen(true);
    setIsNewPasswordOpen(false);
  };

  const handleOpenNewPassword = () => {
    setIsNewPasswordOpen(true);
    setIsLoginOpen(false);
  };

  return (
    <header className="
      bg-background text-foreground
      flex 
      h-21
      items-center justify-between 
      border-b border-border
      px-5      
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
          className="rounded-full"
          variant="ghost"
          size="icon"
          aria-label="Login"
          onClick={handleOpenLogin}
        >
          <LogInIcon className="h-9 w-9 text-primary" />
        </Button>
      </div>

      <Login
        isOpen={isLoginOpen}
        onClose={setIsLoginOpen}
        onForgotPassword={handleOpenNewPassword}
      />

      <NewPassword
        isOpen={isNewPasswordOpen}
        onClose={setIsNewPasswordOpen}
        onBackToLogin={handleOpenLogin}
      />
    </header>
  );
};
