import { useState, useEffect } from 'react';
import { X, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { allergiesService, type CreateAllergyRequest, type UpdateAllergyRequest, type Allergy } from '@/services/api/allergiesService';
import { patientsService, type Patient } from '@/services/api/patientsService';
import { AllergenType, Severity } from '@/types/medical';
import { toast } from 'sonner';

interface AllergyFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingAllergy?: Allergy | null;
  patientId?: string | null;
}

export function AllergyFormDialog({ isOpen, onClose, onSuccess, editingAllergy, patientId }: AllergyFormDialogProps) {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Patient[]>([]);
  const [searching, setSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [formData, setFormData] = useState<CreateAllergyRequest>({
    patientId: patientId || '',
    allergenType: AllergenType.DRUG,
    allergenName: '',
    severity: Severity.MILD,
    reaction: '',
    onsetDate: '',
    reportedBy: '' });

  useEffect(() => {
    if (editingAllergy) {
      setFormData({
        patientId: editingAllergy.patientId,
        allergenType: editingAllergy.allergenType,
        allergenName: editingAllergy.allergenName,
        severity: editingAllergy.severity,
        reaction: editingAllergy.reaction,
        onsetDate: editingAllergy.onsetDate,
        reportedBy: editingAllergy.reportedBy });
    } else if (patientId) {
      // Update patientId when creating a new allergy
      setFormData(prev => ({ ...prev, patientId }));
    }
  }, [editingAllergy, patientId]);

  useEffect(() => {
    if (patientId && !editingAllergy) {
      patientsService.getPatientById(patientId).then(patient => {
        setSelectedPatient(patient);
      }).catch(() => {
        setSelectedPatient(null);
      });
    }
  }, [patientId, editingAllergy]);

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
    
    setLoading(true);

    try {
      if (editingAllergy) {
        const updateData: UpdateAllergyRequest = {
          allergenType: formData.allergenType,
          allergenName: formData.allergenName,
          severity: formData.severity,
          reaction: formData.reaction,
          onsetDate: formData.onsetDate,
          reportedBy: formData.reportedBy };
        await allergiesService.updateAllergy(editingAllergy.id, updateData);
        toast.success('Allergy updated successfully');
      } else {
        await allergiesService.createAllergy(formData);
        toast.success('Allergy created successfully');
      }
      onSuccess();
      onClose();
      setFormData({
        patientId: patientId || '',
        allergenType: AllergenType.DRUG,
        allergenName: '',
        severity: Severity.MILD,
        reaction: '',
        onsetDate: '',
        reportedBy: '' });
      setSelectedPatient(null);
      setSearchTerm('');
      setSearchResults([]);
      setShowSearchResults(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save allergy');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-zinc-200">
          <h2 className="text-lg font-semibold text-zinc-900">
            {editingAllergy ? 'Edit Allergy' : 'Add New Allergy'}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Patient *</label>
            {selectedPatient ? (
              <div className="flex items-center justify-between p-3 border border-zinc-200 rounded-md bg-zinc-50">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-zinc-500" />
                  <div>
                    <p className="font-medium text-zinc-900">
                      {selectedPatient.firstName} {selectedPatient.lastName}
                    </p>
                    <p className="text-xs text-zinc-500">
                      MRN: {selectedPatient.medicalRecordNumber} • {selectedPatient.phoneNumber} • {selectedPatient.email}
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleClearPatient}
                  disabled={loading}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => handlePatientSearch(e.target.value)}
                    placeholder="Search by name, phone, email, or MRN..."
                    className="w-full pl-10 pr-4 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
                    disabled={loading}
                  />
                  {searching && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="w-4 h-4 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin" />
                    </div>
                  )}
                </div>
                {showSearchResults && searchResults.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-zinc-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {searchResults.map((patient) => (
                      <button
                        key={patient.id}
                        type="button"
                        onClick={() => handlePatientSelect(patient)}
                        className="w-full px-4 py-3 text-left hover:bg-zinc-50 border-b border-zinc-100 last:border-b-0"
                      >
                        <p className="font-medium text-zinc-900">
                          {patient.firstName} {patient.lastName}
                        </p>
                        <p className="text-xs text-zinc-500">
                          MRN: {patient.medicalRecordNumber} • {patient.phoneNumber} • {patient.email}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
                {showSearchResults && searchTerm.length >= 2 && searchResults.length === 0 && !searching && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-zinc-200 rounded-md shadow-lg p-4 text-center text-sm text-zinc-500">
                    No patients found
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Allergen Type *</label>
              <select
                value={formData.allergenType}
                onChange={(e) => setFormData({ ...formData, allergenType: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
                required
              >
                <option value={AllergenType.DRUG}>Drug</option>
                <option value={AllergenType.FOOD}>Food</option>
                <option value={AllergenType.ENVIRONMENT}>Environmental</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Severity *</label>
              <select
                value={formData.severity}
                onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
                required
              >
                <option value={Severity.MILD}>Mild</option>
                <option value={Severity.MODERATE}>Moderate</option>
                <option value={Severity.SEVERE}>Severe</option>
                <option value={Severity.LIFE_THREATENING}>Life-threatening</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Allergen Name *</label>
            <input
              type="text"
              value={formData.allergenName}
              onChange={(e) => setFormData({ ...formData, allergenName: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Reaction</label>
            <textarea
              value={formData.reaction}
              onChange={(e) => setFormData({ ...formData, reaction: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Onset Date</label>
              <input
                type="date"
                value={formData.onsetDate}
                onChange={(e) => setFormData({ ...formData, onsetDate: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Reported By</label>
              <input
                type="text"
                value={formData.reportedBy}
                onChange={(e) => setFormData({ ...formData, reportedBy: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-zinc-200">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-zinc-900 hover:bg-zinc-800">
              {loading ? 'Saving...' : editingAllergy ? 'Update Allergy' : 'Create Allergy'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
