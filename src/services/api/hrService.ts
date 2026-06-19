import apiClient from './axios';

export interface BranchDTO {
  id: string;
  name: string;
  code: string;
  address?: string;
  city?: string;
  country?: string;
  phone?: string;
  email?: string;
  branchType?: string;
  parentBranchId?: string;
  status?: string;
  createdAt?: string;
  createdBy?: string;
}

export interface SalaryGradeDTO {
  id: string;
  name: string;
  code: string;
  minSalary: number;
  maxSalary: number;
  currency?: string;
  createdAt?: string;
  createdBy?: string;
}

export interface PositionDTO {
  id: string;
  title: string;
  code: string;
  departmentId?: string;
  gradeId?: string;
  minSalary?: number;
  maxSalary?: number;
  responsibilities?: string;
  requiredSkills?: string;
  requiredQualifications?: string;
  reportingPositionId?: string;
  isActive?: boolean;
  createdAt?: string;
  createdBy?: string;
}

export interface DepartmentDTO {
  id: string;
  name: string;
  code: string;
  branchId?: string;
  branchName?: string;
  departmentHeadEmployeeId?: string;
  budget?: number;
  description?: string;
  parentDepartmentId?: string;
  status?: string;
  employeeCount?: number;
  createdAt?: string;
  createdBy?: string;
}

export interface Employee {
  id: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  email?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  employeeType?: string;
  department?: string;
  position?: string;
  hireDate?: string;
  terminationDate?: string;
  status?: string;
  salary?: number;
  bankName?: string;
  bankAccountNumber?: string;
  taxId?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelationship?: string;
  notes?: string;
  createdAt?: string;
  createdBy?: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  totalDays?: number;
  reason?: string;
  status: string;
  approvedBy?: string;
  approvedOn?: string;
  rejectionReason?: string;
  notes?: string;
  createdAt?: string;
  createdBy?: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  checkInTime?: string;
  checkOutTime?: string;
  status: string;
  hoursWorked?: number;
  overtimeHours?: number;
  notes?: string;
  createdAt?: string;
  createdBy?: string;
}

export interface Payroll {
  id: string;
  employeeId: string;
  payPeriodStart: string;
  payPeriodEnd: string;
  payDate?: string;
  grossPay: number;
  netPay: number;
  taxDeduction?: number;
  insuranceDeduction?: number;
  otherDeductions?: number;
  bonuses?: number;
  overtimePay?: number;
  status: string;
  paymentMethod?: string;
  transactionId?: string;
  notes?: string;
  createdAt?: string;
  createdBy?: string;
}

export interface PerformanceReview {
  id: string;
  employeeId: string;
  reviewerId: string;
  reviewPeriodStart: string;
  reviewPeriodEnd: string;
  reviewDate: string;
  rating: string;
  goalsAchieved?: string;
  areasForImprovement?: string;
  strengths?: string;
  comments?: string;
  employeeComments?: string;
  developmentPlan?: string;
  createdAt?: string;
  createdBy?: string;
}

export interface Recruitment {
  id: string;
  jobTitle: string;
  department?: string;
  description?: string;
  requirements?: string;
  responsibilities?: string;
  vacancies: number;
  postingDate: string;
  closingDate?: string;
  status?: string;
  salaryRange?: string;
  location?: string;
  employmentType?: string;
  notes?: string;
  createdAt?: string;
  createdBy?: string;
}

export interface Training {
  id: string;
  trainingName: string;
  description?: string;
  trainingType?: string;
  startDate: string;
  endDate?: string;
  location?: string;
  instructor?: string;
  cost?: number;
  maxParticipants?: number;
  status?: string;
  notes?: string;
  createdAt?: string;
  createdBy?: string;
}

export interface TrainingEnrollment {
  id: string;
  trainingId?: string;
  employeeId: string;
  enrollmentDate: string;
  completionDate?: string;
  status?: string;
  certificateUrl?: string;
  notes?: string;
  createdAt?: string;
  createdBy?: string;
}

export interface Benefits {
  id: string;
  employeeId: string;
  benefitType: string;
  planName?: string;
  provider?: string;
  coverageAmount?: number;
  employeeContribution?: number;
  employerContribution?: number;
  enrollmentDate?: string;
  effectiveDate?: string;
  terminationDate?: string;
  status?: string;
  dependents?: string;
  notes?: string;
  createdAt?: string;
  createdBy?: string;
}

export interface Compliance {
  id: string;
  employeeId: string;
  complianceType: string;
  documentName?: string;
  documentUrl?: string;
  issuingAuthority?: string;
  issueDate?: string;
  expiryDate?: string;
  status?: string;
  reminderDate?: string;
  notes?: string;
  createdAt?: string;
  createdBy?: string;
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
    const employees = response.data.data;
    return {
      content: Array.isArray(employees) ? employees : [],
      number: page,
      size,
      totalPages: 1,
      totalElements: Array.isArray(employees) ? employees.length : 0,
    };
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

  async terminateEmployee(id: string, request: { terminationDate: string; reason: string }): Promise<void> {
    await apiClient.post(`/hr/employees/${id}/terminate`, request);
  },

  async getLeaveRequests(page = 0, size = 10, params?: { employeeId?: string; status?: string; leaveType?: string }): Promise<PaginatedResponse<LeaveRequest>> {
    const response = await apiClient.get('/hr/leave-requests', { params: { page, size, ...params } });
    const data = response.data.data;
    return {
      content: Array.isArray(data) ? data : [],
      number: page,
      size,
      totalPages: 1,
      totalElements: Array.isArray(data) ? data.length : 0,
    };
  },

  async createLeaveRequest(request: { employeeId: string; leaveType: string; startDate: string; endDate: string; reason?: string }): Promise<LeaveRequest> {
    const response = await apiClient.post('/hr/leave-requests', request);
    return response.data.data;
  },

  async approveLeave(id: string): Promise<void> {
    await apiClient.post(`/hr/leave-requests/${id}/approve`, { approved: true });
  },

  async rejectLeave(id: string, reason: string): Promise<void> {
    await apiClient.post(`/hr/leave-requests/${id}/approve`, { approved: false, rejectionReason: reason });
  },

  async getAttendance(employeeId: string, page = 0, size = 30): Promise<PaginatedResponse<AttendanceRecord>> {
    const response = await apiClient.get(`/hr/attendance/employee/${employeeId}`, { params: { page, size } });
    const data = response.data.data;
    return {
      content: Array.isArray(data) ? data : [],
      number: page,
      size,
      totalPages: 1,
      totalElements: Array.isArray(data) ? data.length : 0,
    };
  },

  async getAllAttendance(page = 0, size = 30, params?: { employeeId?: string; startDate?: string; endDate?: string; status?: string }): Promise<PaginatedResponse<AttendanceRecord>> {
    const response = await apiClient.get('/hr/attendance', { params: { ...params } });
    const data = response.data.data;
    return {
      content: Array.isArray(data) ? data : [],
      number: page,
      size,
      totalPages: 1,
      totalElements: Array.isArray(data) ? data.length : 0,
    };
  },

  async createAttendance(request: Partial<AttendanceRecord>): Promise<AttendanceRecord> {
    const response = await apiClient.post('/hr/attendance', request);
    return response.data.data;
  },

  async updateAttendance(id: string, request: Partial<AttendanceRecord>): Promise<AttendanceRecord> {
    const response = await apiClient.put(`/hr/attendance/${id}`, request);
    return response.data.data;
  },

  async getPayroll(page = 0, size = 10, params?: { employeeId?: string; status?: string; payPeriodStart?: string; payPeriodEnd?: string }): Promise<PaginatedResponse<Payroll>> {
    const response = await apiClient.get('/hr/payroll', { params: { page, size, ...params } });
    const data = response.data.data;
    return {
      content: Array.isArray(data) ? data : [],
      number: page,
      size,
      totalPages: 1,
      totalElements: Array.isArray(data) ? data.length : 0,
    };
  },

  async createPayroll(request: Partial<Payroll>): Promise<Payroll> {
    const response = await apiClient.post('/hr/payroll', request);
    return response.data.data;
  },

  async updatePayroll(id: string, request: Partial<Payroll>): Promise<Payroll> {
    const response = await apiClient.put(`/hr/payroll/${id}`, request);
    return response.data.data;
  },

  async processPayroll(id: string): Promise<void> {
    await apiClient.post(`/hr/payroll/${id}/process`);
  },

  async getPerformanceReviews(page = 0, size = 10, params?: { employeeId?: string; reviewerId?: string }): Promise<PaginatedResponse<PerformanceReview>> {
    const response = await apiClient.get('/hr/performance-reviews', { params: { page, size, ...params } });
    const data = response.data.data;
    return {
      content: Array.isArray(data) ? data : [],
      number: page,
      size,
      totalPages: 1,
      totalElements: Array.isArray(data) ? data.length : 0,
    };
  },

  async createPerformanceReview(request: Partial<PerformanceReview>): Promise<PerformanceReview> {
    const response = await apiClient.post('/hr/performance-reviews', request);
    return response.data.data;
  },

  async updatePerformanceReview(id: string, request: Partial<PerformanceReview>): Promise<PerformanceReview> {
    const response = await apiClient.put(`/hr/performance-reviews/${id}`, request);
    return response.data.data;
  },

  async getRecruitment(page = 0, size = 10, params?: { status?: string; department?: string }): Promise<PaginatedResponse<Recruitment>> {
    const response = await apiClient.get('/hr/recruitment', { params: { page, size, ...params } });
    const data = response.data.data;
    return {
      content: Array.isArray(data) ? data : [],
      number: page,
      size,
      totalPages: 1,
      totalElements: Array.isArray(data) ? data.length : 0,
    };
  },

  async createRecruitment(request: Partial<Recruitment>): Promise<Recruitment> {
    const response = await apiClient.post('/hr/recruitment', request);
    return response.data.data;
  },

  async updateRecruitment(id: string, request: Partial<Recruitment>): Promise<Recruitment> {
    const response = await apiClient.put(`/hr/recruitment/${id}`, request);
    return response.data.data;
  },

  async getTraining(page = 0, size = 10, params?: { status?: string; trainingType?: string }): Promise<PaginatedResponse<Training>> {
    const response = await apiClient.get('/hr/training', { params: { page, size, ...params } });
    const data = response.data.data;
    return {
      content: Array.isArray(data) ? data : [],
      number: page,
      size,
      totalPages: 1,
      totalElements: Array.isArray(data) ? data.length : 0,
    };
  },

  async createTraining(request: Partial<Training>): Promise<Training> {
    const response = await apiClient.post('/hr/training', request);
    return response.data.data;
  },

  async updateTraining(id: string, request: Partial<Training>): Promise<Training> {
    const response = await apiClient.put(`/hr/training/${id}`, request);
    return response.data.data;
  },

  async getTrainingEnrollments(trainingId: string, page = 0, size = 10): Promise<PaginatedResponse<TrainingEnrollment>> {
    const response = await apiClient.get(`/hr/training/${trainingId}/enrollments`, { params: { page, size } });
    const data = response.data.data;
    return {
      content: Array.isArray(data) ? data : [],
      number: page,
      size,
      totalPages: 1,
      totalElements: Array.isArray(data) ? data.length : 0,
    };
  },

  async enrollEmployee(trainingId: string, employeeId: string): Promise<TrainingEnrollment> {
    const response = await apiClient.post(`/hr/training/${trainingId}/enroll`, { employeeId });
    return response.data.data;
  },

  async getBenefits(page = 0, size = 10, params?: { employeeId?: string; benefitType?: string }): Promise<PaginatedResponse<Benefits>> {
    const response = await apiClient.get('/hr/benefits', { params: { page, size, ...params } });
    const data = response.data.data;
    return {
      content: Array.isArray(data) ? data : [],
      number: page,
      size,
      totalPages: 1,
      totalElements: Array.isArray(data) ? data.length : 0,
    };
  },

  async createBenefits(request: Partial<Benefits>): Promise<Benefits> {
    const response = await apiClient.post('/hr/benefits', request);
    return response.data.data;
  },

  async updateBenefits(id: string, request: Partial<Benefits>): Promise<Benefits> {
    const response = await apiClient.put(`/hr/benefits/${id}`, request);
    return response.data.data;
  },

  async getCompliance(page = 0, size = 10, params?: { employeeId?: string; complianceType?: string; status?: string }): Promise<PaginatedResponse<Compliance>> {
    const response = await apiClient.get('/hr/compliance', { params: { page, size, ...params } });
    const data = response.data.data;
    return {
      content: Array.isArray(data) ? data : [],
      number: page,
      size,
      totalPages: 1,
      totalElements: Array.isArray(data) ? data.length : 0,
    };
  },

  async createCompliance(request: Partial<Compliance>): Promise<Compliance> {
    const response = await apiClient.post('/hr/hr-compliance', request);
    return response.data.data;
  },

  async updateCompliance(id: string, request: Partial<Compliance>): Promise<Compliance> {
    const response = await apiClient.put(`/hr/hr-compliance/${id}`, request);
    return response.data.data;
  },

  // ── Branches ──────────────────────────────────────────────────────────────
  async getBranches(status?: string): Promise<BranchDTO[]> {
    const response = await apiClient.get('/hr/branches', { params: status ? { status } : {} });
    const data = response.data.data;
    return Array.isArray(data) ? data : [];
  },
  async getBranchById(id: string): Promise<BranchDTO> {
    const response = await apiClient.get(`/hr/branches/${id}`);
    return response.data.data;
  },
  async createBranch(request: Partial<BranchDTO>): Promise<BranchDTO> {
    const response = await apiClient.post('/hr/branches', request);
    return response.data.data;
  },
  async updateBranch(id: string, request: Partial<BranchDTO>): Promise<BranchDTO> {
    const response = await apiClient.put(`/hr/branches/${id}`, request);
    return response.data.data;
  },
  async deleteBranch(id: string): Promise<void> {
    await apiClient.delete(`/hr/branches/${id}`);
  },

  // ── Salary Grades ─────────────────────────────────────────────────────────
  async getSalaryGrades(): Promise<SalaryGradeDTO[]> {
    const response = await apiClient.get('/hr/salary-grades');
    const data = response.data.data;
    return Array.isArray(data) ? data : [];
  },
  async createSalaryGrade(request: Partial<SalaryGradeDTO>): Promise<SalaryGradeDTO> {
    const response = await apiClient.post('/hr/salary-grades', request);
    return response.data.data;
  },
  async updateSalaryGrade(id: string, request: Partial<SalaryGradeDTO>): Promise<SalaryGradeDTO> {
    const response = await apiClient.put(`/hr/salary-grades/${id}`, request);
    return response.data.data;
  },
  async deleteSalaryGrade(id: string): Promise<void> {
    await apiClient.delete(`/hr/salary-grades/${id}`);
  },

  // ── Positions ─────────────────────────────────────────────────────────────
  async getPositions(departmentId?: string): Promise<PositionDTO[]> {
    const response = await apiClient.get('/hr/positions', { params: departmentId ? { departmentId } : {} });
    const data = response.data.data;
    return Array.isArray(data) ? data : [];
  },
  async createPosition(request: Partial<PositionDTO>): Promise<PositionDTO> {
    const response = await apiClient.post('/hr/positions', request);
    return response.data.data;
  },
  async updatePosition(id: string, request: Partial<PositionDTO>): Promise<PositionDTO> {
    const response = await apiClient.put(`/hr/positions/${id}`, request);
    return response.data.data;
  },
  async deletePosition(id: string): Promise<void> {
    await apiClient.delete(`/hr/positions/${id}`);
  },

  // ── Departments ───────────────────────────────────────────────────────────
  async getDepartments(branchId?: string): Promise<DepartmentDTO[]> {
    const response = await apiClient.get('/hr/departments', { params: branchId ? { branchId } : {} });
    const data = response.data.data;
    return Array.isArray(data) ? data : [];
  },
  async getDepartmentById(id: string): Promise<DepartmentDTO> {
    const response = await apiClient.get(`/hr/departments/${id}`);
    return response.data.data;
  },
  async createDepartment(request: Partial<DepartmentDTO>): Promise<DepartmentDTO> {
    const response = await apiClient.post('/hr/departments', request);
    return response.data.data;
  },
  async updateDepartment(id: string, request: Partial<DepartmentDTO>): Promise<DepartmentDTO> {
    const response = await apiClient.put(`/hr/departments/${id}`, request);
    return response.data.data;
  },
  async deleteDepartment(id: string): Promise<void> {
    await apiClient.delete(`/hr/departments/${id}`);
  },
};
