import React, { useState } from 'react';
import { 
  BarChart3, 
  ArrowUpRight, 
  MapPin,
  Package,
  Layers,
  History,
  AlertTriangle,
  Search,
  Filter
} from 'lucide-react';

const StockLevelsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const mockStock = [
    { id: 1, item: 'Paracetamol 500mg', location: 'Main Store', category: 'General', quantity: 2500, status: 'In Stock' },
    { id: 2, item: 'Amoxicillin 250mg', location: 'Pharmacy', category: 'Antibiotics', quantity: 450, status: 'Low Stock' },
    { id: 3, item: 'Surgical Gloves', location: 'Main Store', category: 'Consumables', quantity: 1200, status: 'In Stock' },
    { id: 4, item: 'Insulin Glargine', location: 'Cold Storage', category: 'Special', quantity: 80, status: 'Low Stock' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Stock Levels</h1>
          <p className="mt-1 text-slate-500">Monitor real-time inventory across all locations.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
            <History className="w-4 h-4" />
            <span>Audit Log</span>
          </button>
          <button className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold shadow-sm hover:bg-indigo-700 transition-all active:scale-95">
            <Layers className="w-5 h-5" />
            <span>Stock Adjustment</span>
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Items', value: '1,248', icon: Package, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Total Value', value: '$45,200', icon: BarChart3, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Low Stock Items', value: '24', icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Stock Locations', value: '8', icon: MapPin, color: 'text-blue-600', bg: 'bg-blue-50' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md hover:border-slate-300">
            <div className="flex items-center justify-between">
              <div className={`p-2.5 ${stat.bg} ${stat.color} rounded-xl`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <span className="flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                <ArrowUpRight className="w-3 h-3 mr-0.5" />
                4.2%
              </span>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden border-separate">
        {/* Filters */}
        <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-50/50">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search items, categories..."
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <select className="flex-1 md:w-40 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none">
              <option>All Locations</option>
              <option>Main Store</option>
              <option>Pharmacy</option>
            </select>
            <button className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-white hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm active:scale-95">
              <Filter className="w-4 h-4" />
              <span>More Filters</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100">
                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Item Detail</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Location</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Category</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Quantity</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {mockStock.map((item) => (
                <tr key={item.id} className="hover:bg-indigo-50/30 transition-all group">
                  <td className="px-8 py-5">
                    <div>
                      <div className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{item.item}</div>
                      <div className="text-xs text-slate-400 mt-1 font-medium">REF: SKU-772{item.id}</div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-slate-300" />
                       <span className="text-sm font-medium text-slate-600">{item.location}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">{item.category}</span>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className={`text-sm font-black ${item.quantity < 500 ? 'text-amber-600' : 'text-slate-900'}`}>
                      {item.quantity.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                      item.status === 'In Stock' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                        : 'bg-amber-50 text-amber-700 border-amber-100'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
                      View History
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StockLevelsPage;
