import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Search, Plus, Network, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { hrService, type DepartmentDTO, type BranchDTO } from '@/services/api/hrService';

export interface DeptFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (d: Partial<DepartmentDTO>) => Promise<void>;
  initial?: DepartmentDTO | null;
  branches: BranchDTO[];
}

function DepartmentFormDialog(props: DeptFormProps) {
  const { open, onClose, onSave, initial, branches } = props;
  const [form, setForm] = useState<Partial<DepartmentDTO>>(initial ?? { status: 'ACTIVE' });
  const [saving, setSaving] = useState(false);

  useEffect(() => { setForm(initial ?? { status: 'ACTIVE' }); }, [initial, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name?.trim() || !form.code?.trim()) { toast.error('Name and Code are required'); return; }
    setSaving(true);
    try { await onSave(form); onClose(); } finally { setSaving(false); }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">
            {initial ? 'Edit Department' : 'Add Department'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-700">Name *</label>
              <input type="text" value={form.name ?? ''} required
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full h-9 px-3 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-700">Code *</label>
              <input type="text" value={form.code ?? ''} required
                onChange={e => setForm(f => ({ ...f, code: e.target.value }))}
                className="w-full h-9 px-3 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-700">Branch</label>
            <select value={form.branchId ?? ''} onChange={e => setForm(f => ({ ...f, branchId: e.target.value || undefined }))}
              className="w-full h-9 px-3 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900 bg-white">
              <option value="">— Select Branch —</option>
              {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-700">Budget</label>
            <input type="number" min={0} step={0.01} value={form.budget ?? ''}
              onChange={e => setForm(f => ({ ...f, budget: parseFloat(e.target.value) || undefined }))}
              className="w-full h-9 px-3 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900" />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-700">Description</label>
            <textarea rows={2} value={form.description ?? ''}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900 resize-none" />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-700">Status</label>
            <select value={form.status ?? 'ACTIVE'} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
              className="w-full h-9 px-3 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900 bg-white">
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
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

export function DepartmentsPage() {
  const [departments, setDepartments] = useState<DepartmentDTO[]>([]);
  const [branches, setBranches] = useState<BranchDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [branchFilter, setBranchFilter] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<DepartmentDTO | null>(null);
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 10;

  useEffect(() => { load(); }, [branchFilter]);

  const load = async () => {
    setLoading(true);
    try {
      const [depts, brnch] = await Promise.all([
        hrService.getDepartments(branchFilter || undefined),
        hrService.getBranches(),
      ]);
      setDepartments(depts);
      setBranches(brnch);
    } catch { toast.error('Failed to load departments'); }
    finally { setLoading(false); }
  };

  const handleSave = async (data: Partial<DepartmentDTO>) => {
    if (editing) { await hrService.updateDepartment(editing.id, data); toast.success('Updated'); }
    else { await hrService.createDepartment(data); toast.success('Created'); }
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this department?')) return;
    try { await hrService.deleteDepartment(id); toast.success('Deleted'); load(); }
    catch { toast.error('Failed to delete department'); }
  };

  const branchName = (id?: string) => branches.find(b => b.id === id)?.name ?? '—';

  const filtered = departments.filter(d =>
    `${d.name} ${d.code} ${d.status}`.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  return (
    <MainLayout
      pageTitle="Departments"
      pageAction={
        <Button size="sm" className="h-8 px-3 bg-zinc-900 hover:bg-zinc-800 text-white shadow-sm"
          onClick={() => { setEditing(null); setDialogOpen(true); }}>
          <Plus className="w-3.5 h-3.5 mr-2" /> Add Department
        </Button>
      }
    >
      <div className="space-y-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
            <input type="text" placeholder="Search departments..." value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setPage(0); }}
              className="w-full h-9 pl-10 pr-4 bg-white border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900 shadow-sm" />
          </div>
          <select value={branchFilter} onChange={e => { setBranchFilter(e.target.value); setPage(0); }}
            className="h-9 px-3 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900 bg-white shadow-sm min-w-[160px]">
            <option value="">All Branches</option>
            {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="w-full h-48 border border-zinc-200 rounded-lg bg-white flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin" />
          </div>
        ) : paged.length === 0 ? (
          <div className="w-full h-64 border border-dashed border-zinc-300 rounded-lg bg-zinc-50/50 flex flex-col items-center justify-center">
            <Network className="w-8 h-8 text-zinc-300 mb-2" />
            <p className="text-sm font-medium text-zinc-900">No departments found</p>
            <p className="text-xs text-zinc-500 mt-1">Add a department to get started.</p>
          </div>
        ) : (
          <>
            <div className="text-[12px] font-medium text-zinc-500 uppercase tracking-wider px-1">
              {filtered.length} departments
            </div>
            <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-zinc-50 border-b border-zinc-200">
                  <tr>
                    {['Name', 'Code', 'Branch', 'Budget', 'Employees', 'Status', ''].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-zinc-600 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {paged.map(d => (
                    <tr key={d.id} className="hover:bg-zinc-50">
                      <td className="px-4 py-3 text-sm font-medium text-zinc-900">{d.name}</td>
                      <td className="px-4 py-3 text-sm text-zinc-600">{d.code}</td>
                      <td className="px-4 py-3 text-sm text-zinc-600">{branchName(d.branchId)}</td>
                      <td className="px-4 py-3 text-sm text-zinc-600">
                        {d.budget != null ? d.budget.toLocaleString() : '—'}
                      </td>
                      <td className="px-4 py-3 text-sm text-zinc-600">
                        {d.employeeCount ?? 0}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-[11px] font-medium ${
                          d.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {d.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" className="h-7 w-7 p-0"
                            onClick={() => { setEditing(d); setDialogOpen(true); }}>
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-red-500 hover:text-red-700"
                            onClick={() => handleDelete(d.id)}>
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

      <DepartmentFormDialog
        open={dialogOpen}
        onClose={() => { setDialogOpen(false); setEditing(null); }}
        onSave={handleSave}
        initial={editing}
        branches={branches}
      />
    </MainLayout>
  );
}
