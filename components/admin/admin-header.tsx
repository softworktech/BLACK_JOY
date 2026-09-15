"use client";

import React from 'react';
import { Menu, Bell } from 'lucide-react';
import { useAdmin } from '@/context/admin-context';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AdminHeaderProps {
  title: string;
  onMenuClick: () => void;
  isCollapsed?: boolean;
  setIsCollapsed?: (isCollapsed: boolean) => void;
}

export function AdminHeader({ title, onMenuClick, isCollapsed, setIsCollapsed }: AdminHeaderProps) {
  const { user, logout } = useAdmin();

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30 transition-all duration-300">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onMenuClick} className="lg:hidden text-slate-500 hover:text-orange-500">
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold text-slate-800">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative text-slate-500 hover:text-orange-500 hover:bg-orange-50 transition-colors rounded-full">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full border-2 border-white"></span>
        </Button>

        <div className="h-6 w-px bg-slate-200 mx-1"></div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full ml-1 hover:ring-2 ring-orange-500/20 transition-all">
              <Avatar className="h-9 w-9 bg-orange-100 text-orange-600 border border-orange-200">
                <AvatarFallback className="font-semibold text-sm">
                  {user?.name?.charAt(0).toUpperCase() || 'A'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 mt-1" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1.5 p-1">
                <p className="text-sm font-semibold leading-none text-slate-800">{user?.name || 'Admin'}</p>
                <p className="text-xs leading-none text-muted-foreground mt-1">
                  {user?.email || 'admin@dosecare.com'}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-100" />
            <DropdownMenuItem className="cursor-pointer hover:bg-slate-50 focus:bg-slate-50">Profile</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer hover:bg-slate-50 focus:bg-slate-50">Settings</DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-100" />
            <DropdownMenuItem onClick={logout} className="text-red-600 focus:text-red-600 focus:bg-red-50 hover:bg-red-50 cursor-pointer font-medium">
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
