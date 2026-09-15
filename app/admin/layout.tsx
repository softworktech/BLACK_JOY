"use client";

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { AdminProvider } from '@/context/admin-context';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminHeader } from '@/components/admin/admin-header';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
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
        <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-sans text-slate-800">
          <AdminSidebar 
            isOpen={sidebarOpen} 
            setIsOpen={setSidebarOpen} 
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
          />
          
          <div className={`flex-1 flex flex-col transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] ${isCollapsed ? 'lg:ml-[88px]' : 'lg:ml-[280px]'}`}>
            <AdminHeader 
              title={getPageTitle()} 
              onMenuClick={() => setSidebarOpen(true)} 
              isCollapsed={isCollapsed}
              setIsCollapsed={setIsCollapsed}
            />
            
            <main className="flex-1 p-4 md:p-6 lg:p-8">
              <div className="max-w-[1600px] mx-auto w-full h-full">
                {children}
              </div>
            </main>
          </div>
        </div>
      )}
    </AdminProvider>
  );
}
