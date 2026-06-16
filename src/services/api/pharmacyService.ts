import apiClient from './axios';

export type PrescriptionStatus = 'PENDING' | 'VALIDATED' | 'DISPENSED' | 'CANCELLED';

export interface Prescription {
  id: string;
  prescriptionNumber: string;
  patientId: string;
  doctorId: string;
  prescriptionDate: string;
  status: PrescriptionStatus;
  priority: string;
  notes: string;
  createdBy: string;
  createdAt: string;
}

export const pharmacyService = {
  async getAllPrescriptions(params?: { status?: PrescriptionStatus; patientId?: string; page?: number; size?: number }): Promise<any> {
    const response = await apiClient.get('/pharmacy/prescriptions', { params });
    return response.data.data;
  },

  async getPrescriptionById(id: string): Promise<Prescription> {
    const response = await apiClient.get(`/pharmacy/prescriptions/${id}`);
    return response.data.data;
  },

  async dispenseMedication(prescriptionId: string): Promise<any> {
    const response = await apiClient.post(`/pharmacy/dispensing/${prescriptionId}`);
    return response.data.data;
  },

  async getAllDrugs(): Promise<any> {
    const response = await apiClient.get('/pharmacy/drugs');
    return response.data.data;
  }
};
