import { useState, useEffect } from 'react';
import { Search, User, ChevronRight, ChevronLeft } from 'lucide-react';
import { patientsService, type Patient } from '@/services/api/patientsService';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface PatientListCardProps {
  onPatientSelect: (patient: Patient) => void;
  title?: string;
  subtitle?: string;
}

export function PatientListCard({ onPatientSelect, title = 'Select a Patient', subtitle = 'Choose a patient to view their nursing records' }: PatientListCardProps) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
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
      console.error('Error loading patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPagination({ ...pagination, page: 0 });
  };

  const handlePageChange = (newPage: number) => {
    setPagination({ ...pagination, page: newPage });
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white border border-zinc-200 rounded-xl p-8 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">{title}</h1>
            <p className="text-zinc-500 text-sm">{subtitle}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Total Patients</p>
            <p className="text-3xl font-bold text-zinc-900 tracking-tighter">{pagination.totalElements}</p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search by name, MRN, or phone number..."
          className="w-full pl-11 pr-4 py-3 bg-white border border-zinc-200 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900 shadow-sm placeholder:text-zinc-400"
        />
      </div>

      {/* Registry Count Sub-header */}
      <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest px-1">
        Registry ({pagination.totalElements} Total)
      </div>

      {/* Patient Table */}
      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="bg-zinc-50/50 border-b border-zinc-100">
              <th className="px-6 py-4 text-left text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Patient</th>
              <th className="px-6 py-4 text-left text-[11px] font-bold text-zinc-400 uppercase tracking-widest text">MRN</th>
              <th className="px-6 py-4 text-left text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Contact</th>
              <th className="px-6 py-4 text-left text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-right text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50">
            {loading ? (
              <tr>
                <td colSpan={5} className="py-20 text-center">
                  <div className="inline-block w-8 h-8 border-2 border-zinc-200 border-t-zinc-900 rounded-full animate-spin" />
                  <p className="mt-2 text-xs text-zinc-500 font-medium">Loading patients...</p>
                </td>
              </tr>
            ) : patients.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-20 text-center">
                  <div className="w-12 h-12 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-zinc-100">
                    <User className="w-6 h-6 text-zinc-300" />
                  </div>
                  <h3 className="text-sm font-semibold text-zinc-900">No Patients Found</h3>
                  <p className="text-xs text-zinc-500 mt-1">Try a different search term</p>
                </td>
              </tr>
            ) : (
              patients.map((patient) => (
                <tr key={patient.id} className="group hover:bg-zinc-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-600 text-xs font-bold shrink-0">
                        {getInitials(patient.firstName, patient.lastName)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-zinc-900 text-sm truncate">
                          {patient.firstName} {patient.lastName}
                        </p>
                        <p className="text-[11px] text-zinc-500 mt-0.5">
                          {patient.dateOfBirth || 'Date of birth not set'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-mono text-zinc-500 font-medium tracking-tight">
                      {patient.medicalRecordNumber}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <p className="text-zinc-700 font-medium tracking-tight">{patient.phoneNumber || '-'}</p>
                    <p className="text-[11px] text-zinc-400 mt-0.5">{patient.email || '-'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="outline" className={cn(
                      "font-bold text-[10px] uppercase tracking-wider rounded-lg px-2",
                      patient.status === 'ACTIVE' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                      patient.status === 'INACTIVE' ? "bg-zinc-100 text-zinc-400 border-zinc-200" :
                      "bg-blue-50 text-blue-600 border-blue-100"
                    )}>
                      {patient.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => onPatientSelect(patient)}
                      className="text-sm font-bold text-zinc-900 hover:text-zinc-600 transition-colors underline decoration-2 underline-offset-4 decoration-zinc-100 hover:decoration-zinc-300"
                    >
                      Select
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modern Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between px-2">
          <p className="text-xs text-zinc-500 font-medium">
            Showing <span className="text-zinc-900 font-bold">{pagination.page * pagination.size + 1}</span> to{' '}
            <span className="text-zinc-900 font-bold">{Math.min((pagination.page + 1) * pagination.size, pagination.totalElements)}</span> of{' '}
            <span className="text-zinc-900 font-bold">{pagination.totalElements}</span> patients
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 0}
              className="h-8 px-3 text-xs font-bold border-zinc-200 rounded-lg"
            >
              <ChevronLeft className="w-3.5 h-3.5 mr-1" />
              Previous
            </Button>
            
            <div className="flex items-center gap-1 mx-2">
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
                    variant={pagination.page === pageNum ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => handlePageChange(pageNum)}
                    className={cn(
                      "h-8 w-8 text-xs font-bold rounded-lg",
                      pagination.page === pageNum ? "bg-zinc-900 text-white hover:bg-zinc-800" : "text-zinc-600 hover:bg-zinc-100"
                    )}
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
              className="h-8 px-3 text-xs font-bold border-zinc-200 rounded-lg"
            >
              Next
              <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
