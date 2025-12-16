/*
 * @copyright 2025 Marcell Ferreira - Advocacia
 * @license Apache-2.0
 */

/**
 * Components
 */
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '../themeToggle';

/**
 * Assets
 */
import { SearchIcon, Settings2Icon, DownloadIcon } from "lucide-react";

export const Page = ({ children }: React.PropsWithChildren) => {
  return (
    <div className="px-4 py-8 md:p-8">{children}</div>
  )
}

export const PageHeader = () => {
  return (
    <div className="flex flex-col gap4 items-center justify-between space-y-1 
    lg:flex-row lg:justify-between">
      <h1 className="text-xl font-semibold lg:text-2xl">Leis Trabalhistas e Previdenciárias</h1>

      <div className="flex gap-3">
        <div className="flex max-lg:hidden">
          <ThemeToggle />

          <Button
            aria-label='Search'
            variant="ghost"
            size="icon"
          >
            <SearchIcon className="h-6 w-6"/>
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Settings2Icon />

            <span>Personalizar</span>
          </Button>

          <Button variant="outline">
            <DownloadIcon />

            <span>Exportar</span>
          </Button>
        </div>
      </div>

    </div>
  )
}
