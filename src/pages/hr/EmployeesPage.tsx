import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Search, Plus, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { hrService, type Employee } from '@/services/api/hrService';
import { EmployeesTable } from './components/EmployeesTable';
import { EmployeeFormDialog } from './components/EmployeeFormDialog';
import { TerminationDialog } from './components/TerminationDialog';

export function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [terminatingEmployee, setTerminatingEmployee] = useState<Employee | null>(null);
  const [isTerminationDialogOpen, setIsTerminationDialogOpen] = useState(false);
  const [pagination, setPagination] = useState({ page: 0, size: 10, totalPages: 0, totalElements: 0 });

  useEffect(() => { loadEmployees(); }, [pagination.page, searchTerm]);

  const loadEmployees = async () => {
    setLoading(true);
    try {
      const data = await hrService.getEmployees(pagination.page, pagination.size);
      setEmployees(data.content || []);
      setPagination(p => ({ ...p, totalPages: data.totalPages, totalElements: data.totalElements }));
    } catch {
      toast.error('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setIsFormOpen(true);
  };

  const handleTerminate = (employee: Employee) => {
    setTerminatingEmployee(employee);
    setIsTerminationDialogOpen(true);
  };

  const handleTerminationConfirm = async (terminationDate: string, reason: string) => {
    if (!terminatingEmployee) return;
    try {
      await hrService.terminateEmployee(terminatingEmployee.id, { terminationDate, reason });
      toast.success('Employee terminated');
      loadEmployees();
      setIsTerminationDialogOpen(false);
      setTerminatingEmployee(null);
    } catch {
      toast.error('Failed to terminate employee');
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingEmployee(null);
  };

  const filtered = searchTerm
    ? employees.filter(e =>
        `${e.firstName} ${e.lastName} ${e.employeeNumber} ${e.email} ${e.department}`.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : employees;

  return (
    <MainLayout
      pageTitle="Employees"
      pageAction={
        <Button size="sm" className="h-8 px-3 bg-zinc-900 hover:bg-zinc-800 text-white shadow-sm" onClick={() => setIsFormOpen(true)}>
          <Plus className="w-3.5 h-3.5 mr-2" />
          Add Employee
        </Button>
      }
    >
      <div className="space-y-4">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by name, employee number, department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-9 pl-10 pr-4 bg-white border border-zinc-200 rounded-lg text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900 shadow-sm"
          />
        </div>

        {loading ? (
          <div className="w-full h-48 border border-zinc-200 rounded-lg bg-white flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <div className="w-5 h-5 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin" />
              <span className="text-xs text-zinc-500 font-medium">Loading employees...</span>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="w-full h-64 border border-dashed border-zinc-300 rounded-lg bg-zinc-50/50 flex flex-col items-center justify-center text-center p-6">
            <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center mb-4 text-zinc-400">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-medium text-zinc-900">No employees found</h3>
            <p className="text-xs text-zinc-500 mt-1">Try adjusting your search or add a new employee.</p>
            {searchTerm && (
              <Button variant="outline" size="sm" className="mt-4 h-8 px-3" onClick={() => setSearchTerm('')}>
                Reset search
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="text-[12px] font-medium text-zinc-500 uppercase tracking-wider px-1">
              {pagination.totalElements} employees
            </div>
            <EmployeesTable employees={filtered} onEdit={handleEdit} onTerminate={handleTerminate} />
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

      <EmployeeFormDialog
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSuccess={loadEmployees}
        editingEmployee={editingEmployee}
      />

      <TerminationDialog
        isOpen={isTerminationDialogOpen}
        employee={terminatingEmployee}
        onClose={() => { setIsTerminationDialogOpen(false); setTerminatingEmployee(null); }}
        onConfirm={handleTerminationConfirm}
      />
    </MainLayout>
  );
}
