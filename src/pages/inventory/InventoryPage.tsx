import { MainLayout } from '@/components/layout/MainLayout';

import { 
  Package, 
  AlertCircle, 
  TrendingDown, 
  Truck,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

const quickLinks = [
  { title: 'Item Catalog', sub: 'Manage products and supplies', icon: Package, path: '/inventory/items', color: 'text-blue-500' },
  { title: 'Stock Levels', sub: 'Monitor current availability', icon: TrendingDown, path: '/inventory/stock', color: 'text-emerald-500' },
  { title: 'New Procurement', sub: 'Receive incoming goods', icon: Truck, path: '/inventory/procurement', color: 'text-amber-500' },
  { title: 'Stock Alerts', sub: 'Expired or low stock items', icon: AlertCircle, path: '/inventory/alerts', color: 'text-red-500' },
];

export function InventoryPage() {
  return (
    <MainLayout
      pageTitle="Inventory Dashboard"
      pageAction={
        <Link 
          to="/inventory/items"
          className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors"
        >
          Manage Items
          <ArrowRight className="size-4" />
        </Link>
      }
    >
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">Stock & Supply Chain</h2>
          <p className="text-sm text-zinc-500 mt-1">Monitor and manage hospital inventory, stock levels, and procurement.</p>
        </div>

        {/* Quick Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="group bg-white border border-zinc-200 rounded-xl p-5 hover:border-zinc-300 hover:shadow-md transition-all duration-200"
            >
              <div className={cn("inline-flex p-2.5 rounded-lg bg-zinc-50 group-hover:bg-zinc-100 transition-colors mb-4", link.color)}>
                <link.icon className="size-5" />
              </div>
              <h3 className="font-semibold text-zinc-900">{link.title}</h3>
              <p className="text-xs text-zinc-500 mt-1">{link.sub}</p>
            </Link>
          ))}
        </div>

        {/* Placeholder for real charts/tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-zinc-200 rounded-xl p-6 min-h-[300px]">
            <h3 className="text-sm font-bold text-zinc-900 mb-4 uppercase tracking-wider">Low Stock Alerts</h3>
            <div className="flex flex-col items-center justify-center h-full text-zinc-400">
              <AlertCircle className="size-12 mb-3 opacity-20" />
              <p className="text-sm">Fetching stock alerts...</p>
            </div>
          </div>
          <div className="bg-white border border-zinc-200 rounded-xl p-6 min-h-[300px]">
            <h3 className="text-sm font-bold text-zinc-900 mb-4 uppercase tracking-wider">Recent Distributions</h3>
            <div className="flex flex-col items-center justify-center h-full text-zinc-400">
              <Truck className="size-12 mb-3 opacity-20" />
              <p className="text-sm">Fetching distribution history...</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
