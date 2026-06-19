import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Search, Plus, DollarSign, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { hrService, type SalaryGradeDTO } from '@/services/api/hrService';

export interface FormDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (d: Partial<SalaryGradeDTO>) => Promise<void>;
  initial?: SalaryGradeDTO | null;
}

function SalaryGradeFormDialog(props: FormDialogProps) {
  const { open, onClose, onSave, initial } = props;
  const [form, setForm] = useState<Partial<SalaryGradeDTO>>(initial ?? { currency: 'USD' });
  const [saving, setSaving] = useState(false);

  useEffect(() => { setForm(initial ?? { currency: 'USD' }); }, [initial, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name?.trim() || !form.code?.trim()) { toast.error('Name and Code are required'); return; }
    if ((form.minSalary ?? 0) >= (form.maxSalary ?? 0)) { toast.error('Min salary must be less than max salary'); return; }
    setSaving(true);
    try { await onSave(form); onClose(); } finally { setSaving(false); }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">
            {initial ? 'Edit Salary Grade' : 'Add Salary Grade'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3 py-2">
          {(['name', 'code', 'currency'] as const).map((key) => (
            <div key={key} className="space-y-1">
              <label className="text-xs font-medium text-zinc-700 capitalize">{key} *</label>
              <input
                type="text"
                value={(form[key] as string) ?? ''}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                required
                className="w-full h-9 px-3 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
              />
            </div>
          ))}
          {(['minSalary', 'maxSalary'] as const).map((key) => (
            <div key={key} className="space-y-1">
              <label className="text-xs font-medium text-zinc-700">
                {key === 'minSalary' ? 'Min Salary' : 'Max Salary'} *
              </label>
              <input
                type="number"
                min={0}
                step={0.01}
                value={(form[key] as number) ?? ''}
                onChange={e => setForm(f => ({ ...f, [key]: parseFloat(e.target.value) }))}
                required
                className="w-full h-9 px-3 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
              />
            </div>
          ))}
          <DialogFooter className="pt-2">
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

export function SalaryGradesPage() {
  const [grades, setGrades] = useState<SalaryGradeDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<SalaryGradeDTO | null>(null);
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 10;

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try { setGrades(await hrService.getSalaryGrades()); }
    catch { toast.error('Failed to load salary grades'); }
    finally { setLoading(false); }
  };

  const handleSave = async (data: Partial<SalaryGradeDTO>) => {
    if (editing) {
      await hrService.updateSalaryGrade(editing.id, data);
      toast.success('Updated');
    } else {
      await hrService.createSalaryGrade(data);
      toast.success('Created');
    }
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this salary grade?')) return;
    try { await hrService.deleteSalaryGrade(id); toast.success('Deleted'); load(); }
    catch { toast.error('Failed to delete'); }
  };

  const filtered = grades.filter(g =>
    `${g.name} ${g.code} ${g.currency}`.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  return (
    <MainLayout
      pageTitle="Salary Grades"
      pageAction={
        <Button
          size="sm"
          className="h-8 px-3 bg-zinc-900 hover:bg-zinc-800 text-white shadow-sm"
          onClick={() => { setEditing(null); setDialogOpen(true); }}
        >
          <Plus className="w-3.5 h-3.5 mr-2" /> Add Grade
        </Button>
      }
    >
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search salary grades..."
            value={searchTerm}
            onChange={e => { setSearchTerm(e.target.value); setPage(0); }}
            className="w-full h-9 pl-10 pr-4 bg-white border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900 shadow-sm"
          />
        </div>

        {loading ? (
          <div className="w-full h-48 border border-zinc-200 rounded-lg bg-white flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin" />
          </div>
        ) : paged.length === 0 ? (
          <div className="w-full h-64 border border-dashed border-zinc-300 rounded-lg bg-zinc-50/50 flex flex-col items-center justify-center">
            <DollarSign className="w-8 h-8 text-zinc-300 mb-2" />
            <p className="text-sm font-medium text-zinc-900">No salary grades found</p>
            <p className="text-xs text-zinc-500 mt-1">Add a grade to get started.</p>
          </div>
        ) : (
          <>
            <div className="text-[12px] font-medium text-zinc-500 uppercase tracking-wider px-1">
              {filtered.length} grades
            </div>
            <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-zinc-50 border-b border-zinc-200">
                  <tr>
                    {['Name', 'Code', 'Min Salary', 'Max Salary', 'Currency', ''].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-zinc-600 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {paged.map(g => (
                    <tr key={g.id} className="hover:bg-zinc-50">
                      <td className="px-4 py-3 text-sm font-medium text-zinc-900">{g.name}</td>
                      <td className="px-4 py-3 text-sm text-zinc-600">{g.code}</td>
                      <td className="px-4 py-3 text-sm text-zinc-600">{g.minSalary?.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-zinc-600">{g.maxSalary?.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-zinc-600">{g.currency}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" className="h-7 w-7 p-0"
                            onClick={() => { setEditing(g); setDialogOpen(true); }}>
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-red-500 hover:text-red-700"
                            onClick={() => handleDelete(g.id)}>
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-zinc-200 pt-4">
                <span className="text-sm text-zinc-500">
                  Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filtered.length)} of {filtered.length}
                </span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setPage(p => p - 1)} disabled={page === 0} className="h-8 px-3">
                    <ChevronLeft className="w-4 h-4 mr-1" /> Previous
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setPage(p => p + 1)} disabled={page >= totalPages - 1} className="h-8 px-3">
                    Next <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <SalaryGradeFormDialog
        open={dialogOpen}
        onClose={() => { setDialogOpen(false); setEditing(null); }}
        onSave={handleSave}
        initial={editing}
      />
    </MainLayout>
  );
}
