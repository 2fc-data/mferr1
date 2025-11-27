import { Scale } from "lucide-react";
import { Navbar } from "../navbar";

export const Header = () => {
  return (
    <div className="relative justify-between grid grid-cols-2 px-3 py-3 mb-3 z-40 top-0 left-0 w-full">

      <div className="grid grid-cols-2 w-auto items-center justify-start text-accent">        
        <h3 className="text-primary p-3">Marcell Ferreira</h3>
        <Scale className="w-9 h-9 text-primary" />
      </div>

      <div className="flex items-center justify-end gap-4">
        <Navbar />
      </div>

    </div>
  );
};
