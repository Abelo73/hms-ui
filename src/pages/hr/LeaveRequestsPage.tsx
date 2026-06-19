import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Plus, CalendarOff, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { hrService, type LeaveRequest } from '@/services/api/hrService';
import { LeaveRequestsTable } from './components/LeaveRequestsTable';
import { LeaveRequestFormDialog } from './components/LeaveRequestFormDialog';
import { RejectionDialog } from './components/RejectionDialog';

const STATUS_FILTERS = ['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'];

export function LeaveRequestsPage() {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [rejectingRequest, setRejectingRequest] = useState<LeaveRequest | null>(null);
  const [isRejectionDialogOpen, setIsRejectionDialogOpen] = useState(false);
  const [pagination, setPagination] = useState({ page: 0, size: 10, totalPages: 0, totalElements: 0 });

  useEffect(() => { loadRequests(); }, [pagination.page, statusFilter]);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const params = statusFilter !== 'ALL' ? { status: statusFilter } : {};
      const data = await hrService.getLeaveRequests(pagination.page, pagination.size, params);
      setRequests(data.content || []);
      setPagination(p => ({ ...p, totalPages: data.totalPages, totalElements: data.totalElements }));
    } catch {
      toast.error('Failed to load leave requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (req: LeaveRequest) => {
    if (!confirm(`Approve leave for employee ${req.employeeId.slice(0, 8)}…?`)) return;
    try {
      await hrService.approveLeave(req.id);
      toast.success('Leave request approved');
      loadRequests();
    } catch {
      toast.error('Failed to approve leave');
    }
  };

  const handleReject = (req: LeaveRequest) => {
    setRejectingRequest(req);
    setIsRejectionDialogOpen(true);
  };

  const handleRejectionConfirm = async (reason: string) => {
    if (!rejectingRequest) return;
    try {
      await hrService.rejectLeave(rejectingRequest.id, reason);
      toast.success('Leave request rejected');
      loadRequests();
      setIsRejectionDialogOpen(false);
      setRejectingRequest(null);
    } catch {
      toast.error('Failed to reject leave');
    }
  };

  const pendingCount = requests.filter(r => r.status === 'PENDING').length;

  return (
    <MainLayout
      pageTitle="Leave Requests"
      pageAction={
        <Button size="sm" className="h-8 px-3 bg-zinc-900 hover:bg-zinc-800 text-white shadow-sm" onClick={() => setIsFormOpen(true)}>
          <Plus className="w-3.5 h-3.5 mr-2" />
          New Request
        </Button>
      }
    >
      <div className="space-y-4">
        {/* Status filter tabs */}
        <div className="flex items-center gap-1 border-b border-zinc-200">
          {STATUS_FILTERS.map(s => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setPagination(p => ({ ...p, page: 0 })); }}
              className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
                statusFilter === s
                  ? 'border-zinc-900 text-zinc-900'
                  : 'border-transparent text-zinc-500 hover:text-zinc-700'
              }`}
            >
              {s}
              {s === 'PENDING' && pendingCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 text-xs rounded-full bg-amber-100 text-amber-700">{pendingCount}</span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="w-full h-48 border border-zinc-200 rounded-lg bg-white flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <div className="w-5 h-5 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin" />
              <span className="text-xs text-zinc-500 font-medium">Loading requests...</span>
            </div>
          </div>
        ) : requests.length === 0 ? (
          <div className="w-full h-64 border border-dashed border-zinc-300 rounded-lg bg-zinc-50/50 flex flex-col items-center justify-center text-center p-6">
            <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center mb-4 text-zinc-400">
              <CalendarOff className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-medium text-zinc-900">No leave requests</h3>
            <p className="text-xs text-zinc-500 mt-1">
              {statusFilter !== 'ALL' ? `No ${statusFilter.toLowerCase()} requests found.` : 'No requests have been submitted yet.'}
            </p>
          </div>
        ) : (
          <>
            <div className="text-[12px] font-medium text-zinc-500 uppercase tracking-wider px-1">
              {pagination.totalElements} requests
            </div>
            <LeaveRequestsTable requests={requests} onApprove={handleApprove} onReject={handleReject} />
          </>
        )}

        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-zinc-200 pt-4">
            <div className="text-sm text-zinc-500">
              Showing {pagination.page * pagination.size + 1}–{Math.min((pagination.page + 1) * pagination.size, pagination.totalElements)} of {pagination.totalElements}
            </div>
            <div className="flex items-center gap-2">
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

      <LeaveRequestFormDialog isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSuccess={loadRequests} />

      <RejectionDialog
        isOpen={isRejectionDialogOpen}
        leaveRequest={rejectingRequest}
        onClose={() => { setIsRejectionDialogOpen(false); setRejectingRequest(null); }}
        onConfirm={handleRejectionConfirm}
      />
    </MainLayout>
  );
}
