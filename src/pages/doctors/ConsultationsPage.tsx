import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Search, Plus, Stethoscope, User, History, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { consultationService, type Consultation } from '@/services/api/consultationService';
import { patientsService, type Patient } from '@/services/api/patientsService';
import { useAuth } from '@/hooks/auth/useAuth';
import { toast } from 'sonner';
import { ConsultationForm } from './components/ConsultationForm';

export function ConsultationsPage() {
  const { user } = useAuth();
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patientSearchTerm, setPatientSearchTerm] = useState('');
  const [patientSearchResults, setPatientSearchResults] = useState<Patient[]>([]);
  const [searching, setSearching] = useState(false);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loadingConsultations, setLoadingConsultations] = useState(false);

  const handlePatientSearch = async (term: string) => {
    setPatientSearchTerm(term);
    if (term.length < 2) {
      setPatientSearchResults([]);
      return;
    }
    setSearching(true);
    try {
      const results = await patientsService.searchPatients(term);
      const patientsArray = Array.isArray(results) ? results : results.content || [];
      setPatientSearchResults(patientsArray.slice(0, 5));
    } catch (error) {
      console.error('Error searching patients:', error);
    } finally {
      setSearching(false);
    }
  };

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
    setPatientSearchTerm('');
    setPatientSearchResults([]);
    loadConsultations(patient.id);
  };

  const loadConsultations = async (patientId: string) => {
    setLoadingConsultations(true);
    try {
      const data = await consultationService.getPatientConsultations(patientId);
      setConsultations(data);
    } catch (error) {
      toast.error('Failed to load consultation history');
    } finally {
      setLoadingConsultations(false);
    }
  };

  return (
    <MainLayout
      pageTitle="Clinical Consultation"
      pageAction={
        selectedPatient && !showForm && (
          <Button size="sm" className="bg-zinc-900 text-white" onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" /> New Consultation
          </Button>
        )
      }
    >
      <div className="space-y-6">
        {/* Patient Selection bar */}
        {!selectedPatient ? (
          <div className="max-w-2xl mx-auto py-12 text-center">
            <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-zinc-400" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-900 mb-2">Identify Patient</h3>
            <p className="text-zinc-600 mb-6">Search for a patient to start a clinical consultation or view history.</p>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Name, MRN, or Phone..."
                value={patientSearchTerm}
                onChange={(e) => handlePatientSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-zinc-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
              />
              {patientSearchResults.length > 0 && (
                <div className="absolute z-10 w-full mt-2 bg-white border border-zinc-200 rounded-xl shadow-xl overflow-hidden">
                  {patientSearchResults.map(p => (
                    <button
                      key={p.id}
                      onClick={() => handlePatientSelect(p)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-zinc-50 border-b border-zinc-100 transition-colors text-left"
                    >
                      <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-zinc-600" />
                      </div>
                      <div>
                        <p className="font-medium text-zinc-900">{p.firstName} {p.lastName}</p>
                        <p className="text-xs text-zinc-500">MRN: {p.medicalRecordNumber} • {p.phoneNumber}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Patient Info Header */}
            <div className="flex items-center justify-between p-4 bg-white border border-zinc-200 rounded-xl shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center text-white font-bold">
                  {selectedPatient.firstName[0]}{selectedPatient.lastName[0]}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-zinc-900">{selectedPatient.firstName} {selectedPatient.lastName}</h2>
                  <p className="text-xs text-zinc-500">MRN: {selectedPatient.medicalRecordNumber} • {selectedPatient.gender} • {selectedPatient.dateOfBirth}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => { setSelectedPatient(null); setShowForm(false); }}>
                Change Patient
              </Button>
            </div>

            {showForm ? (
              <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-zinc-100 bg-zinc-50/50 flex justify-between items-center">
                  <h3 className="font-bold text-zinc-900 flex items-center gap-2">
                    <Stethoscope className="w-4 h-4" /> New Clinical Record
                  </h3>
                  <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                </div>
                <div className="p-6">
                  <ConsultationForm
                    patientId={selectedPatient.id}
                    doctorId={user?.id || ''}
                    onSuccess={() => { setShowForm(false); loadConsultations(selectedPatient.id); }}
                    onCancel={() => setShowForm(false)}
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-center justify-between px-1">
                    <h3 className="font-bold text-zinc-900 flex items-center gap-2">
                      <History className="w-4 h-4" /> Consultation History
                    </h3>
                  </div>
                  {loadingConsultations ? (
                    <div className="p-12 text-center text-zinc-500">Loading history...</div>
                  ) : consultations.length === 0 ? (
                    <div className="p-12 bg-zinc-50 border border-dashed border-zinc-300 rounded-xl text-center">
                      <p className="text-zinc-500">No previous consultations found for this patient.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {consultations.map(c => (
                        <div key={c.id} className="bg-white border border-zinc-200 rounded-xl p-4 hover:border-zinc-300 transition-all shadow-sm">
                          <div className="flex justify-between mb-3">
                            <div>
                                <span className="text-xs font-bold text-zinc-400 uppercase tracking-tighter block mb-1">Date</span>
                                <p className="text-sm font-semibold">{c.consultationDate}</p>
                            </div>
                            <div className="text-right">
                                <span className="text-xs font-bold text-zinc-400 uppercase tracking-tighter block mb-1">Doctor</span>
                                <p className="text-sm font-semibold">Dr. {c.doctorName}</p>
                            </div>
                          </div>
                          <div className="mb-4">
                            <span className="text-xs font-bold text-zinc-400 uppercase tracking-tighter block mb-1">Assessment / Diagnosis</span>
                            <div className="flex flex-wrap gap-2">
                              {c.diagnoses.map((d, i) => (
                                <span key={i} className="px-2 py-1 bg-zinc-100 text-zinc-700 rounded text-xs font-medium border border-zinc-200">
                                  {d.diagnosisCode} - {d.diagnosisName}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="border-t border-zinc-100 pt-3 flex justify-between items-center">
                            <p className="text-xs text-zinc-500 italic truncate max-w-[80%]">"{c.chiefComplaint}"</p>
                            <Button variant="ghost" size="sm" className="text-zinc-900 text-[11px] font-bold">View Detail</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                   <div className="bg-zinc-900 rounded-xl p-6 text-white shadow-lg">
                      <h4 className="font-bold mb-2">Quick Actions</h4>
                      <p className="text-xs text-zinc-400 mb-4">Common clinical tasks for this patient.</p>
                      <div className="grid grid-cols-1 gap-2">
                         <Button variant="outline" className="justify-start border-zinc-700 hover:bg-zinc-800 text-zinc-200 text-xs py-5">
                            Order Lab Tests
                         </Button>
                         <Button variant="outline" className="justify-start border-zinc-700 hover:bg-zinc-800 text-zinc-200 text-xs py-5">
                            Refer to Specialist
                         </Button>
                         <Button variant="outline" className="justify-start border-zinc-700 hover:bg-zinc-800 text-zinc-200 text-xs py-5">
                            Issue Medical Report
                         </Button>
                      </div>
                   </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
