import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Plus, User, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { nursingShiftsService, type NursingShift } from '@/services/api/nursingShiftsService';
import { type Patient } from '@/services/api/patientsService';
import { NursingShiftsTable } from './components/NursingShiftsTable';
import { NursingShiftFormDialog } from './components/NursingShiftFormDialog';
import { PatientListCard } from '@/components/nursing/PatientListCard';

export function NursingShiftsPage() {
  const [shifts, setShifts] = useState<NursingShift[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<NursingShift | null>(null);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 5,
    totalPages: 0,
    totalElements: 0,
  });

  useEffect(() => {
    loadShifts();
  }, [pagination.page, selectedPatientId]);

  const loadShifts = async () => {
    setLoading(true);
    try {
      if (!selectedPatientId) {
        setShifts([]);
        setPagination({ page: 0, size: 5, totalPages: 0, totalElements: 0 });
        return;
      }

      const data = await nursingShiftsService.searchNursingShifts(
        '',
        pagination.page,
        pagination.size
      );

      setShifts(data.content);
      setPagination({
        page: data.number,
        size: data.size,
        totalPages: data.totalPages,
        totalElements: data.totalElements,
      });
    } catch (error) {
      console.error('Error loading nursing shifts:', error);
      toast.error('Failed to load nursing shifts');
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
    setShifts([]);
    setPagination({ page: 0, size: 5, totalPages: 0, totalElements: 0 });
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingShift(null);
  };

  const handleEdit = (shift: NursingShift) => {
    setEditingShift(shift);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this nursing shift?')) {
      return;
    }

    try {
      await nursingShiftsService.deleteNursingShift(id);
      toast.success('Nursing shift deleted successfully');
      loadShifts();
    } catch (error) {
      console.error('Error deleting nursing shift:', error);
      toast.error('Failed to delete nursing shift');
    }
  };

  const handlePageChange = (newPage: number) => {
    setPagination({ ...pagination, page: newPage });
  };

  return (
    <MainLayout
      pageTitle="Nursing Shifts"
      pageAction={selectedPatient && (
        <Button size="sm" className="bg-zinc-900 hover:bg-zinc-800 text-white shadow-sm" onClick={() => setIsFormOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Shift
        </Button>
      )}
    >
      {selectedPatient ? (
        <>
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-zinc-200 mb-6">
            <div className="w-8 h-8 bg-zinc-100 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-zinc-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-zinc-900 text-sm">
                {selectedPatient.firstName} {selectedPatient.lastName}
              </p>
              <p className="text-xs text-zinc-500">{selectedPatient.medicalRecordNumber}</p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClearPatient}
              className="h-7 w-7 p-0 flex-shrink-0 hover:bg-zinc-100"
            >
              <X className="w-3.5 h-3.5" />
            </Button>
          </div>

          <NursingShiftsTable
            shifts={shifts}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            pagination={pagination}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        <PatientListCard
          onPatientSelect={handlePatientSelect}
          title="Nursing Shifts"
          subtitle="Select a patient to view and manage their nursing shifts"
        />
      )}

      <NursingShiftFormDialog
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSuccess={loadShifts}
        editingShift={editingShift}
        nurseId={selectedPatientId}
      />
    </MainLayout>
  );
}
