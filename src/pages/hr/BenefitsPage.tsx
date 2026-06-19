import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Search, Plus, Heart, ChevronLeft, ChevronRight, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { hrService, type Benefits } from '@/services/api/hrService';

const BENEFIT_TYPES = ['HEALTH_INSURANCE', 'PENSION', 'TRANSPORT', 'HOUSING', 'MEAL', 'LIFE_INSURANCE', 'OTHER'];

function BenefitFormDialog(props: { open: boolean; onClose: () => void; onSave: () => void; initial?: Benefits | null }) {
  const { open, onClose, onSave, initial } = props;
  const [form, setForm] = useState<Partial<Benefits>>(initial ?? { benefitType: 'HEALTH_INSURANCE', status: 'ACTIVE' });
  const [saving, setSaving] = useState(false);

  useEffect(() => { setForm(initial ?? { benefitType: 'HEALTH_INSURANCE', status: 'ACTIVE' }); }, [initial, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.employeeId || !form.benefitType) { toast.error('Employee ID and type are required'); return; }
    setSaving(true);
    try {
      if (initial) { await hrService.updateBenefits(initial.id, form); toast.success('Benefit updated'); }
      else { await hrService.createBenefits(form); toast.success('Benefit created'); }
      onSave(); onClose();
    } catch { toast.error('Failed to save benefit'); }
    finally { setSaving(false); }
  };

  const inp = (label: string, key: keyof Benefits, type = 'text', required = false) => (
    <div className="space-y-1">
      <label className="text-xs font-medium text-zinc-700">{label}{required ? ' *' : ''}</label>
      <input type={type} value={(form[key] as string) ?? ''} required={required}
        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        className="w-full h-9 px-3 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5" />
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle className="text-base font-semibold">{initial ? 'Edit Benefit' : 'Add Benefit'}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3 py-2">
          {inp('Employee ID', 'employeeId', 'text', true)}
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-700">Benefit Type *</label>
            <select value={form.benefitType ?? ''} onChange={e => setForm(f => ({ ...f, benefitType: e.target.value }))}
              className="w-full h-9 px-3 border border-zinc-200 rounded-lg text-sm focus:outline-none bg-white">
              {BENEFIT_TYPES.map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
            </select>
          </div>
          {inp('Plan Name', 'planName')}
          {inp('Provider', 'provider')}
          <div className="grid grid-cols-2 gap-3">
            {inp('Employee Contribution', 'employeeContribution', 'number')}
            {inp('Employer Contribution', 'employerContribution', 'number')}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {inp('Effective Date', 'effectiveDate', 'date')}
            {inp('Termination Date', 'terminationDate', 'date')}
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-700">Status</label>
            <select value={form.status ?? 'ACTIVE'} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
              className="w-full h-9 px-3 border border-zinc-200 rounded-lg text-sm focus:outline-none bg-white">
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" size="sm" onClick={onClose}>Cancel</Button>
            <Button type="submit" size="sm" className="bg-zinc-900 hover:bg-zinc-800 text-white" disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function BenefitsPage() {
  const [benefits, setBenefits] = useState<Benefits[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({ page: 0, size: 10, totalPages: 0, totalElements: 0 });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Benefits | null>(null);

  useEffect(() => { load(); }, [pagination.page]);

  const load = async () => {
    setLoading(true);
    try {
      const data = await hrService.getBenefits(pagination.page, pagination.size);
      setBenefits(data.content || []);
      setPagination(p => ({ ...p, totalPages: data.totalPages, totalElements: data.totalElements }));
    } catch { toast.error('Failed to load benefits'); }
    finally { setLoading(false); }
  };

  const filtered = searchTerm
    ? benefits.filter(b => `${b.employeeId} ${b.benefitType} ${b.status}`.toLowerCase().includes(searchTerm.toLowerCase()))
    : benefits;

  return (
    <MainLayout
      pageTitle="Benefits"
      pageAction={
        <Button size="sm" className="h-8 px-3 bg-zinc-900 hover:bg-zinc-800 text-white shadow-sm"
          onClick={() => { setEditing(null); setDialogOpen(true); }}>
          <Plus className="w-3.5 h-3.5 mr-2" /> Add Benefit
        </Button>
      }
    >
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
          <input type="text" placeholder="Search by employee ID, benefit type, status..." value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full h-9 pl-10 pr-4 bg-white border border-zinc-200 rounded-lg text-sm focus:outline-none shadow-sm" />
        </div>

        {loading ? (
          <div className="w-full h-48 border border-zinc-200 rounded-lg bg-white flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="w-full h-64 border border-dashed border-zinc-300 rounded-lg bg-zinc-50/50 flex flex-col items-center justify-center">
            <Heart className="w-8 h-8 text-zinc-300 mb-2" />
            <p className="text-sm font-medium text-zinc-900">No benefits records found</p>
          </div>
        ) : (
          <>
            <div className="text-[12px] font-medium text-zinc-500 uppercase tracking-wider px-1">{pagination.totalElements} benefits</div>
            <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-zinc-50 border-b border-zinc-200">
                  <tr>
                    {['Employee ID', 'Type', 'Plan', 'Provider', 'Employee Contr.', 'Employer Contr.', 'Status', ''].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-zinc-600 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {filtered.map(b => (
                    <tr key={b.id} className="hover:bg-zinc-50">
                      <td className="px-4 py-3 text-xs font-mono text-zinc-700">{b.employeeId?.slice(0, 8)}…</td>
                      <td className="px-4 py-3 text-sm text-zinc-700">{b.benefitType.replace('_', ' ')}</td>
                      <td className="px-4 py-3 text-sm text-zinc-600">{b.planName || '—'}</td>
                      <td className="px-4 py-3 text-sm text-zinc-600">{b.provider || '—'}</td>
                      <td className="px-4 py-3 text-sm text-zinc-600">{b.employeeContribution ?? '—'}</td>
                      <td className="px-4 py-3 text-sm text-zinc-600">{b.employerContribution ?? '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-[11px] font-medium ${b.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {b.status || 'ACTIVE'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => { setEditing(b); setDialogOpen(true); }}>
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
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
            <span className="text-sm text-zinc-500">Showing {pagination.page * pagination.size + 1}–{Math.min((pagination.page + 1) * pagination.size, pagination.totalElements)} of {pagination.totalElements}</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))} disabled={pagination.page === 0} className="h-8 px-3"><ChevronLeft className="w-4 h-4 mr-1" /> Previous</Button>
              <Button variant="outline" size="sm" onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))} disabled={pagination.page >= pagination.totalPages - 1} className="h-8 px-3">Next <ChevronRight className="w-4 h-4 ml-1" /></Button>
            </div>
          </div>
        )}
      </div>
      <BenefitFormDialog open={dialogOpen} onClose={() => { setDialogOpen(false); setEditing(null); }} onSave={load} initial={editing} />
    </MainLayout>
  );
}
