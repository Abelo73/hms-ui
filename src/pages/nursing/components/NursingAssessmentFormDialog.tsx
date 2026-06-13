import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { nursingAssessmentsService, type NursingAssessment, type CreateNursingAssessmentRequest, type UpdateNursingAssessmentRequest } from '@/services/api/nursingAssessmentsService';
import { AssessmentType, RiskLevel } from '@/types/nursing';

interface NursingAssessmentFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingAssessment: NursingAssessment | null;
  admissionId: string | null;
}

export function NursingAssessmentFormDialog({
  isOpen,
  onClose,
  onSuccess,
  editingAssessment,
  admissionId,
}: NursingAssessmentFormDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    assessmentType: AssessmentType.ADMISSION,
    assessmentDate: '',
    assessmentTime: '',
    chiefComplaint: '',
    historyOfPresentIllness: '',
    physicalExamination: '',
    riskLevel: RiskLevel.LOW,
    notes: '',
  });

  useEffect(() => {
    if (editingAssessment) {
      setFormData({
        assessmentType: editingAssessment.assessmentType as any,
        assessmentDate: editingAssessment.assessmentDate,
        assessmentTime: editingAssessment.assessmentTime,
        chiefComplaint: editingAssessment.chiefComplaint,
        historyOfPresentIllness: editingAssessment.historyOfPresentIllness,
        physicalExamination: editingAssessment.physicalExamination,
        riskLevel: editingAssessment.riskLevel as any,
        notes: editingAssessment.notes || '',
      });
    } else {
      const now = new Date();
      setFormData({
        assessmentType: AssessmentType.ADMISSION,
        assessmentDate: now.toISOString().split('T')[0],
        assessmentTime: now.toTimeString().slice(0, 5),
        chiefComplaint: '',
        historyOfPresentIllness: '',
        physicalExamination: '',
        riskLevel: RiskLevel.LOW,
        notes: '',
      });
    }
  }, [editingAssessment, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!admissionId) {
      toast.error('Patient admission is required');
      return;
    }

    setLoading(true);
    try {
      const request = {
        admissionId,
        assessmentType: formData.assessmentType,
        assessmentDate: formData.assessmentDate,
        assessmentTime: formData.assessmentTime,
        chiefComplaint: formData.chiefComplaint,
        historyOfPresentIllness: formData.historyOfPresentIllness,
        physicalExamination: formData.physicalExamination,
        riskLevel: formData.riskLevel,
        notes: formData.notes || undefined,
      };

      if (editingAssessment) {
        await nursingAssessmentsService.updateNursingAssessment(editingAssessment.id, request as UpdateNursingAssessmentRequest);
        toast.success('Nursing assessment updated successfully');
      } else {
        await nursingAssessmentsService.createNursingAssessment(request as CreateNursingAssessmentRequest);
        toast.success('Nursing assessment created successfully');
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving nursing assessment:', error);
      toast.error('Failed to save nursing assessment');
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
            {editingAssessment ? 'Edit Nursing Assessment' : 'New Nursing Assessment'}
          </h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Assessment Type *
              </label>
              <select
                required
                value={formData.assessmentType}
                onChange={(e) => setFormData({ ...formData, assessmentType: e.target.value as any })}
                className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
              >
                {Object.values(AssessmentType).map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Risk Level *
              </label>
              <select
                required
                value={formData.riskLevel}
                onChange={(e) => setFormData({ ...formData, riskLevel: e.target.value as any })}
                className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
              >
                {Object.values(RiskLevel).map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            <div className="col-span-1" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Assessment Date *
              </label>
              <input
                type="date"
                required
                value={formData.assessmentDate}
                onChange={(e) => setFormData({ ...formData, assessmentDate: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Assessment Time *
              </label>
              <input
                type="time"
                required
                value={formData.assessmentTime}
                onChange={(e) => setFormData({ ...formData, assessmentTime: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Chief Complaint *
            </label>
            <input
              type="text"
              required
              value={formData.chiefComplaint}
              onChange={(e) => setFormData({ ...formData, chiefComplaint: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              History of Present Illness *
            </label>
            <textarea
              required
              rows={3}
              value={formData.historyOfPresentIllness}
              onChange={(e) => setFormData({ ...formData, historyOfPresentIllness: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Physical Examination *
            </label>
            <textarea
              required
              rows={3}
              value={formData.physicalExamination}
              onChange={(e) => setFormData({ ...formData, physicalExamination: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
            />
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
              {loading ? 'Saving...' : editingAssessment ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
