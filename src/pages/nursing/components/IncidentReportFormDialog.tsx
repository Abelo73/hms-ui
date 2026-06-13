import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { incidentReportsService, type IncidentReport, type CreateIncidentReportRequest, type UpdateIncidentReportRequest } from '@/services/api/incidentReportsService';
import { IncidentType, IncidentSeverity, IncidentStatus } from '@/types/nursing';

interface IncidentReportFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingReport: IncidentReport | null;
  patientId: string | null;
}

export function IncidentReportFormDialog({
  isOpen,
  onClose,
  onSuccess,
  editingReport,
  patientId,
}: IncidentReportFormDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    incidentType: IncidentType.FALL,
    incidentSeverity: IncidentSeverity.MODERATE,
    incidentStatus: IncidentStatus.REPORTED,
    incidentDate: '',
    incidentTime: '',
    location: '',
    description: '',
    immediateAction: '',
    witnesses: '',
    outcome: '',
    followUpRequired: false,
    followUpDate: '',
    notes: '',
  });

  useEffect(() => {
    if (editingReport) {
      setFormData({
        incidentType: editingReport.incidentType as any,
        incidentSeverity: editingReport.incidentSeverity as any,
        incidentStatus: editingReport.incidentStatus as any,
        incidentDate: editingReport.incidentDate,
        incidentTime: editingReport.incidentTime,
        location: editingReport.location,
        description: editingReport.description,
        immediateAction: editingReport.immediateAction || '',
        witnesses: editingReport.witnesses || '',
        outcome: editingReport.outcome || '',
        followUpRequired: editingReport.followUpRequired,
        followUpDate: editingReport.followUpDate || '',
        notes: editingReport.notes || '',
      });
    } else {
      const now = new Date();
      setFormData({
        incidentType: IncidentType.FALL,
        incidentSeverity: IncidentSeverity.MODERATE,
        incidentStatus: IncidentStatus.REPORTED,
        incidentDate: now.toISOString().split('T')[0],
        incidentTime: now.toTimeString().slice(0, 5),
        location: '',
        description: '',
        immediateAction: '',
        witnesses: '',
        outcome: '',
        followUpRequired: false,
        followUpDate: '',
        notes: '',
      });
    }
  }, [editingReport, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId) {
      toast.error('Patient is required');
      return;
    }

    setLoading(true);
    try {
      const request = {
        patientId,
        incidentType: formData.incidentType,
        incidentSeverity: formData.incidentSeverity,
        incidentStatus: formData.incidentStatus,
        incidentDate: formData.incidentDate,
        incidentTime: formData.incidentTime,
        location: formData.location,
        description: formData.description,
        immediateAction: formData.immediateAction || undefined,
        witnesses: formData.witnesses || undefined,
        outcome: formData.outcome || undefined,
        followUpRequired: formData.followUpRequired,
        followUpDate: formData.followUpDate || undefined,
        notes: formData.notes || undefined,
      };

      if (editingReport) {
        await incidentReportsService.updateIncidentReport(editingReport.id, request as UpdateIncidentReportRequest);
        toast.success('Incident report updated successfully');
      } else {
        await incidentReportsService.createIncidentReport(request as CreateIncidentReportRequest);
        toast.success('Incident report created successfully');
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving incident report:', error);
      toast.error('Failed to save incident report');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-zinc-200">
          <h2 className="text-xl font-semibold text-zinc-900">
            {editingReport ? 'Edit Incident Report' : 'New Incident Report'}
          </h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Incident Type *
              </label>
              <select
                required
                value={formData.incidentType}
                onChange={(e) => setFormData({ ...formData, incidentType: e.target.value as any })}
                className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
              >
                {Object.values(IncidentType).map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Severity *
              </label>
              <select
                required
                value={formData.incidentSeverity}
                onChange={(e) => setFormData({ ...formData, incidentSeverity: e.target.value as any })}
                className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
              >
                {Object.values(IncidentSeverity).map((severity) => (
                  <option key={severity} value={severity}>{severity}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Status *
              </label>
              <select
                required
                value={formData.incidentStatus}
                onChange={(e) => setFormData({ ...formData, incidentStatus: e.target.value as any })}
                className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
              >
                {Object.values(IncidentStatus).map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Incident Date *
              </label>
              <input
                type="date"
                required
                value={formData.incidentDate}
                onChange={(e) => setFormData({ ...formData, incidentDate: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Incident Time *
              </label>
              <input
                type="time"
                required
                value={formData.incidentTime}
                onChange={(e) => setFormData({ ...formData, incidentTime: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Location *
            </label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Description *
            </label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Immediate Action</label>
            <textarea
              rows={2}
              value={formData.immediateAction}
              onChange={(e) => setFormData({ ...formData, immediateAction: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Witnesses</label>
            <input
              type="text"
              value={formData.witnesses}
              onChange={(e) => setFormData({ ...formData, witnesses: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Outcome</label>
            <textarea
              rows={2}
              value={formData.outcome}
              onChange={(e) => setFormData({ ...formData, outcome: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="followUpRequired"
              checked={formData.followUpRequired}
              onChange={(e) => setFormData({ ...formData, followUpRequired: e.target.checked })}
              className="w-4 h-4 text-zinc-900 border-zinc-300 rounded focus:ring-zinc-900"
            />
            <label htmlFor="followUpRequired" className="text-sm font-medium text-zinc-700">
              Follow-up Required
            </label>
          </div>

          {formData.followUpRequired && (
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Follow-up Date</label>
              <input
                type="date"
                value={formData.followUpDate}
                onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Notes</label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="px-4 py-2">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white">
              {loading ? 'Saving...' : editingReport ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
