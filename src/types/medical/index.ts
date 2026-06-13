export const RecordType = {
  DIAGNOSIS: 'DIAGNOSIS',
  PROCEDURE: 'PROCEDURE',
  LAB_RESULT: 'LAB_RESULT',
  VACCINATION: 'VACCINATION',
  HOSPITALIZATION: 'HOSPITALIZATION',
  MEDICATION: 'MEDICATION',
} as const;

export type RecordType = (typeof RecordType)[keyof typeof RecordType];

export const RecordStatus = {
  DRAFT: 'DRAFT',
  FINAL: 'FINAL',
  ARCHIVED: 'ARCHIVED',
} as const;

export type RecordStatus = (typeof RecordStatus)[keyof typeof RecordStatus];

export const ConditionStatus = {
  ACTIVE: 'ACTIVE',
  RESOLVED: 'RESOLVED',
  CHRONIC: 'CHRONIC',
  RECURRING: 'RECURRING',
} as const;

export type ConditionStatus = (typeof ConditionStatus)[keyof typeof ConditionStatus];

export const AllergenType = {
  DRUG: 'DRUG',
  FOOD: 'FOOD',
  ENVIRONMENT: 'ENVIRONMENT',
} as const;

export type AllergenType = (typeof AllergenType)[keyof typeof AllergenType];

export const Severity = {
  MILD: 'MILD',
  MODERATE: 'MODERATE',
  SEVERE: 'SEVERE',
  LIFE_THREATENING: 'LIFE_THREATENING',
} as const;

export type Severity = (typeof Severity)[keyof typeof Severity];

export const MedicationRoute = {
  ORAL: 'ORAL',
  INTRAVENOUS: 'INTRAVENOUS',
  INTRAMUSCULAR: 'INTRAMUSCULAR',
  TOPICAL: 'TOPICAL',
  INHALATION: 'INHALATION',
  SUBCUTANEOUS: 'SUBCUTANEOUS',
  RECTAL: 'RECTAL',
  NASAL: 'NASAL',
} as const;

export type MedicationRoute = (typeof MedicationRoute)[keyof typeof MedicationRoute];

export const MedicationStatus = {
  ACTIVE: 'ACTIVE',
  DISCONTINUED: 'DISCONTINUED',
  COMPLETED: 'COMPLETED',
  ON_HOLD: 'ON_HOLD',
} as const;

export type MedicationStatus = (typeof MedicationStatus)[keyof typeof MedicationStatus];

export const LabResultStatus = {
  NORMAL: 'NORMAL',
  ABNORMAL: 'ABNORMAL',
  CRITICAL: 'CRITICAL',
  PENDING: 'PENDING',
} as const;

export type LabResultStatus = (typeof LabResultStatus)[keyof typeof LabResultStatus];

export const DiagnosisType = {
  PRIMARY: 'PRIMARY',
  SECONDARY: 'SECONDARY',
  ADMITTING: 'ADMITTING',
} as const;

export type DiagnosisType = (typeof DiagnosisType)[keyof typeof DiagnosisType];
