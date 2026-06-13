import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export interface VitalSign {
  id: string;
  patientId: string;
  admissionId?: string;
  recordedDate: string;
  recordedTime: string;
  recordedBy?: string;
  temperature?: number;
  temperatureUnit?: string;
  temperatureSite?: string;
  systolicBP?: number;
  diastolicBP?: number;
  bloodPressureSite?: string;
  heartRate?: number;
  heartRateRhythm?: string;
  respiratoryRate?: number;
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
  recordedDate: string;
  recordedTime: string;
  recordedBy?: string;
  temperature?: number;
  temperatureUnit?: string;
  temperatureSite?: string;
  systolicBP?: number;
  diastolicBP?: number;
  bloodPressureSite?: string;
  heartRate?: number;
  heartRateRhythm?: string;
  respiratoryRate?: number;
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

export interface UpdateVitalSignRequest {
  admissionId?: string;
  recordedDate: string;
  recordedTime: string;
  recordedBy?: string;
  temperature?: number;
  temperatureUnit?: string;
  temperatureSite?: string;
  systolicBP?: number;
  diastolicBP?: number;
  bloodPressureSite?: string;
  heartRate?: number;
  heartRateRhythm?: string;
  respiratoryRate?: number;
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

export interface PaginatedResponse<T> {
  content: T[];
  number: number;
  size: number;
  totalPages: number;
  totalElements: number;
}

export const vitalSignsService = {
  async getVitalSignById(id: string): Promise<VitalSign> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/nursing/vital-signs/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },

  async getVitalSignsByPatientId(patientId: string): Promise<VitalSign[]> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/nursing/vital-signs/patient/${patientId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },

  async getVitalSignsByPatientIdPaginated(
    patientId: string,
    page = 0,
    size = 10,
    sortBy = 'recordDate',
    sortDirection = 'desc'
  ): Promise<PaginatedResponse<VitalSign>> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/nursing/vital-signs/patient/${patientId}/paginated`, {
      params: { page, size, sortBy, sortDirection },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },

  async getVitalSignsByType(
    vitalSignType: string,
    page = 0,
    size = 10,
    sortBy = 'recordDate',
    sortDirection = 'desc'
  ): Promise<PaginatedResponse<VitalSign>> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/nursing/vital-signs/type/${vitalSignType}`, {
      params: { page, size, sortBy, sortDirection },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },

  async getVitalSignsByDateRange(
    startDate: string,
    endDate: string,
    page = 0,
    size = 10,
    sortBy = 'recordDate',
    sortDirection = 'desc'
  ): Promise<PaginatedResponse<VitalSign>> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/nursing/vital-signs/date-range`, {
      params: { startDate, endDate, page, size, sortBy, sortDirection },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },

  async searchVitalSigns(
    searchTerm: string,
    page = 0,
    size = 10,
    sortBy = 'recordDate',
    sortDirection = 'desc'
  ): Promise<PaginatedResponse<VitalSign>> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/nursing/vital-signs/search`, {
      params: { searchTerm, page, size, sortBy, sortDirection },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },

  async createVitalSign(request: CreateVitalSignRequest): Promise<VitalSign> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.post(`${API_BASE_URL}/nursing/vital-signs`, request, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },

  async updateVitalSign(id: string, request: UpdateVitalSignRequest): Promise<VitalSign> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.put(`${API_BASE_URL}/nursing/vital-signs/${id}`, request, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },

  async deleteVitalSign(id: string): Promise<void> {
    const token = localStorage.getItem('accessToken');
    await axios.delete(`${API_BASE_URL}/nursing/vital-signs/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
