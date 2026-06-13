import { useState, useEffect } from 'react';
import { Search, User, Phone, Calendar, MapPin, X, Users } from 'lucide-react';
import { patientsService, type Patient } from '@/services/api/patientsService';
import { Button } from '@/components/ui/button';

interface PatientSelectorProps {
  selectedPatient: Patient | null;
  onPatientSelect: (patient: Patient) => void;
  onPatientClear: () => void;
  showAddButton?: boolean;
  onAddClick?: () => void;
  addButtonText?: string;
}

export function PatientSelector({
  selectedPatient,
  onPatientSelect,
  onPatientClear,
  showAddButton = false,
  onAddClick,
  addButtonText = 'Add New',
}: PatientSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAllPatients, setShowAllPatients] = useState(true);

  useEffect(() => {
    loadPatients();
  }, []);

  useEffect(() => {
    if (searchTerm.length >= 2) {
      const filtered = patients.filter(
        (patient) =>
          patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.medicalRecordNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPatients(filtered);
    } else {
      setFilteredPatients(patients);
    }
  }, [searchTerm, patients]);

  const loadPatients = async () => {
    setLoading(true);
    try {
      const results = await patientsService.searchPatients('');
      const patientsArray = Array.isArray(results) ? results : results.content || [];
      setPatients(patientsArray.slice(0, 20));
      setFilteredPatients(patientsArray.slice(0, 20));
    } catch (error) {
      console.error('Error loading patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePatientClick = (patient: Patient) => {
    onPatientSelect(patient);
    setShowAllPatients(false);
  };

  if (selectedPatient) {
    return (
      <div className="bg-gradient-to-r from-zinc-50 to-white border border-zinc-200 rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-zinc-200 to-zinc-300 rounded-full flex items-center justify-center shadow-sm">
              <User className="w-7 h-7 text-zinc-600" />
            </div>
            <div>
              <h3 className="font-semibold text-zinc-900 text-lg">
                {selectedPatient.firstName} {selectedPatient.lastName}
              </h3>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-sm text-zinc-500 bg-zinc-100 px-2.5 py-1 rounded-md font-medium">
                  MRN: {selectedPatient.medicalRecordNumber}
                </span>
                {selectedPatient.phoneNumber && (
                  <span className="text-sm text-zinc-500 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" />
                    {selectedPatient.phoneNumber}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {showAddButton && onAddClick && (
              <Button
                size="sm"
                className="bg-zinc-900 hover:bg-zinc-800 text-white shadow-sm"
                onClick={onAddClick}
              >
                {addButtonText}
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onPatientClear}
              className="hover:bg-zinc-100"
            >
              <X className="w-4 h-4 mr-2" />
              Change Patient
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zinc-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search patients by name or MRN..."
          className="w-full pl-12 pr-4 py-3 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 shadow-sm"
        />
        {loading && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <div className="w-5 h-5 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Patient Grid */}
      <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-zinc-50 to-white px-5 py-3 border-b border-zinc-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-zinc-600" />
              <h3 className="font-semibold text-zinc-900">
                Patients {filteredPatients.length > 0 && `(${filteredPatients.length})`}
              </h3>
            </div>
            {searchTerm && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setSearchTerm('')}
                className="text-zinc-500 hover:text-zinc-700"
              >
                <X className="w-4 h-4 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </div>

        {filteredPatients.length === 0 ? (
          <div className="p-12 text-center">
            <User className="w-16 h-16 text-zinc-300 mx-auto mb-4" />
            <p className="text-zinc-500 font-medium">No patients found</p>
            <p className="text-zinc-400 text-sm mt-1">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 divide-x divide-y divide-zinc-100">
            {filteredPatients.map((patient) => (
              <button
                key={patient.id}
                type="button"
                onClick={() => handlePatientClick(patient)}
                className="p-5 text-left hover:bg-zinc-50 transition-colors group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-zinc-100 to-zinc-200 rounded-full flex items-center justify-center flex-shrink-0 group-hover:from-zinc-200 group-hover:to-zinc-300 transition-colors">
                    <User className="w-6 h-6 text-zinc-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-zinc-900 group-hover:text-zinc-700 transition-colors">
                      {patient.firstName} {patient.lastName}
                    </h4>
                    <div className="mt-2 space-y-1.5">
                      <div className="flex items-center gap-2 text-sm text-zinc-500">
                        <span className="bg-zinc-100 px-2 py-0.5 rounded text-xs font-medium">
                          {patient.medicalRecordNumber}
                        </span>
                      </div>
                      {patient.phoneNumber && (
                        <div className="flex items-center gap-1.5 text-sm text-zinc-500">
                          <Phone className="w-3.5 h-3.5" />
                          {patient.phoneNumber}
                        </div>
                      )}
                      {patient.dateOfBirth && (
                        <div className="flex items-center gap-1.5 text-sm text-zinc-500">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(patient.dateOfBirth).toLocaleDateString()}
                        </div>
                      )}
                      {patient.address && (
                        <div className="flex items-center gap-1.5 text-sm text-zinc-500">
                          <MapPin className="w-3.5 h-3.5" />
                          <span className="truncate">{patient.address}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
