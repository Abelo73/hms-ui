import apiClient from './axios';

export interface Employee {
  id: string;
  employeeNumber: string;
  userId?: string;
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  department?: string;
  position?: string;
  employmentType?: string;
  employmentStatus?: string;
  hireDate?: string;
  baseSalary?: number;
  createdAt?: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  status: string;
  reason?: string;
  createdAt?: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  checkInTime?: string;
  checkOutTime?: string;
  status: string;
  notes?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  number: number;
  size: number;
  totalPages: number;
  totalElements: number;
}

export const hrService = {
  async getEmployees(page = 0, size = 10): Promise<PaginatedResponse<Employee>> {
    const response = await apiClient.get('/hr/employees', { params: { page, size } });
    return response.data.data;
  },

  async getEmployeeById(id: string): Promise<Employee> {
    const response = await apiClient.get(`/hr/employees/${id}`);
    return response.data.data;
  },

  async createEmployee(request: Partial<Employee>): Promise<Employee> {
    const response = await apiClient.post('/hr/employees', request);
    return response.data.data;
  },

  async updateEmployee(id: string, request: Partial<Employee>): Promise<Employee> {
    const response = await apiClient.put(`/hr/employees/${id}`, request);
    return response.data.data;
  },

  async getLeaveRequests(page = 0, size = 10): Promise<PaginatedResponse<LeaveRequest>> {
    const response = await apiClient.get('/hr/leave-requests', { params: { page, size } });
    return response.data.data;
  },

  async createLeaveRequest(request: Partial<LeaveRequest>): Promise<LeaveRequest> {
    const response = await apiClient.post('/hr/leave-requests', request);
    return response.data.data;
  },

  async approveLeave(id: string): Promise<void> {
    await apiClient.post(`/hr/leave-requests/${id}/approve`);
  },

  async rejectLeave(id: string, reason: string): Promise<void> {
    await apiClient.post(`/hr/leave-requests/${id}/reject`, { reason });
  },

  async getAttendance(employeeId: string, page = 0, size = 30): Promise<PaginatedResponse<AttendanceRecord>> {
    const response = await apiClient.get(`/hr/attendance/employee/${employeeId}`, { params: { page, size } });
    return response.data.data;
  },
};
