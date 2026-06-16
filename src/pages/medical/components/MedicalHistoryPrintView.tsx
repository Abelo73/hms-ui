import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { FileText, Pill, FlaskConical, Syringe, AlertTriangle, Calendar, User, Phone, Mail, MapPin, Printer } from 'lucide-react';
import { type Patient } from '@/services/api/patientsService';
import { type Allergy } from '@/services/api/allergiesService';
import { type Medication } from '@/services/api/medicationsService';
import { type LabResult } from '@/services/api/labResultsService';
import { type Vaccination } from '@/services/api/vaccinationsService';
import { type MedicalRecord } from '@/services/api/medicalRecordsService';
import './MedicalHistoryPrintView.css';

interface TimelineItem {
  id: string;
  date: string;
  type: 'allergy' | 'medication' | 'lab_result' | 'vaccination' | 'medical_record';
  data: Allergy | Medication | LabResult | Vaccination | MedicalRecord;
}

interface MedicalHistoryPrintViewProps {
  patient: Patient;
  timeline: TimelineItem[];
}

export function MedicalHistoryPrintView({ patient, timeline }: MedicalHistoryPrintViewProps) {
  const printRef = useRef<HTMLDivElement>(null);
  
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Medical_History_${patient.firstName}_${patient.lastName}`,
    onAfterPrint: () => {
      console.log('Print completed');
    } });

  const getIconForType = (type: string) => {
    switch (type) {
      case 'allergy':
        return <AlertTriangle className="w-5 h-5" />;
      case 'medication':
        return <Pill className="w-5 h-5" />;
      case 'lab_result':
        return <FlaskConical className="w-5 h-5" />;
      case 'vaccination':
        return <Syringe className="w-5 h-5" />;
      case 'medical_record':
        return <FileText className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
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

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'allergy':
        return 'text-red-600';
      case 'medication':
        return 'text-blue-600';
      case 'lab_result':
        return 'text-purple-600';
      case 'vaccination':
        return 'text-green-600';
      case 'medical_record':
        return 'text-zinc-600';
      default:
        return 'text-zinc-600';
    }
  };

  const sortedTimeline = [...timeline].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="relative">
      <div className="fixed top-4 right-4 z-50 no-print">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition-colors shadow-lg"
        >
          <Printer className="w-4 h-4" />
          Print Report
        </button>
      </div>
      <div ref={printRef} className="bg-white min-h-screen p-6 print:p-4">

        {/* Hospital Header */}
        <div className="mb-6 pb-4 border-b-2 border-zinc-200">
          <h1 className="text-xl font-bold text-zinc-900 mb-2">ACT General Hospital</h1>
          <div className="flex items-center gap-4 text-[10px] text-zinc-600">
            <div className="flex items-center gap-1">
              <Phone className="w-3 h-3" />
              <span>+251-11-555-1234</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>Addis Ababa, Ethiopia</span>
            </div>
            <div className="flex items-center gap-1">
              <Mail className="w-3 h-3" />
              <span>info@acthospital.com</span>
            </div>
          </div>
        </div>

        {/* Patient Information */}
        <div className="bg-zinc-50 rounded-lg p-4 mb-6 border border-zinc-200">
          <h2 className="text-base font-semibold text-zinc-900 mb-3 flex items-center gap-2">
            <User className="w-4 h-4" />
            Patient Information
          </h2>
          <div className="grid grid-cols-3 gap-3 text-xs">
            <div>
              <p className="text-zinc-500 text-[10px] mb-0.5">Full Name</p>
              <p className="font-medium text-zinc-900">{patient.firstName} {patient.lastName}</p>
            </div>
            <div>
              <p className="text-zinc-500 text-[10px] mb-0.5">MRN</p>
              <p className="font-medium text-zinc-900">{patient.medicalRecordNumber}</p>
            </div>
            <div>
              <p className="text-zinc-500 text-[10px] mb-0.5">Date of Birth</p>
              <p className="font-medium text-zinc-900">{patient.dateOfBirth || 'N/A'}</p>
            </div>
            <div>
              <p className="text-zinc-500 text-[10px] mb-0.5">Gender</p>
              <p className="font-medium text-zinc-900">{patient.gender || 'N/A'}</p>
            </div>
            <div>
              <p className="text-zinc-500 text-[10px] mb-0.5">Phone</p>
              <p className="font-medium text-zinc-900 flex items-center gap-1">
                <Phone className="w-3 h-3" /> {patient.phoneNumber}
              </p>
            </div>
            <div>
              <p className="text-zinc-500 text-[10px] mb-0.5">Email</p>
              <p className="font-medium text-zinc-900 flex items-center gap-1">
                <Mail className="w-3 h-3" /> {patient.email || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-zinc-500 text-[10px] mb-0.5">Address</p>
              <p className="font-medium text-zinc-900 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {patient.address || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-zinc-500 text-[10px] mb-0.5">Blood Type</p>
              <p className="font-medium text-zinc-900">{patient.bloodType || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-5 gap-1.5 mb-4">
          <div className="bg-zinc-50 rounded-lg p-1.5 border border-zinc-200 text-center">
            <div className="text-lg font-bold text-zinc-900">{timeline.length}</div>
            <div className="text-[9px] text-zinc-600">Total Records</div>
          </div>
          <div className="bg-red-50 rounded-lg p-1.5 border border-red-200 text-center">
            <div className="text-lg font-bold text-red-700">{timeline.filter(i => i.type === 'allergy').length}</div>
            <div className="text-[9px] text-red-600">Allergies</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-1.5 border border-blue-200 text-center">
            <div className="text-lg font-bold text-blue-700">{timeline.filter(i => i.type === 'medication').length}</div>
            <div className="text-[9px] text-blue-600">Medications</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-1.5 border border-purple-200 text-center">
            <div className="text-lg font-bold text-purple-700">{timeline.filter(i => i.type === 'lab_result').length}</div>
            <div className="text-[9px] text-purple-600">Lab Results</div>
          </div>
          <div className="bg-green-50 rounded-lg p-1.5 border border-green-200 text-center">
            <div className="text-lg font-bold text-green-700">{timeline.filter(i => i.type === 'vaccination').length}</div>
            <div className="text-[9px] text-green-600">Vaccinations</div>
          </div>
        </div>

        {/* Medical Records Timeline */}
        <div>
          <h2 className="text-sm font-semibold text-zinc-900 mb-2 flex items-center gap-2">
            <FileText className="w-3.5 h-3.5" />
            Medical Records Timeline
          </h2>
          
          {sortedTimeline.length === 0 ? (
            <div className="text-center py-6 bg-zinc-50 rounded-lg border border-zinc-200">
              <FileText className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
              <p className="text-zinc-600 text-xs">No medical records found</p>
            </div>
          ) : (
            <div className="space-y-2">
              {sortedTimeline.map((item) => {
                const data = item.data as any;
                return (
                  <div key={item.id} className="bg-white border border-zinc-200 rounded-lg p-2 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${getTypeColor(item.type)} bg-opacity-10`}>
                        {getIconForType(item.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-1.5">
                          <div>
                            <span className={`text-[9px] font-semibold uppercase tracking-wider ${getTypeColor(item.type)}`}>
                              {getTypeLabel(item.type)}
                            </span>
                            <h3 className="text-xs font-semibold text-zinc-900 mt-0.5">
                              {item.type === 'allergy' && data.allergenName}
                              {item.type === 'medication' && data.medicationName}
                              {item.type === 'lab_result' && data.testName}
                              {item.type === 'vaccination' && data.vaccineName}
                              {item.type === 'medical_record' && data.title}
                            </h3>
                          </div>
                          <div className="flex items-center gap-0.5 text-[10px] text-zinc-500">
                            <Calendar className="w-2.5 h-2.5" />
                            {item.date}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5 text-[10px]">
                          {item.type === 'allergy' && (
                            <>
                              <div><span className="text-zinc-500">Type:</span> <span className="font-medium">{data.allergenType}</span></div>
                              <div><span className="text-zinc-500">Severity:</span> <span className={`font-medium ${data.severity === 'SEVERE' || data.severity === 'LIFE_THREATENING' ? 'text-red-600' : ''}`}>{data.severity}</span></div>
                              <div><span className="text-zinc-500">Reaction:</span> <span className="font-medium">{data.reaction}</span></div>
                              <div><span className="text-zinc-500">Reported by:</span> <span className="font-medium">{data.reportedBy}</span></div>
                            </>
                          )}
                          {item.type === 'medication' && (
                            <>
                              <div><span className="text-zinc-500">Dosage:</span> <span className="font-medium">{data.dosage}</span></div>
                              <div><span className="text-zinc-500">Frequency:</span> <span className="font-medium">{data.frequency}</span></div>
                              <div><span className="text-zinc-500">Route:</span> <span className="font-medium">{data.route}</span></div>
                              {data.genericName && <div><span className="text-zinc-500">Generic:</span> <span className="font-medium">{data.genericName}</span></div>}
                            </>
                          )}
                          {item.type === 'lab_result' && (
                            <>
                              <div><span className="text-zinc-500">Test Type:</span> <span className="font-medium">{data.testType}</span></div>
                              <div><span className="text-zinc-500">Result:</span> <span className="font-medium">{data.resultValue} {data.unit}</span></div>
                              <div><span className="text-zinc-500">Status:</span> <span className={`font-medium ${data.status === 'NORMAL' ? 'text-green-600' : data.status === 'ABNORMAL' ? 'text-red-600' : ''}`}>{data.status}</span></div>
                              {data.referenceRange && <div><span className="text-zinc-500">Reference:</span> <span className="font-medium">{data.referenceRange}</span></div>}
                            </>
                          )}
                          {item.type === 'vaccination' && (
                            <>
                              <div><span className="text-zinc-500">Vaccine Type:</span> <span className="font-medium">{data.vaccineType}</span></div>
                              <div><span className="text-zinc-500">Dose:</span> <span className="font-medium">{data.doseNumber}</span></div>
                              {data.lotNumber && <div><span className="text-zinc-500">Lot Number:</span> <span className="font-medium">{data.lotNumber}</span></div>}
                              {data.nextDueDate && <div><span className="text-zinc-500">Next Due:</span> <span className="font-medium">{data.nextDueDate}</span></div>}
                            </>
                          )}
                          {item.type === 'medical_record' && (
                            <>
                              <div><span className="text-zinc-500">Type:</span> <span className="font-medium">{data.recordType}</span></div>
                              {data.description && <div><span className="text-zinc-500">Description:</span> <span className="font-medium">{data.description}</span></div>}
                              <div><span className="text-zinc-500">Status:</span> <span className="font-medium">{data.status}</span></div>
                              <div><span className="text-zinc-500">Record Date:</span> <span className="font-medium">{data.recordDate}</span></div>
                            </>
                          )}
                        </div>

                        {(data.clinicalNotes || data.notes) && (
                          <div className="mt-1.5 pt-1.5 border-t border-zinc-100">
                            <p className="text-[9px] text-zinc-500 mb-0.5">Clinical Notes:</p>
                            <p className="text-[10px] text-zinc-700">{data.clinicalNotes || data.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
