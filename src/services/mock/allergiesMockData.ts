import type { Allergy } from '../api/allergiesService';

export const mockAllergies: Allergy[] = [
  {
    id: '1',
    patientId: 'patient-001',
    allergenType: 'DRUG',
    allergenName: 'Penicillin',
    severity: 'SEVERE',
    reaction: 'Anaphylaxis, difficulty breathing, swelling',
    onsetDate: '2020-03-15',
    reportedBy: 'Dr. Sarah Johnson',
    createdAt: '2020-03-15T10:30:00Z',
    updatedAt: '2020-03-15T10:30:00Z',
  },
  {
    id: '2',
    patientId: 'patient-001',
    allergenType: 'FOOD',
    allergenName: 'Peanuts',
    severity: 'LIFE_THREATENING',
    reaction: 'Severe allergic reaction, hives, throat swelling',
    onsetDate: '2018-07-22',
    reportedBy: 'Dr. Michael Chen',
    createdAt: '2018-07-22T14:20:00Z',
    updatedAt: '2018-07-22T14:20:00Z',
  },
  {
    id: '3',
    patientId: 'patient-001',
    allergenType: 'ENVIRONMENT',
    allergenName: 'Pollen',
    severity: 'MILD',
    reaction: 'Sneezing, itchy eyes, runny nose',
    onsetDate: '2019-04-10',
    reportedBy: 'Dr. Emily Davis',
    createdAt: '2019-04-10T09:15:00Z',
    updatedAt: '2019-04-10T09:15:00Z',
  },
  {
    id: '4',
    patientId: 'patient-002',
    allergenType: 'DRUG',
    allergenName: 'Aspirin',
    severity: 'MODERATE',
    reaction: 'Stomach upset, rash',
    onsetDate: '2021-01-08',
    reportedBy: 'Dr. Robert Wilson',
    createdAt: '2021-01-08T11:45:00Z',
    updatedAt: '2021-01-08T11:45:00Z',
  },
  {
    id: '5',
    patientId: 'patient-002',
    allergenType: 'FOOD',
    allergenName: 'Shellfish',
    severity: 'SEVERE',
    reaction: 'Nausea, vomiting, difficulty breathing',
    onsetDate: '2017-11-30',
    reportedBy: 'Dr. Lisa Anderson',
    createdAt: '2017-11-30T16:30:00Z',
    updatedAt: '2017-11-30T16:30:00Z',
  },
];

export const mockAllergyById = (id: string): Allergy => {
  const allergy = mockAllergies.find(a => a.id === id);
  if (!allergy) throw new Error(`Allergy with id ${id} not found`);
  return allergy;
};

export const mockAllergiesByPatientId = (patientId: string): Allergy[] => {
  return mockAllergies.filter(a => a.patientId === patientId);
};
