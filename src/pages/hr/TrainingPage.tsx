import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Search, Plus, GraduationCap, ChevronLeft, ChevronRight, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { hrService, type Training } from '@/services/api/hrService';

const TRAINING_TYPES = ['INTERNAL', 'EXTERNAL', 'ONLINE', 'CLASSROOM'];

function TrainingFormDialog(props: { open: boolean; onClose: () => void; onSave: () => void }) {
  const { open, onClose, onSave } = props;
  const blank = { trainingName: '', description: '', trainingType: 'INTERNAL', startDate: '', endDate: '', location: '', instructor: '', cost: '', maxParticipants: '' };
  const [form, setForm] = useState(blank);
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (open) setForm(blank); }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.trainingName || !form.startDate) { toast.error('Name and start date are required'); return; }
    setSaving(true);
    try {
      await hrService.createTraining({
        trainingName: form.trainingName, description: form.description, trainingType: form.trainingType,
        startDate: form.startDate, endDate: form.endDate || undefined,
        location: form.location, instructor: form.instructor,
        cost: form.cost ? parseFloat(form.cost) : undefined,
        maxParticipants: form.maxParticipants ? parseInt(form.maxParticipants) : undefined,
      });
      toast.success('Training created'); onSave(); onClose();
    } catch { toast.error('Failed to create training'); }
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
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle className="text-base font-semibold">Create Training Program</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3 py-2">
          {inp('Training Name', 'trainingName', 'text', true)}
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-700">Type</label>
            <select value={form.trainingType} onChange={e => setForm(f => ({ ...f, trainingType: e.target.value }))}
              className="w-full h-9 px-3 border border-zinc-200 rounded-lg text-sm focus:outline-none bg-white">
              {TRAINING_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {inp('Start Date', 'startDate', 'date', true)}
            {inp('End Date', 'endDate', 'date')}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {inp('Instructor', 'instructor')}
            {inp('Location', 'location')}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {inp('Cost', 'cost', 'number')}
            {inp('Max Participants', 'maxParticipants', 'number')}
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-700">Description</label>
            <textarea rows={2} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none resize-none" />
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

function EnrollDialog(props: { open: boolean; trainingId: string; onClose: () => void }) {
  const { open, trainingId, onClose } = props;
  const [employeeId, setEmployeeId] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeId) return;
    setSaving(true);
    try {
      await hrService.enrollEmployee(trainingId, employeeId);
      toast.success('Employee enrolled'); onClose();
    } catch { toast.error('Failed to enroll'); }
    finally { setSaving(false); }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader><DialogTitle className="text-base font-semibold">Enroll Employee</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3 py-2">
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-700">Employee ID *</label>
            <input type="text" value={employeeId} required onChange={e => setEmployeeId(e.target.value)}
              placeholder="UUID of the employee"
              className="w-full h-9 px-3 border border-zinc-200 rounded-lg text-sm focus:outline-none" />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" size="sm" onClick={onClose}>Cancel</Button>
            <Button type="submit" size="sm" className="bg-zinc-900 hover:bg-zinc-800 text-white" disabled={saving}>
              {saving ? 'Enrolling...' : 'Enroll'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

const statusColor: Record<string, string> = {
  COMPLETED: 'bg-green-100 text-green-700',
  IN_PROGRESS: 'bg-blue-100 text-blue-700',
  SCHEDULED: 'bg-yellow-100 text-yellow-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

export function TrainingPage() {
  const [training, setTraining] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({ page: 0, size: 10, totalPages: 0, totalElements: 0 });
  const [createOpen, setCreateOpen] = useState(false);
  const [enrollId, setEnrollId] = useState<string | null>(null);

  useEffect(() => { load(); }, [pagination.page]);

  const load = async () => {
    setLoading(true);
    try {
      const data = await hrService.getTraining(pagination.page, pagination.size);
      setTraining(data.content || []);
      setPagination(p => ({ ...p, totalPages: data.totalPages, totalElements: data.totalElements }));
    } catch { toast.error('Failed to load training records'); }
    finally { setLoading(false); }
  };

  const filtered = searchTerm
    ? training.filter(t => `${t.trainingName} ${t.trainingType} ${t.status}`.toLowerCase().includes(searchTerm.toLowerCase()))
    : training;

  return (
    <MainLayout
      pageTitle="Training"
      pageAction={
        <Button size="sm" className="h-8 px-3 bg-zinc-900 hover:bg-zinc-800 text-white shadow-sm" onClick={() => setCreateOpen(true)}>
          <Plus className="w-3.5 h-3.5 mr-2" /> Add Training
        </Button>
      }
    >
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
          <input type="text" placeholder="Search by training name, type, status..." value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full h-9 pl-10 pr-4 bg-white border border-zinc-200 rounded-lg text-sm focus:outline-none shadow-sm" />
        </div>

        {loading ? (
          <div className="w-full h-48 border border-zinc-200 rounded-lg bg-white flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="w-full h-64 border border-dashed border-zinc-300 rounded-lg bg-zinc-50/50 flex flex-col items-center justify-center">
            <GraduationCap className="w-8 h-8 text-zinc-300 mb-2" />
            <p className="text-sm font-medium text-zinc-900">No training records found</p>
          </div>
        ) : (
          <>
            <div className="text-[12px] font-medium text-zinc-500 uppercase tracking-wider px-1">{pagination.totalElements} trainings</div>
            <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-zinc-50 border-b border-zinc-200">
                  <tr>
                    {['Name', 'Type', 'Start', 'End', 'Instructor', 'Status', ''].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-zinc-600 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {filtered.map(t => (
                    <tr key={t.id} className="hover:bg-zinc-50">
                      <td className="px-4 py-3 text-sm font-medium text-zinc-900">{t.trainingName}</td>
                      <td className="px-4 py-3 text-sm text-zinc-600">{t.trainingType || '—'}</td>
                      <td className="px-4 py-3 text-sm text-zinc-600">{t.startDate}</td>
                      <td className="px-4 py-3 text-sm text-zinc-600">{t.endDate || '—'}</td>
                      <td className="px-4 py-3 text-sm text-zinc-600">{t.instructor || '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-[11px] font-medium ${statusColor[t.status ?? ''] ?? 'bg-zinc-100 text-zinc-700'}`}>
                          {t.status || 'SCHEDULED'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Button size="sm" variant="outline" className="h-7 px-2" onClick={() => setEnrollId(t.id)}>
                          <UserPlus className="w-3 h-3 mr-1" /> Enroll
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

      <TrainingFormDialog open={createOpen} onClose={() => setCreateOpen(false)} onSave={load} />
      {enrollId && <EnrollDialog open={!!enrollId} trainingId={enrollId} onClose={() => setEnrollId(null)} />}
    </MainLayout>
  );
}
