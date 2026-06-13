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