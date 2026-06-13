import { X, Mail, Phone, MapPin, Calendar, User, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Patient } from '@/services/api/patientsService';
import { Gender, BloodType, PatientStatus } from '@/types/patient';

interface PatientViewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient | null;
}

export function PatientViewDialog({ isOpen, onClose, patient }: PatientViewDialogProps) {
  if (!isOpen || !patient) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-zinc-200">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-600 text-xl font-semibold">
              {patient.firstName[0]}{patient.lastName[0]}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-zinc-900">
                {patient.firstName} {patient.lastName}
              </h2>
              <p className="text-sm text-zinc-500 font-mono">{patient.medicalRecordNumber}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status Badge */}
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={`${
                patient.status === 'ACTIVE'
                  ? 'bg-green-50 text-green-700 border-green-200'
                  : patient.status === 'INACTIVE'
                  ? 'bg-gray-50 text-gray-700 border-gray-200'
                  : patient.status === 'ADMITTED'
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'bg-zinc-50 text-zinc-700 border-zinc-200'
              }`}
            >
              {patient.status.replace(/_/g, ' ')}
            </Badge>
            <Badge variant="outline" className="bg-zinc-50 text-zinc-700 border-zinc-200">
              {patient.gender.replace(/_/g, ' ')}
            </Badge>
            <Badge variant="outline" className="bg-zinc-50 text-zinc-700 border-zinc-200">
              {patient.bloodType.replace(/_/g, ' ')}
            </Badge>
          </div>

          {/* Personal Information */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <User className="w-4 h-4" />
              Personal Information
            </h3>
            <div className="grid grid-cols-2 gap-4 bg-zinc-50 p-4 rounded-lg">
              <div>
                <p className="text-xs text-zinc-500 mb-1">Date of Birth</p>
                <p className="text-sm font-medium text-zinc-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-zinc-400" />
                  {patient.dateOfBirth}
                </p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 mb-1">Gender</p>
                <p className="text-sm font-medium text-zinc-900">{patient.gender.replace(/_/g, ' ')}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 mb-1">Blood Type</p>
                <p className="text-sm font-medium text-zinc-900">{patient.bloodType.replace(/_/g, ' ')}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 mb-1">Registration Date</p>
                <p className="text-sm font-medium text-zinc-900">{patient.registrationDate}</p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Contact Information
            </h3>
            <div className="bg-zinc-50 p-4 rounded-lg space-y-3">
              {patient.phoneNumber && (
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-zinc-400" />
                  <div>
                    <p className="text-xs text-zinc-500">Phone</p>
                    <p className="text-sm font-medium text-zinc-900">{patient.phoneNumber}</p>
                  </div>
                </div>
              )}
              {patient.email && (
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-zinc-400" />
                  <div>
                    <p className="text-xs text-zinc-500">Email</p>
                    <p className="text-sm font-medium text-zinc-900">{patient.email}</p>
                  </div>
                </div>
              )}
              {patient.address && (
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-zinc-400" />
                  <div>
                    <p className="text-xs text-zinc-500">Address</p>
                    <p className="text-sm font-medium text-zinc-900">
                      {patient.address}
                      {patient.city && `, ${patient.city}`}
                      {patient.state && `, ${patient.state}`}
                      {patient.postalCode && ` ${patient.postalCode}`}
                      {patient.country && `, ${patient.country}`}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Emergency Contact */}
          {(patient.emergencyContactName || patient.emergencyContactPhone) && (
            <div>
              <h3 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Emergency Contact
              </h3>
              <div className="bg-zinc-50 p-4 rounded-lg">
                {patient.emergencyContactName && (
                  <div className="mb-2">
                    <p className="text-xs text-zinc-500">Name</p>
                    <p className="text-sm font-medium text-zinc-900">{patient.emergencyContactName}</p>
                  </div>
                )}
                {patient.emergencyContactPhone && (
                  <div className="mb-2">
                    <p className="text-xs text-zinc-500">Phone</p>
                    <p className="text-sm font-medium text-zinc-900">{patient.emergencyContactPhone}</p>
                  </div>
                )}
                {patient.emergencyContactRelationship && (
                  <div>
                    <p className="text-xs text-zinc-500">Relationship</p>
                    <p className="text-sm font-medium text-zinc-900">{patient.emergencyContactRelationship}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Medical Information */}
          {(patient.allergies || patient.chronicConditions || patient.currentMedications) && (
            <div>
              <h3 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Medical Information
              </h3>
              <div className="bg-zinc-50 p-4 rounded-lg space-y-3">
                {patient.allergies && (
                  <div>
                    <p className="text-xs text-zinc-500 mb-1">Allergies</p>
                    <p className="text-sm font-medium text-zinc-900">{patient.allergies}</p>
                  </div>
                )}
                {patient.chronicConditions && (
                  <div>
                    <p className="text-xs text-zinc-500 mb-1">Chronic Conditions</p>
                    <p className="text-sm font-medium text-zinc-900">{patient.chronicConditions}</p>
                  </div>
                )}
                {patient.currentMedications && (
                  <div>
                    <p className="text-xs text-zinc-500 mb-1">Current Medications</p>
                    <p className="text-sm font-medium text-zinc-900">{patient.currentMedications}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Insurance Information */}
          {(patient.insuranceProvider || patient.insurancePolicyNumber) && (
            <div>
              <h3 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider mb-3">Insurance Information</h3>
              <div className="bg-zinc-50 p-4 rounded-lg space-y-2">
                {patient.insuranceProvider && (
                  <div>
                    <p className="text-xs text-zinc-500">Provider</p>
                    <p className="text-sm font-medium text-zinc-900">{patient.insuranceProvider}</p>
                  </div>
                )}
                {patient.insurancePolicyNumber && (
                  <div>
                    <p className="text-xs text-zinc-500">Policy Number</p>
                    <p className="text-sm font-medium text-zinc-900">{patient.insurancePolicyNumber}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Notes */}
          {patient.notes && (
            <div>
              <h3 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider mb-3">Notes</h3>
              <div className="bg-zinc-50 p-4 rounded-lg">
                <p className="text-sm text-zinc-900">{patient.notes}</p>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-4 border-t border-zinc-200">
            <Button onClick={onClose}>Close</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
