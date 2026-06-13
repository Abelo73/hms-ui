import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

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
    const token = localStorage.getItem('accessToken');
    const response = await axios.post(`${API_BASE_URL}/consultations`, request, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async getConsultation(id: string): Promise<Consultation> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/consultations/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async getPatientConsultations(patientId: string): Promise<Consultation[]> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/consultations/patient/${patientId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async finalizeConsultation(id: string): Promise<void> {
    const token = localStorage.getItem('accessToken');
    await axios.post(`${API_BASE_URL}/consultations/${id}/finalize`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
