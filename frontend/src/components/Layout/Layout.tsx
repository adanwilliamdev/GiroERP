import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Sidebar />
      <div className="flex-1 ml-72">
        <Header />
        <main className="p-8 animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;