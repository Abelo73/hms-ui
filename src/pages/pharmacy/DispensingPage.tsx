import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { pharmacyService } from '@/services/api/pharmacyService';
import type { Prescription } from '@/services/api/pharmacyService';
import {
  FileText,
  User,
  Pill,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  Package
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function DispensingPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [prescription, setPrescription] = useState<Prescription | null>(null);
  const [loading, setLoading] = useState(true);
  const [dispensing, setDispensing] = useState(false);

  useEffect(() => {
    const fetchPrescription = async () => {
      if (!id) return;
      try {
        const data = await pharmacyService.getPrescriptionById(id);
        setPrescription(data);
      } catch (error) {
        console.error('Failed to fetch prescription:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPrescription();
  }, [id]);

  const handleDispense = async () => {
    if (!id) return;
    setDispensing(true);
    try {
      await pharmacyService.dispenseMedication(id);
      // Show success and redirect or refresh
      navigate('/pharmacy/prescriptions');
    } catch (error) {
      console.error('Dispensing failed:', error);
    } finally {
      setDispensing(false);
    }
  };

  if (loading) {
    return <MainLayout pageTitle="Dispense Medication"><div>Loading...</div></MainLayout>;
  }

  if (!prescription) {
    return <MainLayout pageTitle="Dispense Medication"><div>Prescription not found.</div></MainLayout>;
  }

  return (
    <MainLayout
      pageTitle={`Dispense Medication: ${prescription.prescriptionNumber}`}
      pageAction={
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-3 py-1.5 text-zinc-500 hover:text-zinc-900 transition-colors text-sm font-medium"
        >
          <ArrowLeft className="size-4" />
          Back
        </button>
      }
    >
      <div className="max-w-4xl space-y-6">
        <div className="bg-white border border-zinc-200 rounded-xl p-8 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between gap-6 mb-8 pb-8 border-b border-zinc-100">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="size-12 bg-blue-50 rounded-xl flex items-center justify-center">
                  <FileText className="size-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-zinc-900">{prescription.prescriptionNumber}</h3>
                  <p className="text-sm text-zinc-500">Issued on {new Date(prescription.prescriptionDate).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <div className="flex items-center gap-3 p-3 bg-zinc-50 rounded-lg">
                  <User className="size-4 text-zinc-400" />
                  <div>
                    <p className="text-[10px] uppercase font-bold text-zinc-400 leading-none mb-1">Patient</p>
                    <p className="text-sm font-semibold text-zinc-900">{prescription.patientId}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-zinc-50 rounded-lg">
                  <AlertCircle className="size-4 text-zinc-400" />
                  <div>
                    <p className="text-[10px] uppercase font-bold text-zinc-400 leading-none mb-1">Priority</p>
                    <p className="text-sm font-semibold text-zinc-900">{prescription.priority}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <span className={cn(
                "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
                prescription.status === 'DISPENSED' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
              )}>
                {prescription.status}
              </span>
              <p className="text-xs text-zinc-400">Created by {prescription.createdBy}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="flex items-center gap-2 text-sm font-bold text-zinc-900 uppercase tracking-widest mb-4">
                <Pill className="size-4 text-zinc-400" />
                Medication Details
              </h4>
              <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-100 italic text-sm text-zinc-600">
                {prescription.notes || 'No specific medication notes provided in the summary.'}
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={handleDispense}
                disabled={dispensing || prescription.status === 'DISPENSED'}
                className={cn(
                  "w-full flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-bold transition-all shadow-lg shadow-zinc-200/50",
                  prescription.status === 'DISPENSED'
                    ? "bg-zinc-100 text-zinc-400 cursor-not-allowed shadow-none"
                    : "bg-zinc-900 text-white hover:bg-zinc-800 active:scale-[0.98]"
                )}
              >
                {dispensing ? (
                  "Processing Dispensing..."
                ) : prescription.status === 'DISPENSED' ? (
                  <>
                    <CheckCircle2 className="size-5" />
                    Already Dispensed
                  </>
                ) : (
                  <>
                    <Package className="size-5" />
                    Confirm and Dispense Medication
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-3">
          <AlertCircle className="size-5 text-amber-600 flex-shrink-0" />
          <p className="text-xs text-amber-700 leading-relaxed">
            <strong>Pharmacist Note:</strong> Please verify patient identity and check for potential drug-drug interactions before confirming the dispensing. Ensure the patient understands the dosage and administration instructions.
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
