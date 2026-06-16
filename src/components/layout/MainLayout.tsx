import { type ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { useSidebar } from '@/contexts/SidebarContext';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children: ReactNode;
  /** Page title shown below stat cards */
  pageTitle?: string;
  /** Alias for pageTitle */
  title?: string;
  /** Optional subtitle (ignored, kept for compat) */
  subtitle?: string;
  /** Optional call to action element placed next to page title */
  pageAction?: ReactNode;
}

export function MainLayout({ children, pageTitle, title, pageAction }: MainLayoutProps) {
  const { isCollapsed } = useSidebar();
  const resolvedTitle = pageTitle || title;

  return (
    <div className="flex min-h-screen bg-zinc-50">
      <Sidebar />
      <div
        className={cn(
          'flex-1 flex flex-col transition-all duration-300 ease-in-out min-w-0',
          isCollapsed ? 'ml-14' : 'ml-[220px]'
        )}
      >
        <TopNav />

        <main className="flex-1 p-6 mt-14 overflow-visible">


          {/* ── Page-level header ── */}
          {(resolvedTitle || pageAction) && (
            <div className="flex items-center justify-between mb-5">
              {resolvedTitle && (
                <h1 className="text-xl font-semibold text-zinc-900 tracking-tight">
                  {resolvedTitle}
                </h1>
              )}
              {pageAction && <div>{pageAction}</div>}
            </div>
          )}

          {/* ── Page content ── */}
          {children}
        </main>
      </div>
    </div>
  );
}
