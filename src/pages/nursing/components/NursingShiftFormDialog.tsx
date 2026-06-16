import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { nursingShiftsService, type NursingShift, type CreateNursingShiftRequest, type UpdateNursingShiftRequest } from '@/services/api/nursingShiftsService';
import { ShiftType, ShiftRecordStatus } from '@/types/nursing';

interface NursingShiftFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingShift: NursingShift | null;
  nurseId: string | null;
}

export function NursingShiftFormDialog({
  isOpen,
  onClose,
  onSuccess,
  editingShift,
  nurseId }: NursingShiftFormDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    shiftDate: '',
    shiftType: ShiftType.DAY,
    startTime: '',
    endTime: '',
    assignedUnit: '',
    status: ShiftRecordStatus.SCHEDULED,
    patientCount: 0,
    notes: '' });

  useEffect(() => {
    if (editingShift) {
      setFormData({
        shiftDate: editingShift.shiftDate,
        shiftType: editingShift.shiftType as any,
        startTime: editingShift.startTime,
        endTime: editingShift.endTime,
        assignedUnit: editingShift.assignedUnit,
        status: editingShift.status as any,
        patientCount: editingShift.patientCount,
        notes: editingShift.notes || '' });
    } else {
      const now = new Date();
      setFormData({
        shiftDate: now.toISOString().split('T')[0],
        shiftType: ShiftType.DAY,
        startTime: now.toTimeString().slice(0, 5),
        endTime: now.toTimeString().slice(0, 5),
        assignedUnit: '',
        status: ShiftRecordStatus.SCHEDULED,
        patientCount: 0,
        notes: '' });
    }
  }, [editingShift, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nurseId) {
      toast.error('Nurse is required');
      return;
    }

    setLoading(true);
    try {
      const request = {
        nurseId,
        shiftDate: formData.shiftDate,
        shiftType: formData.shiftType,
        startTime: formData.startTime,
        endTime: formData.endTime,
        assignedUnit: formData.assignedUnit,
        status: formData.status,
        patientCount: formData.patientCount,
        notes: formData.notes || undefined };

      if (editingShift) {
        await nursingShiftsService.updateNursingShift(editingShift.id, request as UpdateNursingShiftRequest);
        toast.success('Nursing shift updated successfully');
      } else {
        await nursingShiftsService.createNursingShift(request as CreateNursingShiftRequest);
        toast.success('Nursing shift created successfully');
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving nursing shift:', error);
      toast.error('Failed to save nursing shift');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-zinc-200">
          <h2 className="text-xl font-semibold text-zinc-900">
            {editingShift ? 'Edit Nursing Shift' : 'New Nursing Shift'}
          </h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Shift Date *
              </label>
              <input
                type="date"
                required
                value={formData.shiftDate}
                onChange={(e) => setFormData({ ...formData, shiftDate: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Shift Type *
              </label>
              <select
                required
                value={formData.shiftType}
                onChange={(e) => setFormData({ ...formData, shiftType: e.target.value as any })}
                className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
              >
                {Object.values(ShiftType).map((shift) => (
                  <option key={shift} value={shift}>{shift}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Start Time *
              </label>
              <input
                type="time"
                required
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                End Time *
              </label>
              <input
                type="time"
                required
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Assigned Unit *
              </label>
              <input
                type="text"
                required
                value={formData.assignedUnit}
                onChange={(e) => setFormData({ ...formData, assignedUnit: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Status *
              </label>
              <select
                required
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
              >
                {Object.values(ShiftRecordStatus).map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Patient Count *
              </label>
              <input
                type="number"
                min="0"
                required
                value={formData.patientCount}
                onChange={(e) => setFormData({ ...formData, patientCount: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Notes</label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="px-4 py-2">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white">
              {loading ? 'Saving...' : editingShift ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
