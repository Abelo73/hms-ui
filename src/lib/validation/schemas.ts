import { z } from 'zod';

// =========================
// Authentication Schemas
// =========================

export const loginSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z
  .object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
    confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number').optional().or(z.literal('')),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// =========================
// Patient Schemas
// =========================

export const patientSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  dateOfBirth: z.string().refine((val) => {
    const date = new Date(val);
    const now = new Date();
    const minDate = new Date(now.getFullYear() - 120, now.getMonth(), now.getDate());
    return !isNaN(date.getTime()) && date.getTime() <= now.getTime() && date.getTime() >= minDate.getTime();
  }, 'Invalid date of birth'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number').optional().or(z.literal('')),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  address: z.string().max(500, 'Address must not exceed 500 characters').optional(),
  city: z.string().max(100, 'City must not exceed 100 characters').optional(),
  state: z.string().max(100, 'State must not exceed 100 characters').optional(),
  postalCode: z.string().max(20, 'Postal code must not exceed 20 characters').optional(),
  country: z.string().max(100, 'Country must not exceed 100 characters').optional(),
  emergencyContactName: z.string().min(2, 'Emergency contact name must be at least 2 characters'),
  emergencyContactPhone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid emergency contact phone number'),
  emergencyContactRelationship: z.string().min(2, 'Relationship must be at least 2 characters'),
  bloodType: z.enum(['A_POSITIVE', 'A_NEGATIVE', 'B_POSITIVE', 'B_NEGATIVE', 'AB_POSITIVE', 'AB_NEGATIVE', 'O_POSITIVE', 'O_NEGATIVE']).optional(),
  allergies: z.string().max(1000, 'Allergies must not exceed 1000 characters').optional(),
  chronicConditions: z.string().max(1000, 'Chronic conditions must not exceed 1000 characters').optional(),
  currentMedications: z.string().max(1000, 'Current medications must not exceed 1000 characters').optional(),
});

// =========================
// Appointment Schemas
// =========================

export const appointmentSchema = z.object({
  patientId: z.string().uuid('Invalid patient ID'),
  doctorId: z.string().uuid('Invalid doctor ID'),
  appointmentType: z.enum(['CONSULTATION', 'FOLLOW_UP', 'EMERGENCY', 'SURGERY', 'LAB_TEST', 'IMAGING']),
  appointmentDate: z.string().refine((val) => {
    const date = new Date(val);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return !isNaN(date.getTime()) && date.getTime() >= now.getTime();
  }, 'Appointment date must be today or in the future'),
  startTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
  endTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
  durationMinutes: z.number().min(5, 'Duration must be at least 5 minutes').max(480, 'Duration must not exceed 8 hours'),
  reason: z.string().min(3, 'Reason must be at least 3 characters').max(500, 'Reason must not exceed 500 characters'),
  symptoms: z.string().max(1000, 'Symptoms must not exceed 1000 characters').optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  isVirtual: z.boolean().default(false),
  meetingLink: z.string().url('Invalid meeting link').optional().or(z.literal('')),
  notes: z.string().max(1000, 'Notes must not exceed 1000 characters').optional(),
}).refine((data) => {
  const [startHours, startMinutes] = data.startTime.split(':').map(Number);
  const [endHours, endMinutes] = data.endTime.split(':').map(Number);
  const startTotalMinutes = startHours * 60 + startMinutes;
  const endTotalMinutes = endHours * 60 + endMinutes;
  return endTotalMinutes > startTotalMinutes;
}, {
  message: 'End time must be after start time',
  path: ['endTime'],
}).refine((data) => {
  if (data.isVirtual) {
    return data.meetingLink && data.meetingLink.length > 0;
  }
  return true;
}, {
  message: 'Meeting link is required for virtual appointments',
  path: ['meetingLink'],
});

// =========================
// Consultation Schemas
// =========================

export const consultationSchema = z.object({
  patientId: z.string().uuid('Invalid patient ID'),
  doctorId: z.string().uuid('Invalid doctor ID'),
  consultationDate: z.string().refine((val) => !isNaN(new Date(val).getTime()), 'Invalid consultation date'),
  chiefComplaint: z.string().min(3, 'Chief complaint must be at least 3 characters').max(1000, 'Chief complaint must not exceed 1000 characters'),
  historyOfPresentIllness: z.string().max(2000, 'History must not exceed 2000 characters').optional(),
  physicalExamination: z.string().max(2000, 'Physical examination must not exceed 2000 characters').optional(),
  plan: z.string().max(2000, 'Plan must not exceed 2000 characters').optional(),
  notes: z.string().max(2000, 'Notes must not exceed 2000 characters').optional(),
});

// =========================
// Medical Record Schemas
// =========================

export const medicalRecordSchema = z.object({
  patientId: z.string().uuid('Invalid patient ID'),
  recordType: z.enum(['DIAGNOSIS', 'TREATMENT', 'PROCEDURE', 'LAB_RESULT', 'IMAGING', 'DISCHARGE_SUMMARY']),
  recordDate: z.string().refine((val) => !isNaN(new Date(val).getTime()), 'Invalid record date'),
  title: z.string().min(3, 'Title must be at least 3 characters').max(200, 'Title must not exceed 200 characters'),
  description: z.string().max(1000, 'Description must not exceed 1000 characters').optional(),
  clinicalNotes: z.string().max(5000, 'Clinical notes must not exceed 5000 characters').optional(),
});

// =========================
// Lab Result Schemas
// =========================

export const labResultSchema = z.object({
  patientId: z.string().uuid('Invalid patient ID'),
  testType: z.string().max(100, 'Test type must not exceed 100 characters').optional(),
  testName: z.string().min(3, 'Test name must be at least 3 characters').max(200, 'Test name must not exceed 200 characters'),
  testDate: z.string().refine((val) => !isNaN(new Date(val).getTime()), 'Invalid test date'),
  resultValue: z.string().max(500, 'Result value must not exceed 500 characters').optional(),
  unit: z.string().max(50, 'Unit must not exceed 50 characters').optional(),
  referenceRange: z.string().max(500, 'Reference range must not exceed 500 characters').optional(),
  status: z.enum(['PENDING', 'COMPLETED', 'ABNORMAL', 'REVIEW_REQUIRED']),
  performedBy: z.string().max(200, 'Performed by must not exceed 200 characters').optional(),
  notes: z.string().max(1000, 'Notes must not exceed 1000 characters').optional(),
});

// =========================
// Medication Schemas
// =========================

export const medicationSchema = z.object({
  patientId: z.string().uuid('Invalid patient ID'),
  medicationName: z.string().min(3, 'Medication name must be at least 3 characters').max(200, 'Medication name must not exceed 200 characters'),
  dosage: z.string().max(100, 'Dosage must not exceed 100 characters').optional(),
  frequency: z.string().max(100, 'Frequency must not exceed 100 characters').optional(),
  startDate: z.string().refine((val) => !isNaN(new Date(val).getTime()), 'Invalid start date'),
  endDate: z.string().refine((val) => !isNaN(new Date(val).getTime()), 'Invalid end date').optional(),
  prescribedBy: z.string().max(200, 'Prescribed by must not exceed 200 characters').optional(),
  notes: z.string().max(1000, 'Notes must not exceed 1000 characters').optional(),
}).refine((data) => {
  if (data.endDate) {
    return new Date(data.endDate).getTime() >= new Date(data.startDate).getTime();
  }
  return true;
}, {
  message: 'End date must be after start date',
  path: ['endDate'],
});

// =========================
// Allergy Schemas
// =========================

export const allergySchema = z.object({
  patientId: z.string().uuid('Invalid patient ID'),
  allergen: z.string().min(2, 'Allergen must be at least 2 characters').max(200, 'Allergen must not exceed 200 characters'),
  severity: z.enum(['MILD', 'MODERATE', 'SEVERE', 'LIFE_THREATENING']),
  reaction: z.string().max(500, 'Reaction must not exceed 500 characters').optional(),
  diagnosedDate: z.string().refine((val) => !isNaN(new Date(val).getTime()), 'Invalid diagnosed date').optional(),
  notes: z.string().max(1000, 'Notes must not exceed 1000 characters').optional(),
});

// =========================
// Vaccination Schemas
// =========================

export const vaccinationSchema = z.object({
  patientId: z.string().uuid('Invalid patient ID'),
  vaccineName: z.string().min(3, 'Vaccine name must be at least 3 characters').max(200, 'Vaccine name must not exceed 200 characters'),
  vaccineType: z.string().max(100, 'Vaccine type must not exceed 100 characters').optional(),
  administrationDate: z.string().refine((val) => !isNaN(new Date(val).getTime()), 'Invalid administration date'),
  nextDueDate: z.string().refine((val) => !isNaN(new Date(val).getTime()), 'Invalid next due date').optional(),
  administeredBy: z.string().max(200, 'Administered by must not exceed 200 characters').optional(),
  lotNumber: z.string().max(100, 'Lot number must not exceed 100 characters').optional(),
  notes: z.string().max(1000, 'Notes must not exceed 1000 characters').optional(),
}).refine((data) => {
  if (data.nextDueDate) {
    return new Date(data.nextDueDate).getTime() >= new Date(data.administrationDate).getTime();
  }
  return true;
}, {
  message: 'Next due date must be after administration date',
  path: ['nextDueDate'],
});

// =========================
// Type Exports
// =========================

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type PatientFormData = z.infer<typeof patientSchema>;
export type AppointmentFormData = z.infer<typeof appointmentSchema>;
export type ConsultationFormData = z.infer<typeof consultationSchema>;
export type MedicalRecordFormData = z.infer<typeof medicalRecordSchema>;
export type LabResultFormData = z.infer<typeof labResultSchema>;
export type MedicationFormData = z.infer<typeof medicationSchema>;
export type AllergyFormData = z.infer<typeof allergySchema>;
export type VaccinationFormData = z.infer<typeof vaccinationSchema>;
