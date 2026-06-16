import type { ApprovalRequest } from '../api/approvalsService';

export const mockApprovalRequests: ApprovalRequest[] = [
  {
    id: 'req-001',
    userId: 'user-001',
    username: 'jdoe',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@hospital.com',
    phoneNumber: '+1-555-0101',
    requestType: 'ROLE_REQUEST',
    requestedRole: 'DOCTOR',
    status: 'PENDING',
    submittedAt: '2024-01-15T10:30:00Z',
    documentsRequired: true,
    documentsVerified: false,
  },
  {
    id: 'req-002',
    userId: 'user-002',
    username: 'jsmith',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@hospital.com',
    phoneNumber: '+1-555-0102',
    requestType: 'ROLE_REQUEST',
    requestedRole: 'NURSE',
    status: 'PENDING',
    submittedAt: '2024-01-16T14:20:00Z',
    documentsRequired: false,
    documentsVerified: false,
  },
  {
    id: 'req-003',
    userId: 'user-003',
    username: 'bwilson',
    firstName: 'Bob',
    lastName: 'Wilson',
    email: 'bob.wilson@hospital.com',
    phoneNumber: '+1-555-0103',
    requestType: 'ROLE_REQUEST',
    requestedRole: 'PHARMACIST',
    status: 'PENDING',
    submittedAt: '2024-01-17T09:15:00Z',
    documentsRequired: true,
    documentsVerified: false,
  },
  {
    id: 'req-004',
    userId: 'user-004',
    username: 'ajohnson',
    firstName: 'Alice',
    lastName: 'Johnson',
    email: 'alice.johnson@hospital.com',
    phoneNumber: '+1-555-0104',
    requestType: 'ROLE_REQUEST',
    requestedRole: 'ADMIN',
    status: 'REJECTED',
    submittedAt: '2024-01-10T11:00:00Z',
    documentsRequired: false,
    documentsVerified: false,
    rejectionReason: 'Insufficient documentation provided',
  },
  {
    id: 'req-005',
    userId: 'user-005',
    username: 'clee',
    firstName: 'Carol',
    lastName: 'Lee',
    email: 'carol.lee@hospital.com',
    phoneNumber: '+1-555-0105',
    requestType: 'ROLE_REQUEST',
    requestedRole: 'LAB_TECHNICIAN',
    status: 'APPROVED',
    submittedAt: '2024-01-05T16:30:00Z',
    documentsRequired: true,
    documentsVerified: true,
  },
];

export const mockPendingApprovals = (): ApprovalRequest[] => {
  return mockApprovalRequests.filter(req => req.status === 'PENDING');
};

export const mockMyRequests = (userId: string): ApprovalRequest[] => {
  return mockApprovalRequests.filter(req => req.userId === userId);
};

export const mockApprovalById = (id: string): ApprovalRequest => {
  const request = mockApprovalRequests.find(req => req.id === id);
  if (!request) throw new Error(`Approval request with id ${id} not found`);
  return request;
};
