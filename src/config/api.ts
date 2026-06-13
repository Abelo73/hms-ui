const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

export const apiConfig = {
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
};

export const endpoints = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refreshToken: '/auth/refresh-token',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
  },
  users: {
    base: '/users',
    me: '/users/me',
  },
  approvals: {
    base: '/approvals',
    pending: '/approvals/pending',
    my: '/approvals/my-requests',
    process: '/approvals/process',
    myStatus: '/approvals/my-status',
    resubmit: (userId: string) => `/approvals/resubmit/${userId}`,
  },
  roles: {
    base: '/roles',
  },
  permissions: {
    base: '/permissions',
  },
  documents: {
    myDocuments: '/documents/my-documents',
    uploadMyDocument: '/documents/upload-my-document',
  },
};

export default apiConfig;
