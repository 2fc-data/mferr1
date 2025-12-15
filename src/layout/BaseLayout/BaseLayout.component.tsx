import { Outlet } from 'react-router-dom';
import { Header } from '../../components/header';

export const BaseLayout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      {/* Área abaixo do header */}
      <div className="flex flex-1 overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
};
