import apiClient from './axios';

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

export interface UpdateNursingAssessmentRequest extends CreateNursingAssessmentRequest {}

export interface PaginatedResponse<T> {
  content: T[];
  number: number;
  size: number;
  totalPages: number;
  totalElements: number;
}

export const nursingAssessmentsService = {
  async getNursingAssessmentById(id: string): Promise<NursingAssessment> {
    const response = await apiClient.get(`/nursing/assessments/${id}`);
    return response.data.data;
  },

  async getNursingAssessmentsByPatientId(patientId: string): Promise<NursingAssessment[]> {
    const response = await apiClient.get(`/nursing/assessments/patient/${patientId}`);
    return response.data.data;
  },

  async getNursingAssessmentsByPatientIdPaginated(patientId: string, page = 0, size = 10, sortBy = 'assessmentDate', sortDirection = 'desc'): Promise<PaginatedResponse<NursingAssessment>> {
    const response = await apiClient.get(`/nursing/assessments/patient/${patientId}/paginated`, { params: { page, size, sortBy, sortDirection } });
    return response.data.data;
  },

  async searchNursingAssessments(searchTerm: string, page = 0, size = 10, sortBy = 'assessmentDate', sortDirection = 'desc'): Promise<PaginatedResponse<NursingAssessment>> {
    const response = await apiClient.get('/nursing/assessments/search', { params: { searchTerm, page, size, sortBy, sortDirection } });
    return response.data.data;
  },

  async createNursingAssessment(request: CreateNursingAssessmentRequest): Promise<NursingAssessment> {
    const response = await apiClient.post('/nursing/assessments', request);
    return response.data.data;
  },

  async updateNursingAssessment(id: string, request: UpdateNursingAssessmentRequest): Promise<NursingAssessment> {
    const response = await apiClient.put(`/nursing/assessments/${id}`, request);
    return response.data.data;
  },

  async deleteNursingAssessment(id: string): Promise<void> {
    await apiClient.delete(`/nursing/assessments/${id}`);
  },
};
