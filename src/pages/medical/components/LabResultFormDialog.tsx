import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { labResultsService, type CreateLabResultRequest, type UpdateLabResultRequest, type LabResult } from '@/services/api/labResultsService';
import { LabResultStatus } from '@/types/medical';
import { toast } from 'sonner';

interface LabResultFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingLabResult?: LabResult | null;
  patientId?: string | null;
}

export function LabResultFormDialog({ isOpen, onClose, onSuccess, editingLabResult, patientId }: LabResultFormDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateLabResultRequest>({
    patientId: patientId || '',
    testType: '',
    testName: '',
    testDate: '',
    resultValue: '',
    unit: '',
    referenceRange: '',
    status: LabResultStatus.PENDING,
    performedBy: '',
    notes: '',
  });

  useEffect(() => {
    if (editingLabResult) {
      setFormData({
        patientId: editingLabResult.patientId,
        testType: editingLabResult.testType,
        testName: editingLabResult.testName,
        testDate: editingLabResult.testDate,
        resultValue: editingLabResult.resultValue,
        unit: editingLabResult.unit,
        referenceRange: editingLabResult.referenceRange,
        status: editingLabResult.status,
        performedBy: editingLabResult.performedBy,
        notes: editingLabResult.notes,
      });
    } else if (patientId) {
      setFormData(prev => ({ ...prev, patientId }));
    }
  }, [editingLabResult, patientId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingLabResult) {
        const updateData: UpdateLabResultRequest = {
          testType: formData.testType,
          testName: formData.testName,
          testDate: formData.testDate,
          resultValue: formData.resultValue,
          unit: formData.unit,
          referenceRange: formData.referenceRange,
          status: formData.status,
          performedBy: formData.performedBy,
          notes: formData.notes,
        };
        await labResultsService.updateLabResult(editingLabResult.id, updateData);
        toast.success('Lab result updated successfully');
      } else {
        await labResultsService.createLabResult(formData);
        toast.success('Lab result created successfully');
      }
      onSuccess();
      onClose();
      setFormData({
        patientId: patientId || '',
        testType: '',
        testName: '',
        testDate: '',
        resultValue: '',
        unit: '',
        referenceRange: '',
        status: LabResultStatus.PENDING,
        performedBy: '',
        notes: '',
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save lab result');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-zinc-200">
          <h2 className="text-lg font-semibold text-zinc-900">
            {editingLabResult ? 'Edit Lab Result' : 'Add New Lab Result'}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Test Type</label>
              <input
                type="text"
                value={formData.testType}
                onChange={(e) => setFormData({ ...formData, testType: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Test Name *</label>
              <input
                type="text"
                value={formData.testName}
                onChange={(e) => setFormData({ ...formData, testName: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Test Date *</label>
            <input
              type="date"
              value={formData.testDate}
              onChange={(e) => setFormData({ ...formData, testDate: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Result Value</label>
              <input
                type="text"
                value={formData.resultValue}
                onChange={(e) => setFormData({ ...formData, resultValue: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Unit</label>
              <input
                type="text"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Status *</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
                required
              >
                <option value={LabResultStatus.NORMAL}>Normal</option>
                <option value={LabResultStatus.ABNORMAL}>Abnormal</option>
                <option value={LabResultStatus.CRITICAL}>Critical</option>
                <option value={LabResultStatus.PENDING}>Pending</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Reference Range</label>
            <input
              type="text"
              value={formData.referenceRange}
              onChange={(e) => setFormData({ ...formData, referenceRange: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Performed By</label>
            <input
              type="text"
              value={formData.performedBy}
              onChange={(e) => setFormData({ ...formData, performedBy: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-zinc-200">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-zinc-900 hover:bg-zinc-800">
              {loading ? 'Saving...' : editingLabResult ? 'Update Lab Result' : 'Create Lab Result'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
