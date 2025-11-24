import { Navbar } from "../navbar";

export const Header = () => {
  return (
    <div className="relative border border-b-secoundary justify-between grid grid-cols-2 px-3 py-3 mb-3 z-40">

      <div className="grid grid-rows-2 w-full items-center justify-start">
        <h3>Marcell Ferreira</h3>
        <h5>Advogados</h5>
      </div>

      <div className="flex items-center justify-end gap-4">
        <Navbar />
      </div>

    </div>
  );
};
