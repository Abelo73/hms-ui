import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Plus, User, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { nursingNotesService, type NursingNote } from '@/services/api/nursingNotesService';
import { type Patient } from '@/services/api/patientsService';
import { NursingNotesTable } from './components/NursingNotesTable';
import { NursingNoteFormDialog } from './components/NursingNoteFormDialog';
import { PatientListCard } from '@/components/nursing/PatientListCard';

export function NursingNotesPage() {
  const [notes, setNotes] = useState<NursingNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<NursingNote | null>(null);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 5,
    totalPages: 0,
    totalElements: 0,
  });

  useEffect(() => {
    loadNotes();
  }, [pagination.page, selectedPatientId]);

  const loadNotes = async () => {
    setLoading(true);
    try {
      if (!selectedPatientId) {
        setNotes([]);
        setPagination({ page: 0, size: 5, totalPages: 0, totalElements: 0 });
        return;
      }

      const data = await nursingNotesService.getNursingNotesByPatientIdPaginated(
        selectedPatientId,
        pagination.page,
        pagination.size
      );

      setNotes(data.content);
      setPagination({
        page: data.number,
        size: data.size,
        totalPages: data.totalPages,
        totalElements: data.totalElements,
      });
    } catch (error) {
      console.error('Error loading nursing notes:', error);
      toast.error('Failed to load nursing notes');
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
    setNotes([]);
    setPagination({ page: 0, size: 5, totalPages: 0, totalElements: 0 });
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingNote(null);
  };

  const handleEdit = (note: NursingNote) => {
    setEditingNote(note);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this nursing note?')) {
      return;
    }

    try {
      await nursingNotesService.deleteNursingNote(id);
      toast.success('Nursing note deleted successfully');
      loadNotes();
    } catch (error) {
      console.error('Error deleting nursing note:', error);
      toast.error('Failed to delete nursing note');
    }
  };

  const handlePageChange = (newPage: number) => {
    setPagination({ ...pagination, page: newPage });
  };

  return (
    <MainLayout
      pageTitle="Nursing Notes"
      pageAction={selectedPatient && (
        <Button size="sm" className="bg-zinc-900 hover:bg-zinc-800 text-white shadow-sm" onClick={() => setIsFormOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Note
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

          <NursingNotesTable
            notes={notes}
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
          title="Nursing Notes"
          subtitle="Select a patient to view and manage their nursing notes"
        />
      )}

      <NursingNoteFormDialog
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSuccess={loadNotes}
        editingNote={editingNote}
        patientId={selectedPatientId}
      />
    </MainLayout>
  );
}
