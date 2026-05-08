import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-background flex text-left font-sans text-foreground">
      <Sidebar />
      <div className="flex-1 sm:ml-64 flex flex-col min-h-screen">
        <Topbar />
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto w-full max-w-[1600px] mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
