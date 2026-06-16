import apiClient from './axios';

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentType: string;
  status: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  reason?: string;
  notes?: string;
  symptoms?: string;
  priority?: string;
  isVirtual: boolean;
  meetingLink?: string;
  reminderSent: boolean;
  checkInTime?: string;
  checkOutTime?: string;
  createdBy?: string;
  createdAt?: string;
  updatedBy?: string;
  updatedAt?: string;
}

export interface CreateAppointmentRequest {
  patientId: string;
  doctorId: string;
  appointmentType: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  reason?: string;
  notes?: string;
  symptoms?: string;
  priority?: string;
  isVirtual?: boolean;
  meetingLink?: string;
}

export interface UpdateAppointmentRequest {
  doctorId?: string;
  appointmentType?: string;
  status?: string;
  appointmentDate?: string;
  startTime?: string;
  endTime?: string;
  durationMinutes?: number;
  reason?: string;
  notes?: string;
  symptoms?: string;
  priority?: string;
  isVirtual?: boolean;
  meetingLink?: string;
  reminderSent?: boolean;
}

export interface PaginatedResponse<T> {
  content: T[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export const appointmentsService = {
  async getAppointmentById(id: string): Promise<Appointment> {
    const response = await apiClient.get(`/appointments/${id}`);
    return response.data.data;
  },

  async getAppointmentsByPatientId(patientId: string): Promise<Appointment[]> {
    const response = await apiClient.get(`/appointments/patient/${patientId}`);
    return response.data.data;
  },

  async getAppointmentsByPatientIdPaginated(patientId: string, page = 0, size = 10, sortBy = 'appointmentDate', sortDirection = 'desc'): Promise<PaginatedResponse<Appointment>> {
    const response = await apiClient.get(`/appointments/patient/${patientId}/paginated`, { params: { page, size, sortBy, sortDirection } });
    return response.data.data;
  },

  async getAppointmentsByDoctorId(doctorId: string): Promise<Appointment[]> {
    const response = await apiClient.get(`/appointments/doctor/${doctorId}`);
    return response.data.data;
  },

  async getAppointmentsByDoctorIdPaginated(doctorId: string, page = 0, size = 10, sortBy = 'appointmentDate', sortDirection = 'desc'): Promise<PaginatedResponse<Appointment>> {
    const response = await apiClient.get(`/appointments/doctor/${doctorId}/paginated`, { params: { page, size, sortBy, sortDirection } });
    return response.data.data;
  },

  async getAppointmentsByStatus(status: string, page = 0, size = 10, sortBy = 'appointmentDate', sortDirection = 'desc'): Promise<PaginatedResponse<Appointment>> {
    const response = await apiClient.get(`/appointments/status/${status}`, { params: { page, size, sortBy, sortDirection } });
    return response.data.data;
  },

  async getAppointmentsByDoctorIdAndStatus(doctorId: string, status: string, page = 0, size = 10, sortBy = 'appointmentDate', sortDirection = 'desc'): Promise<PaginatedResponse<Appointment>> {
    const response = await apiClient.get(`/appointments/doctor/${doctorId}/status/${status}`, { params: { page, size, sortBy, sortDirection } });
    return response.data.data;
  },

  async getAppointmentsByDateRange(startDate: string, endDate: string, page = 0, size = 10, sortBy = 'appointmentDate', sortDirection = 'asc'): Promise<PaginatedResponse<Appointment>> {
    const response = await apiClient.get('/appointments/date-range', { params: { startDate, endDate, page, size, sortBy, sortDirection } });
    return response.data.data;
  },

  async getAppointmentsByDate(appointmentDate: string): Promise<Appointment[]> {
    const response = await apiClient.get(`/appointments/date/${appointmentDate}`);
    return response.data.data;
  },

  async getDoctorAppointmentsForDate(doctorId: string, appointmentDate: string): Promise<Appointment[]> {
    const response = await apiClient.get(`/appointments/doctor/${doctorId}/date/${appointmentDate}`);
    return response.data.data;
  },

  async searchAppointments(searchTerm: string, page = 0, size = 10, sortBy = 'appointmentDate', sortDirection = 'desc'): Promise<PaginatedResponse<Appointment>> {
    const response = await apiClient.get('/appointments/search', { params: { searchTerm, page, size, sortBy, sortDirection } });
    return response.data.data;
  },

  async createAppointment(request: CreateAppointmentRequest): Promise<Appointment> {
    const response = await apiClient.post('/appointments', request);
    return response.data.data;
  },

  async updateAppointment(id: string, request: UpdateAppointmentRequest): Promise<Appointment> {
    const response = await apiClient.put(`/appointments/${id}`, request);
    return response.data.data;
  },

  async checkInAppointment(id: string): Promise<Appointment> {
    const response = await apiClient.post(`/appointments/${id}/check-in`);
    return response.data.data;
  },

  async checkOutAppointment(id: string): Promise<Appointment> {
    const response = await apiClient.post(`/appointments/${id}/check-out`);
    return response.data.data;
  },

  async cancelAppointment(id: string): Promise<Appointment> {
    const response = await apiClient.post(`/appointments/${id}/cancel`);
    return response.data.data;
  },

  async deleteAppointment(id: string): Promise<void> {
    await apiClient.delete(`/appointments/${id}`);
  },
};
