import apiClient from './axios';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  patientId: string;
  patientName?: string;
  invoiceDate: string;
  dueDate?: string;
  status: 'DRAFT' | 'PENDING' | 'PAID' | 'PARTIALLY_PAID' | 'OVERDUE' | 'CANCELLED' | 'REFUNDED';
  subtotal: number;
  tax: number;
  discount: number;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  paymentMethod?: string;
  notes?: string;
  lineItems?: InvoiceLineItem[];
  createdAt?: string;
}

export interface InvoiceLineItem {
  id?: string;
  serviceType?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface Payment {
  id: string;
  invoiceId: string;
  invoiceNumber?: string;
  patientId: string;
  paymentDate: string;
  paymentMethod: string;
  amount: number;
  referenceNumber?: string;
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

export const billingService = {
  async getInvoices(page = 0, size = 10): Promise<PaginatedResponse<Invoice>> {
    const response = await apiClient.get('/billing/invoices', { params: { page, size } });
    return response.data.data;
  },

  async getInvoiceById(id: string): Promise<Invoice> {
    const response = await apiClient.get(`/billing/invoices/${id}`);
    return response.data.data;
  },

  async getPatientInvoices(patientId: string, page = 0, size = 10): Promise<PaginatedResponse<Invoice>> {
    const response = await apiClient.get(`/billing/invoices/patient/${patientId}`, { params: { page, size } });
    return response.data.data;
  },

  async createInvoice(request: {
    patientId: string;
    dueDate?: string;
    lineItems: { description: string; quantity: number; unitPrice: number; serviceType?: string }[];
    paymentMethod?: string;
    notes?: string;
  }): Promise<Invoice> {
    const response = await apiClient.post('/billing/invoices', request);
    return response.data.data;
  },

  async finalizeInvoice(id: string): Promise<Invoice> {
    const response = await apiClient.post(`/billing/invoices/${id}/finalize`);
    return response.data.data;
  },

  async cancelInvoice(id: string): Promise<Invoice> {
    const response = await apiClient.post(`/billing/invoices/${id}/cancel`);
    return response.data.data;
  },

  async processPayment(request: {
    invoiceId: string;
    paymentMethod: string;
    amount: number;
    referenceNumber?: string;
    notes?: string;
  }): Promise<Payment> {
    const response = await apiClient.post('/billing/payments', request);
    return response.data.data;
  },

  async getPayments(page = 0, size = 10): Promise<PaginatedResponse<Payment>> {
    const response = await apiClient.get('/billing/payments', { params: { page, size } });
    return response.data.data;
  },

  async getInvoicePayments(invoiceId: string): Promise<Payment[]> {
    const response = await apiClient.get(`/billing/payments/invoice/${invoiceId}`);
    return response.data.data;
  },

  async getDailyRevenue(date?: string): Promise<Record<string, unknown>> {
    const response = await apiClient.get('/billing/reports/daily-revenue', { params: { date } });
    return response.data.data;
  },

  async getOutstandingBalances(): Promise<Invoice[]> {
    const response = await apiClient.get('/billing/reports/outstanding');
    return response.data.data;
  },
};
