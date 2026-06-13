import { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { consultationService, type CreateConsultationRequest } from '@/services/api/consultationService';
import { toast } from 'sonner';

interface ConsultationFormProps {
  patientId: string;
  doctorId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ConsultationForm({ patientId, doctorId, onSuccess, onCancel }: ConsultationFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateConsultationRequest>({
    patientId,
    doctorId,
    chiefComplaint: '',
    subjective: '',
    objective: '',
    assessment: '',
    plan: '',
    diagnoses: [{ diagnosisCode: '', diagnosisName: '', type: 'PRIMARY', notes: '' }],
    prescriptions: [{ medicationName: '', dosage: '', frequency: '', duration: '', instructions: '' }],
  });

  const handleAddDiagnosis = () => {
    setFormData({
      ...formData,
      diagnoses: [...formData.diagnoses, { diagnosisCode: '', diagnosisName: '', type: 'SECONDARY', notes: '' }],
    });
  };

  const handleRemoveDiagnosis = (index: number) => {
    const newDiagnoses = [...formData.diagnoses];
    newDiagnoses.splice(index, 1);
    setFormData({ ...formData, diagnoses: newDiagnoses });
  };

  const handleAddPrescription = () => {
    setFormData({
      ...formData,
      prescriptions: [...formData.prescriptions, { medicationName: '', dosage: '', frequency: '', duration: '', instructions: '' }],
    });
  };

  const handleRemovePrescription = (index: number) => {
    const newPrescriptions = [...formData.prescriptions];
    newPrescriptions.splice(index, 1);
    setFormData({ ...formData, prescriptions: newPrescriptions });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await consultationService.createConsultation(formData);
      toast.success('Consultation recorded successfully');
      onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save consultation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200">
        <h3 className="text-sm font-semibold text-zinc-900 mb-4 uppercase tracking-wider">Clinical Notes (SOAP)</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Chief Complaint *</label>
            <textarea
              required
              value={formData.chiefComplaint}
              onChange={(e) => setFormData({ ...formData, chiefComplaint: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
              rows={2}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Subjective</label>
              <textarea
                value={formData.subjective}
                onChange={(e) => setFormData({ ...formData, subjective: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Objective</label>
              <textarea
                value={formData.objective}
                onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Assessment</label>
              <textarea
                value={formData.assessment}
                onChange={(e) => setFormData({ ...formData, assessment: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Plan</label>
              <textarea
                value={formData.plan}
                onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm"
                rows={3}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider">Diagnoses</h3>
          <Button type="button" variant="outline" size="sm" onClick={handleAddDiagnosis}>
            <Plus className="w-3.5 h-3.5 mr-1" /> Add
          </Button>
        </div>
        <div className="space-y-4">
          {formData.diagnoses.map((diag, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end border-b border-zinc-100 pb-4 last:border-0 last:pb-0">
              <div className="md:col-span-1">
                <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">Code</label>
                <input
                  type="text"
                  placeholder="ICD-10"
                  value={diag.diagnosisCode}
                  onChange={(e) => {
                    const newD = [...formData.diagnoses];
                    newD[index].diagnosisCode = e.target.value;
                    setFormData({ ...formData, diagnoses: newD });
                  }}
                  className="w-full px-3 py-1.5 border border-zinc-200 rounded-md text-sm"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">Name</label>
                <input
                  type="text"
                  value={diag.diagnosisName}
                  onChange={(e) => {
                    const newD = [...formData.diagnoses];
                    newD[index].diagnosisName = e.target.value;
                    setFormData({ ...formData, diagnoses: newD });
                  }}
                  className="w-full px-3 py-1.5 border border-zinc-200 rounded-md text-sm"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={diag.type}
                  onChange={(e) => {
                    const newD = [...formData.diagnoses];
                    newD[index].type = e.target.value as 'PRIMARY' | 'SECONDARY';
                    setFormData({ ...formData, diagnoses: newD });
                  }}
                  className="flex-1 px-3 py-1.5 border border-zinc-200 rounded-md text-sm"
                >
                  <option value="PRIMARY">Primary</option>
                  <option value="SECONDARY">Secondary</option>
                </select>
                {formData.diagnoses.length > 1 && (
                  <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveDiagnosis(index)} className="text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider">Prescriptions</h3>
          <Button type="button" variant="outline" size="sm" onClick={handleAddPrescription}>
            <Plus className="w-3.5 h-3.5 mr-1" /> Add
          </Button>
        </div>
        <div className="space-y-4">
          {formData.prescriptions.map((presc, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end border-b border-zinc-100 pb-4 last:border-0 last:pb-0">
              <div className="md:col-span-2">
                <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">Medication</label>
                <input
                  type="text"
                  value={presc.medicationName}
                  onChange={(e) => {
                    const newP = [...formData.prescriptions];
                    newP[index].medicationName = e.target.value;
                    setFormData({ ...formData, prescriptions: newP });
                  }}
                  className="w-full px-3 py-1.5 border border-zinc-200 rounded-md text-sm"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">Dosage</label>
                <input
                  type="text"
                  placeholder="e.g. 500mg"
                  value={presc.dosage}
                  onChange={(e) => {
                    const newP = [...formData.prescriptions];
                    newP[index].dosage = e.target.value;
                    setFormData({ ...formData, prescriptions: newP });
                  }}
                  className="w-full px-3 py-1.5 border border-zinc-200 rounded-md text-sm"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">Freq/Dur</label>
                <div className="flex gap-1">
                  <input
                    type="text"
                    placeholder="BID"
                    value={presc.frequency}
                    onChange={(e) => {
                      const newP = [...formData.prescriptions];
                      newP[index].frequency = e.target.value;
                      setFormData({ ...formData, prescriptions: newP });
                    }}
                    className="w-1/2 px-2 py-1.5 border border-zinc-200 rounded-md text-sm"
                  />
                  <input
                    type="text"
                    placeholder="7d"
                    value={presc.duration}
                    onChange={(e) => {
                      const newP = [...formData.prescriptions];
                      newP[index].duration = e.target.value;
                      setFormData({ ...formData, prescriptions: newP });
                    }}
                    className="w-1/2 px-2 py-1.5 border border-zinc-200 rounded-md text-sm"
                  />
                </div>
              </div>
              <div className="flex items-center">
                {formData.prescriptions.length > 1 && (
                  <Button type="button" variant="ghost" size="sm" onClick={() => handleRemovePrescription(index)} className="text-red-500">
                    <Trash2 className="w-4 h-4 ml-auto" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3 p-4 border-t border-zinc-200">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={loading} className="bg-zinc-900 hover:bg-zinc-800 text-white">
          {loading ? 'Saving...' : 'Save Consultation'}
        </Button>
      </div>
    </form>
  );
}
