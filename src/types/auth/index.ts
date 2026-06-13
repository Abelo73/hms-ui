export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  roles: string[];
  permissions: string[];
  approvalStatus: ApprovalStatus;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export const ApprovalStatus = {
  PENDING_SUBMISSION: 'PENDING_SUBMISSION',
  PENDING_VERIFICATION: 'PENDING_VERIFICATION',
  PENDING_APPROVAL: 'PENDING_APPROVAL',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  SUSPENDED: 'SUSPENDED',
} as const;

export type ApprovalStatus = typeof ApprovalStatus[keyof typeof ApprovalStatus];

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  userId: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  permissions: string[];
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  roles?: string[];
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ApprovalStatusResponse {
  id: string;
  userId: string;
  requestType: string;
  status: ApprovalStatus;
  requestedRole?: string;
  submittedAt: string;
  approvedAt?: string;
  approvedBy?: string;
  rejectionReason?: string;
}

export interface UserDocument {
  id: string;
  userId: string;
  documentType: string;
  fileName: string;
  fileUrl: string;
  verified: boolean;
  verifiedAt?: string;
  verifiedBy?: string;
  rejectionReason?: string;
  uploadedAt: string;
}
