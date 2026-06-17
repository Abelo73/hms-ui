import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { inventoryService } from '@/services/api/inventoryService';
import type { Item, CreateItemRequest, ItemType } from '@/services/api/inventoryService';
import {
  Search,
  Filter,
  Plus,
  MoreVertical,
  Package,
  Tag,
  Building2,
  X,
  Loader2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

const ITEM_TYPES: ItemType[] = ['DRUG', 'SUPPLY', 'EQUIPMENT', 'FURNITURE', 'LAB_REAGENT', 'OFFICE_SUPPLY'];

const DEFAULT_FORM: CreateItemRequest = {
  itemCode: '',
  itemName: '',
  itemType: 'DRUG',
  category: '',
  description: '',
  manufacturer: '',
  brand: '',
  unitOfMeasure: '',
  packSize: 1,
  unitPrice: 0,
  purchasePrice: 0,
  minimumOrderQuantity: 0,
  reorderLevel: 0,
  safetyStock: 0,
  shelfLifeDays: 0,
  storageConditions: '',
  isControlledSubstance: false,
  requiresPrescription: false,
  isColdChain: false,
};

export function InventoryItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<CreateItemRequest>(DEFAULT_FORM);
  
  // Pagination State
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const PAGE_SIZE = 8;

  const fetchItems = async () => {
    setLoading(true);
    try {
      let response;
      if (searchTerm.trim()) {
        response = await inventoryService.searchItems(searchTerm, page, PAGE_SIZE);
      } else {
        response = await inventoryService.getAllItems({ page, size: PAGE_SIZE });
      }

      if (response) {
        setItems(response.content);
        setTotalPages(response.totalPages);
        setTotalElements(response.totalElements);
      }
    } catch (err) {
      console.error('Failed to fetch items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [page, searchTerm]);

  // Reset page when search term changes
  useEffect(() => {
    setPage(0);
  }, [searchTerm]);


  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleToggleChange = (name: string) => {
    setForm(prev => ({
      ...prev,
      [name]: !((prev as any)[name]),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.itemCode || !form.itemName || !form.itemType || !form.unitOfMeasure) {
      setError('Please fill in all required fields.');
      return;
    }

    setSaving(true);
    try {
      await inventoryService.createItem(form);
      setShowModal(false);
      setForm(DEFAULT_FORM);
      setLoading(true);
      await fetchItems();
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to create item.';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleOpenModal = () => {
    setForm(DEFAULT_FORM);
    setError(null);
    setShowModal(true);
  };

  return (
    <MainLayout
      pageTitle="Item Catalog"
      pageAction={
        <button
          onClick={handleOpenModal}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors"
        >
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
                  <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Pricing</th>
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
                                ) : items.length > 0 ? (
                  items.map((item) => (
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
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-zinc-900">${item.unitPrice?.toFixed(2) || '0.00'}</span>
                          <span className="text-[10px] text-zinc-400">Cost: ${item.purchasePrice?.toFixed(2) || '0.00'}</span>
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

          {/* Pagination Controls */}
          <div className="px-6 py-4 bg-zinc-50/50 border-t border-zinc-100 flex items-center justify-between">
            <div className="text-xs text-zinc-500">
              Showing <span className="font-medium text-zinc-900">{items.length}</span> of <span className="font-medium text-zinc-900">{totalElements}</span> items
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0 || loading}
                className="p-1.5 border border-zinc-200 rounded-md bg-white hover:bg-zinc-50 disabled:opacity-50 disabled:bg-zinc-50 transition-colors"
                title="Previous Page"
              >
                <ChevronLeft className="size-4 text-zinc-600" />
              </button>
              <div className="text-xs font-medium text-zinc-600">
                Page {page + 1} of {totalPages || 1}
              </div>
              <button
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1 || loading}
                className="p-1.5 border border-zinc-200 rounded-md bg-white hover:bg-zinc-50 disabled:opacity-50 disabled:bg-zinc-50 transition-colors"
                title="Next Page"
              >
                <ChevronRight className="size-4 text-zinc-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Item Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />

          {/* Modal */}
          <div className="relative z-10 w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100">
              <div>
                <h2 className="text-lg font-bold text-zinc-900">Add New Item</h2>
                <p className="text-sm text-zinc-400 mt-0.5">Fill in the details below to register a new catalog item.</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-zinc-100 rounded-lg transition-colors text-zinc-400 hover:text-zinc-600"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="overflow-y-auto flex-1">
              <div className="p-6 space-y-5">
                {/* Error Banner */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                {/* Section: Basic Info */}
                <div>
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Basic Information</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                        Item Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="itemCode"
                        value={form.itemCode}
                        onChange={handleFieldChange}
                        placeholder="e.g. DRUG-001"
                        className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                        Item Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="itemName"
                        value={form.itemName}
                        onChange={handleFieldChange}
                        placeholder="e.g. Paracetamol 500mg"
                        className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                        Item Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="itemType"
                        value={form.itemType}
                        onChange={handleFieldChange}
                        className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 transition-all bg-white"
                        required
                      >
                        {ITEM_TYPES.map(t => (
                          <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-1.5">Category</label>
                      <input
                        type="text"
                        name="category"
                        value={form.category}
                        onChange={handleFieldChange}
                        placeholder="e.g. Analgesics"
                        className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 transition-all"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-zinc-700 mb-1.5">Description</label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleFieldChange}
                      placeholder="Brief description of the item..."
                      rows={2}
                      className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 transition-all resize-none"
                    />
                  </div>
                </div>

                {/* Section: Supplier / Packaging */}
                <div>
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Supplier & Packaging</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-1.5">Manufacturer</label>
                      <input
                        type="text"
                        name="manufacturer"
                        value={form.manufacturer}
                        onChange={handleFieldChange}
                        placeholder="e.g. Pfizer"
                        className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-1.5">Brand</label>
                      <input
                        type="text"
                        name="brand"
                        value={form.brand}
                        onChange={handleFieldChange}
                        placeholder="e.g. Panadol"
                        className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                        Unit of Measure <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="unitOfMeasure"
                        value={form.unitOfMeasure}
                        onChange={handleFieldChange}
                        placeholder="e.g. Tablet, mL, Box"
                        className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-1.5">Pack Size</label>
                      <input
                        type="number"
                        name="packSize"
                        value={form.packSize}
                        onChange={handleFieldChange}
                        min={1}
                        className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 transition-all"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-1.5">Unit Price ($)</label>
                      <input
                        type="number"
                        name="unitPrice"
                        value={form.unitPrice}
                        onChange={handleFieldChange}
                        step="0.01"
                        min="0"
                        className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-1.5">Purchase Price ($)</label>
                      <input
                        type="number"
                        name="purchasePrice"
                        value={form.purchasePrice}
                        onChange={handleFieldChange}
                        step="0.01"
                        min="0"
                        className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Section: Inventory Parameters */}
                <div>
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Inventory Parameters</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-1.5">Reorder Level</label>
                      <input
                        type="number"
                        name="reorderLevel"
                        value={form.reorderLevel}
                        onChange={handleFieldChange}
                        min={0}
                        className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-1.5">Safety Stock</label>
                      <input
                        type="number"
                        name="safetyStock"
                        value={form.safetyStock}
                        onChange={handleFieldChange}
                        min={0}
                        className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-1.5">Min Order Qty (MOQ)</label>
                      <input
                        type="number"
                        name="minimumOrderQuantity"
                        value={form.minimumOrderQuantity}
                        onChange={handleFieldChange}
                        min={0}
                        className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-1.5">Shelf Life (Days)</label>
                      <input
                        type="number"
                        name="shelfLifeDays"
                        value={form.shelfLifeDays}
                        onChange={handleFieldChange}
                        min={0}
                        className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Section: Compliance & Handling */}
                <div>
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Compliance & Handling</p>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <label className="flex items-center gap-3 p-3 border border-zinc-100 rounded-xl hover:bg-zinc-50 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={form.isControlledSubstance}
                          onChange={() => handleToggleChange('isControlledSubstance')}
                          className="size-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900/10"
                        />
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-zinc-700">Controlled Substance</span>
                          <span className="text-[10px] text-zinc-400">Restricted access regulations apply</span>
                        </div>
                      </label>
                      <label className="flex items-center gap-3 p-3 border border-zinc-100 rounded-xl hover:bg-zinc-50 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={form.requiresPrescription}
                          onChange={() => handleToggleChange('requiresPrescription')}
                          className="size-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900/10"
                        />
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-zinc-700">Rx Required</span>
                          <span className="text-[10px] text-zinc-400">Requires valid medical order</span>
                        </div>
                      </label>
                      <label className="flex items-center gap-3 p-3 border border-zinc-100 rounded-xl hover:bg-zinc-50 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={form.isColdChain}
                          onChange={() => handleToggleChange('isColdChain')}
                          className="size-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900/10"
                        />
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-zinc-700">Cold Chain (2-8°C)</span>
                          <span className="text-[10px] text-zinc-400">Requires refrigeration at all times</span>
                        </div>
                      </label>
                    </div>
                    <div className="mt-3">
                      <label className="block text-sm font-medium text-zinc-700 mb-1.5">Storage Conditions</label>
                      <textarea
                        name="storageConditions"
                        value={form.storageConditions}
                        onChange={handleFieldChange}
                        placeholder="e.g. Keep away from direct sunlight, Store in a cool dry place..."
                        rows={2}
                        className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 transition-all resize-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-zinc-100 flex justify-end gap-3 bg-zinc-50/50 rounded-b-2xl">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2 bg-zinc-900 text-white text-sm font-medium rounded-lg hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {saving && <Loader2 className="size-4 animate-spin" />}
                  {saving ? 'Saving...' : 'Create Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
