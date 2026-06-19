import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Search, Plus, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { hrService, type AttendanceRecord } from '@/services/api/hrService';

const STATUS_OPTIONS = ['PRESENT', 'ABSENT', 'LATE', 'HALF_DAY', 'ON_LEAVE'];

function AttendanceFormDialog(props: {
  open: boolean;
  onClose: () => void;
  onSave: (data: Partial<AttendanceRecord>) => Promise<void>;
  initial?: AttendanceRecord | null;
}) {
  const { open, onClose, onSave, initial } = props;
  const [form, setForm] = useState<Partial<AttendanceRecord>>(initial ?? { status: 'PRESENT' });
  const [saving, setSaving] = useState(false);

  useEffect(() => { setForm(initial ?? { status: 'PRESENT' }); }, [initial, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.employeeId || !form.date) { toast.error('Employee ID and Date are required'); return; }
    setSaving(true);
    try { await onSave(form); onClose(); } finally { setSaving(false); }
  };

  const inp = (label: string, key: keyof AttendanceRecord, type = 'text', required = false) => (
    <div className="space-y-1">
      <label className="text-xs font-medium text-zinc-700">{label}{required ? ' *' : ''}</label>
      <input type={type} value={(form[key] as string) ?? ''} required={required}
        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        className="w-full h-9 px-3 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900" />
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle className="text-base font-semibold">{initial ? 'Edit Record' : 'Add Attendance Record'}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3 py-2">
          {inp('Employee ID', 'employeeId', 'text', true)}
          {inp('Date', 'date', 'date', true)}
          {inp('Check In Time', 'checkInTime', 'time')}
          {inp('Check Out Time', 'checkOutTime', 'time')}
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-700">Status *</label>
            <select value={form.status ?? 'PRESENT'} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
              className="w-full h-9 px-3 border border-zinc-200 rounded-lg text-sm focus:outline-none bg-white">
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          {inp('Hours Worked', 'hoursWorked', 'number')}
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

const statusColor: Record<string, string> = {
  PRESENT: 'bg-green-100 text-green-700',
  ABSENT: 'bg-red-100 text-red-700',
  LATE: 'bg-yellow-100 text-yellow-700',
  HALF_DAY: 'bg-blue-100 text-blue-700',
  ON_LEAVE: 'bg-purple-100 text-purple-700',
};

export function AttendancePage() {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({ page: 0, size: 30, totalPages: 0, totalElements: 0 });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<AttendanceRecord | null>(null);

  useEffect(() => { loadAttendance(); }, [pagination.page]);

  const loadAttendance = async () => {
    setLoading(true);
    try {
      const data = await hrService.getAllAttendance(pagination.page, pagination.size);
      setAttendance(data.content || []);
      setPagination(p => ({ ...p, totalPages: data.totalPages, totalElements: data.totalElements }));
    } catch { toast.error('Failed to load attendance records'); }
    finally { setLoading(false); }
  };

  const handleSave = async (form: Partial<AttendanceRecord>) => {
    if (editing) {
      await hrService.updateAttendance(editing.id, form);
      toast.success('Record updated');
    } else {
      await hrService.createAttendance(form);
      toast.success('Record created');
    }
    loadAttendance();
  };

  const filtered = searchTerm
    ? attendance.filter(a => `${a.employeeId} ${a.date} ${a.status}`.toLowerCase().includes(searchTerm.toLowerCase()))
    : attendance;

  return (
    <MainLayout
      pageTitle="Attendance"
      pageAction={
        <Button size="sm" className="h-8 px-3 bg-zinc-900 hover:bg-zinc-800 text-white shadow-sm"
          onClick={() => { setEditing(null); setDialogOpen(true); }}>
          <Plus className="w-3.5 h-3.5 mr-2" /> Add Record
        </Button>
      }
    >
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
          <input type="text" placeholder="Search by employee ID, date, status..." value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full h-9 pl-10 pr-4 bg-white border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900 shadow-sm" />
        </div>

        {loading ? (
          <div className="w-full h-48 border border-zinc-200 rounded-lg bg-white flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="w-full h-64 border border-dashed border-zinc-300 rounded-lg bg-zinc-50/50 flex flex-col items-center justify-center">
            <Clock className="w-8 h-8 text-zinc-300 mb-2" />
            <p className="text-sm font-medium text-zinc-900">No attendance records found</p>
          </div>
        ) : (
          <>
            <div className="text-[12px] font-medium text-zinc-500 uppercase tracking-wider px-1">{pagination.totalElements} records</div>
            <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-zinc-50 border-b border-zinc-200">
                  <tr>
                    {['Employee ID', 'Date', 'Check In', 'Check Out', 'Hours', 'Overtime', 'Status'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-zinc-600 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {filtered.map(record => (
                    <tr key={record.id} className="hover:bg-zinc-50 cursor-pointer"
                      onClick={() => { setEditing(record); setDialogOpen(true); }}>
                      <td className="px-4 py-3 text-sm text-zinc-900 font-mono text-xs">{record.employeeId?.slice(0, 8)}…</td>
                      <td className="px-4 py-3 text-sm text-zinc-700">{record.date}</td>
                      <td className="px-4 py-3 text-sm text-zinc-600">{record.checkInTime || '—'}</td>
                      <td className="px-4 py-3 text-sm text-zinc-600">{record.checkOutTime || '—'}</td>
                      <td className="px-4 py-3 text-sm text-zinc-600">{record.hoursWorked ?? '—'}</td>
                      <td className="px-4 py-3 text-sm text-zinc-600">{record.overtimeHours ?? '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-[11px] font-medium ${statusColor[record.status] ?? 'bg-zinc-100 text-zinc-700'}`}>
                          {record.status}
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

      <AttendanceFormDialog
        open={dialogOpen}
        onClose={() => { setDialogOpen(false); setEditing(null); }}
        onSave={handleSave}
        initial={editing}
      />
    </MainLayout>
  );
}
