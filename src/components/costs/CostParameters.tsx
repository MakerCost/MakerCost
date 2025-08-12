'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect } from 'react';
import { CostParameters as CostParametersType, ProductionInfo, OverheadCalculatorData } from '@/types/pricing';
import { usePricingStore } from '@/store/pricing-store';
import { formatCurrency } from '@/lib/calculations';
import MachineList from '@/components/machines/MachineList';

const costParametersSchema = z.object({
  laborHours: z.number().min(0, 'Labor hours must be non-negative'),
  laborRate: z.number().min(0, 'Labor rate must be non-negative'),
  overheadRatePerHour: z.number().min(0, 'Overhead rate must be non-negative'),
});

type CostParametersFormData = z.infer<typeof costParametersSchema>;

export default function CostParameters() {
  const { currentProject, updateCostParameters, updateProduction } = usePricingStore();
  const [showOverheadCalculator, setShowOverheadCalculator] = useState(false);
  const [overheadCalcData, setOverheadCalcData] = useState<OverheadCalculatorData>({
    rent: currentProject.costParameters.overhead.calculatorData?.rent || 0,
    electricity: currentProject.costParameters.overhead.calculatorData?.electricity || 0,
    software: currentProject.costParameters.overhead.calculatorData?.software || 0,
    marketing: currentProject.costParameters.overhead.calculatorData?.marketing || 0,
    accounting: currentProject.costParameters.overhead.calculatorData?.accounting || 0,
    other: currentProject.costParameters.overhead.calculatorData?.other || 0,
    totalMonthlyHours: currentProject.costParameters.overhead.calculatorData?.totalMonthlyHours || 160
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<CostParametersFormData>({
    resolver: zodResolver(costParametersSchema),
    defaultValues: {
      laborHours: currentProject.costParameters.labor.hours,
      laborRate: currentProject.costParameters.labor.ratePerHour,
      overheadRatePerHour: currentProject.costParameters.overhead.ratePerHour,
    },
  });

  const watchedValues = watch();

  // Sync form values when project data changes (like when demo data is loaded)
  useEffect(() => {
    // Use reset to avoid triggering setValue events that cause loops
    reset({
      laborHours: currentProject.costParameters.labor.hours,
      laborRate: currentProject.costParameters.labor.ratePerHour,
      overheadRatePerHour: currentProject.costParameters.overhead.ratePerHour,
    });
  }, [currentProject.costParameters.labor.hours, currentProject.costParameters.labor.ratePerHour, currentProject.costParameters.overhead.ratePerHour, reset]);

  // Handler to update cost parameters when form values change
  const handleFormChange = (field: string, value: number) => {
    const costParameters: CostParametersType = {
      machines: currentProject.costParameters.machines,
      labor: {
        hours: field === 'laborHours' ? value : (watchedValues.laborHours || 0),
        ratePerHour: field === 'laborRate' ? value : (watchedValues.laborRate || 0),
      },
      depreciation: {
        amount: 0,
        description: '',
      },
      overhead: {
        ratePerHour: field === 'overheadRatePerHour' ? value : (watchedValues.overheadRatePerHour || 0),
        calculatorData: currentProject.costParameters.overhead.calculatorData,
      },
    };
    updateCostParameters(costParameters);
  };

  const calculateOverheadRate = () => {
    const totalExpenses = overheadCalcData.rent + overheadCalcData.electricity + overheadCalcData.software + 
                          overheadCalcData.marketing + overheadCalcData.accounting + overheadCalcData.other;
    const rate = overheadCalcData.totalMonthlyHours > 0 ? Math.round((totalExpenses / overheadCalcData.totalMonthlyHours) * 100) / 100 : 0;
    
    // Update the form field using React Hook Form's setValue
    setValue('overheadRatePerHour', rate);
    
    // Update cost parameters with calculator data
    const costParameters: CostParametersType = {
      ...currentProject.costParameters,
      overhead: {
        ratePerHour: rate,
        calculatorData: overheadCalcData,
      },
    };
    updateCostParameters(costParameters);
    setShowOverheadCalculator(false);
  };


  const overheadCost = (watchedValues.laborHours || 0) * (watchedValues.overheadRatePerHour || 0);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Cost Parameters</h2>
      
      <div className="space-y-6">
        {/* Machine Management Section */}
        <div className="border-b pb-6">
          <MachineList currency={currentProject.currency} />
        </div>

        {/* Labor Section */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-medium mb-3">Labor</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Hours</label>
              <input
                {...register('laborHours', { valueAsNumber: true })}
                type="number"
                step="0.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder=""
                onChange={(e) => handleFormChange('laborHours', parseFloat(e.target.value) || 0)}
              />
              {errors.laborHours && (
                <p className="text-red-500 text-sm mt-1">{errors.laborHours.message}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">Don&apos;t forget to include time spent on design, production, and packaging.</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Rate per Hour ({currentProject.currency})</label>
              <input
                {...register('laborRate', { valueAsNumber: true })}
                type="number"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
                onChange={(e) => handleFormChange('laborRate', parseFloat(e.target.value) || 0)}
              />
              {errors.laborRate && (
                <p className="text-red-500 text-sm mt-1">{errors.laborRate.message}</p>
              )}
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            Labor Cost: <span className="font-medium">{formatCurrency((watchedValues.laborHours || 0) * (watchedValues.laborRate || 0), currentProject.currency)}</span>
          </div>
        </div>


        {/* Overhead Section */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-medium mb-3">Overhead per Labor Hour</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Rate per Hour ({currentProject.currency})</label>
              <input
                {...register('overheadRatePerHour', { valueAsNumber: true })}
                type="number"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="25.00"
                onChange={(e) => handleFormChange('overheadRatePerHour', parseFloat(e.target.value) || 0)}
              />
              {errors.overheadRatePerHour && (
                <p className="text-red-500 text-sm mt-1">{errors.overheadRatePerHour.message}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => setShowOverheadCalculator(true)}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 p-3 rounded border transition-colors"
            >
              🧮 Calculate Overhead Rate
            </button>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            Overhead Cost ({watchedValues.laborHours || 0}h × {formatCurrency(watchedValues.overheadRatePerHour || 0, currentProject.currency)}): <span className="font-medium">{formatCurrency(overheadCost, currentProject.currency)}</span>
          </div>
        </div>


      </div>
      
      {/* Overhead Calculator Modal */}
      {showOverheadCalculator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Overhead Calculator</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Monthly Rent ({currentProject.currency})</label>
                <input
                  type="number"
                  value={overheadCalcData.rent || ''}
                  onChange={(e) => setOverheadCalcData({...overheadCalcData, rent: parseFloat(e.target.value) || 0})}
                  className="w-full p-2 border rounded"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Monthly Electricity ({currentProject.currency})</label>
                <input
                  type="number"
                  value={overheadCalcData.electricity || ''}
                  onChange={(e) => setOverheadCalcData({...overheadCalcData, electricity: parseFloat(e.target.value) || 0})}
                  className="w-full p-2 border rounded"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Monthly Software & Licenses ({currentProject.currency})</label>
                <input
                  type="number"
                  value={overheadCalcData.software || ''}
                  onChange={(e) => setOverheadCalcData({...overheadCalcData, software: parseFloat(e.target.value) || 0})}
                  className="w-full p-2 border rounded"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Monthly Marketing ({currentProject.currency})</label>
                <input
                  type="number"
                  value={overheadCalcData.marketing || ''}
                  onChange={(e) => setOverheadCalcData({...overheadCalcData, marketing: parseFloat(e.target.value) || 0})}
                  className="w-full p-2 border rounded"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Monthly Accounting ({currentProject.currency})</label>
                <input
                  type="number"
                  value={overheadCalcData.accounting || ''}
                  onChange={(e) => setOverheadCalcData({...overheadCalcData, accounting: parseFloat(e.target.value) || 0})}
                  className="w-full p-2 border rounded"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Other Monthly Expenses ({currentProject.currency})</label>
                <input
                  type="number"
                  value={overheadCalcData.other || ''}
                  onChange={(e) => setOverheadCalcData({...overheadCalcData, other: parseFloat(e.target.value) || 0})}
                  className="w-full p-2 border rounded"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Total Monthly Hours</label>
                <input
                  type="number"
                  value={overheadCalcData.totalMonthlyHours || ''}
                  onChange={(e) => setOverheadCalcData({...overheadCalcData, totalMonthlyHours: parseFloat(e.target.value) || 160})}
                  className="w-full p-2 border rounded"
                  placeholder="160"
                />
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>Total Monthly Expenses:</span>
                    <span className="font-medium">{formatCurrency(overheadCalcData.rent + overheadCalcData.electricity + overheadCalcData.software + overheadCalcData.marketing + overheadCalcData.accounting + overheadCalcData.other, currentProject.currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Working Hours:</span>
                    <span className="font-medium">{overheadCalcData.totalMonthlyHours}h</span>
                  </div>
                  <hr className="my-1" />
                  <div className="flex justify-between font-semibold">
                    <span>Overhead Rate per Hour:</span>
                    <span>{formatCurrency(overheadCalcData.totalMonthlyHours > 0 ? Math.round(((overheadCalcData.rent + overheadCalcData.electricity + overheadCalcData.software + overheadCalcData.marketing + overheadCalcData.accounting + overheadCalcData.other) / overheadCalcData.totalMonthlyHours) * 100) / 100 : 0, currentProject.currency)}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={calculateOverheadRate}
                  className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
                >
                  Calculate & Apply
                </button>
                <button
                  type="button"
                  onClick={() => setShowOverheadCalculator(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}