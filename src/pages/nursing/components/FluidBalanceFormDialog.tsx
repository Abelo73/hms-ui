import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { fluidBalanceService, type FluidBalance, type CreateFluidBalanceRequest, type UpdateFluidBalanceRequest } from '@/services/api/fluidBalanceService';
import { ShiftType } from '@/types/nursing';

interface FluidBalanceFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingFluidBalance: FluidBalance | null;
  patientId: string | null;
}

export function FluidBalanceFormDialog({
  isOpen,
  onClose,
  onSuccess,
  editingFluidBalance,
  patientId,
}: FluidBalanceFormDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    recordDate: '',
    shiftType: ShiftType.DAY,
    oralIntake: 0,
    intravenousIntake: 0,
    parenteralIntake: 0,
    bloodProductIntake: 0,
    otherIntake: 0,
    urineOutput: 0,
    stoolOutput: 0,
    emesisOutput: 0,
    drainageOutput: 0,
    otherOutput: 0,
    notes: '',
  });

  useEffect(() => {
    if (editingFluidBalance) {
      setFormData({
        recordDate: editingFluidBalance.recordDate,
        shiftType: editingFluidBalance.shiftType as any,
        oralIntake: editingFluidBalance.oralIntake,
        intravenousIntake: editingFluidBalance.intravenousIntake,
        parenteralIntake: editingFluidBalance.parenteralIntake,
        bloodProductIntake: editingFluidBalance.bloodProductIntake,
        otherIntake: editingFluidBalance.otherIntake,
        urineOutput: editingFluidBalance.urineOutput,
        stoolOutput: editingFluidBalance.stoolOutput,
        emesisOutput: editingFluidBalance.emesisOutput,
        drainageOutput: editingFluidBalance.drainageOutput,
        otherOutput: editingFluidBalance.otherOutput,
        notes: editingFluidBalance.notes || '',
      });
    } else {
      const now = new Date();
      setFormData({
        recordDate: now.toISOString().split('T')[0],
        shiftType: ShiftType.DAY,
        oralIntake: 0,
        intravenousIntake: 0,
        parenteralIntake: 0,
        bloodProductIntake: 0,
        otherIntake: 0,
        urineOutput: 0,
        stoolOutput: 0,
        emesisOutput: 0,
        drainageOutput: 0,
        otherOutput: 0,
        notes: '',
      });
    }
  }, [editingFluidBalance, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId) {
      toast.error('Patient is required');
      return;
    }

    setLoading(true);
    try {
      const totalIntake = formData.oralIntake + formData.intravenousIntake + formData.parenteralIntake + formData.bloodProductIntake + formData.otherIntake;
      const totalOutput = formData.urineOutput + formData.stoolOutput + formData.emesisOutput + formData.drainageOutput + formData.otherOutput;
      const netBalance = totalIntake - totalOutput;

      const request = {
        patientId,
        recordDate: formData.recordDate,
        shiftType: formData.shiftType,
        oralIntake: formData.oralIntake,
        intravenousIntake: formData.intravenousIntake,
        parenteralIntake: formData.parenteralIntake,
        bloodProductIntake: formData.bloodProductIntake,
        otherIntake: formData.otherIntake,
        urineOutput: formData.urineOutput,
        stoolOutput: formData.stoolOutput,
        emesisOutput: formData.emesisOutput,
        drainageOutput: formData.drainageOutput,
        otherOutput: formData.otherOutput,
        notes: formData.notes || undefined,
      };

      if (editingFluidBalance) {
        await fluidBalanceService.updateFluidBalance(editingFluidBalance.id, request as UpdateFluidBalanceRequest);
        toast.success('Fluid balance record updated successfully');
      } else {
        await fluidBalanceService.createFluidBalance(request as CreateFluidBalanceRequest);
        toast.success('Fluid balance record created successfully');
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving fluid balance record:', error);
      toast.error('Failed to save fluid balance record');
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
            {editingFluidBalance ? 'Edit Fluid Balance' : 'New Fluid Balance'}
          </h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Record Date *
              </label>
              <input
                type="date"
                required
                value={formData.recordDate}
                onChange={(e) => setFormData({ ...formData, recordDate: e.target.value })}
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

          <div>
            <h3 className="text-sm font-medium text-zinc-900 mb-3">Intake (mL)</h3>
            <div className="grid grid-cols-5 gap-3">
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">Oral</label>
                <input
                  type="number"
                  min="0"
                  value={formData.oralIntake}
                  onChange={(e) => setFormData({ ...formData, oralIntake: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">IV</label>
                <input
                  type="number"
                  min="0"
                  value={formData.intravenousIntake}
                  onChange={(e) => setFormData({ ...formData, intravenousIntake: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">Parenteral</label>
                <input
                  type="number"
                  min="0"
                  value={formData.parenteralIntake}
                  onChange={(e) => setFormData({ ...formData, parenteralIntake: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">Blood</label>
                <input
                  type="number"
                  min="0"
                  value={formData.bloodProductIntake}
                  onChange={(e) => setFormData({ ...formData, bloodProductIntake: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">Other</label>
                <input
                  type="number"
                  min="0"
                  value={formData.otherIntake}
                  onChange={(e) => setFormData({ ...formData, otherIntake: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-zinc-900 mb-3">Output (mL)</h3>
            <div className="grid grid-cols-5 gap-3">
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">Urine</label>
                <input
                  type="number"
                  min="0"
                  value={formData.urineOutput}
                  onChange={(e) => setFormData({ ...formData, urineOutput: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">Stool</label>
                <input
                  type="number"
                  min="0"
                  value={formData.stoolOutput}
                  onChange={(e) => setFormData({ ...formData, stoolOutput: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">Emesis</label>
                <input
                  type="number"
                  min="0"
                  value={formData.emesisOutput}
                  onChange={(e) => setFormData({ ...formData, emesisOutput: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">Drainage</label>
                <input
                  type="number"
                  min="0"
                  value={formData.drainageOutput}
                  onChange={(e) => setFormData({ ...formData, drainageOutput: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">Other</label>
                <input
                  type="number"
                  min="0"
                  value={formData.otherOutput}
                  onChange={(e) => setFormData({ ...formData, otherOutput: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
                />
              </div>
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
              {loading ? 'Saving...' : editingFluidBalance ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
