import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { diagnosesService, type CreateDiagnosisRequest, type UpdateDiagnosisRequest, type Diagnosis } from '@/services/api/diagnosesService';
import { DiagnosisType, ConditionStatus } from '@/types/medical';
import { toast } from 'sonner';

interface DiagnosisFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingDiagnosis?: Diagnosis | null;
  medicalRecordId?: string | null;
}

export function DiagnosisFormDialog({ isOpen, onClose, onSuccess, editingDiagnosis, medicalRecordId }: DiagnosisFormDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateDiagnosisRequest>({
    medicalRecordId: medicalRecordId || '',
    icd10Code: '',
    diagnosisName: '',
    diagnosisType: DiagnosisType.PRIMARY,
    conditionStatus: ConditionStatus.ACTIVE,
    diagnosisDate: new Date().toISOString().split('T')[0],
    resolvedDate: '',
    notes: '' });

  useEffect(() => {
    if (editingDiagnosis) {
      setFormData({
        medicalRecordId: editingDiagnosis.medicalRecordId,
        icd10Code: editingDiagnosis.icd10Code || '',
        diagnosisName: editingDiagnosis.diagnosisName,
        diagnosisType: editingDiagnosis.diagnosisType,
        conditionStatus: editingDiagnosis.conditionStatus,
        diagnosisDate: editingDiagnosis.diagnosisDate,
        resolvedDate: editingDiagnosis.resolvedDate || '',
        notes: editingDiagnosis.notes || '' });
    } else if (medicalRecordId) {
      setFormData(prev => ({ ...prev, medicalRecordId }));
    }
  }, [editingDiagnosis, medicalRecordId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.medicalRecordId) {
      toast.error('Medical record ID is required');
      return;
    }

    if (!formData.diagnosisName) {
      toast.error('Please enter a diagnosis name');
      return;
    }

    setLoading(true);
    try {
      if (editingDiagnosis) {
        const updateRequest: UpdateDiagnosisRequest = {
          icd10Code: formData.icd10Code,
          diagnosisName: formData.diagnosisName,
          diagnosisType: formData.diagnosisType,
          conditionStatus: formData.conditionStatus,
          diagnosisDate: formData.diagnosisDate,
          resolvedDate: formData.resolvedDate,
          notes: formData.notes };
        await diagnosesService.updateDiagnosis(editingDiagnosis.id, updateRequest);
        toast.success('Diagnosis updated successfully');
      } else {
        await diagnosesService.createDiagnosis(formData);
        toast.success('Diagnosis created successfully');
      }
      onSuccess();
      onClose();
      setFormData({
        medicalRecordId: medicalRecordId || '',
        icd10Code: '',
        diagnosisName: '',
        diagnosisType: DiagnosisType.PRIMARY,
        conditionStatus: ConditionStatus.ACTIVE,
        diagnosisDate: new Date().toISOString().split('T')[0],
        resolvedDate: '',
        notes: '' });
    } catch (error) {
      console.error('Error saving diagnosis:', error);
      toast.error('Failed to save diagnosis');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-zinc-200">
          <h2 className="text-lg font-semibold text-zinc-900">
            {editingDiagnosis ? 'Edit Diagnosis' : 'Add Diagnosis'}
          </h2>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Diagnosis Name *
              </label>
              <input
                type="text"
                value={formData.diagnosisName}
                onChange={(e) => setFormData({ ...formData, diagnosisName: e.target.value })}
                placeholder="Enter diagnosis name"
                className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                ICD-10 Code
              </label>
              <input
                type="text"
                value={formData.icd10Code}
                onChange={(e) => setFormData({ ...formData, icd10Code: e.target.value })}
                placeholder="e.g., J01.90"
                className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Diagnosis Type *
              </label>
              <select
                value={formData.diagnosisType}
                onChange={(e) => setFormData({ ...formData, diagnosisType: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
              >
                <option value={DiagnosisType.PRIMARY}>Primary</option>
                <option value={DiagnosisType.SECONDARY}>Secondary</option>
                <option value={DiagnosisType.ADMISSION}>Admission</option>
                <option value={DiagnosisType.DISCHARGE}>Discharge</option>
                <option value={DiagnosisType.PROVISIONAL}>Provisional</option>
                <option value={DiagnosisType.RULE_OUT}>Rule Out</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Condition Status *
              </label>
              <select
                value={formData.conditionStatus}
                onChange={(e) => setFormData({ ...formData, conditionStatus: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
              >
                <option value={ConditionStatus.ACTIVE}>Active</option>
                <option value={ConditionStatus.RESOLVED}>Resolved</option>
                <option value={ConditionStatus.CHRONIC}>Chronic</option>
                <option value={ConditionStatus.INACTIVE}>Inactive</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Diagnosis Date *
              </label>
              <input
                type="date"
                value={formData.diagnosisDate}
                onChange={(e) => setFormData({ ...formData, diagnosisDate: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Resolved Date
              </label>
              <input
                type="date"
                value={formData.resolvedDate}
                onChange={(e) => setFormData({ ...formData, resolvedDate: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
                disabled={formData.conditionStatus !== ConditionStatus.RESOLVED}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Clinical Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Enter clinical notes"
              rows={4}
              className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-zinc-900 hover:bg-zinc-800 text-white"
            >
              {loading ? 'Saving...' : editingDiagnosis ? 'Update Diagnosis' : 'Add Diagnosis'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
