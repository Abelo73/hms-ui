import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { nursingTasksService, type NursingTask, type CreateNursingTaskRequest, type UpdateNursingTaskRequest } from '@/services/api/nursingTasksService';
import { TaskCategory, TaskPriority, TaskStatus } from '@/types/nursing';

interface NursingTaskFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingTask: NursingTask | null;
  patientId: string | null;
}

export function NursingTaskFormDialog({
  isOpen,
  onClose,
  onSuccess,
  editingTask,
  patientId,
}: NursingTaskFormDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    taskName: '',
    taskCategory: TaskCategory.ASSESSMENT,
    taskPriority: TaskPriority.MEDIUM,
    taskStatus: TaskStatus.PENDING,
    dueDate: '',
    dueTime: '',
    assignedTo: '',
    description: '',
    notes: '',
  });

  useEffect(() => {
    if (editingTask) {
      setFormData({
        taskName: editingTask.taskName,
        taskCategory: editingTask.taskCategory as any,
        taskPriority: editingTask.taskPriority as any,
        taskStatus: editingTask.taskStatus as any,
        dueDate: editingTask.dueDate,
        dueTime: editingTask.dueTime,
        assignedTo: editingTask.assignedTo,
        description: editingTask.description || '',
        notes: editingTask.notes || '',
      });
    } else {
      const now = new Date();
      setFormData({
        taskName: '',
        taskCategory: TaskCategory.ASSESSMENT,
        taskPriority: TaskPriority.MEDIUM,
        taskStatus: TaskStatus.PENDING,
        dueDate: now.toISOString().split('T')[0],
        dueTime: now.toTimeString().slice(0, 5),
        assignedTo: '',
        description: '',
        notes: '',
      });
    }
  }, [editingTask, isOpen]);

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
        taskName: formData.taskName,
        taskCategory: formData.taskCategory,
        taskPriority: formData.taskPriority,
        taskStatus: formData.taskStatus,
        dueDate: formData.dueDate,
        dueTime: formData.dueTime,
        assignedTo: formData.assignedTo,
        description: formData.description || undefined,
        notes: formData.notes || undefined,
      };

      if (editingTask) {
        await nursingTasksService.updateNursingTask(editingTask.id, request as UpdateNursingTaskRequest);
        toast.success('Task updated successfully');
      } else {
        await nursingTasksService.createNursingTask(request as CreateNursingTaskRequest);
        toast.success('Task created successfully');
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving task:', error);
      toast.error('Failed to save task');
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
            {editingTask ? 'Edit Nursing Task' : 'New Nursing Task'}
          </h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Task Name *
            </label>
            <input
              type="text"
              required
              value={formData.taskName}
              onChange={(e) => setFormData({ ...formData, taskName: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Category *
              </label>
              <select
                required
                value={formData.taskCategory}
                onChange={(e) => setFormData({ ...formData, taskCategory: e.target.value as any })}
                className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
              >
                {Object.values(TaskCategory).map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Priority *
              </label>
              <select
                required
                value={formData.taskPriority}
                onChange={(e) => setFormData({ ...formData, taskPriority: e.target.value as any })}
                className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
              >
                {Object.values(TaskPriority).map((priority) => (
                  <option key={priority} value={priority}>{priority}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Status *
              </label>
              <select
                required
                value={formData.taskStatus}
                onChange={(e) => setFormData({ ...formData, taskStatus: e.target.value as any })}
                className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
              >
                {Object.values(TaskStatus).map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Due Date *
              </label>
              <input
                type="date"
                required
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Due Time *
              </label>
              <input
                type="time"
                required
                value={formData.dueTime}
                onChange={(e) => setFormData({ ...formData, dueTime: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Assigned To *
            </label>
            <input
              type="text"
              required
              value={formData.assignedTo}
              onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
            />
          </div>

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
              {loading ? 'Saving...' : editingTask ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
