import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { hrService, type Employee } from '@/services/api/hrService';
import { toast } from 'sonner';

interface EmployeeFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingEmployee?: Employee | null;
}

const EMPLOYEE_TYPES = ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN', 'CONSULTANT'];
const DEPARTMENTS = ['Administration', 'Nursing', 'Pharmacy', 'Laboratory', 'Radiology', 'Surgery', 'Emergency', 'ICU', 'Pediatrics', 'Oncology', 'Cardiology', 'HR', 'Finance', 'IT', 'Maintenance'];
const GENDERS = ['MALE', 'FEMALE', 'OTHER'];

const emptyForm = {
  firstName: '', lastName: '', middleName: '', email: '', phoneNumber: '',
  dateOfBirth: '', gender: '', address: '', city: '', state: '', country: '', postalCode: '',
  employeeType: '', department: '', position: '', hireDate: '', salary: '',
  bankName: '', bankAccountNumber: '', taxId: '',
  emergencyContactName: '', emergencyContactPhone: '', emergencyContactRelationship: '', notes: '',
};

export function EmployeeFormDialog({ isOpen, onClose, onSuccess, editingEmployee }: EmployeeFormDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    if (editingEmployee) {
      setFormData({
        firstName: editingEmployee.firstName || '',
        lastName: editingEmployee.lastName || '',
        middleName: editingEmployee.middleName || '',
        email: editingEmployee.email || '',
        phoneNumber: editingEmployee.phoneNumber || '',
        dateOfBirth: editingEmployee.dateOfBirth || '',
        gender: editingEmployee.gender || '',
        address: editingEmployee.address || '',
        city: editingEmployee.city || '',
        state: editingEmployee.state || '',
        country: editingEmployee.country || '',
        postalCode: editingEmployee.postalCode || '',
        employeeType: editingEmployee.employeeType || '',
        department: editingEmployee.department || '',
        position: editingEmployee.position || '',
        hireDate: editingEmployee.hireDate || '',
        salary: editingEmployee.salary?.toString() || '',
        bankName: editingEmployee.bankName || '',
        bankAccountNumber: editingEmployee.bankAccountNumber || '',
        taxId: editingEmployee.taxId || '',
        emergencyContactName: editingEmployee.emergencyContactName || '',
        emergencyContactPhone: editingEmployee.emergencyContactPhone || '',
        emergencyContactRelationship: editingEmployee.emergencyContactRelationship || '',
        notes: editingEmployee.notes || '',
      });
    } else {
      setFormData(emptyForm);
    }
  }, [editingEmployee, isOpen]);

  const f = (field: keyof typeof emptyForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setFormData({ ...formData, [field]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...formData, salary: formData.salary ? parseFloat(formData.salary) : undefined };
      if (editingEmployee) {
        await hrService.updateEmployee(editingEmployee.id, payload);
        toast.success('Employee updated');
      } else {
        await hrService.createEmployee(payload);
        toast.success('Employee created');
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save employee');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const inputCls = 'w-full px-3 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900';
  const labelCls = 'block text-sm font-medium text-zinc-700 mb-1';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-zinc-200 sticky top-0 bg-white z-10">
          <h2 className="text-lg font-semibold text-zinc-900">
            {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}><X className="w-4 h-4" /></Button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-5">
          {/* Personal Info */}
          <div>
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Personal Information</p>
            <div className="grid grid-cols-3 gap-3">
              <div><label className={labelCls}>First Name *</label><input required className={inputCls} value={formData.firstName} onChange={f('firstName')} /></div>
              <div><label className={labelCls}>Middle Name</label><input className={inputCls} value={formData.middleName} onChange={f('middleName')} /></div>
              <div><label className={labelCls}>Last Name *</label><input required className={inputCls} value={formData.lastName} onChange={f('lastName')} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div><label className={labelCls}>Date of Birth</label><input type="date" className={inputCls} value={formData.dateOfBirth} onChange={f('dateOfBirth')} /></div>
              <div>
                <label className={labelCls}>Gender</label>
                <select className={inputCls} value={formData.gender} onChange={f('gender')}>
                  <option value="">Select gender</option>
                  {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div><label className={labelCls}>Email</label><input type="email" className={inputCls} value={formData.email} onChange={f('email')} /></div>
              <div><label className={labelCls}>Phone Number</label><input type="tel" className={inputCls} value={formData.phoneNumber} onChange={f('phoneNumber')} /></div>
            </div>
            <div className="mt-3"><label className={labelCls}>Address</label><input className={inputCls} value={formData.address} onChange={f('address')} /></div>
            <div className="grid grid-cols-3 gap-3 mt-3">
              <div><label className={labelCls}>City</label><input className={inputCls} value={formData.city} onChange={f('city')} /></div>
              <div><label className={labelCls}>State</label><input className={inputCls} value={formData.state} onChange={f('state')} /></div>
              <div><label className={labelCls}>Postal Code</label><input className={inputCls} value={formData.postalCode} onChange={f('postalCode')} /></div>
            </div>
            <div className="mt-3"><label className={labelCls}>Country</label><input className={inputCls} value={formData.country} onChange={f('country')} /></div>
          </div>

          {/* Employment Info */}
          <div>
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Employment Details</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Department *</label>
                <select required className={inputCls} value={formData.department} onChange={f('department')}>
                  <option value="">Select department</option>
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div><label className={labelCls}>Position *</label><input required className={inputCls} value={formData.position} onChange={f('position')} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div>
                <label className={labelCls}>Employee Type</label>
                <select className={inputCls} value={formData.employeeType} onChange={f('employeeType')}>
                  <option value="">Select type</option>
                  {EMPLOYEE_TYPES.map(t => <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>)}
                </select>
              </div>
              <div><label className={labelCls}>Hire Date *</label><input required type="date" className={inputCls} value={formData.hireDate} onChange={f('hireDate')} /></div>
            </div>
            <div className="mt-3"><label className={labelCls}>Salary</label><input type="number" min="0" step="0.01" className={inputCls} value={formData.salary} onChange={f('salary')} /></div>
          </div>

          {/* Bank Info */}
          <div>
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Banking & Tax</p>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={labelCls}>Bank Name</label><input className={inputCls} value={formData.bankName} onChange={f('bankName')} /></div>
              <div><label className={labelCls}>Account Number</label><input className={inputCls} value={formData.bankAccountNumber} onChange={f('bankAccountNumber')} /></div>
            </div>
            <div className="mt-3"><label className={labelCls}>Tax ID</label><input className={inputCls} value={formData.taxId} onChange={f('taxId')} /></div>
          </div>

          {/* Emergency Contact */}
          <div>
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Emergency Contact</p>
            <div className="grid grid-cols-3 gap-3">
              <div><label className={labelCls}>Name</label><input className={inputCls} value={formData.emergencyContactName} onChange={f('emergencyContactName')} /></div>
              <div><label className={labelCls}>Phone</label><input type="tel" className={inputCls} value={formData.emergencyContactPhone} onChange={f('emergencyContactPhone')} /></div>
              <div><label className={labelCls}>Relationship</label><input className={inputCls} value={formData.emergencyContactRelationship} onChange={f('emergencyContactRelationship')} /></div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className={labelCls}>Notes</label>
            <textarea rows={3} className={inputCls} value={formData.notes} onChange={f('notes')} />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-zinc-200">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
            <Button type="submit" disabled={loading} className="bg-zinc-900 hover:bg-zinc-800">
              {loading ? 'Saving...' : editingEmployee ? 'Update Employee' : 'Create Employee'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
