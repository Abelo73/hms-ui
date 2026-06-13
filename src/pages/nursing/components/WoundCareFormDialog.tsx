import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { woundCareService, type WoundCare, type CreateWoundCareRequest, type UpdateWoundCareRequest } from '@/services/api/woundCareService';
import { WoundType, WoundStage, ExudateType, ExudateAmount, OdorLevel, HealingProgress } from '@/types/nursing';

interface WoundCareFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingWoundCare: WoundCare | null;
  patientId: string | null;
}

export function WoundCareFormDialog({
  isOpen,
  onClose,
  onSuccess,
  editingWoundCare,
  patientId,
}: WoundCareFormDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    woundType: WoundType.PRESSURE_ULCER,
    woundLocation: '',
    woundStage: '',
    woundSize: '',
    exudateType: '',
    exudateAmount: '',
    odorLevel: '',
    healingProgress: HealingProgress.NOT_HEALING,
    treatment: '',
    assessmentDate: '',
    assessmentTime: '',
    notes: '',
  });

  useEffect(() => {
    if (editingWoundCare) {
      setFormData({
        woundType: editingWoundCare.woundType as any,
        woundLocation: editingWoundCare.woundLocation,
        woundStage: editingWoundCare.woundStage || '',
        woundSize: editingWoundCare.woundSize,
        exudateType: editingWoundCare.exudateType || '',
        exudateAmount: editingWoundCare.exudateAmount || '',
        odorLevel: editingWoundCare.odorLevel || '',
        healingProgress: editingWoundCare.healingProgress as any,
        treatment: editingWoundCare.treatment,
        assessmentDate: editingWoundCare.assessmentDate,
        assessmentTime: editingWoundCare.assessmentTime,
        notes: editingWoundCare.notes || '',
      });
    } else {
      const now = new Date();
      setFormData({
        woundType: WoundType.PRESSURE_ULCER,
        woundLocation: '',
        woundStage: '',
        woundSize: '',
        exudateType: '',
        exudateAmount: '',
        odorLevel: '',
        healingProgress: HealingProgress.NOT_HEALING,
        treatment: '',
        assessmentDate: now.toISOString().split('T')[0],
        assessmentTime: now.toTimeString().slice(0, 5),
        notes: '',
      });
    }
  }, [editingWoundCare, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId) {
      toast.error('Patient is required');
      return;
    }

    setLoading(true);
    try {
      const request = {
        patientId,
        woundType: formData.woundType,
        woundLocation: formData.woundLocation,
        woundStage: formData.woundStage || undefined,
        woundSize: formData.woundSize,
        exudateType: formData.exudateType || undefined,
        exudateAmount: formData.exudateAmount || undefined,
        odorLevel: formData.odorLevel || undefined,
        healingProgress: formData.healingProgress,
        treatment: formData.treatment,
        assessmentDate: formData.assessmentDate,
        assessmentTime: formData.assessmentTime,
        notes: formData.notes || undefined,
      };

      if (editingWoundCare) {
        await woundCareService.updateWoundCare(editingWoundCare.id, request as UpdateWoundCareRequest);
        toast.success('Wound care record updated successfully');
      } else {
        await woundCareService.createWoundCare(request as CreateWoundCareRequest);
        toast.success('Wound care record created successfully');
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving wound care record:', error);
      toast.error('Failed to save wound care record');
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
            {editingWoundCare ? 'Edit Wound Care' : 'New Wound Care'}
          </h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Wound Type *
              </label>
              <select
                required
                value={formData.woundType}
                onChange={(e) => setFormData({ ...formData, woundType: e.target.value as any })}
                className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
              >
                {Object.values(WoundType).map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Healing Progress *
              </label>
              <select
                required
                value={formData.healingProgress}
                onChange={(e) => setFormData({ ...formData, healingProgress: e.target.value as any })}
                className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
              >
                {Object.values(HealingProgress).map((progress) => (
                  <option key={progress} value={progress}>{progress}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Wound Location *
            </label>
            <input
              type="text"
              required
              value={formData.woundLocation}
              onChange={(e) => setFormData({ ...formData, woundLocation: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Wound Stage</label>
              <select
                value={formData.woundStage}
                onChange={(e) => setFormData({ ...formData, woundStage: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
              >
                <option value="">Select Stage</option>
                {Object.values(WoundStage).map((stage) => (
                  <option key={stage} value={stage}>{stage}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Wound Size *
              </label>
              <input
                type="text"
                required
                value={formData.woundSize}
                onChange={(e) => setFormData({ ...formData, woundSize: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Exudate Type</label>
              <select
                value={formData.exudateType}
                onChange={(e) => setFormData({ ...formData, exudateType: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
              >
                <option value="">Select Type</option>
                {Object.values(ExudateType).map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Exudate Amount</label>
              <select
                value={formData.exudateAmount}
                onChange={(e) => setFormData({ ...formData, exudateAmount: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
              >
                <option value="">Select Amount</option>
                {Object.values(ExudateAmount).map((amount) => (
                  <option key={amount} value={amount}>{amount}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Odor Level</label>
              <select
                value={formData.odorLevel}
                onChange={(e) => setFormData({ ...formData, odorLevel: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
              >
                <option value="">Select Level</option>
                {Object.values(OdorLevel).map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
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
              Treatment *
            </label>
            <textarea
              required
              rows={3}
              value={formData.treatment}
              onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
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
              {loading ? 'Saving...' : editingWoundCare ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
