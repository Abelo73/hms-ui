import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { pharmacyService } from '@/services/api/pharmacyService';
import type { Prescription } from '@/services/api/pharmacyService';
import {
  Search,
  Filter,
  Plus,
  FileText,
  User,
  Stethoscope,
  Clock,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

export function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const data = await pharmacyService.getAllPrescriptions();
        if (data && data.content) {
          setPrescriptions(data.content);
        }
      } catch (error) {
        console.error('Failed to fetch prescriptions:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPrescriptions();
  }, []);

  const filteredPrescriptions = prescriptions.filter(p =>
    p.prescriptionNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout
      pageTitle="Prescriptions"
      pageAction={
        <button className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors">
          <Plus className="size-4" />
          New Prescription
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
              placeholder="Search prescriptions by number..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 rounded-lg text-sm font-medium text-zinc-600 hover:bg-zinc-50 transition-colors">
            <Filter className="size-4" />
            Active Only
          </button>
        </div>

        {/* Table */}
        <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50/50 border-b border-zinc-100">
                  <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Prescription No.</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Patient & Doctor</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Date & Status</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Priority</th>
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
                ) : filteredPrescriptions.length > 0 ? (
                  filteredPrescriptions.map((p) => (
                    <tr key={p.id} className="hover:bg-zinc-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 size-10 bg-blue-50 rounded-lg flex items-center justify-center">
                            <FileText className="size-5 text-blue-500" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-zinc-900">{p.prescriptionNumber}</div>
                            <div className="text-[10px] text-zinc-400 mt-0.5">ID: {p.id.substring(0, 8)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5 text-sm text-zinc-700">
                            <User className="size-3.5 text-zinc-400" />
                            {p.patientId.substring(0, 8)}... (Patient)
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                            <Stethoscope className="size-3.5 text-zinc-400" />
                            Dr. {p.doctorId.substring(0, 8)}...
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5 text-sm text-zinc-600">
                            <Clock className="size-3.5 text-zinc-400" />
                            {new Date(p.prescriptionDate).toLocaleDateString()}
                          </div>
                          <span className={cn(
                            "inline-flex w-fit items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                            p.status === 'DISPENSED' ? "bg-emerald-50 text-emerald-600" :
                              p.status === 'PENDING' ? "bg-amber-50 text-amber-600" : "bg-zinc-100 text-zinc-500"
                          )}>
                            {p.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "text-xs font-medium px-2 py-1 rounded-md",
                          p.priority === 'URGENT' ? "bg-red-50 text-red-600" : "bg-zinc-50 text-zinc-600"
                        )}>
                          {p.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          to={`/pharmacy/dispense/${p.id}`}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-900 hover:text-zinc-600 transition-colors bg-zinc-50 px-3 py-1.5 rounded-lg border border-zinc-200"
                        >
                          Dispense
                          <ArrowRight className="size-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-sm text-zinc-400">
                      No prescriptions found.
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
