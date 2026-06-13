import axios from 'axios';
import { mockAppointments } from '../mock/appointmentsMockData';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';

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
    if (USE_MOCK_DATA) {
      const appointment = mockAppointments.find(a => a.id === id);
      if (!appointment) throw new Error('Appointment not found');
      return appointment;
    }
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/appointments/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  },

  async getAppointmentsByPatientId(patientId: string): Promise<Appointment[]> {
    if (USE_MOCK_DATA) {
      return mockAppointments.filter(a => a.patientId === patientId);
    }
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/appointments/patient/${patientId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  },

  async getAppointmentsByPatientIdPaginated(
    patientId: string,
    page = 0,
    size = 10,
    sortBy = 'appointmentDate',
    sortDirection = 'desc'
  ): Promise<PaginatedResponse<Appointment>> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/appointments/patient/${patientId}/paginated`, {
      params: { page, size, sortBy, sortDirection },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  },

  async getAppointmentsByDoctorId(doctorId: string): Promise<Appointment[]> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/appointments/doctor/${doctorId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  },

  async getAppointmentsByDoctorIdPaginated(
    doctorId: string,
    page = 0,
    size = 10,
    sortBy = 'appointmentDate',
    sortDirection = 'desc'
  ): Promise<PaginatedResponse<Appointment>> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/appointments/doctor/${doctorId}/paginated`, {
      params: { page, size, sortBy, sortDirection },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  },

  async getAppointmentsByStatus(
    status: string,
    page = 0,
    size = 10,
    sortBy = 'appointmentDate',
    sortDirection = 'desc'
  ): Promise<PaginatedResponse<Appointment>> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/appointments/status/${status}`, {
      params: { page, size, sortBy, sortDirection },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  },

  async getAppointmentsByType(
    appointmentType: string,
    page = 0,
    size = 10,
    sortBy = 'appointmentDate',
    sortDirection = 'desc'
  ): Promise<PaginatedResponse<Appointment>> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/appointments/type/${appointmentType}`, {
      params: { page, size, sortBy, sortDirection },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  },

  async getAppointmentsByPatientIdAndStatus(
    patientId: string,
    status: string,
    page = 0,
    size = 10,
    sortBy = 'appointmentDate',
    sortDirection = 'desc'
  ): Promise<PaginatedResponse<Appointment>> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/appointments/patient/${patientId}/status/${status}`, {
      params: { page, size, sortBy, sortDirection },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  },

  async getAppointmentsByDoctorIdAndStatus(
    doctorId: string,
    status: string,
    page = 0,
    size = 10,
    sortBy = 'appointmentDate',
    sortDirection = 'desc'
  ): Promise<PaginatedResponse<Appointment>> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/appointments/doctor/${doctorId}/status/${status}`, {
      params: { page, size, sortBy, sortDirection },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  },

  async getAppointmentsByPatientIdAndDoctorId(
    patientId: string,
    doctorId: string,
    page = 0,
    size = 10,
    sortBy = 'appointmentDate',
    sortDirection = 'desc'
  ): Promise<PaginatedResponse<Appointment>> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/appointments/patient/${patientId}/doctor/${doctorId}`, {
      params: { page, size, sortBy, sortDirection },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  },

  async searchAppointments(
    searchTerm: string,
    page = 0,
    size = 10,
    sortBy = 'appointmentDate',
    sortDirection = 'desc'
  ): Promise<PaginatedResponse<Appointment>> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/appointments/search`, {
      params: { searchTerm, page, size, sortBy, sortDirection },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  },

  async searchPatientAppointments(
    patientId: string,
    searchTerm: string,
    page = 0,
    size = 10,
    sortBy = 'appointmentDate',
    sortDirection = 'desc'
  ): Promise<PaginatedResponse<Appointment>> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/appointments/patient/${patientId}/search`, {
      params: { searchTerm, page, size, sortBy, sortDirection },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  },

  async searchDoctorAppointments(
    doctorId: string,
    searchTerm: string,
    page = 0,
    size = 10,
    sortBy = 'appointmentDate',
    sortDirection = 'desc'
  ): Promise<PaginatedResponse<Appointment>> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/appointments/doctor/${doctorId}/search`, {
      params: { searchTerm, page, size, sortBy, sortDirection },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  },

  async getAppointmentsByDateRange(
    startDate: string,
    endDate: string,
    page = 0,
    size = 10,
    sortBy = 'appointmentDate',
    sortDirection = 'asc'
  ): Promise<PaginatedResponse<Appointment>> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/appointments/date-range`, {
      params: { startDate, endDate, page, size, sortBy, sortDirection },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  },

  async getAppointmentsByDate(appointmentDate: string): Promise<Appointment[]> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/appointments/date/${appointmentDate}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  },

  async getDoctorAppointmentsForDate(doctorId: string, appointmentDate: string): Promise<Appointment[]> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/appointments/doctor/${doctorId}/date/${appointmentDate}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  },

  async countDoctorAppointmentsForDate(doctorId: string, appointmentDate: string): Promise<number> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/appointments/doctor/${doctorId}/date/${appointmentDate}/count`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  },

  async createAppointment(request: CreateAppointmentRequest): Promise<Appointment> {
    if (USE_MOCK_DATA) {
      const newAppointment: Appointment = {
        id: crypto.randomUUID(),
        ...request,
        status: 'SCHEDULED',
        reminderSent: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      mockAppointments.push(newAppointment);
      return newAppointment;
    }
    const token = localStorage.getItem('accessToken');
    const response = await axios.post(`${API_BASE_URL}/appointments`, request, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  },

  async updateAppointment(id: string, request: UpdateAppointmentRequest): Promise<Appointment> {
    if (USE_MOCK_DATA) {
      const index = mockAppointments.findIndex(a => a.id === id);
      if (index === -1) throw new Error('Appointment not found');
      mockAppointments[index] = { ...mockAppointments[index], ...request, updatedAt: new Date().toISOString() };
      return mockAppointments[index];
    }
    const token = localStorage.getItem('accessToken');
    const response = await axios.put(`${API_BASE_URL}/appointments/${id}`, request, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  },

  async checkInAppointment(id: string): Promise<Appointment> {
    if (USE_MOCK_DATA) {
      const index = mockAppointments.findIndex(a => a.id === id);
      if (index === -1) throw new Error('Appointment not found');
      mockAppointments[index] = {
        ...mockAppointments[index],
        status: 'IN_PROGRESS',
        checkInTime: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      return mockAppointments[index];
    }
    const token = localStorage.getItem('accessToken');
    const response = await axios.post(`${API_BASE_URL}/appointments/${id}/check-in`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  },

  async checkOutAppointment(id: string): Promise<Appointment> {
    if (USE_MOCK_DATA) {
      const index = mockAppointments.findIndex(a => a.id === id);
      if (index === -1) throw new Error('Appointment not found');
      mockAppointments[index] = {
        ...mockAppointments[index],
        status: 'COMPLETED',
        checkOutTime: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      return mockAppointments[index];
    }
    const token = localStorage.getItem('accessToken');
    const response = await axios.post(`${API_BASE_URL}/appointments/${id}/check-out`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  },

  async cancelAppointment(id: string): Promise<Appointment> {
    if (USE_MOCK_DATA) {
      const index = mockAppointments.findIndex(a => a.id === id);
      if (index === -1) throw new Error('Appointment not found');
      mockAppointments[index] = {
        ...mockAppointments[index],
        status: 'CANCELLED',
        updatedAt: new Date().toISOString()
      };
      return mockAppointments[index];
    }
    const token = localStorage.getItem('accessToken');
    const response = await axios.post(`${API_BASE_URL}/appointments/${id}/cancel`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  },

  async deleteAppointment(id: string): Promise<void> {
    if (USE_MOCK_DATA) {
      const index = mockAppointments.findIndex(a => a.id === id);
      if (index === -1) throw new Error('Appointment not found');
      mockAppointments.splice(index, 1);
      return;
    }
    const token = localStorage.getItem('accessToken');
    await axios.delete(`${API_BASE_URL}/appointments/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};
