import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Search, Plus, AlertTriangle, User, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { incidentReportsService, type IncidentReport } from '@/services/api/incidentReportsService';
import { patientsService, type Patient } from '@/services/api/patientsService';
import { IncidentReportsTable } from './components/IncidentReportsTable';
import { IncidentReportFormDialog } from './components/IncidentReportFormDialog';

export function IncidentReportsPage() {
  const [reports, setReports] = useState<IncidentReport[]>([]);
  const [searchTerm, _setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingReport, setEditingReport] = useState<IncidentReport | null>(null);
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
    totalElements: 0
  });

  useEffect(() => {
    loadReports();
  }, [pagination.page, searchTerm, selectedPatientId]);

  const loadReports = async () => {
    setLoading(true);
    try {
      if (!selectedPatientId) {
        setReports([]);
        setPagination({ page: 0, size: 5, totalPages: 0, totalElements: 0 });
        return;
      }

      const data = searchTerm
        ? await incidentReportsService.searchIncidentReports(
          searchTerm,
          pagination.page,
          pagination.size
        )
        : await incidentReportsService.getIncidentReportsByPatientIdPaginated(
          selectedPatientId,
          pagination.page,
          pagination.size
        );

      setReports(data.content);
      setPagination({
        page: data.number,
        size: data.size,
        totalPages: data.totalPages,
        totalElements: data.totalElements
      });
    } catch (error) {
      console.error('Error loading incident reports:', error);
      toast.error('Failed to load incident reports');
    } finally {
      setLoading(false);
    }
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
      const patientsArray = Array.isArray(results) ? results : (results as any).content ?? [];
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
    setPagination({ page: 0, size: 5, totalPages: 0, totalElements: 0 });
  };

  const handleClearPatient = () => {
    setSelectedPatient(null);
    setSelectedPatientId(null);
    setReports([]);
    setPagination({ page: 0, size: 5, totalPages: 0, totalElements: 0 });
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingReport(null);
  };

  const handleEdit = (report: IncidentReport) => {
    setEditingReport(report);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this incident report?')) {
      return;
    }

    try {
      await incidentReportsService.deleteIncidentReport(id);
      toast.success('Incident report deleted successfully');
      loadReports();
    } catch (error) {
      console.error('Error deleting incident report:', error);
      toast.error('Failed to delete incident report');
    }
  };

  const handlePageChange = (newPage: number) => {
    setPagination({ ...pagination, page: newPage });
  };

  return (
    <MainLayout
      title="Incident Reports"
      subtitle="Track and manage safety incidents and adverse events"
    >
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1">
          {selectedPatient ? (
            <div className="flex items-center gap-2 bg-zinc-50 px-3 py-2 rounded-lg border border-zinc-200">
              <div className="w-8 h-8 bg-zinc-200 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-zinc-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-zinc-900 text-xs">
                  {selectedPatient.firstName} {selectedPatient.lastName}
                </p>
                <p className="text-xs text-zinc-500">{selectedPatient.medicalRecordNumber}</p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClearPatient}
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
                value={patientSearchTerm}
                onChange={(e) => handlePatientSearch(e.target.value)}
                placeholder="Search patient to manage incident reports..."
                className="w-full pl-10 pr-10 py-2.5 border border-zinc-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
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
            </div>
          )}
        </div>
        {selectedPatient && (
          <Button size="sm" className="h-10 px-4 bg-zinc-900 hover:bg-zinc-800 text-white shadow-sm" onClick={() => setIsFormOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Incident
          </Button>
        )}
      </div>

      {selectedPatient ? (
        <IncidentReportsTable
          reports={reports}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      ) : (
        <div className="text-center py-16 bg-zinc-50 rounded-lg border border-zinc-200">
          <AlertTriangle className="w-16 h-16 text-zinc-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-zinc-900 mb-2">No Patient Selected</h3>
          <p className="text-zinc-600 mb-4">Search for a patient above to view and manage their incident reports</p>
        </div>
      )}

      <IncidentReportFormDialog
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSuccess={loadReports}
        editingReport={editingReport}
        patientId={selectedPatientId}
      />
    </MainLayout>
  );
}
