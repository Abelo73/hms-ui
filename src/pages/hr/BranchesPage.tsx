import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Search, Plus, Building2, ChevronLeft, ChevronRight, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { hrService, type BranchDTO } from '@/services/api/hrService';

const BRANCH_TYPES = ['HOSPITAL', 'CLINIC', 'ADMIN_OFFICE'];
const STATUS_OPTIONS = ['ACTIVE', 'INACTIVE'];

function BranchFormDialog({
  open, onClose, onSave, initial,
}: {
  open: boolean; onClose: () => void; onSave: (data: Partial<BranchDTO>) => Promise<void>; initial?: BranchDTO | null;
}) {
  const [form, setForm] = useState<Partial<BranchDTO>>(initial ?? { branchType: 'HOSPITAL', status: 'ACTIVE' });
  const [saving, setSaving] = useState(false);

  useEffect(() => { setForm(initial ?? { branchType: 'HOSPITAL', status: 'ACTIVE' }); }, [initial, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name?.trim()) { toast.error('Name is required'); return; }
    setSaving(true);
    try { await onSave(form); onClose(); } finally { setSaving(false); }
  };

  const field = (label: string, key: keyof BranchDTO, type = 'text', required = false) => (
    <div className="space-y-1">
      <label className="text-xs font-medium text-zinc-700">{label}{required && ' *'}</label>
      <input
        type={type}
        value={(form[key] as string) ?? ''}
        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        required={required}
        className="w-full h-9 px-3 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
      />
    </div>
  );

  const select = (label: string, key: keyof BranchDTO, options: string[]) => (
    <div className="space-y-1">
      <label className="text-xs font-medium text-zinc-700">{label}</label>
      <select
        value={(form[key] as string) ?? ''}
        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        className="w-full h-9 px-3 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900 bg-white"
      >
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">{initial ? 'Edit Branch' : 'Add Branch'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3 py-2">
          {field('Name', 'name', 'text', true)}
          {field('Code', 'code')}
          {select('Branch Type', 'branchType', BRANCH_TYPES)}
          {field('Address', 'address')}
          {field('City', 'city')}
          {field('Country', 'country')}
          {field('Phone', 'phone')}
          {field('Email', 'email', 'email')}
          {select('Status', 'status', STATUS_OPTIONS)}
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

export function BranchesPage() {
  const [branches, setBranches] = useState<BranchDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<BranchDTO | null>(null);
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 10;

  useEffect(() => { loadBranches(); }, []);

  const loadBranches = async () => {
    setLoading(true);
    try {
      const data = await hrService.getBranches();
      setBranches(data);
    } catch { toast.error('Failed to load branches'); }
    finally { setLoading(false); }
  };

  const handleSave = async (data: Partial<BranchDTO>) => {
    if (editing) {
      await hrService.updateBranch(editing.id, data);
      toast.success('Branch updated');
    } else {
      await hrService.createBranch(data);
      toast.success('Branch created');
    }
    loadBranches();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this branch?')) return;
    try {
      await hrService.deleteBranch(id);
      toast.success('Branch deleted');
      loadBranches();
    } catch { toast.error('Failed to delete branch'); }
  };

  const filtered = branches.filter(b =>
    `${b.name} ${b.code} ${b.branchType} ${b.city} ${b.country} ${b.status}`.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  return (
    <MainLayout
      pageTitle="Branches"
      pageAction={
        <Button size="sm" className="h-8 px-3 bg-zinc-900 hover:bg-zinc-800 text-white shadow-sm"
          onClick={() => { setEditing(null); setDialogOpen(true); }}>
          <Plus className="w-3.5 h-3.5 mr-2" /> Add Branch
        </Button>
      }
    >
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
          <input type="text" placeholder="Search branches..." value={searchTerm}
            onChange={e => { setSearchTerm(e.target.value); setPage(0); }}
            className="w-full h-9 pl-10 pr-4 bg-white border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900 shadow-sm" />
        </div>

        {loading ? (
          <div className="w-full h-48 border border-zinc-200 rounded-lg bg-white flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin" />
          </div>
        ) : paged.length === 0 ? (
          <div className="w-full h-64 border border-dashed border-zinc-300 rounded-lg bg-zinc-50/50 flex flex-col items-center justify-center">
            <Building2 className="w-8 h-8 text-zinc-300 mb-2" />
            <p className="text-sm font-medium text-zinc-900">No branches found</p>
            <p className="text-xs text-zinc-500 mt-1">Add a branch to get started.</p>
          </div>
        ) : (
          <>
            <div className="text-[12px] font-medium text-zinc-500 uppercase tracking-wider px-1">{filtered.length} branches</div>
            <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-zinc-50 border-b border-zinc-200">
                  <tr>
                    {['Name', 'Code', 'Type', 'City', 'Country', 'Status', ''].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-zinc-600 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {paged.map(b => (
                    <tr key={b.id} className="hover:bg-zinc-50">
                      <td className="px-4 py-3 text-sm font-medium text-zinc-900">{b.name}</td>
                      <td className="px-4 py-3 text-sm text-zinc-600">{b.code}</td>
                      <td className="px-4 py-3 text-sm text-zinc-600">{b.branchType}</td>
                      <td className="px-4 py-3 text-sm text-zinc-600">{b.city || '—'}</td>
                      <td className="px-4 py-3 text-sm text-zinc-600">{b.country || '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-[11px] font-medium ${b.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Button size="sm" variant="ghost" className="h-7 w-7 p-0"
                            onClick={() => { setEditing(b); setDialogOpen(true); }}>
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-red-500 hover:text-red-700"
                            onClick={() => handleDelete(b.id)}>
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

      <BranchFormDialog
        open={dialogOpen}
        onClose={() => { setDialogOpen(false); setEditing(null); }}
        onSave={handleSave}
        initial={editing}
      />
    </MainLayout>
  );
}
