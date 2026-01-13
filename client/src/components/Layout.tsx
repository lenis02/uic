// src/components/Layout.tsx
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <>
      <Navbar />

      {/* <Outlet />은 자식 라우트(페이지들)가 렌더링 될 자리입니다.
        Navbar는 고정되고, 이 부분만 페이지에 따라 갈아 끼워집니다.
      */}
      <main className="flex-1">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
