export const Gender = {
  MALE: 'MALE',
  FEMALE: 'FEMALE',
  OTHER: 'OTHER',
  PREFER_NOT_TO_SAY: 'PREFER_NOT_TO_SAY',
} as const;
export type Gender = typeof Gender[keyof typeof Gender];

export const BloodType = {
  A_POSITIVE: 'A_POSITIVE',
  A_NEGATIVE: 'A_NEGATIVE',
  B_POSITIVE: 'B_POSITIVE',
  B_NEGATIVE: 'B_NEGATIVE',
  AB_POSITIVE: 'AB_POSITIVE',
  AB_NEGATIVE: 'AB_NEGATIVE',
  O_POSITIVE: 'O_POSITIVE',
  O_NEGATIVE: 'O_NEGATIVE',
  UNKNOWN: 'UNKNOWN',
} as const;
export type BloodType = typeof BloodType[keyof typeof BloodType];

export const PatientStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  ADMITTED: 'ADMITTED',
  DISCHARGED: 'DISCHARGED',
  DECEASED: 'DECEASED',
  PENDING_REGISTRATION: 'PENDING_REGISTRATION',
} as const;
export type PatientStatus = typeof PatientStatus[keyof typeof PatientStatus];

export interface Patient {
  id: string;
  medicalRecordNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: Gender;
  bloodType?: BloodType;
  phoneNumber?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelationship?: string;
  allergies?: string;
  chronicConditions?: string;
  currentMedications?: string;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  registrationDate: string;
  status: PatientStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePatientRequest {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: Gender;
  bloodType?: BloodType;
  phoneNumber?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelationship?: string;
  allergies?: string;
  chronicConditions?: string;
  currentMedications?: string;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  notes?: string;
}

export interface UpdatePatientRequest {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: Gender;
  bloodType?: BloodType;
  phoneNumber?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelationship?: string;
  allergies?: string;
  chronicConditions?: string;
  currentMedications?: string;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  status?: PatientStatus;
  notes?: string;
}
