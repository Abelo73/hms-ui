import type { Medication } from '../api/medicationsService';

export const mockMedications: Medication[] = [
  {
    id: '1',
    patientId: 'patient-001',
    medicationName: 'Lisinopril',
    genericName: 'Lisinopril',
    dosage: '10mg',
    frequency: 'Once daily',
    route: 'ORAL',
    startDate: '2023-01-15',
    endDate: null,
    prescribingPhysicianId: 'physician-001',
    status: 'ACTIVE',
    notes: 'Take in the morning with food',
    createdAt: '2023-01-15T08:00:00Z',
    updatedAt: '2023-01-15T08:00:00Z',
  },
  {
    id: '2',
    patientId: 'patient-001',
    medicationName: 'Metformin',
    genericName: 'Metformin hydrochloride',
    dosage: '500mg',
    frequency: 'Twice daily',
    route: 'ORAL',
    startDate: '2022-08-20',
    endDate: null,
    prescribingPhysicianId: 'physician-001',
    status: 'ACTIVE',
    notes: 'Take with meals',
    createdAt: '2022-08-20T10:30:00Z',
    updatedAt: '2022-08-20T10:30:00Z',
  },
  {
    id: '3',
    patientId: 'patient-001',
    medicationName: 'Atorvastatin',
    genericName: 'Atorvastatin calcium',
    dosage: '20mg',
    frequency: 'Once daily',
    route: 'ORAL',
    startDate: '2022-05-10',
    endDate: '2023-06-01',
    prescribingPhysicianId: 'physician-002',
    status: 'DISCONTINUED',
    notes: 'Discontinued due to side effects',
    createdAt: '2022-05-10T14:00:00Z',
    updatedAt: '2023-06-01T09:00:00Z',
  },
  {
    id: '4',
    patientId: 'patient-002',
    medicationName: 'Amoxicillin',
    genericName: 'Amoxicillin trihydrate',
    dosage: '500mg',
    frequency: 'Three times daily',
    route: 'ORAL',
    startDate: '2024-01-10',
    endDate: '2024-01-17',
    prescribingPhysicianId: 'physician-003',
    status: 'COMPLETED',
    notes: 'Complete full course',
    createdAt: '2024-01-10T11:00:00Z',
    updatedAt: '2024-01-17T18:00:00Z',
  },
  {
    id: '5',
    patientId: 'patient-002',
    medicationName: 'Ibuprofen',
    genericName: 'Ibuprofen',
    dosage: '400mg',
    frequency: 'As needed',
    route: 'ORAL',
    startDate: '2024-02-01',
    endDate: null,
    prescribingPhysicianId: 'physician-003',
    status: 'ACTIVE',
    notes: 'For pain relief, maximum 3 times daily',
    createdAt: '2024-02-01T15:30:00Z',
    updatedAt: '2024-02-01T15:30:00Z',
  },
  {
    id: '6',
    patientId: 'patient-003',
    medicationName: 'Insulin Glargine',
    genericName: 'Insulin glargine',
    dosage: '10 units',
    frequency: 'Once daily',
    route: 'SUBCUTANEOUS',
    startDate: '2023-09-01',
    endDate: null,
    prescribingPhysicianId: 'physician-001',
    status: 'ACTIVE',
    notes: 'Inject at bedtime',
    createdAt: '2023-09-01T08:00:00Z',
    updatedAt: '2023-09-01T08:00:00Z',
  },
];

export const mockMedicationById = (id: string): Medication => {
  const medication = mockMedications.find(m => m.id === id);
  if (!medication) throw new Error(`Medication with id ${id} not found`);
  return medication;
};

export const mockMedicationsByPatientId = (patientId: string): Medication[] => {
  return mockMedications.filter(m => m.patientId === patientId);
};

export const mockActiveMedicationsByPatientId = (patientId: string): Medication[] => {
  return mockMedications.filter(m => m.patientId === patientId && m.status === 'ACTIVE');
};
