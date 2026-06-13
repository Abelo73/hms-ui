import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { laboratoryService, type LabTestRequestItem } from '@/services/api/laboratoryService';
import { toast } from 'sonner';

interface LabResultEntryFormProps {
  item: LabTestRequestItem;
  onSuccess: () => void;
  onCancel: () => void;
}

export function LabResultEntryForm({ item, onSuccess, onCancel }: LabResultEntryFormProps) {
  const [loading, setLoading] = useState(false);
  const [resultValue, setResultValue] = useState(item.resultValue || '');
  const [resultFlag, setResultFlag] = useState(item.resultFlag || 'NORMAL');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await laboratoryService.updateItemResult(item.id, resultValue, resultFlag);
      toast.success('Result updated successfully');
      onSuccess();
    } catch (error: any) {
      toast.error('Failed to update result');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1">Result Value ({item.unit || 'no unit'})</label>
        <input
          type="text"
          required
          value={resultValue}
          onChange={(e) => setResultValue(e.target.value)}
          className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
          autoFocus
        />
        {item.referenceRange && (
          <p className="text-xs text-zinc-500 mt-1">Ref: {item.referenceRange}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1">Flag</label>
        <select
          value={resultFlag}
          onChange={(e) => setResultFlag(e.target.value as any)}
          className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm"
        >
          <option value="NORMAL">Normal</option>
          <option value="ABNORMAL">Abnormal</option>
          <option value="HIGH">High</option>
          <option value="LOW">Low</option>
          <option value="CRITICAL">Critical</option>
        </select>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={loading} size="sm" className="bg-zinc-900 text-white">
          {loading ? 'Saving...' : 'Save Result'}
        </Button>
      </div>
    </form>
  );
}
