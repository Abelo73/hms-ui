import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export interface NursingAssessment {
  id: string;
  patientId: string;
  assessmentType: string;
  assessmentDate: string;
  assessmentTime: string;
  chiefComplaint: string;
  historyOfPresentIllness: string;
  physicalExamination: string;
  riskLevel: string;
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

export interface CreateNursingAssessmentRequest {
  patientId: string;
  assessmentType: string;
  assessmentDate: string;
  assessmentTime: string;
  chiefComplaint: string;
  historyOfPresentIllness: string;
  physicalExamination: string;
  riskLevel: string;
  notes?: string;
}

export interface UpdateNursingAssessmentRequest {
  assessmentType: string;
  assessmentDate: string;
  assessmentTime: string;
  chiefComplaint: string;
  historyOfPresentIllness: string;
  physicalExamination: string;
  riskLevel: string;
  notes?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  number: number;
  size: number;
  totalPages: number;
  totalElements: number;
}

export const nursingAssessmentsService = {
  async getNursingAssessmentById(id: string): Promise<NursingAssessment> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/nursing/assessments/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },

  async getNursingAssessmentsByPatientId(patientId: string): Promise<NursingAssessment[]> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/nursing/assessments/patient/${patientId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },

  async getNursingAssessmentsByPatientIdPaginated(
    patientId: string,
    page = 0,
    size = 10,
    sortBy = 'assessmentDate',
    sortDirection = 'desc'
  ): Promise<PaginatedResponse<NursingAssessment>> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/nursing/assessments/patient/${patientId}/paginated`, {
      params: { page, size, sortBy, sortDirection },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },

  async getNursingAssessmentsByType(
    assessmentType: string,
    page = 0,
    size = 10,
    sortBy = 'assessmentDate',
    sortDirection = 'desc'
  ): Promise<PaginatedResponse<NursingAssessment>> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/nursing/assessments/type/${assessmentType}`, {
      params: { page, size, sortBy, sortDirection },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },

  async getNursingAssessmentsByRiskLevel(
    riskLevel: string,
    page = 0,
    size = 10,
    sortBy = 'assessmentDate',
    sortDirection = 'desc'
  ): Promise<PaginatedResponse<NursingAssessment>> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/nursing/assessments/risk-level/${riskLevel}`, {
      params: { page, size, sortBy, sortDirection },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },

  async searchNursingAssessments(
    searchTerm: string,
    page = 0,
    size = 10,
    sortBy = 'assessmentDate',
    sortDirection = 'desc'
  ): Promise<PaginatedResponse<NursingAssessment>> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/nursing/assessments/search`, {
      params: { searchTerm, page, size, sortBy, sortDirection },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },

  async createNursingAssessment(request: CreateNursingAssessmentRequest): Promise<NursingAssessment> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.post(`${API_BASE_URL}/nursing/assessments`, request, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },

  async updateNursingAssessment(id: string, request: UpdateNursingAssessmentRequest): Promise<NursingAssessment> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.put(`${API_BASE_URL}/nursing/assessments/${id}`, request, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },

  async deleteNursingAssessment(id: string): Promise<void> {
    const token = localStorage.getItem('accessToken');
    await axios.delete(`${API_BASE_URL}/nursing/assessments/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
