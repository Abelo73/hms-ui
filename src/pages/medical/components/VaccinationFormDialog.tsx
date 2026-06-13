import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { vaccinationsService, type CreateVaccinationRequest, type UpdateVaccinationRequest, type Vaccination } from '@/services/api/vaccinationsService';
import { toast } from 'sonner';

interface VaccinationFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingVaccination?: Vaccination | null;
  patientId?: string | null;
}

export function VaccinationFormDialog({ isOpen, onClose, onSuccess, editingVaccination, patientId }: VaccinationFormDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateVaccinationRequest>({
    patientId: patientId || '',
    vaccineName: '',
    vaccineType: '',
    administrationDate: '',
    doseNumber: 1,
    lotNumber: '',
    administeringProviderId: '',
    nextDueDate: '',
    notes: '',
  });

  useEffect(() => {
    if (editingVaccination) {
      setFormData({
        patientId: editingVaccination.patientId,
        vaccineName: editingVaccination.vaccineName,
        vaccineType: editingVaccination.vaccineType,
        administrationDate: editingVaccination.administrationDate,
        doseNumber: editingVaccination.doseNumber,
        lotNumber: editingVaccination.lotNumber,
        administeringProviderId: editingVaccination.administeringProviderId,
        nextDueDate: editingVaccination.nextDueDate,
        notes: editingVaccination.notes,
      });
    } else if (patientId) {
      setFormData(prev => ({ ...prev, patientId }));
    }
  }, [editingVaccination, patientId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingVaccination) {
        const updateData: UpdateVaccinationRequest = {
          vaccineName: formData.vaccineName,
          vaccineType: formData.vaccineType,
          administrationDate: formData.administrationDate,
          doseNumber: formData.doseNumber,
          lotNumber: formData.lotNumber,
          administeringProviderId: formData.administeringProviderId,
          nextDueDate: formData.nextDueDate,
          notes: formData.notes,
        };
        await vaccinationsService.updateVaccination(editingVaccination.id, updateData);
        toast.success('Vaccination updated successfully');
      } else {
        await vaccinationsService.createVaccination(formData);
        toast.success('Vaccination created successfully');
      }
      onSuccess();
      onClose();
      setFormData({
        patientId: patientId || '',
        vaccineName: '',
        vaccineType: '',
        administrationDate: '',
        doseNumber: 1,
        lotNumber: '',
        administeringProviderId: '',
        nextDueDate: '',
        notes: '',
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save vaccination');
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
            {editingVaccination ? 'Edit Vaccination' : 'Add New Vaccination'}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Vaccine Name *</label>
              <input
                type="text"
                value={formData.vaccineName}
                onChange={(e) => setFormData({ ...formData, vaccineName: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Vaccine Type</label>
              <input
                type="text"
                value={formData.vaccineType}
                onChange={(e) => setFormData({ ...formData, vaccineType: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Administration Date *</label>
              <input
                type="date"
                value={formData.administrationDate}
                onChange={(e) => setFormData({ ...formData, administrationDate: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Dose Number</label>
              <input
                type="number"
                value={formData.doseNumber}
                onChange={(e) => setFormData({ ...formData, doseNumber: parseInt(e.target.value) || 1 })}
                min="1"
                className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Lot Number</label>
              <input
                type="text"
                value={formData.lotNumber}
                onChange={(e) => setFormData({ ...formData, lotNumber: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Next Due Date</label>
              <input
                type="date"
                value={formData.nextDueDate}
                onChange={(e) => setFormData({ ...formData, nextDueDate: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Administering Provider ID</label>
            <input
              type="text"
              value={formData.administeringProviderId}
              onChange={(e) => setFormData({ ...formData, administeringProviderId: e.target.value })}
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
              {loading ? 'Saving...' : editingVaccination ? 'Update Vaccination' : 'Create Vaccination'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
