import apiClient from './axios';

export interface Diagnosis {
  id: string;
  diagnosisCode: string;
  diagnosisName: string;
  type: 'PRIMARY' | 'SECONDARY';
  notes?: string;
}

export interface Prescription {
  id: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

export interface Consultation {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  consultationDate: string;
  consultationTime: string;
  chiefComplaint: string;
  subjective?: string;
  objective?: string;
  assessment?: string;
  plan?: string;
  status: 'DRAFT' | 'FINALIZED';
  diagnoses: Diagnosis[];
  prescriptions: Prescription[];
}

export interface CreateConsultationRequest {
  patientId: string;
  doctorId: string;
  chiefComplaint: string;
  subjective?: string;
  objective?: string;
  assessment?: string;
  plan?: string;
  diagnoses: Array<{
    diagnosisCode: string;
    diagnosisName: string;
    type: 'PRIMARY' | 'SECONDARY';
    notes?: string;
  }>;
  prescriptions: Array<{
    medicationName: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: string;
  }>;
}

export const consultationService = {
  async createConsultation(request: CreateConsultationRequest): Promise<Consultation> {
    const response = await apiClient.post('/consultations', request);
    return response.data.data;
  },

  async getConsultation(id: string): Promise<Consultation> {
    const response = await apiClient.get(`/consultations/${id}`);
    return response.data.data;
  },

  async getPatientConsultations(patientId: string): Promise<Consultation[]> {
    const response = await apiClient.get(`/consultations/patient/${patientId}`);
    return response.data.data;
  },

  async finalizeConsultation(id: string): Promise<void> {
    await apiClient.post(`/consultations/${id}/finalize`);
  },
};
