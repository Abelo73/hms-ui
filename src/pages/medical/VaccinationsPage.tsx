import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Search, Plus, Syringe, User, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { vaccinationsService, type Vaccination, type PaginatedResponse } from '@/services/api/vaccinationsService';
import { patientsService, type Patient } from '@/services/api/patientsService';
import { VaccinationsTable } from './components/VaccinationsTable';
import { VaccinationFormDialog } from './components/VaccinationFormDialog';

export function VaccinationsPage() {
  const [vaccinations, setVaccinations] = useState<Vaccination[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVaccination, setEditingVaccination] = useState<Vaccination | null>(null);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patientSearchTerm, setPatientSearchTerm] = useState('');
  const [patientSearchResults, setPatientSearchResults] = useState<Patient[]>([]);
  const [searchingPatient, setSearchingPatient] = useState(false);
  const [showPatientSearchResults, setShowPatientSearchResults] = useState(false);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 5,
    totalPages: 0,
    totalElements: 0,
  });

  useEffect(() => {
    loadVaccinations();
  }, [pagination.page, searchTerm, selectedPatientId]);

  const loadVaccinations = async () => {
    setLoading(true);
    try {
      if (!selectedPatientId) {
        setVaccinations([]);
        setPagination({ page: 0, size: 5, totalPages: 0, totalElements: 0 });
        return;
      }

      const data = searchTerm
        ? await vaccinationsService.searchPatientVaccinations(
            selectedPatientId,
            searchTerm,
            pagination.page,
            pagination.size
          )
        : await vaccinationsService.getVaccinationsByPatientIdPaginated(
            selectedPatientId,
            pagination.page,
            pagination.size
          );
      setVaccinations(data.content || []);
      setPagination({
        page: data.number,
        size: data.size,
        totalPages: data.totalPages,
        totalElements: data.totalElements,
      });
    } catch (error) {
      console.error('Failed to load vaccinations:', error);
      toast.error('Failed to load vaccinations');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (vaccination: Vaccination) => {
    setEditingVaccination(vaccination);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingVaccination(null);
  };

  const handlePageChange = (newPage: number) => {
    setPagination({ ...pagination, page: newPage });
  };

  const handlePatientSearch = async (term: string) => {
    setPatientSearchTerm(term);
    if (term.length < 2) {
      setPatientSearchResults([]);
      setShowPatientSearchResults(false);
      return;
    }

    setSearchingPatient(true);
    try {
      const results = await patientsService.searchPatients(term);
      const patientsArray = Array.isArray(results) ? results : results.content || [];
      setPatientSearchResults(patientsArray.slice(0, 5));
      setShowPatientSearchResults(true);
    } catch (error) {
      console.error('Error searching patients:', error);
      setPatientSearchResults([]);
    } finally {
      setSearchingPatient(false);
    }
  };

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
    setSelectedPatientId(patient.id);
    setPatientSearchTerm('');
    setPatientSearchResults([]);
    setShowPatientSearchResults(false);
  };

  const handleClearPatient = () => {
    setSelectedPatient(null);
    setSelectedPatientId(null);
    setVaccinations([]);
    setPagination({ page: 0, size: 10, totalPages: 0, totalElements: 0 });
  };

  return (
    <MainLayout
      pageTitle="Vaccinations Management"
      pageAction={
        <div className="flex items-center gap-2 overflow-visible">
          <div className="relative w-96 overflow-visible">
            {selectedPatient ? (
              <div className="flex items-center justify-between p-3 border border-zinc-200 rounded-md bg-zinc-50">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-8 h-8 bg-zinc-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-zinc-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-zinc-900 text-sm truncate">
                      {selectedPatient.firstName} {selectedPatient.lastName}
                    </p>
                    <p className="text-xs text-zinc-500 truncate">
                      MRN: {selectedPatient.medicalRecordNumber} • {selectedPatient.phoneNumber}
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleClearPatient}
                  className="h-8 w-8 p-0 flex-shrink-0 hover:bg-zinc-200"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  value={patientSearchTerm}
                  onChange={(e) => handlePatientSearch(e.target.value)}
                  placeholder="Search patient to manage vaccinations..."
                  className="w-full pl-10 pr-10 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
                  autoFocus
                />
                {searchingPatient && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin" />
                  </div>
                )}
                {showPatientSearchResults && patientSearchResults.length > 0 && (
                  <div className="absolute z-[9999] left-0 right-0 mt-2 bg-white border border-zinc-200 rounded-lg shadow-xl max-h-80 overflow-y-auto">
                    <div className="p-2 border-b border-zinc-100 bg-zinc-50">
                      <p className="text-xs font-medium text-zinc-500">Recommended Patients</p>
                    </div>
                    {patientSearchResults.map((patient) => (
                      <button
                        key={patient.id}
                        type="button"
                        onClick={() => handlePatientSelect(patient)}
                        className="w-full px-4 py-3 text-left hover:bg-zinc-50 border-b border-zinc-100 last:border-b-0 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="w-5 h-5 text-zinc-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-zinc-900 text-sm">
                              {patient.firstName} {patient.lastName}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded">
                                {patient.medicalRecordNumber}
                              </span>
                              <span className="text-xs text-zinc-500">
                                {patient.phoneNumber}
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
                {showPatientSearchResults && patientSearchTerm.length >= 2 && patientSearchResults.length === 0 && !searchingPatient && (
                  <div className="absolute z-[9999] left-0 right-0 mt-2 bg-white border border-zinc-200 rounded-lg shadow-lg p-6 text-center">
                    <User className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
                    <p className="text-sm text-zinc-600">No patients found matching "{patientSearchTerm}"</p>
                    <p className="text-xs text-zinc-500 mt-1">Try searching by name, phone, email, or MRN</p>
                  </div>
                )}
              </div>
            )}
          </div>
          {selectedPatient && (
            <Button size="sm" className="h-8 px-4 bg-zinc-900 hover:bg-zinc-800 text-white shadow-sm" onClick={() => setIsFormOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Vaccination
            </Button>
          )}
        </div>
      }
    >
      <div className="space-y-4">
        {searchTerm && (
          <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-sm text-zinc-600">
              <Search className="w-4 h-4" />
              <span>Showing results for "{searchTerm}"</span>
              <Button variant="outline" size="sm" className="mt-4 h-8 px-3" onClick={() => setSearchTerm('')}>
                Reset search
              </Button>
            </div>
          </div>
        )}

        {!selectedPatientId ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-zinc-400" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-900 mb-2">Search for a Patient</h3>
            <p className="text-zinc-600 max-w-md mx-auto">
              Enter a patient name, phone number, email, or medical record number above to view and manage their vaccinations.
            </p>
          </div>
        ) : (
          <>
            <div className="text-[12px] font-medium text-zinc-500 uppercase tracking-wider px-1">
              Vaccinations ({pagination.totalElements} total)
            </div>
            <VaccinationsTable
              vaccinations={vaccinations}
              onEdit={handleEdit}
              onDelete={async (vaccination) => {
                if (!confirm(`Are you sure you want to delete this vaccination?`)) return;
                try {
                  await vaccinationsService.deleteVaccination(vaccination.id);
                  toast.success('Vaccination deleted successfully');
                  loadVaccinations();
                } catch (error) {
                  toast.error('Failed to delete vaccination');
                }
              }}
            />
          </>
        )}

        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-zinc-200 pt-4">
            <div className="text-sm text-zinc-500">
              Showing {pagination.page * pagination.size + 1} to{' '}
              {Math.min((pagination.page + 1) * pagination.size, pagination.totalElements)} of{' '}
              {pagination.totalElements}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 0}
              >
                Previous
              </Button>
              <span className="text-sm text-zinc-600">
                Page {pagination.page + 1} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages - 1}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      <VaccinationFormDialog
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSuccess={loadVaccinations}
        editingVaccination={editingVaccination}
        patientId={selectedPatientId}
      />
    </MainLayout>
  );
}
