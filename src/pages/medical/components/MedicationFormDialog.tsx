import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { medicationsService, type CreateMedicationRequest, type UpdateMedicationRequest, type Medication } from '@/services/api/medicationsService';
import { MedicationRoute, MedicationStatus } from '@/types/medical';
import { toast } from 'sonner';

interface MedicationFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingMedication?: Medication | null;
  patientId?: string | null;
}

export function MedicationFormDialog({ isOpen, onClose, onSuccess, editingMedication, patientId }: MedicationFormDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateMedicationRequest>({
    patientId: patientId || '',
    medicationName: '',
    genericName: '',
    dosage: '',
    frequency: '',
    route: MedicationRoute.ORAL,
    startDate: '',
    endDate: '',
    prescribingPhysicianId: '',
    status: MedicationStatus.ACTIVE,
    notes: '' });

  useEffect(() => {
    if (editingMedication) {
      setFormData({
        patientId: editingMedication.patientId,
        medicationName: editingMedication.medicationName,
        genericName: editingMedication.genericName,
        dosage: editingMedication.dosage,
        frequency: editingMedication.frequency,
        route: editingMedication.route,
        startDate: editingMedication.startDate,
        endDate: editingMedication.endDate,
        prescribingPhysicianId: editingMedication.prescribingPhysicianId,
        status: editingMedication.status,
        notes: editingMedication.notes });
    } else if (patientId) {
      setFormData(prev => ({ ...prev, patientId }));
    }
  }, [editingMedication, patientId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingMedication) {
        const updateData: UpdateMedicationRequest = {
          medicationName: formData.medicationName,
          genericName: formData.genericName,
          dosage: formData.dosage,
          frequency: formData.frequency,
          route: formData.route,
          startDate: formData.startDate,
          endDate: formData.endDate,
          prescribingPhysicianId: formData.prescribingPhysicianId,
          status: formData.status,
          notes: formData.notes };
        await medicationsService.updateMedication(editingMedication.id, updateData);
        toast.success('Medication updated successfully');
      } else {
        await medicationsService.createMedication(formData);
        toast.success('Medication created successfully');
      }
      onSuccess();
      onClose();
      setFormData({
        patientId: patientId || '',
        medicationName: '',
        genericName: '',
        dosage: '',
        frequency: '',
        route: MedicationRoute.ORAL,
        startDate: '',
        endDate: '',
        prescribingPhysicianId: '',
        status: MedicationStatus.ACTIVE,
        notes: '' });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save medication');
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
            {editingMedication ? 'Edit Medication' : 'Add New Medication'}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Medication Name *</label>
              <input
                type="text"
                value={formData.medicationName}
                onChange={(e) => setFormData({ ...formData, medicationName: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Generic Name</label>
              <input
                type="text"
                value={formData.genericName}
                onChange={(e) => setFormData({ ...formData, genericName: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Dosage</label>
              <input
                type="text"
                value={formData.dosage}
                onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Frequency</label>
              <input
                type="text"
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Route</label>
              <select
                value={formData.route}
                onChange={(e) => setFormData({ ...formData, route: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
              >
                <option value={MedicationRoute.ORAL}>Oral</option>
                <option value={MedicationRoute.INTRAVENOUS}>Intravenous</option>
                <option value={MedicationRoute.INTRAMUSCULAR}>Intramuscular</option>
                <option value={MedicationRoute.TOPICAL}>Topical</option>
                <option value={MedicationRoute.INHALATION}>Inhalation</option>
                <option value={MedicationRoute.SUBCUTANEOUS}>Subcutaneous</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Start Date</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">End Date</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Prescribing Physician ID</label>
              <input
                type="text"
                value={formData.prescribingPhysicianId}
                onChange={(e) => setFormData({ ...formData, prescribingPhysicianId: e.target.value })}
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
                <option value={MedicationStatus.ACTIVE}>Active</option>
                <option value={MedicationStatus.DISCONTINUED}>Discontinued</option>
                <option value={MedicationStatus.COMPLETED}>Completed</option>
                <option value={MedicationStatus.ON_HOLD}>On Hold</option>
              </select>
            </div>
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
              {loading ? 'Saving...' : editingMedication ? 'Update Medication' : 'Create Medication'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
