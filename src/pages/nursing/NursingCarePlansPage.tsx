import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Plus, User, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { nursingCarePlansService, type NursingCarePlan } from '@/services/api/nursingCarePlansService';
import { type Patient } from '@/services/api/patientsService';
import { NursingCarePlansTable } from './components/NursingCarePlansTable';
import { NursingCarePlanFormDialog } from './components/NursingCarePlanFormDialog';
import { PatientListCard } from '@/components/nursing/PatientListCard';

export function NursingCarePlansPage() {
  const [carePlans, setCarePlans] = useState<NursingCarePlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCarePlan, setEditingCarePlan] = useState<NursingCarePlan | null>(null);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 5,
    totalPages: 0,
    totalElements: 0,
  });

  useEffect(() => {
    loadCarePlans();
  }, [pagination.page, selectedPatientId]);

  const loadCarePlans = async () => {
    setLoading(true);
    try {
      if (!selectedPatientId) {
        setCarePlans([]);
        setPagination({ page: 0, size: 5, totalPages: 0, totalElements: 0 });
        return;
      }

      const data = await nursingCarePlansService.getNursingCarePlansByPatientIdPaginated(
        selectedPatientId,
        pagination.page,
        pagination.size
      );

      setCarePlans(data.content);
      setPagination({
        page: data.number,
        size: data.size,
        totalPages: data.totalPages,
        totalElements: data.totalElements,
      });
    } catch (error) {
      console.error('Error loading care plans:', error);
      toast.error('Failed to load care plans');
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
    setCarePlans([]);
    setPagination({ page: 0, size: 5, totalPages: 0, totalElements: 0 });
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingCarePlan(null);
  };

  const handleEdit = (plan: NursingCarePlan) => {
    setEditingCarePlan(plan);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this care plan?')) {
      return;
    }

    try {
      await nursingCarePlansService.deleteNursingCarePlan(id);
      toast.success('Care plan deleted successfully');
      loadCarePlans();
    } catch (error) {
      console.error('Error deleting care plan:', error);
      toast.error('Failed to delete care plan');
    }
  };

  const handlePageChange = (newPage: number) => {
    setPagination({ ...pagination, page: newPage });
  };

  return (
    <MainLayout
      pageTitle="Nursing Care Plans"
      pageAction={selectedPatient && (
        <Button size="sm" className="bg-zinc-900 hover:bg-zinc-800 text-white shadow-sm" onClick={() => setIsFormOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Care Plan
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

          <NursingCarePlansTable
            carePlans={carePlans}
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
          title="Nursing Care Plans"
          subtitle="Select a patient to view and manage their care plans"
        />
      )}

      <NursingCarePlanFormDialog
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSuccess={loadCarePlans}
        editingCarePlan={editingCarePlan}
        patientId={selectedPatientId}
      />
    </MainLayout>
  );
}
