import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Search, Plus, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { hrService, type PerformanceReview } from '@/services/api/hrService';

const RATINGS = ['EXCELLENT', 'GOOD', 'SATISFACTORY', 'NEEDS_IMPROVEMENT', 'POOR'];

const ratingColor: Record<string, string> = {
  EXCELLENT: 'bg-green-100 text-green-700',
  GOOD: 'bg-blue-100 text-blue-700',
  SATISFACTORY: 'bg-yellow-100 text-yellow-700',
  NEEDS_IMPROVEMENT: 'bg-orange-100 text-orange-700',
  POOR: 'bg-red-100 text-red-700',
};

type ReviewDialogProps = {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
};

function ReviewFormDialog({ open, onClose, onSave }: ReviewDialogProps) {
  const blank = {
    employeeId: '', reviewerId: '', reviewPeriodStart: '', reviewPeriodEnd: '',
    reviewDate: '', rating: 'GOOD', goalsAchieved: '', areasForImprovement: '',
    strengths: '', comments: '',
  };
  const [form, setForm] = useState(blank);
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (open) setForm(blank); }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.employeeId || !form.reviewerId || !form.reviewDate) {
      toast.error('Employee ID, Reviewer ID and review date are required');
      return;
    }
    setSaving(true);
    try {
      await hrService.createPerformanceReview({
        employeeId: form.employeeId,
        reviewerId: form.reviewerId,
        reviewPeriodStart: form.reviewPeriodStart,
        reviewPeriodEnd: form.reviewPeriodEnd,
        reviewDate: form.reviewDate,
        rating: form.rating,
        goalsAchieved: form.goalsAchieved,
        areasForImprovement: form.areasForImprovement,
        strengths: form.strengths,
        comments: form.comments,
      });
      toast.success('Performance review created');
      onSave();
      onClose();
    } catch {
      toast.error('Failed to create review');
    } finally {
      setSaving(false);
    }
  };

  const inp = (label: string, key: keyof typeof form, type = 'text', required = false) => (
    <div className="space-y-1">
      <label className="text-xs font-medium text-zinc-700">{label}{required ? ' *' : ''}</label>
      <input type={type} value={form[key]} required={required}
        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        className="w-full h-9 px-3 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5" />
    </div>
  );

  const ta = (label: string, key: keyof typeof form) => (
    <div className="space-y-1">
      <label className="text-xs font-medium text-zinc-700">{label}</label>
      <textarea rows={2} value={form[key]}
        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none resize-none" />
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">Create Performance Review</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3 py-2">
          <div className="grid grid-cols-2 gap-3">
            {inp('Employee ID', 'employeeId', 'text', true)}
            {inp('Reviewer ID', 'reviewerId', 'text', true)}
          </div>
          <div className="grid grid-cols-3 gap-3">
            {inp('Period Start', 'reviewPeriodStart', 'date')}
            {inp('Period End', 'reviewPeriodEnd', 'date')}
            {inp('Review Date', 'reviewDate', 'date', true)}
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-700">Rating *</label>
            <select value={form.rating}
              onChange={e => setForm(f => ({ ...f, rating: e.target.value }))}
              className="w-full h-9 px-3 border border-zinc-200 rounded-lg text-sm focus:outline-none bg-white">
              {RATINGS.map(r => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
            </select>
          </div>
          {ta('Goals Achieved', 'goalsAchieved')}
          {ta('Strengths', 'strengths')}
          {ta('Areas for Improvement', 'areasForImprovement')}
          {ta('Comments', 'comments')}
          <DialogFooter>
            <Button type="button" variant="outline" size="sm" onClick={onClose}>Cancel</Button>
            <Button type="submit" size="sm" className="bg-zinc-900 hover:bg-zinc-800 text-white" disabled={saving}>
              {saving ? 'Creating...' : 'Create Review'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function PerformanceReviewPage() {
  const [reviews, setReviews] = useState<PerformanceReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({ page: 0, size: 10, totalPages: 0, totalElements: 0 });
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => { load(); }, [pagination.page]);

  const load = async () => {
    setLoading(true);
    try {
      const data = await hrService.getPerformanceReviews(pagination.page, pagination.size);
      setReviews(data.content || []);
      setPagination(p => ({ ...p, totalPages: data.totalPages, totalElements: data.totalElements }));
    } catch {
      toast.error('Failed to load performance reviews');
    } finally {
      setLoading(false);
    }
  };

  const filtered = searchTerm
    ? reviews.filter(r => `${r.employeeId} ${r.rating}`.toLowerCase().includes(searchTerm.toLowerCase()))
    : reviews;

  return (
    <MainLayout
      pageTitle="Performance Reviews"
      pageAction={
        <Button size="sm" className="h-8 px-3 bg-zinc-900 hover:bg-zinc-800 text-white shadow-sm"
          onClick={() => setDialogOpen(true)}>
          <Plus className="w-3.5 h-3.5 mr-2" /> Add Review
        </Button>
      }
    >
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
          <input type="text" placeholder="Search by employee ID, rating..." value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full h-9 pl-10 pr-4 bg-white border border-zinc-200 rounded-lg text-sm focus:outline-none shadow-sm" />
        </div>

        {loading ? (
          <div className="w-full h-48 border border-zinc-200 rounded-lg bg-white flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="w-full h-64 border border-dashed border-zinc-300 rounded-lg bg-zinc-50/50 flex flex-col items-center justify-center">
            <Star className="w-8 h-8 text-zinc-300 mb-2" />
            <p className="text-sm font-medium text-zinc-900">No performance reviews found</p>
          </div>
        ) : (
          <>
            <div className="text-[12px] font-medium text-zinc-500 uppercase tracking-wider px-1">
              {pagination.totalElements} reviews
            </div>
            <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-zinc-50 border-b border-zinc-200">
                  <tr>
                    {['Employee ID', 'Reviewer ID', 'Review Period', 'Review Date', 'Rating'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-zinc-600 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {filtered.map(review => (
                    <tr key={review.id} className="hover:bg-zinc-50">
                      <td className="px-4 py-3 text-xs font-mono text-zinc-700">{review.employeeId?.slice(0, 8)}…</td>
                      <td className="px-4 py-3 text-xs font-mono text-zinc-600">{review.reviewerId?.slice(0, 8)}…</td>
                      <td className="px-4 py-3 text-sm text-zinc-600">{review.reviewPeriodStart} — {review.reviewPeriodEnd}</td>
                      <td className="px-4 py-3 text-sm text-zinc-600">{review.reviewDate}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium ${ratingColor[review.rating] ?? 'bg-zinc-100 text-zinc-700'}`}>
                          <Star className="w-2.5 h-2.5 fill-current" />
                          {review.rating?.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-zinc-200 pt-4">
            <span className="text-sm text-zinc-500">
              Showing {pagination.page * pagination.size + 1}–{Math.min((pagination.page + 1) * pagination.size, pagination.totalElements)} of {pagination.totalElements}
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))} disabled={pagination.page === 0} className="h-8 px-3">
                <ChevronLeft className="w-4 h-4 mr-1" /> Previous
              </Button>
              <Button variant="outline" size="sm" onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))} disabled={pagination.page >= pagination.totalPages - 1} className="h-8 px-3">
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <ReviewFormDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onSave={load} />
    </MainLayout>
  );
}
