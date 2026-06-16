import apiClient from './axios';

export interface NursingNote {
  id: string;
  patientId: string;
  noteType: string;
  noteDate: string;
  noteTime: string;
  subject: string;
  content: string;
  assessment?: string;
  intervention?: string;
  response?: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

export interface CreateNursingNoteRequest {
  patientId: string;
  noteType: string;
  noteDate: string;
  noteTime: string;
  subject: string;
  content: string;
  assessment?: string;
  intervention?: string;
  response?: string;
}

export interface UpdateNursingNoteRequest extends CreateNursingNoteRequest {}

export interface PaginatedResponse<T> {
  content: T[];
  number: number;
  size: number;
  totalPages: number;
  totalElements: number;
}

export const nursingNotesService = {
  async getNursingNoteById(id: string): Promise<NursingNote> {
    const response = await apiClient.get(`/nursing/notes/${id}`);
    return response.data.data;
  },

  async getNursingNotesByPatientId(patientId: string): Promise<NursingNote[]> {
    const response = await apiClient.get(`/nursing/notes/patient/${patientId}`);
    return response.data.data;
  },

  async getNursingNotesByPatientIdPaginated(patientId: string, page = 0, size = 10, sortBy = 'noteDate', sortDirection = 'desc'): Promise<PaginatedResponse<NursingNote>> {
    const response = await apiClient.get(`/nursing/notes/patient/${patientId}/paginated`, { params: { page, size, sortBy, sortDirection } });
    return response.data.data;
  },

  async searchNursingNotes(searchTerm: string, page = 0, size = 10, sortBy = 'noteDate', sortDirection = 'desc'): Promise<PaginatedResponse<NursingNote>> {
    const response = await apiClient.get('/nursing/notes/search', { params: { searchTerm, page, size, sortBy, sortDirection } });
    return response.data.data;
  },

  async createNursingNote(request: CreateNursingNoteRequest): Promise<NursingNote> {
    const response = await apiClient.post('/nursing/notes', request);
    return response.data.data;
  },

  async updateNursingNote(id: string, request: UpdateNursingNoteRequest): Promise<NursingNote> {
    const response = await apiClient.put(`/nursing/notes/${id}`, request);
    return response.data.data;
  },

  async deleteNursingNote(id: string): Promise<void> {
    await apiClient.delete(`/nursing/notes/${id}`);
  },
};
