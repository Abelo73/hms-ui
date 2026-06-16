import apiClient from './axios';

export interface VitalSign {
  id: string;
  patientId: string;
  admissionId?: string;
  // Support both naming conventions for compatibility
  recordedDate?: string;
  recordedTime?: string;
  recordDate?: string;
  recordTime?: string;
  vitalSignType?: string;
  recordedBy?: string;
  temperature?: number;
  temperatureUnit?: string;
  temperatureSite?: string;
  systolicBP?: number;
  diastolicBP?: number;
  bloodPressureSite?: string;
  bloodPressurePosition?: string;
  heartRate?: number;
  heartRateRhythm?: string;
  respiratoryRate?: number;
  respiratoryPattern?: string;
  oxygenSaturation?: number;
  oxygenSupplement?: boolean;
  oxygenFlowRate?: number;
  oxygenDeliveryMethod?: string;
  bloodGlucose?: number;
  bloodGlucoseUnit?: string;
  bloodGlucoseTiming?: string;
  painScore?: number;
  painScale?: string;
  height?: number;
  weight?: number;
  bmi?: number;
  headCircumference?: number;
  notes?: string;
  isAbnormal?: boolean;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

export interface CreateVitalSignRequest {
  patientId: string;
  admissionId?: string;
  recordedDate?: string;
  recordedTime?: string;
  recordDate?: string;
  recordTime?: string;
  vitalSignType?: string;
  recordedBy?: string;
  temperature?: number;
  temperatureUnit?: string;
  temperatureSite?: string;
  systolicBP?: number;
  diastolicBP?: number;
  bloodPressureSite?: string;
  bloodPressurePosition?: string;
  heartRate?: number;
  heartRateRhythm?: string;
  respiratoryRate?: number;
  respiratoryPattern?: string;
  oxygenSaturation?: number;
  oxygenSupplement?: boolean;
  oxygenFlowRate?: number;
  oxygenDeliveryMethod?: string;
  bloodGlucose?: number;
  bloodGlucoseUnit?: string;
  bloodGlucoseTiming?: string;
  painScore?: number;
  painScale?: string;
  height?: number;
  weight?: number;
  bmi?: number;
  headCircumference?: number;
  notes?: string;
  isAbnormal?: boolean;
}

export interface UpdateVitalSignRequest extends CreateVitalSignRequest {}

export interface PaginatedResponse<T> {
  content: T[];
  number: number;
  size: number;
  totalPages: number;
  totalElements: number;
}

export const vitalSignsService = {
  async getVitalSignById(id: string): Promise<VitalSign> {
    const response = await apiClient.get(`/nursing/vital-signs/${id}`);
    return response.data.data;
  },

  async getVitalSignsByPatientId(patientId: string): Promise<VitalSign[]> {
    const response = await apiClient.get(`/nursing/vital-signs/patient/${patientId}`);
    return response.data.data;
  },

  async getVitalSignsByPatientIdPaginated(patientId: string, page = 0, size = 10, sortBy = 'recordDate', sortDirection = 'desc'): Promise<PaginatedResponse<VitalSign>> {
    const response = await apiClient.get(`/nursing/vital-signs/patient/${patientId}/paginated`, { params: { page, size, sortBy, sortDirection } });
    return response.data.data;
  },

  async searchVitalSigns(searchTerm: string, page = 0, size = 10, sortBy = 'recordDate', sortDirection = 'desc'): Promise<PaginatedResponse<VitalSign>> {
    const response = await apiClient.get('/nursing/vital-signs/search', { params: { searchTerm, page, size, sortBy, sortDirection } });
    return response.data.data;
  },

  async createVitalSign(request: CreateVitalSignRequest): Promise<VitalSign> {
    const response = await apiClient.post('/nursing/vital-signs', request);
    return response.data.data;
  },

  async updateVitalSign(id: string, request: UpdateVitalSignRequest): Promise<VitalSign> {
    const response = await apiClient.put(`/nursing/vital-signs/${id}`, request);
    return response.data.data;
  },

  async deleteVitalSign(id: string): Promise<void> {
    await apiClient.delete(`/nursing/vital-signs/${id}`);
  },
};
