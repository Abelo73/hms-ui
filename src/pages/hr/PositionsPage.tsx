import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Search, Plus, Briefcase, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { hrService, type PositionDTO, type SalaryGradeDTO } from '@/services/api/hrService';

function PositionFormDialog({
  open, onClose, onSave, initial, grades,
}: { open: boolean; onClose: () => void; onSave: (d: Partial<PositionDTO>) => Promise<void>; initial?: PositionDTO | null; grades: SalaryGradeDTO[] }) {
  const [form, setForm] = useState<Partial<PositionDTO>>(initial ?? { isActive: true });
  const [saving, setSaving] = useState(false);

  useEffect(() => { setForm(initial ?? { isActive: true }); }, [initial, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title?.trim() || !form.code?.trim()) { toast.error('Title and Code are required'); return; }
    setSaving(true);
    try { await onSave(form); onClose(); } finally { setSaving(false); }
  };

  const textField = (label: string, key: keyof PositionDTO, required = false) => (
    <div className="space-y-1">
      <label className="text-xs font-medium text-zinc-700">{label}{required ? ' *' : ''}</label>
      <input type="text" value={(form[key] as string) ?? ''} required={required}
        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        className="w-full h-9 px-3 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900" />
    </div>
  );

  const numField = (label: string, key: keyof PositionDTO) => (
    <div className="space-y-1">
      <label className="text-xs font-medium text-zinc-700">{label}</label>
      <input type="number" min={0} step={0.01} value={(form[key] as number) ?? ''}
        onChange={e => setForm(f => ({ ...f, [key]: parseFloat(e.target.value) || undefined }))}
        className="w-full h-9 px-3 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900" />
    </div>
  );

  const textarea = (label: string, key: keyof PositionDTO) => (
    <div className="space-y-1">
      <label className="text-xs font-medium text-zinc-700">{label}</label>
      <textarea rows={2} value={(form[key] as string) ?? ''}
        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900 resize-none" />
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle className="text-base font-semibold">{initial ? 'Edit Position' : 'Add Position'}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3 py-2">
          <div className="grid grid-cols-2 gap-3">
            {textField('Title', 'title', true)}
            {textField('Code', 'code', true)}
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-700">Salary Grade</label>
            <select value={form.gradeId ?? ''} onChange={e => setForm(f => ({ ...f, gradeId: e.target.value || undefined }))}
              className="w-full h-9 px-3 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900 bg-white">
              <option value="">— Select Grade —</option>
              {grades.map(g => <option key={g.id} value={g.id}>{g.name} ({g.currency} {g.minSalary?.toLocaleString()}–{g.maxSalary?.toLocaleString()})</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {numField('Min Salary', 'minSalary')}
            {numField('Max Salary', 'maxSalary')}
          </div>
          {textarea('Responsibilities', 'responsibilities')}
          {textarea('Required Skills', 'requiredSkills')}
          {textarea('Required Qualifications', 'requiredQualifications')}
          <div className="flex items-center gap-2">
            <input type="checkbox" id="isActive" checked={form.isActive ?? true}
              onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))}
              className="rounded border-zinc-300" />
            <label htmlFor="isActive" className="text-sm text-zinc-700">Active</label>
          </div>
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

export function PositionsPage() {
  const [positions, setPositions] = useState<PositionDTO[]>([]);
  const [grades, setGrades] = useState<SalaryGradeDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<PositionDTO | null>(null);
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 10;

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const [pos, grd] = await Promise.all([hrService.getPositions(), hrService.getSalaryGrades()]);
      setPositions(pos);
      setGrades(grd);
    } catch { toast.error('Failed to load positions'); }
    finally { setLoading(false); }
  };

  const handleSave = async (data: Partial<PositionDTO>) => {
    if (editing) { await hrService.updatePosition(editing.id, data); toast.success('Updated'); }
    else { await hrService.createPosition(data); toast.success('Created'); }
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this position?')) return;
    try { await hrService.deletePosition(id); toast.success('Deleted'); load(); }
    catch { toast.error('Failed to delete'); }
  };

  const gradeLabel = (gradeId?: string) => grades.find(g => g.id === gradeId)?.name ?? '—';

  const filtered = positions.filter(p =>
    `${p.title} ${p.code}`.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  return (
    <MainLayout
      pageTitle="Positions"
      pageAction={
        <Button size="sm" className="h-8 px-3 bg-zinc-900 hover:bg-zinc-800 text-white shadow-sm"
          onClick={() => { setEditing(null); setDialogOpen(true); }}>
          <Plus className="w-3.5 h-3.5 mr-2" /> Add Position
        </Button>
      }
    >
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
          <input type="text" placeholder="Search positions..." value={searchTerm}
            onChange={e => { setSearchTerm(e.target.value); setPage(0); }}
            className="w-full h-9 pl-10 pr-4 bg-white border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900 shadow-sm" />
        </div>

        {loading ? (
          <div className="w-full h-48 border border-zinc-200 rounded-lg bg-white flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin" />
          </div>
        ) : paged.length === 0 ? (
          <div className="w-full h-64 border border-dashed border-zinc-300 rounded-lg bg-zinc-50/50 flex flex-col items-center justify-center">
            <Briefcase className="w-8 h-8 text-zinc-300 mb-2" />
            <p className="text-sm font-medium text-zinc-900">No positions found</p>
            <p className="text-xs text-zinc-500 mt-1">Add a position to get started.</p>
          </div>
        ) : (
          <>
            <div className="text-[12px] font-medium text-zinc-500 uppercase tracking-wider px-1">{filtered.length} positions</div>
            <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-zinc-50 border-b border-zinc-200">
                  <tr>
                    {['Title', 'Code', 'Grade', 'Min Salary', 'Max Salary', 'Active', ''].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-zinc-600 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {paged.map(p => (
                    <tr key={p.id} className="hover:bg-zinc-50">
                      <td className="px-4 py-3 text-sm font-medium text-zinc-900">{p.title}</td>
                      <td className="px-4 py-3 text-sm text-zinc-600">{p.code}</td>
                      <td className="px-4 py-3 text-sm text-zinc-600">{gradeLabel(p.gradeId)}</td>
                      <td className="px-4 py-3 text-sm text-zinc-600">{p.minSalary?.toLocaleString() ?? '—'}</td>
                      <td className="px-4 py-3 text-sm text-zinc-600">{p.maxSalary?.toLocaleString() ?? '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-[11px] font-medium ${p.isActive ? 'bg-green-100 text-green-700' : 'bg-zinc-100 text-zinc-500'}`}>
                          {p.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => { setEditing(p); setDialogOpen(true); }}>
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-red-500 hover:text-red-700" onClick={() => handleDelete(p.id)}>
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
                <span className="text-sm text-zinc-500">Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filtered.length)} of {filtered.length}</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setPage(pg => pg - 1)} disabled={page === 0} className="h-8 px-3"><ChevronLeft className="w-4 h-4 mr-1" /> Previous</Button>
                  <Button variant="outline" size="sm" onClick={() => setPage(pg => pg + 1)} disabled={page >= totalPages - 1} className="h-8 px-3">Next <ChevronRight className="w-4 h-4 ml-1" /></Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <PositionFormDialog open={dialogOpen} onClose={() => { setDialogOpen(false); setEditing(null); }} onSave={handleSave} initial={editing} grades={grades} />
    </MainLayout>
  );
}
