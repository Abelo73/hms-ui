import React, { useState } from 'react';
import { 
  Clock, 
  TrendingDown, 
  ArrowRight,
  ShieldAlert,
  CalendarDays,
  MoreVertical,
  CheckCircle2
} from 'lucide-react';

const StockAlertsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'low' | 'expiring'>('low');

  const lowStockItems = [
    { id: 1, item: 'Amoxicillin 250mg', current: 450, reorder: 500, leadTime: '3 days', priority: 'High' },
    { id: 2, item: 'Insulin Glargine', current: 80, reorder: 100, leadTime: '5 days', priority: 'Critical' },
    { id: 3, item: 'Surgical Masks', current: 800, reorder: 1000, leadTime: '2 days', priority: 'Medium' },
  ];

  const expiringItems = [
    { id: 101, item: 'Hepatitis B Vaccine', batch: 'HB-2024-X', expiry: '2026-07-15', quantity: 120, status: 'Expiring Soon' },
    { id: 102, item: 'Adrenaline 1mg', batch: 'AD-9921', expiry: '2026-06-30', quantity: 45, status: 'Urgent' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl shadow-inner">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">Inventory Alerts</h1>
            <p className="text-slate-500 font-medium">Critical items requiring immediate attention.</p>
          </div>
        </div>
        <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button 
            onClick={() => setActiveTab('low')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'low' 
                ? 'bg-white text-indigo-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Low Stock
          </button>
          <button 
            onClick={() => setActiveTab('expiring')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'expiring' 
                ? 'bg-white text-indigo-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Expiring Items
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-6 rounded-3xl text-white shadow-lg shadow-amber-200">
          <TrendingDown className="w-10 h-10 opacity-30 mb-4" />
          <h3 className="text-lg font-bold opacity-80 uppercase tracking-wider">Critical Low</h3>
          <p className="text-4xl font-black mt-2">08 Items</p>
          <div className="mt-4 flex items-center text-xs font-bold bg-white/20 px-3 py-1.5 rounded-full w-fit">
            Next Delivery: Tomorrow
          </div>
        </div>
        <div className="bg-gradient-to-br from-rose-500 to-rose-600 p-6 rounded-3xl text-white shadow-lg shadow-rose-200">
          <Clock className="w-10 h-10 opacity-30 mb-4" />
          <h3 className="text-lg font-bold opacity-80 uppercase tracking-wider">Expiring (30d)</h3>
          <p className="text-4xl font-black mt-2">14 Batches</p>
          <div className="mt-4 flex items-center text-xs font-bold bg-white/20 px-3 py-1.5 rounded-full w-fit">
            Disposition Required
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
             <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
               <CheckCircle2 className="w-6 h-6" />
             </div>
             <div>
               <h3 className="text-lg font-bold text-slate-900 line-clamp-1">Auto-Replenish</h3>
               <p className="text-sm text-slate-500 font-medium">System managed orders</p>
             </div>
          </div>
          <button className="w-full py-3 bg-slate-50 text-indigo-600 font-bold rounded-2xl border border-indigo-100 hover:bg-slate-100 transition-colors">
            Configure Rules
          </button>
        </div>
      </div>

      {/* Alerts Table */}
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
        {activeTab === 'low' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-0">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Item Name</th>
                  <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                  <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Priority</th>
                  <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Recommended</th>
                  <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-[0.2em]"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {lowStockItems.map((item) => (
                  <tr key={item.id} className="group hover:bg-slate-50/30 transition-colors">
                    <td className="px-8 py-6 border-transparent border-l-4 group-hover:border-amber-500 transition-all">
                      <div className="text-base font-bold text-slate-900">{item.item}</div>
                      <div className="text-xs text-slate-400 font-bold mt-1">
                        Current: {item.current} units | Reorder point: {item.reorder}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                       <div className="w-32 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                         <div 
                          className="h-full bg-amber-500 rounded-full" 
                          style={{ width: `${(item.current / item.reorder) * 100}%` }} 
                        />
                       </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter ${
                        item.priority === 'Critical' ? 'bg-rose-50 text-rose-600 border border-rose-100' : 
                        item.priority === 'High' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                        'bg-slate-50 text-slate-500 border border-slate-100'
                      }`}>
                        {item.priority}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-sm font-black text-indigo-600">
                      Order +{item.reorder * 2}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-2xl text-xs font-black shadow-lg shadow-slate-200 hover:scale-105 transition-transform active:scale-95">
                        Create PO
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-0">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Batch Detail</th>
                  <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Expiry Date</th>
                  <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                  <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Inventory</th>
                  <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-[0.2em]"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {expiringItems.map((item) => (
                  <tr key={item.id} className="group hover:bg-slate-50/30 transition-colors">
                    <td className="px-8 py-6">
                      <div className="text-base font-bold text-slate-900">{item.item}</div>
                      <div className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-widest">
                        Batch No: {item.batch}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-2 text-sm font-black text-slate-700">
                         <CalendarDays className="w-4 h-4 text-rose-500" />
                         {item.expiry}
                       </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter ${
                        item.status === 'Urgent' ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-sm font-black text-slate-900">
                      {item.quantity} units
                    </td>
                    <td className="px-8 py-6 text-right">
                       <button className="p-3 hover:bg-rose-50 hover:text-rose-600 rounded-2xl transition-all outline-none">
                         <MoreVertical className="w-5 h-5" />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockAlertsPage;
