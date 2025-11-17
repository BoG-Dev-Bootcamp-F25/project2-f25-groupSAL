'use client';

import { ReactNode } from 'react';
import Sidebar from '../components/Sidebar';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-[calc(100vh-4.5rem)] overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}

