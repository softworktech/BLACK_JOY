"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAdmin } from '@/context/admin-context';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  FolderTree,
  Users,
  FileImage,
  Mail,
  Ticket,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  X,
  Menu,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminSidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isCollapsed?: boolean;
  setIsCollapsed?: (isCollapsed: boolean) => void;
}

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
  { label: 'Orders', icon: ShoppingCart, href: '/admin/orders' },
  { label: 'Products', icon: Package, href: '/admin/products' },
  { label: 'Categories', icon: FolderTree, href: '/admin/categories' },
  { label: 'Customers', icon: Users, href: '/admin/customers' },
  { label: 'Requests', icon: FileImage, href: '/admin/requests' },
  { label: 'Messages', icon: Mail, href: '/admin/contacts' },
  { label: 'Coupons', icon: Ticket, href: '/admin/coupons' },
  { label: 'Reports', icon: BarChart3, href: '/admin/reports' },
  { label: 'Settings', icon: Settings, href: '/admin/settings' },
];

export function AdminSidebar({ isOpen, setIsOpen, isCollapsed = false, setIsCollapsed }: AdminSidebarProps) {
  const pathname = usePathname();
  const { logout } = useAdmin();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 h-screen bg-white/95 backdrop-blur-xl border-r border-slate-100/50 z-50 flex flex-col transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] shadow-[4px_0_30px_rgba(0,0,0,0.03)]
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isCollapsed ? 'w-[280px] lg:w-[88px]' : 'w-[280px]'}
        `}
      >
        <div className={`flex items-center p-6 border-b border-slate-100/50 h-[72px] ${isCollapsed ? 'lg:justify-center justify-between' : 'justify-between'}`}>
          <div className={`flex flex-col ${isCollapsed ? 'lg:hidden' : 'flex'}`}>
            <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-orange-400 tracking-tight">Dose care</h1>
            <p className="text-[10px] uppercase text-slate-400 font-bold tracking-widest mt-0.5">Admin Panel</p>
          </div>
          {isCollapsed && (
            <div className="hidden lg:flex items-center justify-center bg-gradient-to-tr from-orange-600 to-orange-400 rounded-xl w-11 h-11 text-white font-black text-xl shadow-[0_8px_20px_rgba(249,115,22,0.3)]">
              D
            </div>
          )}
          <button onClick={() => setIsOpen(false)} className="lg:hidden text-slate-400 hover:text-orange-500 hover:bg-orange-50 p-2 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-2 px-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex items-center px-3.5 py-3 rounded-2xl transition-all duration-300 group relative
                  ${isActive 
                    ? 'bg-gradient-to-r from-orange-500 to-orange-400 text-white shadow-[0_4px_20px_rgba(249,115,22,0.35)] scale-[1.02]' 
                    : 'text-slate-500 hover:bg-orange-50 hover:text-orange-600 hover:scale-[1.02]'
                  }
                  ${isCollapsed ? 'lg:justify-center lg:px-0 lg:w-14 lg:h-14 lg:mx-auto' : 'gap-3.5'}
                `}
                onClick={() => setIsOpen(false)}
              >
                <Icon size={22} className={`transition-transform duration-300 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-orange-500'} ${isCollapsed ? 'group-hover:scale-110' : ''}`} />
                <span className={`font-semibold text-sm whitespace-nowrap transition-opacity duration-300 ${isCollapsed ? 'lg:hidden' : 'block'}`}>
                  {item.label}
                </span>
                
                {/* Active indicator dot for collapsed mode */}
                {isActive && isCollapsed && (
                  <span className="hidden lg:block absolute right-1.5 top-1.5 w-1.5 h-1.5 bg-white rounded-full"></span>
                )}
                
                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="hidden lg:group-hover:flex absolute left-full ml-4 px-3 py-2 bg-gray-900 text-white text-xs font-semibold rounded-lg shadow-xl whitespace-nowrap z-50 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-[-10px] group-hover:translate-x-0">
                    {item.label}
                    <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 border-[5px] border-transparent border-r-gray-900"></div>
                  </div>
                )}
              </Link>
            );
          })}
        </div>

        <div className={`p-4 border-t border-slate-100/50 flex flex-col gap-3 bg-white/50 backdrop-blur-md`}>
          {setIsCollapsed && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={`hidden lg:flex items-center w-full py-3 text-slate-400 hover:text-orange-500 hover:bg-orange-50 rounded-2xl transition-all duration-300 group
                ${isCollapsed ? 'justify-center' : 'justify-between px-4'}
              `}
            >
              {!isCollapsed && <span className="text-sm font-semibold text-slate-500 group-hover:text-orange-500">Collapse</span>}
              <ChevronRight size={20} className={`transition-transform duration-500 ${isCollapsed ? '' : 'rotate-180'}`} />
            </button>
          )}
          
          <Button 
            variant="ghost" 
            className={`w-full text-slate-500 hover:text-red-600 hover:bg-red-50 hover:shadow-sm rounded-2xl transition-all duration-300 h-12
              ${isCollapsed ? 'lg:justify-center lg:px-0 lg:w-14 lg:mx-auto' : 'justify-start px-4'}
            `}
            onClick={logout}
            title={isCollapsed ? "Logout" : undefined}
          >
            <LogOut size={20} className={`${isCollapsed ? 'mr-0' : 'mr-3'} text-slate-400 group-hover:text-red-500 transition-colors`} />
            <span className={`${isCollapsed ? 'lg:hidden' : 'block'} font-semibold`}>Logout</span>
          </Button>
        </div>
      </aside>
    </>
  );
}
