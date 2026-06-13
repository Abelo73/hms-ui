import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { medicationAdministrationsService, type MedicationAdministration, type CreateMedicationAdministrationRequest, type UpdateMedicationAdministrationRequest } from '@/services/api/medicationAdministrationsService';
import { MedicationRoute, AdministrationStatus } from '@/types/nursing';

interface MedicationAdministrationFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingAdministration: MedicationAdministration | null;
  patientId: string | null;
}

export function MedicationAdministrationFormDialog({
  isOpen,
  onClose,
  onSuccess,
  editingAdministration,
  patientId,
}: MedicationAdministrationFormDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    medicationId: '',
    administrationDate: '',
    administrationTime: '',
    medicationRoute: MedicationRoute.ORAL,
    dosage: '',
    frequency: '',
    status: AdministrationStatus.SCHEDULED,
    administeredBy: '',
    notes: '',
  });

  useEffect(() => {
    if (editingAdministration) {
      setFormData({
        medicationId: editingAdministration.medicationId,
        administrationDate: editingAdministration.administrationDate,
        administrationTime: editingAdministration.administrationTime,
        medicationRoute: editingAdministration.medicationRoute as any,
        dosage: editingAdministration.dosage,
        frequency: editingAdministration.frequency,
        status: editingAdministration.status as any,
        administeredBy: editingAdministration.administeredBy || '',
        notes: editingAdministration.notes || '',
      });
    } else {
      const now = new Date();
      setFormData({
        medicationId: '',
        administrationDate: now.toISOString().split('T')[0],
        administrationTime: now.toTimeString().slice(0, 5),
        medicationRoute: MedicationRoute.ORAL,
        dosage: '',
        frequency: '',
        status: AdministrationStatus.SCHEDULED,
        administeredBy: '',
        notes: '',
      });
    }
  }, [editingAdministration, isOpen]);

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
        medicationId: formData.medicationId,
        administrationDate: formData.administrationDate,
        administrationTime: formData.administrationTime,
        medicationRoute: formData.medicationRoute,
        dosage: formData.dosage,
        frequency: formData.frequency,
        status: formData.status,
        administeredBy: formData.administeredBy || undefined,
        notes: formData.notes || undefined,
      };

      if (editingAdministration) {
        await medicationAdministrationsService.updateMedicationAdministration(editingAdministration.id, request as UpdateMedicationAdministrationRequest);
        toast.success('Medication administration updated successfully');
      } else {
        await medicationAdministrationsService.createMedicationAdministration(request as CreateMedicationAdministrationRequest);
        toast.success('Medication administration created successfully');
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving medication administration:', error);
      toast.error('Failed to save medication administration');
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
            {editingAdministration ? 'Edit Medication Administration' : 'New Medication Administration'}
          </h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Medication ID *
            </label>
            <input
              type="text"
              required
              value={formData.medicationId}
              onChange={(e) => setFormData({ ...formData, medicationId: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Administration Date *
              </label>
              <input
                type="date"
                required
                value={formData.administrationDate}
                onChange={(e) => setFormData({ ...formData, administrationDate: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Administration Time *
              </label>
              <input
                type="time"
                required
                value={formData.administrationTime}
                onChange={(e) => setFormData({ ...formData, administrationTime: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Route *
              </label>
              <select
                required
                value={formData.medicationRoute}
                onChange={(e) => setFormData({ ...formData, medicationRoute: e.target.value as any })}
                className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
              >
                {Object.values(MedicationRoute).map((route) => (
                  <option key={route} value={route}>{route}</option>
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
                {Object.values(AdministrationStatus).map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Dosage *
              </label>
              <input
                type="text"
                required
                value={formData.dosage}
                onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Frequency *
              </label>
              <input
                type="text"
                required
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Administered By
            </label>
            <input
              type="text"
              value={formData.administeredBy}
              onChange={(e) => setFormData({ ...formData, administeredBy: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Notes</label>
            <textarea
              rows={3}
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
              {loading ? 'Saving...' : editingAdministration ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
