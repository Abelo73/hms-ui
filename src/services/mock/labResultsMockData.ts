import { LabResult } from '../api/labResultsService';

export const mockLabResults: LabResult[] = [
  {
    id: '1',
    patientId: 'patient-001',
    testType: 'Blood Test',
    testName: 'Complete Blood Count (CBC)',
    testDate: '2024-01-15',
    resultValue: 'Normal',
    unit: 'N/A',
    referenceRange: 'See individual components',
    status: 'NORMAL',
    performedBy: 'Lab Technician - John Smith',
    notes: 'All values within normal range',
    createdAt: '2024-01-15T14:30:00Z',
    updatedAt: '2024-01-15T14:30:00Z',
  },
  {
    id: '2',
    patientId: 'patient-001',
    testType: 'Blood Test',
    testName: 'Lipid Panel',
    testDate: '2024-01-15',
    resultValue: 'LDL: 145 mg/dL',
    unit: 'mg/dL',
    referenceRange: 'LDL: <100 mg/dL',
    status: 'ABNORMAL',
    performedBy: 'Lab Technician - John Smith',
    notes: 'LDL cholesterol elevated, recommend dietary changes',
    createdAt: '2024-01-15T14:30:00Z',
    updatedAt: '2024-01-15T14:30:00Z',
  },
  {
    id: '3',
    patientId: 'patient-001',
    testType: 'Blood Test',
    testName: 'HbA1c',
    testDate: '2024-02-20',
    resultValue: '7.2%',
    unit: '%',
    referenceRange: '4.0% - 5.6%',
    status: 'ABNORMAL',
    performedBy: 'Lab Technician - Sarah Brown',
    notes: 'Elevated HbA1c indicates poor diabetes control',
    createdAt: '2024-02-20T10:00:00Z',
    updatedAt: '2024-02-20T10:00:00Z',
  },
  {
    id: '4',
    patientId: 'patient-002',
    testType: 'Urinalysis',
    testName: 'Complete Urinalysis',
    testDate: '2024-03-01',
    resultValue: 'Normal',
    unit: 'N/A',
    referenceRange: 'Normal ranges apply',
    status: 'NORMAL',
    performedBy: 'Lab Technician - Emily White',
    notes: 'No abnormalities detected',
    createdAt: '2024-03-01T09:15:00Z',
    updatedAt: '2024-03-01T09:15:00Z',
  },
  {
    id: '5',
    patientId: 'patient-002',
    testType: 'Blood Test',
    testName: 'Troponin I',
    testDate: '2024-03-05',
    resultValue: '0.45 ng/mL',
    unit: 'ng/mL',
    referenceRange: '0.00 - 0.04 ng/mL',
    status: 'CRITICAL',
    performedBy: 'Lab Technician - Robert Green',
    notes: 'Elevated troponin - possible cardiac event. Immediate attention required.',
    createdAt: '2024-03-05T03:30:00Z',
    updatedAt: '2024-03-05T03:30:00Z',
  },
  {
    id: '6',
    patientId: 'patient-003',
    testType: 'Blood Test',
    testName: 'Thyroid Panel (TSH)',
    testDate: '2024-02-28',
    resultValue: 'Pending',
    unit: 'mIU/L',
    referenceRange: '0.4 - 4.0 mIU/L',
    status: 'PENDING',
    performedBy: 'Lab Technician - Maria Garcia',
    notes: 'Sample sent to reference lab',
    createdAt: '2024-02-28T16:00:00Z',
    updatedAt: '2024-02-28T16:00:00Z',
  },
];

export const mockLabResultById = (id: string): LabResult => {
  const labResult = mockLabResults.find(l => l.id === id);
  if (!labResult) throw new Error(`Lab result with id ${id} not found`);
  return labResult;
};

export const mockLabResultsByPatientId = (patientId: string): LabResult[] => {
  return mockLabResults.filter(l => l.patientId === patientId);
};
