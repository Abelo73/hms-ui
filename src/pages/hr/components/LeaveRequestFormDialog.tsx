import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { hrService } from '@/services/api/hrService';
import { toast } from 'sonner';

interface LeaveRequestFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const LEAVE_TYPES = [
  'ANNUAL', 'SICK', 'MATERNITY', 'PATERNITY', 'UNPAID',
  'BEREAVEMENT', 'STUDY', 'EMERGENCY', 'OTHER',
];

const emptyForm = { employeeId: '', leaveType: '', startDate: '', endDate: '', reason: '' };

export function LeaveRequestFormDialog({ isOpen, onClose, onSuccess }: LeaveRequestFormDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => { if (isOpen) setFormData(emptyForm); }, [isOpen]);

  const f = (field: keyof typeof emptyForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setFormData({ ...formData, [field]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.endDate < formData.startDate) {
      toast.error('End date must be after start date');
      return;
    }
    setLoading(true);
    try {
      await hrService.createLeaveRequest(formData);
      toast.success('Leave request submitted');
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit leave request');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const inputCls = 'w-full px-3 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900';
  const labelCls = 'block text-sm font-medium text-zinc-700 mb-1';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-zinc-200">
          <h2 className="text-lg font-semibold text-zinc-900">New Leave Request</h2>
          <Button variant="ghost" size="sm" onClick={onClose}><X className="w-4 h-4" /></Button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className={labelCls}>Employee ID *</label>
            <input required className={inputCls} placeholder="Employee UUID" value={formData.employeeId} onChange={f('employeeId')} />
            <p className="text-xs text-zinc-400 mt-1">Paste the employee's ID from the Employees list</p>
          </div>

          <div>
            <label className={labelCls}>Leave Type *</label>
            <select required className={inputCls} value={formData.leaveType} onChange={f('leaveType')}>
              <option value="">Select type</option>
              {LEAVE_TYPES.map(t => <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Start Date *</label>
              <input required type="date" className={inputCls} value={formData.startDate} onChange={f('startDate')} />
            </div>
            <div>
              <label className={labelCls}>End Date *</label>
              <input required type="date" className={inputCls} value={formData.endDate} onChange={f('endDate')} />
            </div>
          </div>

          <div>
            <label className={labelCls}>Reason</label>
            <textarea rows={3} className={inputCls} value={formData.reason} onChange={f('reason')} placeholder="Brief description..." />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-zinc-200">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
            <Button type="submit" disabled={loading} className="bg-zinc-900 hover:bg-zinc-800">
              {loading ? 'Submitting...' : 'Submit Request'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
