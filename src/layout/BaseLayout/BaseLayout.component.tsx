import { Outlet } from 'react-router-dom';
import { Header } from '../../components/header';

export const BaseLayout = () => {
  return (
    <div className="">
      <Header />
      <Outlet />
    </div>
  );
};
