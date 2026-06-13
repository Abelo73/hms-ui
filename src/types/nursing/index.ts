export const CarePlanType = {
  ASSESSMENT: 'ASSESSMENT',
  INTERVENTION: 'INTERVENTION',
  EVALUATION: 'EVALUATION',
  DISCHARGE: 'DISCHARGE',
} as const;

export type CarePlanType = (typeof CarePlanType)[keyof typeof CarePlanType];

export const CarePlanStatus = {
  ACTIVE: 'ACTIVE',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  ON_HOLD: 'ON_HOLD',
} as const;

export type CarePlanStatus = (typeof CarePlanStatus)[keyof typeof CarePlanStatus];

export const AssessmentType = {
  ADMISSION: 'ADMISSION',
  DAILY: 'DAILY',
  SHIFT: 'SHIFT',
  DISCHARGE: 'DISCHARGE',
  FALL_RISK: 'FALL_RISK',
  PRESSURE_ULCER: 'PRESSURE_ULCER',
  PAIN: 'PAIN',
  NUTRITION: 'NUTRITION',
} as const;

export type AssessmentType = (typeof AssessmentType)[keyof typeof AssessmentType];

export const RiskLevel = {
  LOW: 'LOW',
  MODERATE: 'MODERATE',
  HIGH: 'HIGH',
  SEVERE: 'SEVERE',
} as const;

export type RiskLevel = (typeof RiskLevel)[keyof typeof RiskLevel];

export const VitalSignType = {
  TEMPERATURE: 'TEMPERATURE',
  BLOOD_PRESSURE: 'BLOOD_PRESSURE',
  HEART_RATE: 'HEART_RATE',
  RESPIRATORY_RATE: 'RESPIRATORY_RATE',
  OXYGEN_SATURATION: 'OXYGEN_SATURATION',
  PAIN_SCORE: 'PAIN_SCORE',
  BLOOD_GLUCOSE: 'BLOOD_GLUCOSE',
  HEIGHT: 'HEIGHT',
  WEIGHT: 'WEIGHT',
  BMI: 'BMI',
} as const;

export type VitalSignType = (typeof VitalSignType)[keyof typeof VitalSignType];

export const TemperatureUnit = {
  CELSIUS: 'CELSIUS',
  FAHRENHEIT: 'FAHRENHEIT',
} as const;

export type TemperatureUnit = (typeof TemperatureUnit)[keyof typeof TemperatureUnit];

export const TemperatureSite = {
  ORAL: 'ORAL',
  AXILLARY: 'AXILLARY',
  RECTAL: 'RECTAL',
  TEMPORAL: 'TEMPORAL',
  TYMPANIC: 'TYMPANIC',
} as const;

export type TemperatureSite = (typeof TemperatureSite)[keyof typeof TemperatureSite];

export const BloodPressurePosition = {
  SITTING: 'SITTING',
  LYING: 'LYING',
  STANDING: 'STANDING',
} as const;

export type BloodPressurePosition = (typeof BloodPressurePosition)[keyof typeof BloodPressurePosition];

export const HeartRateRhythm = {
  REGULAR: 'REGULAR',
  IRREGULAR: 'IRREGULAR',
} as const;

export type HeartRateRhythm = (typeof HeartRateRhythm)[keyof typeof HeartRateRhythm];

export const RespiratoryPattern = {
  REGULAR: 'REGULAR',
  IRREGULAR: 'IRREGULAR',
  CHEYNE_STOKES: 'CHEYNE_STOKES',
  KUSSMAUL: 'KUSSMAUL',
  BIOT: 'BIOT',
} as const;

export type RespiratoryPattern = (typeof RespiratoryPattern)[keyof typeof RespiratoryPattern];

export const OxygenDeliveryMethod = {
  ROOM_AIR: 'ROOM_AIR',
  NASAL_CANNULA: 'NASAL_CANNULA',
  FACE_MASK: 'FACE_MASK',
  VENTURI_MASK: 'VENTURI_MASK',
  NON_REBREATHER: 'NON_REBREATHER',
  TRACHEOSTOMY: 'TRACHEOSTOMY',
  MECHANICAL_VENTILATOR: 'MECHANICAL_VENTILATOR',
} as const;

export type OxygenDeliveryMethod = (typeof OxygenDeliveryMethod)[keyof typeof OxygenDeliveryMethod];

export const PainScale = {
  NUMERIC: 'NUMERIC',
  FLACC: 'FLACC',
  WONG_BAKER: 'WONG_BAKER',
  COMFORT: 'COMFORT',
} as const;

export type PainScale = (typeof PainScale)[keyof typeof PainScale];

export const MedicationRoute = {
  ORAL: 'ORAL',
  INTRAVENOUS: 'INTRAVENOUS',
  INTRAMUSCULAR: 'INTRAMUSCULAR',
  SUBCUTANEOUS: 'SUBCUTANEOUS',
  TOPICAL: 'TOPICAL',
  INHALATION: 'INHALATION',
  RECTAL: 'RECTAL',
  NASAL: 'NASAL',
  OPHTHALMIC: 'OPHTHALMIC',
  OTIC: 'OTIC',
} as const;

export type MedicationRoute = (typeof MedicationRoute)[keyof typeof MedicationRoute];

export const AdministrationStatus = {
  SCHEDULED: 'SCHEDULED',
  ADMINISTERED: 'ADMINISTERED',
  HELD: 'HELD',
  REFUSED: 'REFUSED',
  MISSED: 'MISSED',
} as const;

export type AdministrationStatus = (typeof AdministrationStatus)[keyof typeof AdministrationStatus];

export const NoteType = {
  NARRATIVE: 'NARRATIVE',
  FLOW_SHEET: 'FLOW_SHEET',
  DAR: 'DAR',
  TELEMETRY: 'TELEMETRY',
  PROGRESS: 'PROGRESS',
} as const;

export type NoteType = (typeof NoteType)[keyof typeof NoteType];

export const WoundType = {
  PRESSURE_ULCER: 'PRESSURE_ULCER',
  SURGICAL: 'SURGICAL',
  TRAUMATIC: 'TRAUMATIC',
  BURN: 'BURN',
  DIABETIC_ULCER: 'DIABETIC_ULCER',
  VENOUS_STASIS: 'VENOUS_STASIS',
  ARTERIAL: 'ARTERIAL',
} as const;

export type WoundType = (typeof WoundType)[keyof typeof WoundType];

export const WoundStage = {
  STAGE_1: 'STAGE_1',
  STAGE_2: 'STAGE_2',
  STAGE_3: 'STAGE_3',
  STAGE_4: 'STAGE_4',
  DEEP_TISSUE_INJURY: 'DEEP_TISSUE_INJURY',
  UNSTAGEABLE: 'UNSTAGEABLE',
} as const;

export type WoundStage = (typeof WoundStage)[keyof typeof WoundStage];

export const ExudateType = {
  SEROUS: 'SEROUS',
  SEROSANGUINEOUS: 'SEROSANGUINEOUS',
  SANGUINEOUS: 'SANGUINEOUS',
  PURULENT: 'PURULENT',
  NONE: 'NONE',
} as const;

export type ExudateType = (typeof ExudateType)[keyof typeof ExudateType];

export const ExudateAmount = {
  SCANT: 'SCANT',
  LIGHT: 'LIGHT',
  MODERATE: 'MODERATE',
  HEAVY: 'HEAVY',
  NONE: 'NONE',
} as const;

export type ExudateAmount = (typeof ExudateAmount)[keyof typeof ExudateAmount];

export const OdorLevel = {
  NONE: 'NONE',
  SLIGHT: 'SLIGHT',
  MODERATE: 'MODERATE',
  STRONG: 'STRONG',
} as const;

export type OdorLevel = (typeof OdorLevel)[keyof typeof OdorLevel];

export const HealingProgress = {
  NOT_HEALING: 'NOT_HEALING',
  SLOW_HEALING: 'SLOW_HEALING',
  HEALING: 'HEALING',
  FULLY_HEALED: 'FULLY_HEALED',
} as const;

export type HealingProgress = (typeof HealingProgress)[keyof typeof HealingProgress];

export const FluidType = {
  ORAL: 'ORAL',
  INTRAVENOUS: 'INTRAVENOUS',
  PARENTERAL: 'PARENTERAL',
  BLOOD_PRODUCT: 'BLOOD_PRODUCT',
  OTHER: 'OTHER',
} as const;

export type FluidType = (typeof FluidType)[keyof typeof FluidType];

export const ShiftType = {
  DAY: 'DAY',
  NIGHT: 'NIGHT',
  EVENING: 'EVENING',
} as const;

export type ShiftType = (typeof ShiftType)[keyof typeof ShiftType];

export const ShiftRecordStatus = {
  SCHEDULED: 'SCHEDULED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  MISSED: 'MISSED',
} as const;

export type ShiftRecordStatus = (typeof ShiftRecordStatus)[keyof typeof ShiftRecordStatus];

export const TaskCategory = {
  ASSESSMENT: 'ASSESSMENT',
  MEDICATION: 'MEDICATION',
  TREATMENT: 'TREATMENT',
  DOCUMENTATION: 'DOCUMENTATION',
  PATIENT_CARE: 'PATIENT_CARE',
  COMMUNICATION: 'COMMUNICATION',
  ADMINISTRATIVE: 'ADMINISTRATIVE',
} as const;

export type TaskCategory = (typeof TaskCategory)[keyof typeof TaskCategory];

export const TaskPriority = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT',
} as const;

export type TaskPriority = (typeof TaskPriority)[keyof typeof TaskPriority];

export const TaskStatus = {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  OVERDUE: 'OVERDUE',
} as const;

export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus];

export const IncidentType = {
  FALL: 'FALL',
  MEDICATION_ERROR: 'MEDICATION_ERROR',
  PRESSURE_INJURY: 'PRESSURE_INJURY',
  PATIENT_ELOPEMENT: 'PATIENT_ELOPEMENT',
  WORKPLACE_INJURY: 'WORKPLACE_INJURY',
  EQUIPMENT_FAILURE: 'EQUIPMENT_FAILURE',
  OTHER: 'OTHER',
} as const;

export type IncidentType = (typeof IncidentType)[keyof typeof IncidentType];

export const IncidentSeverity = {
  MINOR: 'MINOR',
  MODERATE: 'MODERATE',
  MAJOR: 'MAJOR',
  SEVERE: 'SEVERE',
  CRITICAL: 'CRITICAL',
} as const;

export type IncidentSeverity = (typeof IncidentSeverity)[keyof typeof IncidentSeverity];

export const IncidentStatus = {
  REPORTED: 'REPORTED',
  UNDER_INVESTIGATION: 'UNDER_INVESTIGATION',
  RESOLVED: 'RESOLVED',
  CLOSED: 'CLOSED',
} as const;

export type IncidentStatus = (typeof IncidentStatus)[keyof typeof IncidentStatus];
