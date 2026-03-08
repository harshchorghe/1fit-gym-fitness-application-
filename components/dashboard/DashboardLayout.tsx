'use client';

import { useState, ReactNode } from 'react';
import Sidebar from './Sidebar';
import TopNavigation from './TopNavigation';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="h-screen overflow-hidden bg-black text-white">

      <div className="grain"></div>

      <TopNavigation 
        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className="flex h-[calc(100vh-4rem)] pt-16 lg:pt-0">
        <Sidebar 
          isSidebarOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />

        <main className="min-w-0 flex-1 overflow-y-auto scrollbar-hide p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}