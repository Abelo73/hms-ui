import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Activity } from 'lucide-react';
import { toast } from 'sonner';
import { vitalSignsService, type VitalSign } from '@/services/api/vitalSignsService';
import { type Patient } from '@/services/api/patientsService';
import { VitalSignsTable } from './components/VitalSignsTable';
import { VitalSignFormDialog } from './components/VitalSignFormDialog';
import { PatientSelector } from '@/components/patients/PatientSelector';

export function VitalSignsPage() {
  const [vitalSigns, setVitalSigns] = useState<VitalSign[]>([]);
  const [searchTerm, _setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVitalSign, setEditingVitalSign] = useState<VitalSign | null>(null);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 5,
    totalPages: 0,
    totalElements: 0 });

  useEffect(() => {
    loadVitalSigns();
  }, [pagination.page, searchTerm, selectedPatientId]);

  const loadVitalSigns = async () => {
    setLoading(true);
    try {
      if (!selectedPatientId) {
        setVitalSigns([]);
        setPagination({ page: 0, size: 5, totalPages: 0, totalElements: 0 });
        return;
      }

      const data = searchTerm
        ? await vitalSignsService.searchVitalSigns(
            searchTerm,
            pagination.page,
            pagination.size
          )
        : await vitalSignsService.getVitalSignsByPatientIdPaginated(
            selectedPatientId,
            pagination.page,
            pagination.size
          );

      setVitalSigns(data.content);
      setPagination({
        page: data.number,
        size: data.size,
        totalPages: data.totalPages,
        totalElements: data.totalElements });
    } catch (error) {
      console.error('Error loading vital signs:', error);
      toast.error('Failed to load vital signs');
    } finally {
      setLoading(false);
    }
  };

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
    setSelectedPatientId(patient.id);
    setPagination({ page: 0, size: 5, totalPages: 0, totalElements: 0 });
  };

  const handleClearPatient = () => {
    setSelectedPatient(null);
    setSelectedPatientId(null);
    setVitalSigns([]);
    setPagination({ page: 0, size: 5, totalPages: 0, totalElements: 0 });
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingVitalSign(null);
  };

  const handleEdit = (vitalSign: VitalSign) => {
    setEditingVitalSign(vitalSign);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this vital sign record?')) {
      return;
    }

    try {
      await vitalSignsService.deleteVitalSign(id);
      toast.success('Vital sign deleted successfully');
      loadVitalSigns();
    } catch (error) {
      console.error('Error deleting vital sign:', error);
      toast.error('Failed to delete vital sign');
    }
  };

  const handlePageChange = (newPage: number) => {
    setPagination({ ...pagination, page: newPage });
  };

  return (
    <MainLayout
      title="Vital Signs"
      subtitle="Monitor and record patient vital signs"
    >
      <div className="space-y-6">
        <PatientSelector
          selectedPatient={selectedPatient}
          onPatientSelect={handlePatientSelect}
          onPatientClear={handleClearPatient}
          showAddButton={!!selectedPatient}
          onAddClick={() => setIsFormOpen(true)}
          addButtonText="Add Vital Sign"
        />

        {selectedPatient ? (
          <VitalSignsTable
            vitalSigns={vitalSigns}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            pagination={pagination}
            onPageChange={handlePageChange}
          />
        ) : (
          <div className="text-center py-16 bg-zinc-50 rounded-lg border border-zinc-200">
            <Activity className="w-16 h-16 text-zinc-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-zinc-900 mb-2">No Patient Selected</h3>
            <p className="text-zinc-600 mb-4">Select a patient from the list above to view and manage their vital signs</p>
          </div>
        )}
      </div>

      <VitalSignFormDialog
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSuccess={loadVitalSigns}
        editingVitalSign={editingVitalSign}
        patientId={selectedPatientId}
      />
    </MainLayout>
  );
}
