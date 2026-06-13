import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Search, Plus, Command, User, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/auth/useAuth';
import { useSidebar } from '@/contexts/SidebarContext';
import { cn } from '@/lib/utils';

export function TopNav() {
  const { user, logout } = useAuth();
  const { isCollapsed } = useSidebar();
  const [showDropdown, setShowDropdown] = useState(false);

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  const hasUnreadNotifications = true; // Mock state for badge

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className={cn(
      "fixed top-0 right-0 z-30 flex h-14 items-center bg-white border-b border-zinc-100 transition-all duration-300 ease-in-out",
      isCollapsed ? "left-14" : "left-[220px]"
    )}>
      <div className="flex flex-1 items-center justify-between px-6">
        {/* Left: Search */}
        <div className="flex-1 max-w-[280px] hidden sm:block">
          <div className="relative group">
            <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-600 transition-colors" />
            <input
              type="text"
              placeholder="Search patients, records..."
              className="h-9 w-full rounded-full bg-zinc-50 pl-9 pr-12 text-sm text-zinc-900 outline-none border border-transparent focus:border-zinc-200 focus:bg-white transition-all ring-offset-white"
            />
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 px-1.5 py-0.5 rounded border border-zinc-200 bg-white text-[10px] font-medium text-zinc-400">
              <Command className="size-2.5" /> K
            </div>
          </div>
        </div>

        {/* Mobile Search Icon */}
        <button className="sm:hidden p-2 text-zinc-500 hover:text-zinc-900 transition-colors">
          <Search className="size-5" />
        </button>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <button className="h-8 px-3 rounded-md bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 transition-colors flex items-center gap-1.5">
            <Plus className="size-3.5" />
            <span>New</span>
          </button>

          <div className="h-4 w-px bg-zinc-100 mx-1" />

          {/* Notifications */}
          <button className="p-2 text-zinc-500 hover:text-zinc-900 transition-colors relative">
            <Bell className="size-5" />
            {hasUnreadNotifications && (
              <span className="absolute top-2 right-2.5 size-1.5 bg-red-500 rounded-full ring-2 ring-white" />
            )}
          </button>

          {/* User Profile */}
          <div className="relative">
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 p-0.5 rounded-full hover:bg-zinc-50 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2"
            >
              <div className="size-8 rounded-full bg-zinc-100 flex items-center justify-center text-xs font-semibold text-zinc-700 ring-1 ring-zinc-200 overflow-hidden">
                {getInitials(user?.firstName, user?.lastName)}
              </div>
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-zinc-200 rounded-lg shadow-lg py-1 z-50">
                <div className="px-3 py-2 border-b border-zinc-100">
                  <p className="text-sm font-medium text-zinc-900 leading-none">{user?.firstName} {user?.lastName}</p>
                  <p className="text-xs text-zinc-500 mt-1">{user?.email}</p>
                </div>
                <div className="py-1">
                  <Link
                    to="/profile"
                    onClick={() => setShowDropdown(false)}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-all"
                  >
                    <User className="size-4" />
                    <span>Profile</span>
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setShowDropdown(false)}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-all"
                  >
                    <Settings className="size-4" />
                    <span>Settings</span>
                  </Link>
                </div>
                <div className="border-t border-zinc-100 pt-1">
                  <button
                    onClick={() => {
                      handleLogout();
                      setShowDropdown(false);
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 transition-all w-full text-left"
                  >
                    <LogOut className="size-4" />
                    <span>Log out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {showDropdown && (
        <div 
          className="fixed inset-0 z-40 bg-transparent" 
          onClick={() => setShowDropdown(false)}
        />
      )}
    </header>
  );
}
