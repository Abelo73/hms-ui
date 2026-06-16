import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { appointmentsService, type Appointment, type CreateAppointmentRequest, type UpdateAppointmentRequest } from '@/services/api/appointmentsService';
import { usersService, type User } from '@/services/api/usersService';
import { patientsService, type Patient } from '@/services/api/patientsService';
import { appointmentTypes, priorities } from '@/services/mock/appointmentsMockData';
import { User as UserIcon, Stethoscope, Users } from 'lucide-react';

interface AppointmentFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingAppointment: Appointment | null;
  patientId: string | null;
}

export function AppointmentFormDialog({
  isOpen,
  onClose,
  onSuccess,
  editingAppointment,
  patientId }: AppointmentFormDialogProps) {
  const [formData, setFormData] = useState({
    doctorId: '',
    appointmentType: 'CONSULTATION',
    appointmentDate: '',
    startTime: '',
    endTime: '',
    durationMinutes: 30,
    reason: '',
    notes: '',
    symptoms: '',
    priority: 'MEDIUM',
    isVirtual: false,
    meetingLink: '' });
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState<User[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctorSearchTerm, setDoctorSearchTerm] = useState('');
  const [patientSearchTerm, setPatientSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  useEffect(() => {
    if (editingAppointment) {
      setFormData({
        doctorId: editingAppointment.doctorId,
        appointmentType: editingAppointment.appointmentType,
        appointmentDate: editingAppointment.appointmentDate,
        startTime: editingAppointment.startTime,
        endTime: editingAppointment.endTime,
        durationMinutes: editingAppointment.durationMinutes,
        reason: editingAppointment.reason || '',
        notes: editingAppointment.notes || '',
        symptoms: editingAppointment.symptoms || '',
        priority: editingAppointment.priority || 'MEDIUM',
        isVirtual: editingAppointment.isVirtual,
        meetingLink: editingAppointment.meetingLink || '' });
    } else {
      setFormData({
        doctorId: '',
        appointmentType: 'CONSULTATION',
        appointmentDate: '',
        startTime: '',
        endTime: '',
        durationMinutes: 30,
        reason: '',
        notes: '',
        symptoms: '',
        priority: 'MEDIUM',
        isVirtual: false,
        meetingLink: '' });
    }
  }, [editingAppointment, isOpen]);

  useEffect(() => {
    loadDoctors();
    loadPatients();
  }, []);

  const loadDoctors = async () => {
    try {
      const doctorsData = await usersService.getUsersByRole('DOCTOR');
      setDoctors(doctorsData);
    } catch (error) {
      console.error('Failed to load doctors:', error);
      toast.error('Failed to load doctors');
    }
  };

  const loadPatients = async () => {
    try {
      const patientsData = await patientsService.getAllPatients();
      setPatients(patientsData);
    } catch (error) {
      console.error('Failed to load patients:', error);
      toast.error('Failed to load patients');
    }
  };

  const handleDoctorSearch = async (term: string) => {
    setDoctorSearchTerm(term);
    if (term.length >= 2) {
      try {
        const results = await usersService.searchUsersByRole('DOCTOR', term);
        setDoctors(results);
      } catch (error) {
        console.error('Failed to search doctors:', error);
      }
    } else if (term.length === 0) {
      loadDoctors();
    }
  };

  const handlePatientSearch = async (term: string) => {
    setPatientSearchTerm(term);
    if (term.length >= 2) {
      try {
        const results = await patientsService.searchPatients(term);
        setPatients(results);
      } catch (error) {
        console.error('Failed to search patients:', error);
      }
    } else if (term.length === 0) {
      loadPatients();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentPatientId = selectedPatient?.id || patientId;
    if (!currentPatientId) {
      toast.error('Patient is required');
      return;
    }

    setLoading(true);
    try {
      if (editingAppointment) {
        const updateRequest: UpdateAppointmentRequest = {
          doctorId: formData.doctorId || undefined,
          appointmentType: formData.appointmentType,
          appointmentDate: formData.appointmentDate || undefined,
          startTime: formData.startTime || undefined,
          endTime: formData.endTime || undefined,
          durationMinutes: formData.durationMinutes,
          reason: formData.reason || undefined,
          notes: formData.notes || undefined,
          symptoms: formData.symptoms || undefined,
          priority: formData.priority || undefined,
          isVirtual: formData.isVirtual,
          meetingLink: formData.meetingLink || undefined };
        await appointmentsService.updateAppointment(editingAppointment.id, updateRequest);
        toast.success('Appointment updated successfully');
      } else {
        const createRequest: CreateAppointmentRequest = {
          patientId: currentPatientId,
          doctorId: formData.doctorId,
          appointmentType: formData.appointmentType,
          appointmentDate: formData.appointmentDate,
          startTime: formData.startTime,
          endTime: formData.endTime,
          durationMinutes: formData.durationMinutes,
          reason: formData.reason,
          notes: formData.notes,
          symptoms: formData.symptoms,
          priority: formData.priority,
          isVirtual: formData.isVirtual,
          meetingLink: formData.meetingLink };
        await appointmentsService.createAppointment(createRequest);
        toast.success('Appointment created successfully');
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to save appointment:', error);
      toast.error(editingAppointment ? 'Failed to update appointment' : 'Failed to create appointment');
    } finally {
      setLoading(false);
    }
  };

  const handleTimeChange = (field: 'startTime' | 'endTime', value: string) => {
    setFormData({ ...formData, [field]: value });
    
    // Auto-calculate duration when both times are set
    if (formData.startTime && value) {
      const start = formData.startTime;
      const end = value;
      const [startHours, startMinutes] = start.split(':').map(Number);
      const [endHours, endMinutes] = end.split(':').map(Number);
      const startTotalMinutes = startHours * 60 + startMinutes;
      const endTotalMinutes = endHours * 60 + endMinutes;
      const duration = endTotalMinutes - startTotalMinutes;
      if (duration > 0) {
        setFormData(prev => ({ ...prev, durationMinutes: duration }));
      }
    }
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" onClose={onClose}>
        <DialogHeader>
          <DialogTitle>
            {editingAppointment ? 'Edit Appointment' : 'Schedule New Appointment'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!patientId && (
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Patient *
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search patient by name or MRN..."
                  value={patientSearchTerm}
                  onChange={(e) => handlePatientSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
                />
              </div>
              {patients.length > 0 && (
                <div className="mt-2 max-h-40 overflow-y-auto border border-zinc-200 rounded-md">
                  {patients.map((patient) => (
                    <div
                      key={patient.id}
                      onClick={() => setSelectedPatient(patient)}
                      className={`p-2 cursor-pointer hover:bg-zinc-50 ${
                        selectedPatient?.id === patient.id ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <UserIcon className="w-4 h-4 text-zinc-400" />
                        <div>
                          <p className="text-sm font-medium text-zinc-900">
                            {patient.firstName} {patient.lastName}
                          </p>
                          <p className="text-xs text-zinc-500">MRN: {patient.medicalRecordNumber}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Doctor *
              </label>
              <div className="relative">
                <Stethoscope className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search doctor by name..."
                  value={doctorSearchTerm}
                  onChange={(e) => handleDoctorSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
                />
              </div>
              {doctors.length > 0 && (
                <div className="mt-2 max-h-40 overflow-y-auto border border-zinc-200 rounded-md">
                  {doctors.map((doctor) => (
                    <div
                      key={doctor.id}
                      onClick={() => setFormData({ ...formData, doctorId: doctor.id })}
                      className={`p-2 cursor-pointer hover:bg-zinc-50 ${
                        formData.doctorId === doctor.id ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Stethoscope className="w-4 h-4 text-zinc-400" />
                        <div>
                          <p className="text-sm font-medium text-zinc-900">
                            Dr. {doctor.firstName} {doctor.lastName}
                          </p>
                          <p className="text-xs text-zinc-500">{doctor.email}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Appointment Type *
              </label>
              <select
                required
                value={formData.appointmentType}
                onChange={(e) => setFormData({ ...formData, appointmentType: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
              >
                {appointmentTypes.map((type) => (
                  <option key={type} value={type}>{type.replace(/_/g, ' ')}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Date *
              </label>
              <input
                type="date"
                required
                value={formData.appointmentDate}
                onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Start Time *
              </label>
              <input
                type="time"
                required
                value={formData.startTime}
                onChange={(e) => handleTimeChange('startTime', e.target.value)}
                className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                End Time *
              </label>
              <input
                type="time"
                required
                value={formData.endTime}
                onChange={(e) => handleTimeChange('endTime', e.target.value)}
                className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Duration (minutes) *
              </label>
              <input
                type="number"
                required
                min="5"
                step="5"
                value={formData.durationMinutes}
                onChange={(e) => setFormData({ ...formData, durationMinutes: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
              >
                {priorities.map((priority) => (
                  <option key={priority} value={priority}>{priority}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Reason *
            </label>
            <input
              type="text"
              required
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              placeholder="Reason for appointment"
              className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Symptoms
            </label>
            <textarea
              value={formData.symptoms}
              onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
              placeholder="Describe symptoms"
              rows={2}
              className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional notes"
              rows={2}
              className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isVirtual"
              checked={formData.isVirtual}
              onChange={(e) => setFormData({ ...formData, isVirtual: e.target.checked })}
              className="w-4 h-4 border-zinc-300 rounded focus:ring-zinc-900"
            />
            <label htmlFor="isVirtual" className="text-sm text-zinc-700">
              Virtual Appointment
            </label>
          </div>

          {formData.isVirtual && (
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Meeting Link
              </label>
              <input
                type="url"
                value={formData.meetingLink}
                onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
                placeholder="https://meet.example.com/..."
                className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
              />
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-zinc-900 hover:bg-zinc-800">
              {loading ? 'Saving...' : editingAppointment ? 'Update Appointment' : 'Schedule Appointment'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
