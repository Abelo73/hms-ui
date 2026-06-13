import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Search, Plus, SlidersHorizontal, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { patientsService, type Patient, type PaginatedResponse } from '@/services/api/patientsService';
import { PatientsTable } from './components/PatientsTable';
import { PatientFormDialog } from './components/PatientFormDialog';
import { PatientViewDialog } from './components/PatientViewDialog';

export function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [viewingPatient, setViewingPatient] = useState<Patient | null>(null);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 5,
    totalPages: 0,
    totalElements: 0,
  });

  useEffect(() => {
    loadPatients();
  }, [pagination.page, searchTerm]);

  const loadPatients = async () => {
    setLoading(true);
    try {
      const data = searchTerm
        ? await patientsService.searchPatientsPaginated(
            searchTerm,
            pagination.page,
            pagination.size
          )
        : await patientsService.getAllPatientsPaginated(
            pagination.page,
            pagination.size
          );
      setPatients(data.content || []);
      setPagination({
        page: data.number,
        size: data.size,
        totalPages: data.totalPages,
        totalElements: data.totalElements,
      });
    } catch (error) {
      console.error('Failed to load patients:', error);
      toast.error('Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (patient: Patient) => {
    if (!confirm(`Are you sure you want to delete ${patient.firstName} ${patient.lastName}?`)) return;
    try {
      await patientsService.deletePatient(patient.id);
      toast.success('Patient deleted successfully');
      loadPatients();
    } catch (error) {
      toast.error('Failed to delete patient');
    }
  };

  const filteredPatients = patients;

  const handleEdit = (patient: Patient) => {
    setEditingPatient(patient);
    setIsFormOpen(true);
  };

  const handleView = (patient: Patient) => {
    setViewingPatient(patient);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingPatient(null);
  };

  const handlePageChange = (newPage: number) => {
    setPagination({ ...pagination, page: newPage });
  };

  const handleSizeChange = (newSize: number) => {
    setPagination({ ...pagination, size: newSize, page: 0 });
  };

  return (
    <MainLayout
      pageTitle="Patient Registry"
      pageAction={
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 px-3 text-zinc-600 border-zinc-200">
            <SlidersHorizontal className="w-3.5 h-3.5 mr-2" />
            Filters
          </Button>
          <Button size="sm" className="h-8 px-3 bg-zinc-900 hover:bg-zinc-800 text-white shadow-sm" onClick={() => setIsFormOpen(true)}>
            <Plus className="w-3.5 h-3.5 mr-2" />
            Add Patient
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Search bar */}
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4 transition-colors group-focus-within:text-zinc-600" />
          <input
            type="text"
            placeholder="Search by name, MRN, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-9 pl-10 pr-4 bg-white border border-zinc-200 rounded-lg text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900 transition-all shadow-sm"
          />
        </div>

        {loading ? (
          <div className="w-full h-48 border border-zinc-200 rounded-lg bg-white flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <div className="w-5 h-5 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin" />
              <span className="text-xs text-zinc-500 font-medium">Loading patient registry...</span>
            </div>
          </div>
        ) : filteredPatients.length === 0 ? (
          <div className="w-full h-64 border border-dashed border-zinc-300 rounded-lg bg-zinc-50/50 flex flex-col items-center justify-center text-center p-6">
            <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center mb-4 text-zinc-400">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-medium text-zinc-900">No patients found</h3>
            <p className="text-xs text-zinc-500 mt-1 max-w-[240px]">
              Try adjusting your search or filters to find the patients you're looking for.
            </p>
            <Button variant="outline" size="sm" className="mt-4 h-8 px-3" onClick={() => setSearchTerm('')}>
              Reset search
            </Button>
          </div>
        ) : (
          <>
            <div className="text-[12px] font-medium text-zinc-500 uppercase tracking-wider px-1">
              Registry ({filteredPatients.length} total)
            </div>
            <PatientsTable
              patients={patients}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={handleView}
              onStatusChange={() => {}}
            />
          </>
        )}

        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-zinc-200 pt-4">
            <div className="text-sm text-zinc-500">
              Showing {pagination.page * pagination.size + 1} to{' '}
              {Math.min((pagination.page + 1) * pagination.size, pagination.totalElements)} of{' '}
              {pagination.totalElements} patients
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 0}
                className="h-8 px-3"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
                  let pageNum;
                  if (pagination.totalPages <= 5) {
                    pageNum = i;
                  } else if (pagination.page < 3) {
                    pageNum = i;
                  } else if (pagination.page > pagination.totalPages - 3) {
                    pageNum = pagination.totalPages - 5 + i;
                  } else {
                    pageNum = pagination.page - 2 + i;
                  }
                  return (
                    <Button
                      key={pageNum}
                      variant={pagination.page === pageNum ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handlePageChange(pageNum)}
                      className={`h-8 w-8 ${pagination.page === pageNum ? 'bg-zinc-900 hover:bg-zinc-800' : ''}`}
                    >
                      {pageNum + 1}
                    </Button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages - 1}
                className="h-8 px-3"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
              <select
                value={pagination.size}
                onChange={(e) => handleSizeChange(Number(e.target.value))}
                className="h-8 px-2 text-sm border border-zinc-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900/5"
              >
                <option value={2}>2 per page</option>
                <option value={5}>5 per page</option>
                <option value={7}>7 per page</option>
              </select>
            </div>
          </div>
        )}
      </div>

      <PatientFormDialog
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSuccess={loadPatients}
        editingPatient={editingPatient}
      />

      <PatientViewDialog
        isOpen={!!viewingPatient}
        onClose={() => setViewingPatient(null)}
        patient={viewingPatient}
      />
    </MainLayout>
  );
}
