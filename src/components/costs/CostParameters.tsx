'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect, useCallback } from 'react';
import { CostParameters as CostParametersType, OverheadCalculatorData } from '@/types/pricing';
import { usePricingStore } from '@/store/pricing-store';
import { useShopStore } from '@/store/shop-store';
import { useAuth } from '@/hooks/useAuth';
import { formatCurrency } from '@/lib/calculations';
import MachineList from '@/components/machines/MachineList';
import Tooltip, { QuestionMarkIcon } from '@/components/ui/Tooltip';
import { OVERHEAD_FIELDS } from '@/constants/overhead-fields';

const costParametersSchema = z.object({
  laborHours: z.number().min(0, 'Labor hours must be non-negative'),
  laborRate: z.number().min(0, 'Labor rate must be non-negative'),
  overheadRatePerHour: z.number().min(0, 'Overhead rate must be non-negative'),
});

type CostParametersFormData = z.infer<typeof costParametersSchema>;

export default function CostParameters() {
  const { currentProject, updateCostParameters } = usePricingStore();
  const { shopData } = useShopStore();
  const { user } = useAuth();
  const [showOverheadCalculator, setShowOverheadCalculator] = useState(false);
  // Initialize overhead calculator data with shop data for authenticated users
  const getInitialOverheadData = (): OverheadCalculatorData => {
    const projectData = currentProject.costParameters.overhead.calculatorData;
    
    // If user is authenticated and no project data exists, use shop data
    if (user && !projectData) {
      return {
        rentLease: shopData.rentLease,
        utilities: shopData.utilities,
        digitalInfrastructure: shopData.digitalInfrastructure,
        insuranceProfessional: shopData.insuranceProfessional,
        marketingAdvertising: shopData.marketingAdvertising,
        officeSupplies: shopData.officeSupplies,
        transportationDelivery: shopData.transportationDelivery,
        miscellaneousContingency: shopData.miscellaneousContingency,
        totalMonthlyHours: shopData.totalMonthlyHours
      };
    }
    
    // Otherwise use project data or defaults
    return {
      rentLease: projectData?.rentLease || 0,
      utilities: projectData?.utilities || 0,
      digitalInfrastructure: projectData?.digitalInfrastructure || 0,
      insuranceProfessional: projectData?.insuranceProfessional || 0,
      marketingAdvertising: projectData?.marketingAdvertising || 0,
      officeSupplies: projectData?.officeSupplies || 0,
      transportationDelivery: projectData?.transportationDelivery || 0,
      miscellaneousContingency: projectData?.miscellaneousContingency || 0,
      totalMonthlyHours: projectData?.totalMonthlyHours || 160
    };
  };

  const [overheadCalcData, setOverheadCalcData] = useState<OverheadCalculatorData>(getInitialOverheadData());

  // Calculate overhead rate from shop data for authenticated users
  const calculateShopOverheadRate = useCallback((): number => {
    if (!user || !shopData.totalMonthlyHours) return 0;
    
    const totalExpenses = shopData.rentLease + shopData.utilities + 
                         shopData.digitalInfrastructure + shopData.insuranceProfessional +
                         shopData.marketingAdvertising + shopData.officeSupplies +
                         shopData.transportationDelivery + shopData.miscellaneousContingency;
    
    return shopData.totalMonthlyHours > 0 ? Math.round((totalExpenses / shopData.totalMonthlyHours) * 100) / 100 : 0;
  }, [user, shopData.totalMonthlyHours, shopData.rentLease, shopData.utilities, shopData.digitalInfrastructure, shopData.insuranceProfessional, shopData.marketingAdvertising, shopData.officeSupplies, shopData.transportationDelivery, shopData.miscellaneousContingency]);

  const {
    register,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<CostParametersFormData>({
    resolver: zodResolver(costParametersSchema),
    defaultValues: {
      laborHours: currentProject.costParameters.labor.hours,
      laborRate: currentProject.costParameters.labor.ratePerHour || (user ? shopData.laborRate : 0),
      overheadRatePerHour: currentProject.costParameters.overhead.ratePerHour || calculateShopOverheadRate(),
    },
  });

  const watchedValues = watch();

  // Sync form values when project data changes (like when demo data is loaded)
  useEffect(() => {
    // Use reset to avoid triggering setValue events that cause loops
    reset({
      laborHours: currentProject.costParameters.labor.hours,
      laborRate: currentProject.costParameters.labor.ratePerHour || (user ? shopData.laborRate : 0),
      overheadRatePerHour: currentProject.costParameters.overhead.ratePerHour || calculateShopOverheadRate(),
    });
  }, [currentProject.costParameters.labor.hours, currentProject.costParameters.labor.ratePerHour, currentProject.costParameters.overhead.ratePerHour, shopData.laborRate, user, reset, calculateShopOverheadRate]);

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
    const totalExpenses = overheadCalcData.rentLease + overheadCalcData.utilities + overheadCalcData.digitalInfrastructure + 
                          overheadCalcData.insuranceProfessional + overheadCalcData.marketingAdvertising + overheadCalcData.officeSupplies + 
                          overheadCalcData.transportationDelivery + overheadCalcData.miscellaneousContingency;
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
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow dark:shadow-slate-700/10 p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Cost Parameters</h2>
      
      <div className="space-y-6">
        {/* Machine Management Section */}
        <div className="border-b dark:border-gray-700 pb-6">
          <MachineList currency={currentProject.currency} />
        </div>

        {/* Combined Labor and Overhead Section */}
        <div className="border-b dark:border-gray-700 pb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Labor and Overhead per Project Hour</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">Project Hours</label>
              <input
                {...register('laborHours', { valueAsNumber: true })}
                type="number"
                step="0.1"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                placeholder=""
                onChange={(e) => handleFormChange('laborHours', parseFloat(e.target.value) || 0)}
              />
              {errors.laborHours && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.laborHours.message}</p>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Include design, production, and packaging time.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">Labor Cost per Hour ({currentProject.currency})</label>
              <input
                {...register('laborRate', { valueAsNumber: true })}
                type="number"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                placeholder="0.00"
                onChange={(e) => handleFormChange('laborRate', parseFloat(e.target.value) || 0)}
              />
              {errors.laborRate && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.laborRate.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">Overhead per Hour ({currentProject.currency})</label>
              <input
                {...register('overheadRatePerHour', { valueAsNumber: true })}
                type="number"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                placeholder="25.00"
                onChange={(e) => handleFormChange('overheadRatePerHour', parseFloat(e.target.value) || 0)}
              />
              {errors.overheadRatePerHour && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.overheadRatePerHour.message}</p>
              )}
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <div>Labor Cost: <span className="font-medium text-gray-900 dark:text-white">{formatCurrency((watchedValues.laborHours || 0) * (watchedValues.laborRate || 0), currentProject.currency)}</span></div>
                <div>Overhead Cost ({watchedValues.laborHours || 0}h × {formatCurrency(watchedValues.overheadRatePerHour || 0, currentProject.currency)}): <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(overheadCost, currentProject.currency)}</span></div>
              </div>
            </div>
            <div>
              <button
                type="button"
                onClick={() => {
                  setOverheadCalcData(getInitialOverheadData());
                  setShowOverheadCalculator(true);
                }}
                className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white p-3 rounded border border-gray-300 dark:border-gray-600 transition-colors cursor-pointer"
              >
                🧮 Calculate Overhead Rate
              </button>
            </div>
          </div>
        </div>


      </div>
      
      {/* Overhead Calculator Modal */}
      {showOverheadCalculator && (
        <div className="fixed inset-0 bg-black dark:bg-gray-900 bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setShowOverheadCalculator(false)}>
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Overhead Calculator</h3>
              <button
                onClick={() => setShowOverheadCalculator(false)}
                className="text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-100 cursor-pointer"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {OVERHEAD_FIELDS.map((field) => (
                  <div key={field.key}>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white mb-1">
                      {field.label}
                      <Tooltip content={field.tooltip}>
                        <QuestionMarkIcon className="w-4 h-4" />
                      </Tooltip>
                    </label>
                    <input
                      type="number"
                      value={overheadCalcData[field.key] || ''}
                      onChange={(e) => setOverheadCalcData({...overheadCalcData, [field.key]: parseFloat(e.target.value) || 0})}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                      placeholder={field.placeholder}
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">Total Monthly Hours</label>
                  <input
                    type="number"
                    value={overheadCalcData.totalMonthlyHours || ''}
                    onChange={(e) => setOverheadCalcData({...overheadCalcData, totalMonthlyHours: parseFloat(e.target.value) || 160})}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                    placeholder="160"
                  />
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-slate-700 p-3 rounded">
                <div className="text-sm text-gray-900 dark:text-white space-y-1">
                  <div className="flex justify-between">
                    <span>Total Monthly Expenses:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(overheadCalcData.rentLease + overheadCalcData.utilities + overheadCalcData.digitalInfrastructure + overheadCalcData.insuranceProfessional + overheadCalcData.marketingAdvertising + overheadCalcData.officeSupplies + overheadCalcData.transportationDelivery + overheadCalcData.miscellaneousContingency, currentProject.currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Working Hours:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{overheadCalcData.totalMonthlyHours}h</span>
                  </div>
                  <hr className="my-1 border-gray-300 dark:border-gray-600" />
                  <div className="flex justify-between font-semibold text-gray-900 dark:text-white">
                    <span>Overhead Rate per Hour:</span>
                    <span>{formatCurrency(overheadCalcData.totalMonthlyHours > 0 ? Math.round(((overheadCalcData.rentLease + overheadCalcData.utilities + overheadCalcData.digitalInfrastructure + overheadCalcData.insuranceProfessional + overheadCalcData.marketingAdvertising + overheadCalcData.officeSupplies + overheadCalcData.transportationDelivery + overheadCalcData.miscellaneousContingency) / overheadCalcData.totalMonthlyHours) * 100) / 100 : 0, currentProject.currency)}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={calculateOverheadRate}
                  className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors cursor-pointer"
                >
                  Calculate & Apply
                </button>
                <button
                  type="button"
                  onClick={() => setShowOverheadCalculator(false)}
                  className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-white py-2 rounded hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors cursor-pointer"
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