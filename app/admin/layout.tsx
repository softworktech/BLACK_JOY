"use client";

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { AdminProvider } from '@/context/admin-context';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminHeader } from '@/components/admin/admin-header';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Close sidebar on route change on mobile
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Generate title from pathname
  const getPageTitle = () => {
    if (pathname === '/admin') return 'Dashboard';
    const pathParts = pathname.split('/');
    const mainSection = pathParts[2];
    if (!mainSection) return 'Admin Panel';
    
    // Capitalize first letter
    return mainSection.charAt(0).toUpperCase() + mainSection.slice(1);
  };

  const isLoginPage = pathname === '/admin/login';
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <AdminProvider>
      {isLoginPage ? (
        children
      ) : (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
          <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
          
          <div className="flex-1 flex flex-col lg:ml-[280px] transition-all duration-300">
            <AdminHeader title={getPageTitle()} onMenuClick={() => setSidebarOpen(true)} />
            
            <main className="flex-1 p-4 md:p-6 lg:p-8">
              <div className="max-w-7xl mx-auto w-full h-full">
                {children}
              </div>
            </main>
          </div>
        </div>
      )}
    </AdminProvider>
  );
}
