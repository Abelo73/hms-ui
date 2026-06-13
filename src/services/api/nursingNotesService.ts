import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

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

export interface UpdateNursingNoteRequest {
  noteType: string;
  noteDate: string;
  noteTime: string;
  subject: string;
  content: string;
  assessment?: string;
  intervention?: string;
  response?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  number: number;
  size: number;
  totalPages: number;
  totalElements: number;
}

export const nursingNotesService = {
  async getNursingNoteById(id: string): Promise<NursingNote> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/nursing/notes/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },

  async getNursingNotesByPatientId(patientId: string): Promise<NursingNote[]> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/nursing/notes/patient/${patientId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },

  async getNursingNotesByPatientIdPaginated(
    patientId: string,
    page = 0,
    size = 10,
    sortBy = 'noteDate',
    sortDirection = 'desc'
  ): Promise<PaginatedResponse<NursingNote>> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/nursing/notes/patient/${patientId}/paginated`, {
      params: { page, size, sortBy, sortDirection },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },

  async getNursingNotesByType(
    noteType: string,
    page = 0,
    size = 10,
    sortBy = 'noteDate',
    sortDirection = 'desc'
  ): Promise<PaginatedResponse<NursingNote>> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/nursing/notes/type/${noteType}`, {
      params: { page, size, sortBy, sortDirection },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },

  async getNursingNotesByDateRange(
    startDate: string,
    endDate: string,
    page = 0,
    size = 10,
    sortBy = 'noteDate',
    sortDirection = 'desc'
  ): Promise<PaginatedResponse<NursingNote>> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/nursing/notes/date-range`, {
      params: { startDate, endDate, page, size, sortBy, sortDirection },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },

  async searchNursingNotes(
    searchTerm: string,
    page = 0,
    size = 10,
    sortBy = 'noteDate',
    sortDirection = 'desc'
  ): Promise<PaginatedResponse<NursingNote>> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/nursing/notes/search`, {
      params: { searchTerm, page, size, sortBy, sortDirection },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },

  async createNursingNote(request: CreateNursingNoteRequest): Promise<NursingNote> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.post(`${API_BASE_URL}/nursing/notes`, request, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },

  async updateNursingNote(id: string, request: UpdateNursingNoteRequest): Promise<NursingNote> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.put(`${API_BASE_URL}/nursing/notes/${id}`, request, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },

  async deleteNursingNote(id: string): Promise<void> {
    const token = localStorage.getItem('accessToken');
    await axios.delete(`${API_BASE_URL}/nursing/notes/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
