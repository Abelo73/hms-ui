import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { nursingCarePlansService, type NursingCarePlan, type CreateNursingCarePlanRequest, type UpdateNursingCarePlanRequest } from '@/services/api/nursingCarePlansService';
import { CarePlanType, CarePlanStatus } from '@/types/nursing';

interface NursingCarePlanFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingCarePlan: NursingCarePlan | null;
  patientId: string | null;
}

export function NursingCarePlanFormDialog({
  isOpen,
  onClose,
  onSuccess,
  editingCarePlan,
  patientId,
}: NursingCarePlanFormDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    planName: '',
    planType: CarePlanType.ASSESSMENT,
    startDate: '',
    endDate: '',
    goals: '',
    interventions: '',
    evaluation: '',
    status: CarePlanStatus.ACTIVE,
  });

  useEffect(() => {
    if (editingCarePlan) {
      setFormData({
        planName: editingCarePlan.planName,
        planType: editingCarePlan.planType as any,
        startDate: editingCarePlan.startDate,
        endDate: editingCarePlan.endDate || '',
        goals: editingCarePlan.goals,
        interventions: editingCarePlan.interventions,
        evaluation: editingCarePlan.evaluation || '',
        status: editingCarePlan.status as any,
      });
    } else {
      setFormData({
        planName: '',
        planType: CarePlanType.ASSESSMENT,
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        goals: '',
        interventions: '',
        evaluation: '',
        status: CarePlanStatus.ACTIVE,
      });
    }
  }, [editingCarePlan, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId) {
      toast.error('Patient is required');
      return;
    }

    setLoading(true);
    try {
      if (editingCarePlan) {
        const updateRequest: UpdateNursingCarePlanRequest = {
          planName: formData.planName,
          planType: formData.planType,
          startDate: formData.startDate,
          endDate: formData.endDate || undefined,
          goals: formData.goals,
          interventions: formData.interventions,
          evaluation: formData.evaluation || undefined,
          status: formData.status,
        };
        await nursingCarePlansService.updateNursingCarePlan(editingCarePlan.id, updateRequest);
        toast.success('Care plan updated successfully');
      } else {
        const createRequest: CreateNursingCarePlanRequest = {
          patientId,
          planName: formData.planName,
          planType: formData.planType,
          startDate: formData.startDate,
          endDate: formData.endDate || undefined,
          goals: formData.goals,
          interventions: formData.interventions,
          evaluation: formData.evaluation || undefined,
          status: formData.status,
        };
        await nursingCarePlansService.createNursingCarePlan(createRequest);
        toast.success('Care plan created successfully');
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving care plan:', error);
      toast.error('Failed to save care plan');
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
            {editingCarePlan ? 'Edit Care Plan' : 'New Care Plan'}
          </h2>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Plan Name *
            </label>
            <input
              type="text"
              required
              value={formData.planName}
              onChange={(e) => setFormData({ ...formData, planName: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Plan Type *
              </label>
              <select
                required
                value={formData.planType}
                onChange={(e) => setFormData({ ...formData, planType: e.target.value as any })}
                className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
              >
                {Object.values(CarePlanType).map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
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
                {Object.values(CarePlanStatus).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Start Date *
              </label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Goals *
            </label>
            <textarea
              required
              rows={3}
              value={formData.goals}
              onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Interventions *
            </label>
            <textarea
              required
              rows={3}
              value={formData.interventions}
              onChange={(e) => setFormData({ ...formData, interventions: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Evaluation
            </label>
            <textarea
              rows={3}
              value={formData.evaluation}
              onChange={(e) => setFormData({ ...formData, evaluation: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="px-4 py-2"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white"
            >
              {loading ? 'Saving...' : editingCarePlan ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
