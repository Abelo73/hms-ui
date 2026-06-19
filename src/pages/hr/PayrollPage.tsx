import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Search, Plus, DollarSign, ChevronLeft, ChevronRight, Play, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { hrService, type Payroll } from '@/services/api/hrService';

function PayrollFormDialog(props: { open: boolean; onClose: () => void; onSave: () => void }) {
  const { open, onClose, onSave } = props;
  const [form, setForm] = useState({
    employeeId: '', payPeriodStart: '', payPeriodEnd: '',
    grossPay: '', taxDeduction: '', insuranceDeduction: '', bonuses: '', overtimePay: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) setForm({ employeeId: '', payPeriodStart: '', payPeriodEnd: '', grossPay: '', taxDeduction: '', insuranceDeduction: '', bonuses: '', overtimePay: '' });
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.employeeId || !form.payPeriodStart || !form.payPeriodEnd) { toast.error('Employee ID and pay period are required'); return; }
    setSaving(true);
    try {
      await hrService.createPayroll({
        employeeId: form.employeeId,
        payPeriodStart: form.payPeriodStart,
        payPeriodEnd: form.payPeriodEnd,
        grossPay: parseFloat(form.grossPay) || 0,
        taxDeduction: parseFloat(form.taxDeduction) || 0,
        insuranceDeduction: parseFloat(form.insuranceDeduction) || 0,
        bonuses: parseFloat(form.bonuses) || 0,
        overtimePay: parseFloat(form.overtimePay) || 0,
        netPay: (parseFloat(form.grossPay) || 0) - (parseFloat(form.taxDeduction) || 0) - (parseFloat(form.insuranceDeduction) || 0) + (parseFloat(form.bonuses) || 0) + (parseFloat(form.overtimePay) || 0),
      });
      toast.success('Payroll record created');
      onSave();
      onClose();
    } catch { toast.error('Failed to create payroll'); }
    finally { setSaving(false); }
  };

  const numField = (label: string, key: keyof typeof form) => (
    <div className="space-y-1">
      <label className="text-xs font-medium text-zinc-700">{label}</label>
      <input type="number" min={0} step={0.01} value={form[key]}
        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        className="w-full h-9 px-3 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900" />
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle className="text-base font-semibold">Create Payroll Record</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3 py-2">
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-700">Employee ID *</label>
            <input type="text" value={form.employeeId} required onChange={e => setForm(f => ({ ...f, employeeId: e.target.value }))}
              placeholder="UUID of the employee"
              className="w-full h-9 px-3 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-700">Period Start *</label>
              <input type="date" value={form.payPeriodStart} required onChange={e => setForm(f => ({ ...f, payPeriodStart: e.target.value }))}
                className="w-full h-9 px-3 border border-zinc-200 rounded-lg text-sm focus:outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-700">Period End *</label>
              <input type="date" value={form.payPeriodEnd} required onChange={e => setForm(f => ({ ...f, payPeriodEnd: e.target.value }))}
                className="w-full h-9 px-3 border border-zinc-200 rounded-lg text-sm focus:outline-none" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {numField('Gross Pay', 'grossPay')}
            {numField('Tax Deduction', 'taxDeduction')}
            {numField('Insurance Deduction', 'insuranceDeduction')}
            {numField('Overtime Pay', 'overtimePay')}
            {numField('Bonuses', 'bonuses')}
          </div>
          <div className="bg-zinc-50 rounded-lg p-3 text-sm text-zinc-700">
            Net Pay: <span className="font-semibold text-zinc-900">
              ${((parseFloat(form.grossPay) || 0) - (parseFloat(form.taxDeduction) || 0) - (parseFloat(form.insuranceDeduction) || 0) + (parseFloat(form.bonuses) || 0) + (parseFloat(form.overtimePay) || 0)).toFixed(2)}
            </span>
          </div>
          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>Cancel</Button>
            <Button type="submit" size="sm" className="bg-zinc-900 hover:bg-zinc-800 text-white" disabled={saving}>
              {saving ? 'Creating...' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

const statusColor: Record<string, string> = {
  PAID: 'bg-green-100 text-green-700',
  PENDING: 'bg-yellow-100 text-yellow-700',
  PROCESSED: 'bg-blue-100 text-blue-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

export function PayrollPage() {
  const [payroll, setPayroll] = useState<Payroll[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({ page: 0, size: 10, totalPages: 0, totalElements: 0 });
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => { loadPayroll(); }, [pagination.page]);

  const loadPayroll = async () => {
    setLoading(true);
    try {
      const data = await hrService.getPayroll(pagination.page, pagination.size);
      setPayroll(data.content || []);
      setPagination(p => ({ ...p, totalPages: data.totalPages, totalElements: data.totalElements }));
    } catch { toast.error('Failed to load payroll records'); }
    finally { setLoading(false); }
  };

  const handleProcess = async (id: string) => {
    try { await hrService.processPayroll(id); toast.success('Payroll processed'); loadPayroll(); }
    catch { toast.error('Failed to process payroll'); }
  };

  const filtered = searchTerm
    ? payroll.filter(p => `${p.employeeId} ${p.payPeriodStart} ${p.status}`.toLowerCase().includes(searchTerm.toLowerCase()))
    : payroll;

  return (
    <MainLayout
      pageTitle="Payroll"
      pageAction={
        <Button size="sm" className="h-8 px-3 bg-zinc-900 hover:bg-zinc-800 text-white shadow-sm" onClick={() => setDialogOpen(true)}>
          <Plus className="w-3.5 h-3.5 mr-2" /> Add Payroll
        </Button>
      }
    >
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
          <input type="text" placeholder="Search by employee ID, period, status..." value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full h-9 pl-10 pr-4 bg-white border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900 shadow-sm" />
        </div>

        {loading ? (
          <div className="w-full h-48 border border-zinc-200 rounded-lg bg-white flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="w-full h-64 border border-dashed border-zinc-300 rounded-lg bg-zinc-50/50 flex flex-col items-center justify-center">
            <DollarSign className="w-8 h-8 text-zinc-300 mb-2" />
            <p className="text-sm font-medium text-zinc-900">No payroll records found</p>
          </div>
        ) : (
          <>
            <div className="text-[12px] font-medium text-zinc-500 uppercase tracking-wider px-1">{pagination.totalElements} records</div>
            <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-zinc-50 border-b border-zinc-200">
                  <tr>
                    {['Employee ID', 'Period', 'Gross Pay', 'Net Pay', 'Status', 'Actions'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-zinc-600 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {filtered.map(record => (
                    <tr key={record.id} className="hover:bg-zinc-50">
                      <td className="px-4 py-3 text-xs font-mono text-zinc-700">{record.employeeId?.slice(0, 8)}…</td>
                      <td className="px-4 py-3 text-sm text-zinc-600">{record.payPeriodStart} → {record.payPeriodEnd}</td>
                      <td className="px-4 py-3 text-sm text-zinc-600">${record.grossPay?.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-zinc-900">${record.netPay?.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-[11px] font-medium ${statusColor[record.status] ?? 'bg-zinc-100 text-zinc-700'}`}>
                          {record.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 flex items-center gap-1">
                        {record.status === 'PENDING' && (
                          <Button size="sm" variant="outline" className="h-7 px-2" onClick={() => handleProcess(record.id)}>
                            <Play className="w-3 h-3 mr-1" /> Process
                          </Button>
                        )}
                        {record.status === 'PROCESSED' && (
                          <span className="text-xs text-zinc-400 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Ready</span>
                        )}
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
            <span className="text-sm text-zinc-500">
              Showing {pagination.page * pagination.size + 1}–{Math.min((pagination.page + 1) * pagination.size, pagination.totalElements)} of {pagination.totalElements}
            </span>
            <div className="flex gap-2">
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

      <PayrollFormDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onSave={loadPayroll} />
    </MainLayout>
  );
}
