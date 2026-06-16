import { useState, useEffect } from 'react';
import { X, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { medicalRecordsService, type CreateMedicalRecordRequest, type UpdateMedicalRecordRequest, type MedicalRecord } from '@/services/api/medicalRecordsService';
import { patientsService, type Patient } from '@/services/api/patientsService';
import { RecordType, RecordStatus } from '@/types/medical';
import { toast } from 'sonner';

interface MedicalRecordFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingMedicalRecord?: MedicalRecord | null;
  patientId?: string | null;
}

export function MedicalRecordFormDialog({ isOpen, onClose, onSuccess, editingMedicalRecord, patientId }: MedicalRecordFormDialogProps) {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Patient[]>([]);
  const [searching, setSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [formData, setFormData] = useState<CreateMedicalRecordRequest>({
    patientId: patientId || '',
    recordType: RecordType.CONSULTATION,
    recordDate: new Date().toISOString().split('T')[0],
    title: '',
    description: '',
    clinicalNotes: '',
    status: RecordStatus.ACTIVE });

  useEffect(() => {
    if (editingMedicalRecord) {
      setFormData({
        patientId: editingMedicalRecord.patientId,
        recordType: editingMedicalRecord.recordType,
        recordDate: editingMedicalRecord.recordDate,
        title: editingMedicalRecord.title,
        description: editingMedicalRecord.description || '',
        clinicalNotes: editingMedicalRecord.clinicalNotes || '',
        status: editingMedicalRecord.status });
    } else if (patientId) {
      setFormData(prev => ({ ...prev, patientId }));
    }
  }, [editingMedicalRecord, patientId]);

  useEffect(() => {
    if (patientId && !editingMedicalRecord) {
      patientsService.getPatientById(patientId).then(patient => {
        setSelectedPatient(patient);
      }).catch(() => {
        setSelectedPatient(null);
      });
    }
  }, [patientId, editingMedicalRecord]);

  const handlePatientSearch = async (term: string) => {
    setSearchTerm(term);
    if (term.length < 2) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setSearching(true);
    try {
      const results = await patientsService.searchPatients(term);
      setSearchResults(results);
      setShowSearchResults(true);
    } catch (error) {
      console.error('Error searching patients:', error);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
    setFormData({ ...formData, patientId: patient.id });
    setSearchTerm('');
    setSearchResults([]);
    setShowSearchResults(false);
  };

  const handleClearPatient = () => {
    setSelectedPatient(null);
    setFormData({ ...formData, patientId: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.patientId) {
      toast.error('Please select a patient');
      return;
    }

    if (!formData.title) {
      toast.error('Please enter a title');
      return;
    }

    setLoading(true);
    try {
      if (editingMedicalRecord) {
        const updateRequest: UpdateMedicalRecordRequest = {
          recordType: formData.recordType,
          recordDate: formData.recordDate,
          title: formData.title,
          description: formData.description,
          clinicalNotes: formData.clinicalNotes,
          status: formData.status };
        await medicalRecordsService.updateMedicalRecord(editingMedicalRecord.id, updateRequest);
        toast.success('Medical record updated successfully');
      } else {
        await medicalRecordsService.createMedicalRecord(formData);
        toast.success('Medical record created successfully');
      }
      onSuccess();
      onClose();
      setFormData({
        patientId: patientId || '',
        recordType: RecordType.CONSULTATION,
        recordDate: new Date().toISOString().split('T')[0],
        title: '',
        description: '',
        clinicalNotes: '',
        status: RecordStatus.ACTIVE });
      setSelectedPatient(null);
    } catch (error) {
      console.error('Error saving medical record:', error);
      toast.error('Failed to save medical record');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-zinc-200">
          <h2 className="text-lg font-semibold text-zinc-900">
            {editingMedicalRecord ? 'Edit Medical Record' : 'Add Medical Record'}
          </h2>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {!patientId && (
            <div className="relative">
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Patient *
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => handlePatientSearch(e.target.value)}
                  placeholder="Search patient..."
                  className="w-full pl-10 pr-10 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
                />
                {searching && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin" />
                  </div>
                )}
              </div>
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute z-10 left-0 right-0 mt-1 bg-white border border-zinc-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {searchResults.map((patient) => (
                    <button
                      key={patient.id}
                      type="button"
                      onClick={() => handlePatientSelect(patient)}
                      className="w-full px-4 py-2 text-left hover:bg-zinc-50 border-b border-zinc-100 last:border-b-0"
                    >
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-zinc-400" />
                        <div>
                          <p className="text-sm font-medium text-zinc-900">
                            {patient.firstName} {patient.lastName}
                          </p>
                          <p className="text-xs text-zinc-500">{patient.medicalRecordNumber}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              {selectedPatient && (
                <div className="mt-2 flex items-center gap-2 bg-zinc-50 px-3 py-2 rounded-md">
                  <User className="w-4 h-4 text-zinc-600" />
                  <span className="text-sm text-zinc-900">
                    {selectedPatient.firstName} {selectedPatient.lastName}
                  </span>
                  <button
                    type="button"
                    onClick={handleClearPatient}
                    className="text-zinc-400 hover:text-zinc-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Record Type *
              </label>
              <select
                value={formData.recordType}
                onChange={(e) => setFormData({ ...formData, recordType: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
              >
                <option value={RecordType.CONSULTATION}>Consultation</option>
                <option value={RecordType.ADMISSION}>Admission</option>
                <option value={RecordType.DISCHARGE}>Discharge</option>
                <option value={RecordType.PROCEDURE}>Procedure</option>
                <option value={RecordType.LAB_RESULT}>Lab Result</option>
                <option value={RecordType.PRESCRIPTION}>Prescription</option>
                <option value={RecordType.REFERRAL}>Referral</option>
                <option value={RecordType.OTHER}>Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Record Date *
              </label>
              <input
                type="date"
                value={formData.recordDate}
                onChange={(e) => setFormData({ ...formData, recordDate: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter record title"
              className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter description"
              rows={3}
              className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Clinical Notes
            </label>
            <textarea
              value={formData.clinicalNotes}
              onChange={(e) => setFormData({ ...formData, clinicalNotes: e.target.value })}
              placeholder="Enter clinical notes"
              rows={4}
              className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Status *
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
            >
              <option value={RecordStatus.ACTIVE}>Active</option>
              <option value={RecordStatus.INACTIVE}>Inactive</option>
              <option value={RecordStatus.ARCHIVED}>Archived</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-zinc-900 hover:bg-zinc-800 text-white"
            >
              {loading ? 'Saving...' : editingMedicalRecord ? 'Update Record' : 'Add Record'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
