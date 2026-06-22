import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { Dashboard } from '@/pages/dashboard/Dashboard';
import { ProfilePage } from '@/pages/profile/ProfilePage';
import { ApprovalsPage } from '@/pages/approvals/ApprovalsPage';
import { ComingSoonPage } from '@/pages/ComingSoonPage';
import { UsersPage } from '@/pages/users/UsersPage';
import { RolesPage } from '@/pages/roles/RolesPage';
import { PatientsPage } from '@/pages/patients/PatientsPage';
import { AllergiesPage } from '@/pages/medical/AllergiesPage';
import { MedicationsPage } from '@/pages/medical/MedicationsPage';
import { LabResultsPage } from '@/pages/medical/LabResultsPage';
import { VaccinationsPage } from '@/pages/medical/VaccinationsPage';
import { MedicalRecordsPage } from '@/pages/medical/MedicalRecordsPage';
import { DiagnosesPage } from '@/pages/medical/DiagnosesPage';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { SidebarProvider } from '@/contexts/SidebarContext';
import { MedicalHistoryPage } from './pages/medical/MedicalHistoryPage';
import { AppointmentsPage } from './pages/appointments/AppointmentsPage';
import { NursingCarePlansPage } from './pages/nursing/NursingCarePlansPage';
import { VitalSignsPage } from './pages/nursing/VitalSignsPage';
import { NursingTasksPage } from './pages/nursing/NursingTasksPage';
import { MedicationAdministrationsPage } from './pages/nursing/MedicationAdministrationsPage';
import { NursingNotesPage } from './pages/nursing/NursingNotesPage';
import { IncidentReportsPage } from './pages/nursing/IncidentReportsPage';
import { NursingAssessmentsPage } from './pages/nursing/NursingAssessmentsPage';
import { WoundCarePage } from './pages/nursing/WoundCarePage';
import { FluidBalancePage } from './pages/nursing/FluidBalancePage';
import { NursingShiftsPage } from './pages/nursing/NursingShiftsPage';
import { ConsultationsPage } from './pages/doctors/ConsultationsPage';
import { LabWorklistPage } from './pages/laboratory/LabWorklistPage';
import { InventoryPage } from './pages/inventory/InventoryPage';
import { InventoryItemsPage } from './pages/inventory/InventoryItemsPage';
import ProcurementPage from './pages/inventory/ProcurementPage';
import StockLevelsPage from './pages/inventory/StockLevelsPage';
import StockAlertsPage from './pages/inventory/StockAlertsPage';
import { PrescriptionsPage } from './pages/pharmacy/PrescriptionsPage';
import { DispensingPage } from './pages/pharmacy/DispensingPage';
import { EmployeesPage } from './pages/hr/EmployeesPage';
import { LeaveRequestsPage } from './pages/hr/LeaveRequestsPage';
import { AttendancePage } from './pages/hr/AttendancePage';
import { PayrollPage } from './pages/hr/PayrollPage';
import { PerformanceReviewPage } from './pages/hr/PerformanceReviewPage';
import { RecruitmentPage } from './pages/hr/RecruitmentPage';
import { TrainingPage } from './pages/hr/TrainingPage';
import { BenefitsPage } from './pages/hr/BenefitsPage';
import { CompliancePage } from './pages/hr/CompliancePage';
import { HrDashboardPage } from './pages/hr/HrDashboardPage';
import { BranchesPage } from './pages/hr/BranchesPage';
import { SalaryGradesPage } from './pages/hr/SalaryGradesPage';
import { PositionsPage } from './pages/hr/PositionsPage';
import { DepartmentsPage } from './pages/hr/DepartmentsPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="inventory" element={<InventoryPage />} />
            <Route path="inventory/items" element={<InventoryItemsPage />} />
            <Route path="inventory/procurement" element={<ProcurementPage />} />
            <Route path="inventory/stock-levels" element={<StockLevelsPage />} />
            <Route path="inventory/alerts" element={<StockAlertsPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/approvals"
              element={
                <ProtectedRoute>
                  <ApprovalsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patients"
              element={
                <ProtectedRoute>
                  <PatientsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/medical/allergies"
              element={
                <ProtectedRoute>
                  <AllergiesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/medical/medications"
              element={
                <ProtectedRoute>
                  <MedicationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/medical/lab-results"
              element={
                <ProtectedRoute>
                  <LabResultsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/medical/vaccinations"
              element={
                <ProtectedRoute>
                  <VaccinationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/medical/records"
              element={
                <ProtectedRoute>
                  <MedicalRecordsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/medical/diagnoses"
              element={
                <ProtectedRoute>
                  <DiagnosesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/medical/history"
              element={
                <ProtectedRoute>
                  <MedicalHistoryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/appointments"
              element={
                <ProtectedRoute>
                  <AppointmentsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/nursing/care-plans"
              element={
                <ProtectedRoute>
                  <NursingCarePlansPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/nursing/vital-signs"
              element={
                <ProtectedRoute>
                  <VitalSignsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/nursing/tasks"
              element={
                <ProtectedRoute>
                  <NursingTasksPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/nursing/medication-administrations"
              element={
                <ProtectedRoute>
                  <MedicationAdministrationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/nursing/notes"
              element={
                <ProtectedRoute>
                  <NursingNotesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/nursing/incident-reports"
              element={
                <ProtectedRoute>
                  <IncidentReportsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/nursing/assessments"
              element={
                <ProtectedRoute>
                  <NursingAssessmentsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/nursing/wound-care"
              element={
                <ProtectedRoute>
                  <WoundCarePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/nursing/fluid-balance"
              element={
                <ProtectedRoute>
                  <FluidBalancePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/nursing/shifts"
              element={
                <ProtectedRoute>
                  <NursingShiftsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctors/consultations"
              element={
                <ProtectedRoute>
                  <ConsultationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/laboratory/worklist"
              element={
                <ProtectedRoute>
                  <LabWorklistPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/inventory"
              element={
                <ProtectedRoute>
                  <InventoryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/inventory/items"
              element={
                <ProtectedRoute>
                  <InventoryItemsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pharmacy/prescriptions"
              element={
                <ProtectedRoute>
                  <PrescriptionsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pharmacy/dispense/:id"
              element={
                <ProtectedRoute>
                  <DispensingPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/hr/employees"
              element={
                <ProtectedRoute>
                  <EmployeesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/hr/dashboard"
              element={
                <ProtectedRoute>
                  <HrDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/hr/leave-requests"
              element={
                <ProtectedRoute>
                  <LeaveRequestsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/hr/attendance"
              element={
                <ProtectedRoute>
                  <AttendancePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/hr/payroll"
              element={
                <ProtectedRoute>
                  <PayrollPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/hr/performance-reviews"
              element={
                <ProtectedRoute>
                  <PerformanceReviewPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/hr/recruitment"
              element={
                <ProtectedRoute>
                  <RecruitmentPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/hr/training"
              element={
                <ProtectedRoute>
                  <TrainingPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/hr/benefits"
              element={
                <ProtectedRoute>
                  <BenefitsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/hr/compliance"
              element={
                <ProtectedRoute>
                  <CompliancePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/hr/branches"
              element={
                <ProtectedRoute>
                  <BranchesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/hr/salary-grades"
              element={
                <ProtectedRoute>
                  <SalaryGradesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/hr/positions"
              element={
                <ProtectedRoute>
                  <PositionsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/hr/departments"
              element={
                <ProtectedRoute>
                  <DepartmentsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <ComingSoonPage title="Reports & Analytics" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/documents"
              element={
                <ProtectedRoute>
                  <ComingSoonPage title="Documents" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <ProtectedRoute>
                  <UsersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/roles"
              element={
                <ProtectedRoute>
                  <RolesPage />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
          <Toaster position="top-right" richColors />
        </BrowserRouter>
      </SidebarProvider>
    </QueryClientProvider>
  );
}

export default App;