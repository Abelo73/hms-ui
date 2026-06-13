import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { vitalSignsService, type VitalSign, type CreateVitalSignRequest, type UpdateVitalSignRequest } from '@/services/api/vitalSignsService';
import { VitalSignType, TemperatureUnit, TemperatureSite, BloodPressurePosition, HeartRateRhythm, RespiratoryPattern, OxygenDeliveryMethod, PainScale } from '@/types/nursing';

interface VitalSignFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingVitalSign: VitalSign | null;
  patientId: string | null;
}

export function VitalSignFormDialog({
  isOpen,
  onClose,
  onSuccess,
  editingVitalSign,
  patientId,
}: VitalSignFormDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    vitalSignType: VitalSignType.TEMPERATURE,
    recordDate: '',
    recordTime: '',
    temperature: '',
    temperatureUnit: TemperatureUnit.CELSIUS,
    temperatureSite: TemperatureSite.ORAL,
    systolicBP: '',
    diastolicBP: '',
    bloodPressurePosition: BloodPressurePosition.SITTING,
    heartRate: '',
    heartRateRhythm: HeartRateRhythm.REGULAR,
    respiratoryRate: '',
    respiratoryPattern: RespiratoryPattern.REGULAR,
    oxygenSaturation: '',
    oxygenDeliveryMethod: OxygenDeliveryMethod.ROOM_AIR,
    painScore: '',
    painScale: PainScale.NUMERIC,
    bloodGlucose: '',
    height: '',
    weight: '',
    bmi: '',
    notes: '',
  });

  useEffect(() => {
    if (editingVitalSign) {
      setFormData({
        vitalSignType: editingVitalSign.vitalSignType as any,
        recordDate: editingVitalSign.recordDate,
        recordTime: editingVitalSign.recordTime,
        temperature: editingVitalSign.temperature?.toString() || '',
        temperatureUnit: editingVitalSign.temperatureUnit as any || TemperatureUnit.CELSIUS,
        temperatureSite: editingVitalSign.temperatureSite as any || TemperatureSite.ORAL,
        systolicBP: editingVitalSign.systolicBP?.toString() || '',
        diastolicBP: editingVitalSign.diastolicBP?.toString() || '',
        bloodPressurePosition: editingVitalSign.bloodPressurePosition as any || BloodPressurePosition.SITTING,
        heartRate: editingVitalSign.heartRate?.toString() || '',
        heartRateRhythm: editingVitalSign.heartRateRhythm as any || HeartRateRhythm.REGULAR,
        respiratoryRate: editingVitalSign.respiratoryRate?.toString() || '',
        respiratoryPattern: editingVitalSign.respiratoryPattern as any || RespiratoryPattern.REGULAR,
        oxygenSaturation: editingVitalSign.oxygenSaturation?.toString() || '',
        oxygenDeliveryMethod: editingVitalSign.oxygenDeliveryMethod as any || OxygenDeliveryMethod.ROOM_AIR,
        painScore: editingVitalSign.painScore?.toString() || '',
        painScale: editingVitalSign.painScale as any || PainScale.NUMERIC,
        bloodGlucose: editingVitalSign.bloodGlucose?.toString() || '',
        height: editingVitalSign.height?.toString() || '',
        weight: editingVitalSign.weight?.toString() || '',
        bmi: editingVitalSign.bmi?.toString() || '',
        notes: editingVitalSign.notes || '',
      });
    } else {
      const now = new Date();
      setFormData({
        vitalSignType: VitalSignType.TEMPERATURE,
        recordDate: now.toISOString().split('T')[0],
        recordTime: now.toTimeString().slice(0, 5),
        temperature: '',
        temperatureUnit: TemperatureUnit.CELSIUS,
        temperatureSite: TemperatureSite.ORAL,
        systolicBP: '',
        diastolicBP: '',
        bloodPressurePosition: BloodPressurePosition.SITTING,
        heartRate: '',
        heartRateRhythm: HeartRateRhythm.REGULAR,
        respiratoryRate: '',
        respiratoryPattern: RespiratoryPattern.REGULAR,
        oxygenSaturation: '',
        oxygenDeliveryMethod: OxygenDeliveryMethod.ROOM_AIR,
        painScore: '',
        painScale: PainScale.NUMERIC,
        bloodGlucose: '',
        height: '',
        weight: '',
        bmi: '',
        notes: '',
      });
    }
  }, [editingVitalSign, isOpen]);

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
        vitalSignType: formData.vitalSignType,
        recordDate: formData.recordDate,
        recordTime: formData.recordTime,
        temperature: formData.temperature ? parseFloat(formData.temperature) : undefined,
        temperatureUnit: formData.temperatureUnit,
        temperatureSite: formData.temperatureSite,
        systolicBP: formData.systolicBP ? parseFloat(formData.systolicBP) : undefined,
        diastolicBP: formData.diastolicBP ? parseFloat(formData.diastolicBP) : undefined,
        bloodPressurePosition: formData.bloodPressurePosition,
        heartRate: formData.heartRate ? parseFloat(formData.heartRate) : undefined,
        heartRateRhythm: formData.heartRateRhythm,
        respiratoryRate: formData.respiratoryRate ? parseFloat(formData.respiratoryRate) : undefined,
        respiratoryPattern: formData.respiratoryPattern,
        oxygenSaturation: formData.oxygenSaturation ? parseFloat(formData.oxygenSaturation) : undefined,
        oxygenDeliveryMethod: formData.oxygenDeliveryMethod,
        painScore: formData.painScore ? parseFloat(formData.painScore) : undefined,
        painScale: formData.painScale,
        bloodGlucose: formData.bloodGlucose ? parseFloat(formData.bloodGlucose) : undefined,
        height: formData.height ? parseFloat(formData.height) : undefined,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        bmi: formData.bmi ? parseFloat(formData.bmi) : undefined,
        notes: formData.notes || undefined,
      };

      if (editingVitalSign) {
        await vitalSignsService.updateVitalSign(editingVitalSign.id, request as UpdateVitalSignRequest);
        toast.success('Vital sign updated successfully');
      } else {
        await vitalSignsService.createVitalSign(request as CreateVitalSignRequest);
        toast.success('Vital sign created successfully');
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving vital sign:', error);
      toast.error('Failed to save vital sign');
    } finally {
      setLoading(false);
    }
  };

  const renderVitalSignFields = () => {
    switch (formData.vitalSignType as string) {
      case 'TEMPERATURE':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Temperature *</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={formData.temperature}
                  onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Unit *</label>
                <select
                  required
                  value={formData.temperatureUnit}
                  onChange={(e) => setFormData({ ...formData, temperatureUnit: e.target.value as any })}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
                >
                  {Object.values(TemperatureUnit).map((unit) => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Site</label>
              <select
                value={formData.temperatureSite}
                onChange={(e) => setFormData({ ...formData, temperatureSite: e.target.value as any })}
                className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
              >
                {Object.values(TemperatureSite).map((site) => (
                  <option key={site} value={site}>{site}</option>
                ))}
              </select>
            </div>
          </>
        );
      case 'BLOOD_PRESSURE':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Systolic BP *</label>
                <input
                  type="number"
                  required
                  value={formData.systolicBP}
                  onChange={(e) => setFormData({ ...formData, systolicBP: e.target.value })}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Diastolic BP *</label>
                <input
                  type="number"
                  required
                  value={formData.diastolicBP}
                  onChange={(e) => setFormData({ ...formData, diastolicBP: e.target.value })}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Position</label>
              <select
                value={formData.bloodPressurePosition}
                onChange={(e) => setFormData({ ...formData, bloodPressurePosition: e.target.value as any })}
                className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
              >
                {Object.values(BloodPressurePosition).map((pos) => (
                  <option key={pos} value={pos}>{pos}</option>
                ))}
              </select>
            </div>
          </>
        );
      case 'HEART_RATE':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Heart Rate *</label>
                <input
                  type="number"
                  required
                  value={formData.heartRate}
                  onChange={(e) => setFormData({ ...formData, heartRate: e.target.value })}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Rhythm</label>
                <select
                  value={formData.heartRateRhythm}
                  onChange={(e) => setFormData({ ...formData, heartRateRhythm: e.target.value as any })}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
                >
                  {Object.values(HeartRateRhythm).map((rhythm) => (
                    <option key={rhythm} value={rhythm}>{rhythm}</option>
                  ))}
                </select>
              </div>
            </div>
          </>
        );
      case 'RESPIRATORY_RATE':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Respiratory Rate *</label>
                <input
                  type="number"
                  required
                  value={formData.respiratoryRate}
                  onChange={(e) => setFormData({ ...formData, respiratoryRate: e.target.value })}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Pattern</label>
                <select
                  value={formData.respiratoryPattern}
                  onChange={(e) => setFormData({ ...formData, respiratoryPattern: e.target.value as any })}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
                >
                  {Object.values(RespiratoryPattern).map((pattern) => (
                    <option key={pattern} value={pattern}>{pattern}</option>
                  ))}
                </select>
              </div>
            </div>
          </>
        );
      case 'OXYGEN_SATURATION':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">SpO2 *</label>
                <input
                  type="number"
                  required
                  value={formData.oxygenSaturation}
                  onChange={(e) => setFormData({ ...formData, oxygenSaturation: e.target.value })}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Delivery Method</label>
                <select
                  value={formData.oxygenDeliveryMethod}
                  onChange={(e) => setFormData({ ...formData, oxygenDeliveryMethod: e.target.value as any })}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
                >
                  {Object.values(OxygenDeliveryMethod).map((method) => (
                    <option key={method} value={method}>{method}</option>
                  ))}
                </select>
              </div>
            </div>
          </>
        );
      case 'PAIN_SCORE':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Pain Score *</label>
              <input
                type="number"
                min="0"
                max="10"
                required
                value={formData.painScore}
                onChange={(e) => setFormData({ ...formData, painScore: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Scale</label>
              <select
                value={formData.painScale}
                onChange={(e) => setFormData({ ...formData, painScale: e.target.value as any })}
                className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
              >
                {Object.values(PainScale).map((scale) => (
                  <option key={scale} value={scale}>{scale}</option>
                ))}
              </select>
            </div>
          </div>
        );
      case 'BLOOD_GLUCOSE':
        return (
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Blood Glucose *</label>
            <input
              type="number"
              required
              value={formData.bloodGlucose}
              onChange={(e) => setFormData({ ...formData, bloodGlucose: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
            />
          </div>
        );
      case 'HEIGHT':
        return (
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Height (cm) *</label>
            <input
              type="number"
              required
              value={formData.height}
              onChange={(e) => setFormData({ ...formData, height: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
            />
          </div>
        );
      case 'WEIGHT':
        return (
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Weight (kg) *</label>
            <input
              type="number"
              required
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
            />
          </div>
        );
      case 'BMI':
        return (
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">BMI *</label>
            <input
              type="number"
              step="0.1"
              required
              value={formData.bmi}
              onChange={(e) => setFormData({ ...formData, bmi: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
            />
          </div>
        );
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-zinc-200">
          <h2 className="text-xl font-semibold text-zinc-900">
            {editingVitalSign ? 'Edit Vital Sign' : 'New Vital Sign'}
          </h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Vital Sign Type *
            </label>
            <select
              required
              value={formData.vitalSignType}
              onChange={(e) => setFormData({ ...formData, vitalSignType: e.target.value as any })}
              className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
            >
              {Object.values(VitalSignType).map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Record Date *
              </label>
              <input
                type="date"
                required
                value={formData.recordDate}
                onChange={(e) => setFormData({ ...formData, recordDate: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Record Time *
              </label>
              <input
                type="time"
                required
                value={formData.recordTime}
                onChange={(e) => setFormData({ ...formData, recordTime: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
              />
            </div>
          </div>

          {renderVitalSignFields()}

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Notes</label>
            <textarea
              rows={3}
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
              {loading ? 'Saving...' : editingVitalSign ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
