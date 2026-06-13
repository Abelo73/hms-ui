import { Sidebar } from '@/components/layout/Sidebar';
import { TopNav } from '@/components/layout/TopNav';
import { useSidebar } from '@/contexts/SidebarContext';
import { Construction } from 'lucide-react';

export function ComingSoonPage({ title = 'Coming Soon' }: { title?: string }) {
  const { isCollapsed } = useSidebar();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <TopNav />
      
      <main className={`flex-1 transition-all duration-300 ease-in-out pt-16 p-4 lg:p-5 ${isCollapsed ? 'ml-18' : 'ml-52'}`}>
        <div>
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
            <Construction className="w-24 h-24 text-gray-400" />
            <h1 className="text-4xl font-bold text-gray-900">{title}</h1>
            <p className="text-xl text-gray-600 max-w-md">
              This feature is under development. We're working hard to bring you this functionality soon.
            </p>
            <div className="flex gap-4 mt-8">
              <div className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg">
                <span className="text-sm font-medium">In Progress</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
