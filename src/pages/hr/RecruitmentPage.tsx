import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Search, Plus, Briefcase, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { hrService, type Recruitment } from '@/services/api/hrService';

const EMP_TYPES = ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN'];

function JobPostingDialog(props: { open: boolean; onClose: () => void; onSave: () => void }) {
  const { open, onClose, onSave } = props;
  const blank = { jobTitle: '', department: '', description: '', requirements: '', responsibilities: '',
    vacancies: '1', postingDate: '', closingDate: '', salaryRange: '', location: '', employmentType: 'FULL_TIME' };
  const [form, setForm] = useState(blank);
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (open) setForm(blank); }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.jobTitle || !form.postingDate) { toast.error('Job title and posting date are required'); return; }
    setSaving(true);
    try {
      await hrService.createRecruitment({
        jobTitle: form.jobTitle, department: form.department, description: form.description,
        requirements: form.requirements, responsibilities: form.responsibilities,
        vacancies: parseInt(form.vacancies) || 1, postingDate: form.postingDate,
        closingDate: form.closingDate || undefined, salaryRange: form.salaryRange,
        location: form.location, employmentType: form.employmentType,
      });
      toast.success('Job posting created');
      onSave(); onClose();
    } catch { toast.error('Failed to create job posting'); }
    finally { setSaving(false); }
  };

  const inp = (label: string, key: keyof typeof form, type = 'text', required = false) => (
    <div className="space-y-1">
      <label className="text-xs font-medium text-zinc-700">{label}{required ? ' *' : ''}</label>
      <input type={type} value={form[key]} required={required}
        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        className="w-full h-9 px-3 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900" />
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle className="text-base font-semibold">Create Job Posting</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3 py-2">
          <div className="grid grid-cols-2 gap-3">
            {inp('Job Title', 'jobTitle', 'text', true)}
            {inp('Department', 'department')}
          </div>
          <div className="grid grid-cols-3 gap-3">
            {inp('Vacancies', 'vacancies', 'number')}
            {inp('Posting Date', 'postingDate', 'date', true)}
            {inp('Closing Date', 'closingDate', 'date')}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {inp('Salary Range', 'salaryRange')}
            {inp('Location', 'location')}
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-700">Employment Type</label>
            <select value={form.employmentType} onChange={e => setForm(f => ({ ...f, employmentType: e.target.value }))}
              className="w-full h-9 px-3 border border-zinc-200 rounded-lg text-sm focus:outline-none bg-white">
              {EMP_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-700">Description</label>
            <textarea rows={2} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none resize-none" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-700">Requirements</label>
            <textarea rows={2} value={form.requirements} onChange={e => setForm(f => ({ ...f, requirements: e.target.value }))}
              className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none resize-none" />
          </div>
          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>Cancel</Button>
            <Button type="submit" size="sm" className="bg-zinc-900 hover:bg-zinc-800 text-white" disabled={saving}>
              {saving ? 'Creating...' : 'Create Posting'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

const statusColor: Record<string, string> = {
  OPEN: 'bg-green-100 text-green-700',
  CLOSED: 'bg-red-100 text-red-700',
  FILLED: 'bg-blue-100 text-blue-700',
  ON_HOLD: 'bg-yellow-100 text-yellow-700',
};

export function RecruitmentPage() {
  const [recruitment, setRecruitment] = useState<Recruitment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({ page: 0, size: 10, totalPages: 0, totalElements: 0 });
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => { load(); }, [pagination.page]);

  const load = async () => {
    setLoading(true);
    try {
      const data = await hrService.getRecruitment(pagination.page, pagination.size);
      setRecruitment(data.content || []);
      setPagination(p => ({ ...p, totalPages: data.totalPages, totalElements: data.totalElements }));
    } catch { toast.error('Failed to load recruitment records'); }
    finally { setLoading(false); }
  };

  const filtered = searchTerm
    ? recruitment.filter(r => `${r.jobTitle} ${r.department} ${r.status}`.toLowerCase().includes(searchTerm.toLowerCase()))
    : recruitment;

  return (
    <MainLayout
      pageTitle="Recruitment"
      pageAction={
        <Button size="sm" className="h-8 px-3 bg-zinc-900 hover:bg-zinc-800 text-white shadow-sm" onClick={() => setDialogOpen(true)}>
          <Plus className="w-3.5 h-3.5 mr-2" /> Add Job Posting
        </Button>
      }
    >
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
          <input type="text" placeholder="Search by job title, department, status..." value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full h-9 pl-10 pr-4 bg-white border border-zinc-200 rounded-lg text-sm focus:outline-none shadow-sm" />
        </div>

        {loading ? (
          <div className="w-full h-48 border border-zinc-200 rounded-lg bg-white flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="w-full h-64 border border-dashed border-zinc-300 rounded-lg bg-zinc-50/50 flex flex-col items-center justify-center">
            <Briefcase className="w-8 h-8 text-zinc-300 mb-2" />
            <p className="text-sm font-medium text-zinc-900">No job postings found</p>
          </div>
        ) : (
          <>
            <div className="text-[12px] font-medium text-zinc-500 uppercase tracking-wider px-1">{pagination.totalElements} postings</div>
            <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-zinc-50 border-b border-zinc-200">
                  <tr>
                    {['Job Title', 'Department', 'Type', 'Vacancies', 'Closing Date', 'Status'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-zinc-600 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {filtered.map(job => (
                    <tr key={job.id} className="hover:bg-zinc-50">
                      <td className="px-4 py-3 text-sm font-medium text-zinc-900">{job.jobTitle}</td>
                      <td className="px-4 py-3 text-sm text-zinc-600">{job.department || '—'}</td>
                      <td className="px-4 py-3 text-sm text-zinc-600">{job.employmentType || '—'}</td>
                      <td className="px-4 py-3 text-sm text-zinc-600">{job.vacancies}</td>
                      <td className="px-4 py-3 text-sm text-zinc-600">{job.closingDate || '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-[11px] font-medium ${statusColor[job.status ?? ''] ?? 'bg-zinc-100 text-zinc-700'}`}>
                          {job.status || 'OPEN'}
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
      <JobPostingDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onSave={load} />
    </MainLayout>
  );
}
