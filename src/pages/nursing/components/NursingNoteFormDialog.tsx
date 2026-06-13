import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { nursingNotesService, type NursingNote, type CreateNursingNoteRequest, type UpdateNursingNoteRequest } from '@/services/api/nursingNotesService';
import { NoteType } from '@/types/nursing';

interface NursingNoteFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingNote: NursingNote | null;
  patientId: string | null;
}

export function NursingNoteFormDialog({
  isOpen,
  onClose,
  onSuccess,
  editingNote,
  patientId,
}: NursingNoteFormDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    noteType: NoteType.NARRATIVE,
    noteDate: '',
    noteTime: '',
    subject: '',
    content: '',
    assessment: '',
    intervention: '',
    response: '',
  });

  useEffect(() => {
    if (editingNote) {
      setFormData({
        noteType: editingNote.noteType as any,
        noteDate: editingNote.noteDate,
        noteTime: editingNote.noteTime,
        subject: editingNote.subject,
        content: editingNote.content,
        assessment: editingNote.assessment || '',
        intervention: editingNote.intervention || '',
        response: editingNote.response || '',
      });
    } else {
      const now = new Date();
      setFormData({
        noteType: NoteType.NARRATIVE,
        noteDate: now.toISOString().split('T')[0],
        noteTime: now.toTimeString().slice(0, 5),
        subject: '',
        content: '',
        assessment: '',
        intervention: '',
        response: '',
      });
    }
  }, [editingNote, isOpen]);

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
        noteType: formData.noteType,
        noteDate: formData.noteDate,
        noteTime: formData.noteTime,
        subject: formData.subject,
        content: formData.content,
        assessment: formData.assessment || undefined,
        intervention: formData.intervention || undefined,
        response: formData.response || undefined,
      };

      if (editingNote) {
        await nursingNotesService.updateNursingNote(editingNote.id, request as UpdateNursingNoteRequest);
        toast.success('Nursing note updated successfully');
      } else {
        await nursingNotesService.createNursingNote(request as CreateNursingNoteRequest);
        toast.success('Nursing note created successfully');
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving nursing note:', error);
      toast.error('Failed to save nursing note');
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
            {editingNote ? 'Edit Nursing Note' : 'New Nursing Note'}
          </h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Note Type *
            </label>
            <select
              required
              value={formData.noteType}
              onChange={(e) => setFormData({ ...formData, noteType: e.target.value as any })}
              className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
            >
              {Object.values(NoteType).map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Note Date *
              </label>
              <input
                type="date"
                required
                value={formData.noteDate}
                onChange={(e) => setFormData({ ...formData, noteDate: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Note Time *
              </label>
              <input
                type="time"
                required
                value={formData.noteTime}
                onChange={(e) => setFormData({ ...formData, noteTime: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Subject *
            </label>
            <input
              type="text"
              required
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Content *
            </label>
            <textarea
              required
              rows={4}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Assessment</label>
            <textarea
              rows={2}
              value={formData.assessment}
              onChange={(e) => setFormData({ ...formData, assessment: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Intervention</label>
            <textarea
              rows={2}
              value={formData.intervention}
              onChange={(e) => setFormData({ ...formData, intervention: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Response</label>
            <textarea
              rows={2}
              value={formData.response}
              onChange={(e) => setFormData({ ...formData, response: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="px-4 py-2">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white">
              {loading ? 'Saving...' : editingNote ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
