import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export interface NursingTask {
  id: string;
  patientId: string;
  taskName: string;
  taskCategory: string;
  taskPriority: string;
  taskStatus: string;
  dueDate: string;
  dueTime: string;
  assignedTo: string;
  description?: string;
  completedAt?: string;
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

export interface CreateNursingTaskRequest {
  patientId: string;
  taskName: string;
  taskCategory: string;
  taskPriority: string;
  taskStatus: string;
  dueDate: string;
  dueTime: string;
  assignedTo: string;
  description?: string;
  notes?: string;
}

export interface UpdateNursingTaskRequest {
  taskName: string;
  taskCategory: string;
  taskPriority: string;
  taskStatus: string;
  dueDate: string;
  dueTime: string;
  assignedTo: string;
  description?: string;
  completedAt?: string;
  notes?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  number: number;
  size: number;
  totalPages: number;
  totalElements: number;
}

export const nursingTasksService = {
  async getNursingTaskById(id: string): Promise<NursingTask> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/nursing/tasks/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },

  async getNursingTasksByPatientId(patientId: string): Promise<NursingTask[]> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/nursing/tasks/patient/${patientId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },

  async getNursingTasksByPatientIdPaginated(
    patientId: string,
    page = 0,
    size = 10,
    sortBy = 'scheduledDate',
    sortDirection = 'desc'
  ): Promise<PaginatedResponse<NursingTask>> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/nursing/tasks/patient/${patientId}`, {
      params: { page, size, sortBy, sortDirection },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },

  async getNursingTasksByAssignedTo(
    assignedTo: string,
    page = 0,
    size = 10,
    sortBy = 'dueDate',
    sortDirection = 'asc'
  ): Promise<PaginatedResponse<NursingTask>> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/nursing/tasks/assigned-to/${assignedTo}`, {
      params: { page, size, sortBy, sortDirection },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },

  async getNursingTasksByStatus(
    status: string,
    page = 0,
    size = 10,
    sortBy = 'dueDate',
    sortDirection = 'asc'
  ): Promise<PaginatedResponse<NursingTask>> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/nursing/tasks/status/${status}`, {
      params: { page, size, sortBy, sortDirection },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },

  async getNursingTasksByPriority(
    priority: string,
    page = 0,
    size = 10,
    sortBy = 'dueDate',
    sortDirection = 'asc'
  ): Promise<PaginatedResponse<NursingTask>> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/nursing/tasks/priority/${priority}`, {
      params: { page, size, sortBy, sortDirection },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },

  async getNursingTasksByCategory(
    category: string,
    page = 0,
    size = 10,
    sortBy = 'dueDate',
    sortDirection = 'asc'
  ): Promise<PaginatedResponse<NursingTask>> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/nursing/tasks/category/${category}`, {
      params: { page, size, sortBy, sortDirection },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },

  async getNursingTasksByDateRange(
    startDate: string,
    endDate: string,
    page = 0,
    size = 10,
    sortBy = 'dueDate',
    sortDirection = 'asc'
  ): Promise<PaginatedResponse<NursingTask>> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/nursing/tasks/date-range`, {
      params: { startDate, endDate, page, size, sortBy, sortDirection },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },

  async searchNursingTasks(
    searchTerm: string,
    page = 0,
    size = 10,
    sortBy = 'dueDate',
    sortDirection = 'asc'
  ): Promise<PaginatedResponse<NursingTask>> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/nursing/tasks/search`, {
      params: { searchTerm, page, size, sortBy, sortDirection },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },

  async createNursingTask(request: CreateNursingTaskRequest): Promise<NursingTask> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.post(`${API_BASE_URL}/nursing/tasks`, request, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },

  async updateNursingTask(id: string, request: UpdateNursingTaskRequest): Promise<NursingTask> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.put(`${API_BASE_URL}/nursing/tasks/${id}`, request, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },

  async deleteNursingTask(id: string): Promise<void> {
    const token = localStorage.getItem('accessToken');
    await axios.delete(`${API_BASE_URL}/nursing/tasks/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
