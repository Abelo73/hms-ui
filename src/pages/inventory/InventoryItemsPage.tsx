import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { inventoryService } from '@/services/api/inventoryService';
import type { Item } from '@/services/api/inventoryService';
import {
  Search,
  Filter,
  Plus,
  MoreVertical,
  Package,
  Tag,
  Building2
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function InventoryItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await inventoryService.getAllItems();
        if (data && data.content) {
          setItems(data.content);
        }
      } catch (error) {
        console.error('Failed to fetch items:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const filteredItems = items.filter(item =>
    item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.itemCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout
      pageTitle="Item Catalog"
      pageAction={
        <button className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors">
          <Plus className="size-4" />
          Add Item
        </button>
      }
    >
      <div className="space-y-4">
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search items by name or code..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 rounded-lg text-sm font-medium text-zinc-600 hover:bg-zinc-50 transition-colors">
            <Filter className="size-4" />
            Filters
          </button>
        </div>

        {/* Table */}
        <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50/50 border-b border-zinc-100">
                  <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Item Info</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Track Details</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={5} className="px-6 py-4">
                        <div className="h-10 bg-zinc-100 rounded-md" />
                      </td>
                    </tr>
                  ))
                ) : filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-zinc-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 size-10 bg-zinc-100 rounded-lg flex items-center justify-center">
                            <Package className="size-5 text-zinc-400" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-zinc-900">{item.itemName}</div>
                            <div className="text-[11px] text-zinc-500 font-mono mt-0.5">{item.itemCode}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <Tag className="size-3.5 text-zinc-400" />
                          <span className="text-sm text-zinc-600">{item.category}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                            <Building2 className="size-3.5" />
                            {item.manufacturer || 'Unknown Manufacturer'}
                          </div>
                          <div className="text-[10px] text-zinc-400">
                            Unit: {item.unitOfMeasure} | Pack: {item.packSize}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium",
                          item.isActive ? "bg-emerald-50 text-emerald-600" : "bg-zinc-100 text-zinc-500"
                        )}>
                          {item.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-zinc-400">
                        <button className="hover:text-zinc-600 p-1">
                          <MoreVertical className="size-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-sm text-zinc-400">
                      No items found in catalog.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
