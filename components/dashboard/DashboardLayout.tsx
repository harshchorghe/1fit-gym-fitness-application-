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
    <div className="min-h-screen bg-black text-white">

      <div className="grain"></div>

      <TopNavigation 
        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className="flex pt-16">
        <Sidebar 
          isSidebarOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}