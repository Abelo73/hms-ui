import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Search, Plus, ShieldCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { hrService, type Compliance } from '@/services/api/hrService';

export function CompliancePage() {
  const [compliance, setCompliance] = useState<Compliance[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({ page: 0, size: 10, totalPages: 0, totalElements: 0 });

  useEffect(() => { loadCompliance(); }, [pagination.page, searchTerm]);

  const loadCompliance = async () => {
    setLoading(true);
    try {
      const data = await hrService.getCompliance(pagination.page, pagination.size);
      setCompliance(data.content || []);
      setPagination(p => ({ ...p, totalPages: data.totalPages, totalElements: data.totalElements }));
    } catch {
      toast.error('Failed to load compliance records');
    } finally {
      setLoading(false);
    }
  };

  const filtered = searchTerm
    ? compliance.filter(c =>
        `${c.employeeId} ${c.complianceType} ${c.status}`.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : compliance;

  return (
    <MainLayout
      pageTitle="Compliance"
      pageAction={
        <Button size="sm" className="h-8 px-3 bg-zinc-900 hover:bg-zinc-800 text-white shadow-sm">
          <Plus className="w-3.5 h-3.5 mr-2" />
          Add Compliance
        </Button>
      }
    >
      <div className="space-y-4">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by employee ID, compliance type, status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-9 pl-10 pr-4 bg-white border border-zinc-200 rounded-lg text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900 shadow-sm"
          />
        </div>

        {loading ? (
          <div className="w-full h-48 border border-zinc-200 rounded-lg bg-white flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <div className="w-5 h-5 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin" />
              <span className="text-xs text-zinc-500 font-medium">Loading compliance...</span>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="w-full h-64 border border-dashed border-zinc-300 rounded-lg bg-zinc-50/50 flex flex-col items-center justify-center text-center p-6">
            <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center mb-4 text-zinc-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-medium text-zinc-900">No compliance records found</h3>
            <p className="text-xs text-zinc-500 mt-1">Try adjusting your search or add a new compliance record.</p>
          </div>
        ) : (
          <>
            <div className="text-[12px] font-medium text-zinc-500 uppercase tracking-wider px-1">
              {pagination.totalElements} records
            </div>
            <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-zinc-50 border-b border-zinc-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold text-zinc-600 uppercase tracking-wider">Employee ID</th>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold text-zinc-600 uppercase tracking-wider">Compliance Type</th>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold text-zinc-600 uppercase tracking-wider">Document Name</th>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold text-zinc-600 uppercase tracking-wider">Expiry Date</th>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold text-zinc-600 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {filtered.map((record) => (
                    <tr key={record.id} className="hover:bg-zinc-50">
                      <td className="px-4 py-3 text-sm text-zinc-900">{record.employeeId}</td>
                      <td className="px-4 py-3 text-sm text-zinc-600">{record.complianceType}</td>
                      <td className="px-4 py-3 text-sm text-zinc-600">{record.documentName || '-'}</td>
                      <td className="px-4 py-3 text-sm text-zinc-600">{record.expiryDate || '-'}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-[11px] font-medium ${
                          record.status === 'VALID' ? 'bg-green-100 text-green-700' :
                          record.status === 'EXPIRED' ? 'bg-red-100 text-red-700' :
                          record.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-zinc-100 text-zinc-700'
                        }`}>
                          {record.status || 'VALID'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-zinc-200 pt-4">
            <div className="text-sm text-zinc-500">
              Showing {pagination.page * pagination.size + 1}–{Math.min((pagination.page + 1) * pagination.size, pagination.totalElements)} of {pagination.totalElements}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))} disabled={pagination.page === 0} className="h-8 px-3">
                <ChevronLeft className="w-4 h-4 mr-1" /> Previous
              </Button>
              <Button variant="outline" size="sm" onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))} disabled={pagination.page >= pagination.totalPages - 1} className="h-8 px-3">
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
