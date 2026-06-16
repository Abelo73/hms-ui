import apiClient from './axios';

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

export interface UpdateNursingTaskRequest extends CreateNursingTaskRequest {
  completedAt?: string;
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
    const response = await apiClient.get(`/nursing/tasks/${id}`);
    return response.data.data;
  },

  async getNursingTasksByPatientId(patientId: string): Promise<NursingTask[]> {
    const response = await apiClient.get(`/nursing/tasks/patient/${patientId}`);
    return response.data.data;
  },

  async getNursingTasksByPatientIdPaginated(patientId: string, page = 0, size = 10, sortBy = 'dueDate', sortDirection = 'asc'): Promise<PaginatedResponse<NursingTask>> {
    const response = await apiClient.get(`/nursing/tasks/patient/${patientId}`, { params: { page, size, sortBy, sortDirection } });
    return response.data.data;
  },

  async getNursingTasksByStatus(status: string, page = 0, size = 10, sortBy = 'dueDate', sortDirection = 'asc'): Promise<PaginatedResponse<NursingTask>> {
    const response = await apiClient.get(`/nursing/tasks/status/${status}`, { params: { page, size, sortBy, sortDirection } });
    return response.data.data;
  },

  async searchNursingTasks(searchTerm: string, page = 0, size = 10, sortBy = 'dueDate', sortDirection = 'asc'): Promise<PaginatedResponse<NursingTask>> {
    const response = await apiClient.get('/nursing/tasks/search', { params: { searchTerm, page, size, sortBy, sortDirection } });
    return response.data.data;
  },

  async createNursingTask(request: CreateNursingTaskRequest): Promise<NursingTask> {
    const response = await apiClient.post('/nursing/tasks', request);
    return response.data.data;
  },

  async updateNursingTask(id: string, request: UpdateNursingTaskRequest): Promise<NursingTask> {
    const response = await apiClient.put(`/nursing/tasks/${id}`, request);
    return response.data.data;
  },

  async deleteNursingTask(id: string): Promise<void> {
    await apiClient.delete(`/nursing/tasks/${id}`);
  },
};
