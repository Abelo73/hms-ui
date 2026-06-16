import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Search, User, X, FileText, Pill, FlaskConical, Syringe, AlertTriangle, Calendar, Filter, Printer } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { patientsService, type Patient } from '@/services/api/patientsService';
import { allergiesService, type Allergy } from '@/services/api/allergiesService';
import { medicationsService, type Medication } from '@/services/api/medicationsService';
import { labResultsService, type LabResult } from '@/services/api/labResultsService';
import { vaccinationsService, type Vaccination } from '@/services/api/vaccinationsService';
import { medicalRecordsService, type MedicalRecord } from '@/services/api/medicalRecordsService';
import { MedicalHistoryPrintView } from './components/MedicalHistoryPrintView';

interface TimelineItem {
  id: string;
  date: string;
  type: 'allergy' | 'medication' | 'lab_result' | 'vaccination' | 'medical_record';
  data: Allergy | Medication | LabResult | Vaccination | MedicalRecord;
}

type FilterType = 'all' | 'allergy' | 'medication' | 'lab_result' | 'vaccination' | 'medical_record';

export function MedicalHistoryPage() {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [patientSearchTerm, setPatientSearchTerm] = useState('');
  const [patientSearchResults, setPatientSearchResults] = useState<Patient[]>([]);
  const [searchingPatient, setSearchingPatient] = useState(false);
  const [showPatientSearchResults, setShowPatientSearchResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [showPrintView, setShowPrintView] = useState(false);

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
    loadMedicalHistory(patient.id);
  };

  const handleClearPatient = () => {
    setSelectedPatient(null);
    setSelectedPatientId(null);
    setTimeline([]);
  };

  const loadMedicalHistory = async (patientId: string) => {
    setLoading(true);
    try {
      const [allergies, medications, labResults, vaccinations, medicalRecords] = await Promise.all([
        allergiesService.getAllergiesByPatientId(patientId),
        medicationsService.getMedicationsByPatientId(patientId),
        labResultsService.getLabResultsByPatientId(patientId),
        vaccinationsService.getVaccinationsByPatientId(patientId),
        medicalRecordsService.getMedicalRecordsByPatientId(patientId),
      ]);

      const items: TimelineItem[] = [];

      allergies.forEach((allergy) => {
        items.push({
          id: allergy.id,
          date: allergy.onsetDate,
          type: 'allergy',
          data: allergy });
      });

      medications.forEach((medication) => {
        items.push({
          id: medication.id,
          date: medication.startDate,
          type: 'medication',
          data: medication });
      });

      labResults.forEach((labResult) => {
        items.push({
          id: labResult.id,
          date: labResult.testDate,
          type: 'lab_result',
          data: labResult });
      });

      vaccinations.forEach((vaccination) => {
        items.push({
          id: vaccination.id,
          date: vaccination.administrationDate,
          type: 'vaccination',
          data: vaccination });
      });

      medicalRecords.forEach((record) => {
        items.push({
          id: record.id,
          date: record.recordDate,
          type: 'medical_record',
          data: record });
      });

      items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setTimeline(items);
    } catch (error) {
      console.error('Failed to load medical history:', error);
      toast.error('Failed to load medical history');
    } finally {
      setLoading(false);
    }
  };

  const filteredTimeline = filter === 'all' ? timeline : timeline.filter(item => item.type === filter);

  const stats = {
    all: timeline.length,
    allergy: timeline.filter(i => i.type === 'allergy').length,
    medication: timeline.filter(i => i.type === 'medication').length,
    lab_result: timeline.filter(i => i.type === 'lab_result').length,
    vaccination: timeline.filter(i => i.type === 'vaccination').length,
    medical_record: timeline.filter(i => i.type === 'medical_record').length };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'allergy':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'medication':
        return <Pill className="w-5 h-5 text-blue-500" />;
      case 'lab_result':
        return <FlaskConical className="w-5 h-5 text-purple-500" />;
      case 'vaccination':
        return <Syringe className="w-5 h-5 text-green-500" />;
      case 'medical_record':
        return <FileText className="w-5 h-5 text-zinc-500" />;
      default:
        return <FileText className="w-5 h-5 text-zinc-500" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'allergy':
        return 'Allergy';
      case 'medication':
        return 'Medication';
      case 'lab_result':
        return 'Lab Result';
      case 'vaccination':
        return 'Vaccination';
      case 'medical_record':
        return 'Medical Record';
      default:
        return 'Record';
    }
  };

  const renderCard = (item: TimelineItem) => {
    const data = item.data as any;
    
    return (
      <div key={item.id} className="bg-white border border-zinc-200 rounded-lg p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center flex-shrink-0">
            {getIconForType(item.type)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider bg-zinc-100 px-2 py-0.5 rounded">
                {getTypeLabel(item.type)}
              </span>
            </div>
            <h4 className="font-semibold text-zinc-900 text-sm truncate">
              {item.type === 'allergy' && data.allergenName}
              {item.type === 'medication' && data.medicationName}
              {item.type === 'lab_result' && data.testName}
              {item.type === 'vaccination' && data.vaccineName}
              {item.type === 'medical_record' && data.title}
            </h4>
          </div>
        </div>
        
        <div className="space-y-1.5 text-xs text-zinc-600">
          {item.type === 'allergy' && (
            <>
              <div className="flex justify-between"><span className="text-zinc-500">Type:</span> <span className="font-medium">{data.allergenType}</span></div>
              <div className="flex justify-between"><span className="text-zinc-500">Severity:</span> <span className={`font-medium ${data.severity === 'SEVERE' || data.severity === 'LIFE_THREATENING' ? 'text-red-600' : ''}`}>{data.severity}</span></div>
              <div className="flex justify-between"><span className="text-zinc-500">Reaction:</span> <span className="font-medium truncate max-w-[150px]">{data.reaction}</span></div>
            </>
          )}
          {item.type === 'medication' && (
            <>
              <div className="flex justify-between"><span className="text-zinc-500">Dosage:</span> <span className="font-medium">{data.dosage}</span></div>
              <div className="flex justify-between"><span className="text-zinc-500">Frequency:</span> <span className="font-medium">{data.frequency}</span></div>
              {data.genericName && <div className="flex justify-between"><span className="text-zinc-500">Generic:</span> <span className="font-medium">{data.genericName}</span></div>}
            </>
          )}
          {item.type === 'lab_result' && (
            <>
              <div className="flex justify-between"><span className="text-zinc-500">Test Type:</span> <span className="font-medium">{data.testType}</span></div>
              <div className="flex justify-between"><span className="text-zinc-500">Result:</span> <span className="font-medium">{data.resultValue} {data.unit}</span></div>
              <div className="flex justify-between"><span className="text-zinc-500">Status:</span> <span className={`font-medium ${data.status === 'NORMAL' ? 'text-green-600' : data.status === 'ABNORMAL' ? 'text-red-600' : ''}`}>{data.status}</span></div>
            </>
          )}
          {item.type === 'vaccination' && (
            <>
              <div className="flex justify-between"><span className="text-zinc-500">Vaccine Type:</span> <span className="font-medium">{data.vaccineType}</span></div>
              <div className="flex justify-between"><span className="text-zinc-500">Dose:</span> <span className="font-medium">{data.doseNumber}</span></div>
              {data.lotNumber && <div className="flex justify-between"><span className="text-zinc-500">Lot:</span> <span className="font-medium">{data.lotNumber}</span></div>}
            </>
          )}
          {item.type === 'medical_record' && (
            <>
              <div className="flex justify-between"><span className="text-zinc-500">Type:</span> <span className="font-medium">{data.recordType}</span></div>
              {data.description && <div className="flex justify-between"><span className="text-zinc-500">Desc:</span> <span className="font-medium truncate max-w-[150px]">{data.description}</span></div>}
              <div className="flex justify-between"><span className="text-zinc-500">Status:</span> <span className="font-medium">{data.status}</span></div>
            </>
          )}
          <div className="flex justify-between pt-2 border-t border-zinc-100 mt-2">
            <span className="text-zinc-400 flex items-center gap-1"><Calendar className="w-3 h-3" /> {item.date}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <MainLayout
      pageTitle="Medical History"
      pageAction={
        <div className="flex items-center gap-2 overflow-visible">
          {selectedPatient && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPrintView(true)}
              className="h-10 px-4 border-zinc-200 text-zinc-700 hover:bg-zinc-100"
            >
              <Printer className="w-4 h-4 mr-2" />
              Print / Export PDF
            </Button>
          )}
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
                  placeholder="Search patient to view medical history..."
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
        </div>
      }
    >
      <div className="space-y-4">
        {!selectedPatientId ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-20 h-20 bg-zinc-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Search className="w-10 h-10 text-zinc-400" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-900 mb-2">Search for a Patient</h3>
              <p className="text-zinc-600 max-w-md">
                Enter a patient name, phone number, email, or MRN to view their complete medical history.
              </p>
            </div>
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-zinc-600">Loading medical history...</p>
            </div>
          </div>
        ) : timeline.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-20 h-20 bg-zinc-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileText className="w-10 h-10 text-zinc-400" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-900 mb-2">No Medical Records Found</h3>
              <p className="text-zinc-600 max-w-md">
                This patient has no medical history recorded yet.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              <button
                onClick={() => setFilter('all')}
                className={`p-3 rounded-lg border transition-all ${
                  filter === 'all' ? 'bg-zinc-900 border-zinc-900 text-white' : 'bg-white border-zinc-200 hover:border-zinc-300'
                }`}
              >
                <div className="text-2xl font-bold">{stats.all}</div>
                <div className="text-xs opacity-80">All Records</div>
              </button>
              <button
                onClick={() => setFilter('allergy')}
                className={`p-3 rounded-lg border transition-all ${
                  filter === 'allergy' ? 'bg-red-500 border-red-500 text-white' : 'bg-white border-zinc-200 hover:border-zinc-300'
                }`}
              >
                <div className="text-2xl font-bold">{stats.allergy}</div>
                <div className="text-xs opacity-80 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Allergies</div>
              </button>
              <button
                onClick={() => setFilter('medication')}
                className={`p-3 rounded-lg border transition-all ${
                  filter === 'medication' ? 'bg-blue-500 border-blue-500 text-white' : 'bg-white border-zinc-200 hover:border-zinc-300'
                }`}
              >
                <div className="text-2xl font-bold">{stats.medication}</div>
                <div className="text-xs opacity-80 flex items-center gap-1"><Pill className="w-3 h-3" /> Medications</div>
              </button>
              <button
                onClick={() => setFilter('lab_result')}
                className={`p-3 rounded-lg border transition-all ${
                  filter === 'lab_result' ? 'bg-purple-500 border-purple-500 text-white' : 'bg-white border-zinc-200 hover:border-zinc-300'
                }`}
              >
                <div className="text-2xl font-bold">{stats.lab_result}</div>
                <div className="text-xs opacity-80 flex items-center gap-1"><FlaskConical className="w-3 h-3" /> Lab Results</div>
              </button>
              <button
                onClick={() => setFilter('vaccination')}
                className={`p-3 rounded-lg border transition-all ${
                  filter === 'vaccination' ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-zinc-200 hover:border-zinc-300'
                }`}
              >
                <div className="text-2xl font-bold">{stats.vaccination}</div>
                <div className="text-xs opacity-80 flex items-center gap-1"><Syringe className="w-3 h-3" /> Vaccinations</div>
              </button>
              <button
                onClick={() => setFilter('medical_record')}
                className={`p-3 rounded-lg border transition-all ${
                  filter === 'medical_record' ? 'bg-zinc-600 border-zinc-600 text-white' : 'bg-white border-zinc-200 hover:border-zinc-300'
                }`}
              >
                <div className="text-2xl font-bold">{stats.medical_record}</div>
                <div className="text-xs opacity-80 flex items-center gap-1"><FileText className="w-3 h-3" /> Records</div>
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 border-b border-zinc-200 pb-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  filter === 'all' ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:bg-zinc-100'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('allergy')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  filter === 'allergy' ? 'bg-red-100 text-red-700' : 'text-zinc-600 hover:bg-zinc-100'
                }`}
              >
                Allergies
              </button>
              <button
                onClick={() => setFilter('medication')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  filter === 'medication' ? 'bg-blue-100 text-blue-700' : 'text-zinc-600 hover:bg-zinc-100'
                }`}
              >
                Medications
              </button>
              <button
                onClick={() => setFilter('lab_result')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  filter === 'lab_result' ? 'bg-purple-100 text-purple-700' : 'text-zinc-600 hover:bg-zinc-100'
                }`}
              >
                Lab Results
              </button>
              <button
                onClick={() => setFilter('vaccination')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  filter === 'vaccination' ? 'bg-green-100 text-green-700' : 'text-zinc-600 hover:bg-zinc-100'
                }`}
              >
                Vaccinations
              </button>
              <button
                onClick={() => setFilter('medical_record')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  filter === 'medical_record' ? 'bg-zinc-100 text-zinc-700' : 'text-zinc-600 hover:bg-zinc-100'
                }`}
              >
                Records
              </button>
            </div>

            {/* Cards Grid */}
            {filteredTimeline.length === 0 ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <Filter className="w-12 h-12 text-zinc-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-zinc-900 mb-2">No Records Found</h3>
                  <p className="text-zinc-600">
                    No {filter !== 'all' ? getTypeLabel(filter).toLowerCase() : ''} records match your filter.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTimeline.map(renderCard)}
              </div>
            )}
          </>
        )}
      </div>

      {showPrintView && selectedPatient && (
        <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto">
          <div className="min-h-screen">
            <MedicalHistoryPrintView patient={selectedPatient} timeline={timeline} />
            <button
              onClick={() => setShowPrintView(false)}
              className="fixed top-4 left-4 z-[60] px-4 py-2 bg-white text-zinc-900 rounded-lg hover:bg-zinc-100 flex items-center gap-2 shadow-lg border border-zinc-200"
            >
              <X className="w-4 h-4" />
              Close
            </button>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
