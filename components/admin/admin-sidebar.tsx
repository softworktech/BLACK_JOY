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
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminSidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
  { label: 'Orders', icon: ShoppingCart, href: '/admin/orders' },
  { label: 'Products', icon: Package, href: '/admin/products' },
  { label: 'Categories', icon: FolderTree, href: '/admin/categories' },
  { label: 'Customers', icon: Users, href: '/admin/customers' },
  { label: 'Custom Requests', icon: FileImage, href: '/admin/requests' },
  { label: 'Contact Messages', icon: Mail, href: '/admin/contacts' },
  { label: 'Coupons', icon: Ticket, href: '/admin/coupons' },
  { label: 'Reports', icon: BarChart3, href: '/admin/reports' },
  { label: 'Settings', icon: Settings, href: '/admin/settings' },
];

export function AdminSidebar({ isOpen, setIsOpen }: AdminSidebarProps) {
  const pathname = usePathname();
  const { logout } = useAdmin();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 h-screen w-[280px] bg-slate-900 text-white z-50 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Vtech Store</h1>
            <p className="text-xs text-slate-400 font-medium">Admin Panel</p>
          </div>
          <button onClick={() => setIsOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-1 px-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-orange-500/10 text-orange-500 border-l-4 border-orange-500' 
                    : 'text-slate-300 hover:bg-white/5 hover:text-white border-l-4 border-transparent'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <Icon size={20} className={isActive ? 'text-orange-500' : 'text-slate-400'} />
                <span className="font-medium text-sm">{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-slate-800">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-slate-300 hover:text-white hover:bg-red-500/10 hover:text-red-500"
            onClick={logout}
          >
            <LogOut size={20} className="mr-3 text-slate-400 group-hover:text-red-500" />
            Logout
          </Button>
        </div>
      </aside>
    </>
  );
}
