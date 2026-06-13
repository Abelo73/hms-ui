import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Search, Plus, FileText, User, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { diagnosesService, type Diagnosis, type PaginatedResponse } from '@/services/api/diagnosesService';
import { medicalRecordsService, type MedicalRecord } from '@/services/api/medicalRecordsService';
import { patientsService, type Patient } from '@/services/api/patientsService';
import { DiagnosesTable } from './components/DiagnosesTable';
import { DiagnosisFormDialog } from './components/DiagnosisFormDialog';

export function DiagnosesPage() {
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDiagnosis, setEditingDiagnosis] = useState<Diagnosis | null>(null);
  const [selectedMedicalRecordId, setSelectedMedicalRecordId] = useState<string | null>(null);
  const [selectedMedicalRecord, setSelectedMedicalRecord] = useState<MedicalRecord | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [medicalRecordSearchTerm, setMedicalRecordSearchTerm] = useState('');
  const [medicalRecordSearchResults, setMedicalRecordSearchResults] = useState<MedicalRecord[]>([]);
  const [searchingMedicalRecord, setSearchingMedicalRecord] = useState(false);
  const [showMedicalRecordSearchResults, setShowMedicalRecordSearchResults] = useState(false);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 5,
    totalPages: 0,
    totalElements: 0,
  });

  useEffect(() => {
    loadDiagnoses();
  }, [pagination.page, searchTerm, selectedMedicalRecordId]);

  const loadDiagnoses = async () => {
    setLoading(true);
    try {
      if (!selectedMedicalRecordId) {
        setDiagnoses([]);
        setPagination({ page: 0, size: 5, totalPages: 0, totalElements: 0 });
        return;
      }

      const data = searchTerm
        ? await diagnosesService.searchMedicalRecordDiagnoses(
            selectedMedicalRecordId,
            searchTerm,
            pagination.page,
            pagination.size
          )
        : await diagnosesService.getDiagnosesByMedicalRecordIdPaginated(
            selectedMedicalRecordId,
            pagination.page,
            pagination.size
          );

      setDiagnoses(data.content);
      setPagination({
        page: data.number,
        size: data.size,
        totalPages: data.totalPages,
        totalElements: data.totalElements,
      });
    } catch (error) {
      console.error('Error loading diagnoses:', error);
      toast.error('Failed to load diagnoses');
    } finally {
      setLoading(false);
    }
  };

  const handleMedicalRecordSearch = async (term: string) => {
    setMedicalRecordSearchTerm(term);
    if (term.length < 2) {
      setMedicalRecordSearchResults([]);
      setShowMedicalRecordSearchResults(false);
      return;
    }

    setSearchingMedicalRecord(true);
    try {
      // Search patients first, then get their medical records
      const patientResults = await patientsService.searchPatients(term);
      const patientsArray = Array.isArray(patientResults) ? patientResults : patientResults.content || [];
      
      // Get medical records for each patient
      const allMedicalRecords: MedicalRecord[] = [];
      for (const patient of patientsArray.slice(0, 5)) {
        try {
          const records = await medicalRecordsService.getMedicalRecordsByPatientId(patient.id);
          allMedicalRecords.push(...records);
        } catch (error) {
          console.error('Error fetching medical records for patient:', error);
        }
      }
      
      setMedicalRecordSearchResults(allMedicalRecords.slice(0, 5));
      setShowMedicalRecordSearchResults(true);
    } catch (error) {
      console.error('Error searching medical records:', error);
      setMedicalRecordSearchResults([]);
    } finally {
      setSearchingMedicalRecord(false);
    }
  };

  const handleMedicalRecordSelect = async (medicalRecord: MedicalRecord) => {
    setSelectedMedicalRecord(medicalRecord);
    setSelectedMedicalRecordId(medicalRecord.id);
    setMedicalRecordSearchTerm('');
    setMedicalRecordSearchResults([]);
    setShowMedicalRecordSearchResults(false);
    setPagination({ page: 0, size: 5, totalPages: 0, totalElements: 0 });
    
    // Fetch patient information for the selected medical record
    try {
      const patient = await patientsService.getPatientById(medicalRecord.patientId);
      setSelectedPatient(patient);
    } catch (error) {
      console.error('Error fetching patient:', error);
      setSelectedPatient(null);
    }
  };

  const handleClearMedicalRecord = () => {
    setSelectedMedicalRecord(null);
    setSelectedMedicalRecordId(null);
    setSelectedPatient(null);
    setDiagnoses([]);
    setPagination({ page: 0, size: 5, totalPages: 0, totalElements: 0 });
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingDiagnosis(null);
  };

  const handleEdit = (diagnosis: Diagnosis) => {
    setEditingDiagnosis(diagnosis);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this diagnosis?')) {
      return;
    }

    try {
      await diagnosesService.deleteDiagnosis(id);
      toast.success('Diagnosis deleted successfully');
      loadDiagnoses();
    } catch (error) {
      console.error('Error deleting diagnosis:', error);
      toast.error('Failed to delete diagnosis');
    }
  };

  const handlePageChange = (newPage: number) => {
    setPagination({ ...pagination, page: newPage });
  };

  return (
    <MainLayout
      title="Diagnoses"
      subtitle="Manage patient diagnoses and clinical conditions"
    >
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1">
          {selectedMedicalRecord ? (
            <div className="flex items-center gap-2 bg-zinc-50 px-3 py-2 rounded-lg border border-zinc-200">
              <div className="w-8 h-8 bg-zinc-200 rounded-full flex items-center justify-center flex-shrink-0">
                <FileText className="w-4 h-4 text-zinc-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-zinc-900 text-sm">{selectedMedicalRecord.title}</p>
                <p className="text-xs text-zinc-500">{selectedMedicalRecord.recordDate}</p>
              </div>
              {selectedPatient && (
                <div className="flex items-center gap-2 text-xs text-zinc-600">
                  <User className="w-3 h-3" />
                  <span>{selectedPatient.firstName} {selectedPatient.lastName}</span>
                </div>
              )}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClearMedicalRecord}
                className="h-7 w-7 p-0 flex-shrink-0 hover:bg-zinc-200"
              >
                <X className="w-3.5 h-3.5" />
              </Button>
            </div>
          ) : (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                value={medicalRecordSearchTerm}
                onChange={(e) => handleMedicalRecordSearch(e.target.value)}
                placeholder="Search medical record to manage diagnoses..."
                className="w-full pl-10 pr-10 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
                autoFocus
              />
              {searchingMedicalRecord && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin" />
                </div>
              )}
              {showMedicalRecordSearchResults && medicalRecordSearchResults.length > 0 && (
                <div className="absolute z-[9999] left-0 right-0 mt-2 bg-white border border-zinc-200 rounded-lg shadow-xl max-h-80 overflow-y-auto">
                  <div className="p-2 border-b border-zinc-100 bg-zinc-50">
                    <p className="text-xs font-medium text-zinc-500">Recommended Medical Records</p>
                  </div>
                  {medicalRecordSearchResults.map((record) => (
                    <button
                      key={record.id}
                      type="button"
                      onClick={() => handleMedicalRecordSelect(record)}
                      className="w-full px-4 py-3 text-left hover:bg-zinc-50 border-b border-zinc-100 last:border-b-0 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-zinc-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5 text-zinc-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-zinc-900 text-sm">{record.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded">
                              {record.recordType}
                            </span>
                            <span className="text-xs text-zinc-500">
                              {record.recordDate}
                            </span>
                          </div>
                        </div>
                        <div className="text-zinc-400">
                          <Search className="w-4 h-4" />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              {showMedicalRecordSearchResults && medicalRecordSearchTerm.length >= 2 && medicalRecordSearchResults.length === 0 && !searchingMedicalRecord && (
                <div className="absolute z-[9999] left-0 right-0 mt-2 bg-white border border-zinc-200 rounded-lg shadow-lg p-6 text-center">
                  <FileText className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
                  <p className="text-sm text-zinc-600">No medical records found matching "{medicalRecordSearchTerm}"</p>
                  <p className="text-xs text-zinc-500 mt-1">Try searching by patient name or medical record title</p>
                </div>
              )}
            </div>
          )}
        </div>
        {selectedMedicalRecord && (
          <Button size="sm" className="h-8 px-4 bg-zinc-900 hover:bg-zinc-800 text-white shadow-sm" onClick={() => setIsFormOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Diagnosis
          </Button>
        )}
      </div>

      {selectedMedicalRecord ? (
        <DiagnosesTable
          diagnoses={diagnoses}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      ) : (
        <div className="text-center py-16 bg-zinc-50 rounded-lg border border-zinc-200">
          <FileText className="w-16 h-16 text-zinc-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-zinc-900 mb-2">No Medical Record Selected</h3>
          <p className="text-zinc-600 mb-4">Search for a medical record above to view and manage its diagnoses</p>
        </div>
      )}

      <DiagnosisFormDialog
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSuccess={loadDiagnoses}
        editingDiagnosis={editingDiagnosis}
        medicalRecordId={selectedMedicalRecordId}
      />
    </MainLayout>
  );
}
