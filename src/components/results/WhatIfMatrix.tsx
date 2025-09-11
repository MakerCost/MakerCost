'use client';

import { useState } from 'react';
import { usePricingStore } from '@/store/pricing-store';
import { calculatePricing, formatCurrency, formatCurrencyWholeNumbers } from '@/lib/calculations';

export default function WhatIfMatrix() {
  const { currentProject } = usePricingStore();
  const calculations = currentProject.calculations;
  
  // State for optional cost scaling
  const [scaleLaborOverhead, setScaleLaborOverhead] = useState(true);
  const [scaleMachineCost, setScaleMachineCost] = useState(true);

  if (!calculations || !currentProject.salePrice.amount) {
    return null;
  }

  const basePrice = currentProject.salePrice.amount;
  // Use the actual units count from sale price first, then fallback to production units
  const baseQuantity = currentProject.salePrice.unitsCount || currentProject.production.unitsProduced || 1;
  const baseNetProfit = calculations.netProfit;

  // Generate adaptive scenarios based on base values
  const generateAdaptiveScenarios = (baseValue: number, isPrice: boolean = false) => {
    if (baseValue <= 0) return [0];
    
    const scenarios: number[] = [];
    
    if (isPrice && baseValue < 10) {
      // For low prices, use round number increments
      const increments = [1, 2, 5];
      increments.forEach(inc => {
        scenarios.push(-inc, -inc/2, 0, inc/2, inc);
      });
    } else if (!isPrice && baseValue < 10) {
      // For low quantities, use whole number increments
      const increments = [1, 2, 3, 5];
      increments.forEach(inc => {
        if (baseValue + inc > 0) scenarios.push(inc);
        if (baseValue - inc > 0) scenarios.push(-inc);
      });
      scenarios.push(0);
    } else if (baseValue < 100) {
      // Medium values - mix of round numbers and percentages
      scenarios.push(-50, -25, -20, -15, -10, -5, 0, 5, 10, 15, 20, 25, 50);
    } else {
      // Higher values - percentage based
      scenarios.push(-50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50);
    }
    
    return [...new Set(scenarios)].sort((a, b) => a - b);
  };
  
  const priceScenarios = generateAdaptiveScenarios(basePrice, true);
  const quantityScenarios = generateAdaptiveScenarios(baseQuantity, false);

  const calculateScenario = (priceChange: number, quantityChange: number): number => {
    // Handle both percentage and absolute changes
    const newPrice = basePrice < 10 && Math.abs(priceChange) <= 10 
      ? Math.max(0.01, basePrice + priceChange)  // Absolute change for low prices
      : basePrice * (1 + priceChange / 100);     // Percentage change for higher prices
    
    const newQuantity = baseQuantity < 10 && Math.abs(quantityChange) <= 10
      ? Math.max(1, baseQuantity + quantityChange)     // Absolute change for low quantities  
      : Math.max(1, Math.round(baseQuantity * (1 + quantityChange / 100))); // Percentage change
    const quantityMultiplier = newQuantity / baseQuantity;

    // Scale materials correctly based on cost type
    const scaledMaterials = currentProject.materials.map(material => ({
      ...material,
      quantity: material.quantity * quantityMultiplier,
      // Per-unit costs don't change with quantity - only quantity changes
      unitCost: material.unitCost,
      // Total costs scale with quantity multiplier
      totalCost: material.totalCost ? material.totalCost * quantityMultiplier : undefined
    }));

    const scaledCostParameters = {
      ...currentProject.costParameters,
      labor: {
        ...currentProject.costParameters.labor,
        hours: scaleLaborOverhead 
          ? currentProject.costParameters.labor.hours * quantityMultiplier
          : currentProject.costParameters.labor.hours
      },
      machines: currentProject.costParameters.machines.map(machine => ({
        ...machine,
        // Conditionally scale the usage hours based on checkbox
        usageHours: scaleMachineCost 
          ? machine.usageHours * quantityMultiplier
          : machine.usageHours,
        // Keep other machine properties unchanged
        hoursPerYear: machine.hoursPerYear,
        purchasePrice: machine.purchasePrice,
        depreciationPercentage: machine.depreciationPercentage,
        maintenanceCostPerYear: machine.maintenanceCostPerYear
      }))
    };

    const scenarioSalePrice = {
      ...currentProject.salePrice,
      amount: newPrice,
      unitsCount: newQuantity,
      isPerUnit: true  // Ensure price is treated as per-unit for proper revenue scaling
    };

    const scenarioProduction = {
      ...currentProject.production,
      unitsProduced: newQuantity
    };

    try {
      const scenarioCalculation = calculatePricing(
        scaledMaterials,
        scaledCostParameters,
        scenarioProduction,
        scenarioSalePrice,
        currentProject.vatSettings
      );
      return scenarioCalculation.netProfit;
    } catch {
      return 0;
    }
  };

  const getCellColor = (profit: number): string => {
    if (profit > baseNetProfit * 1.2) return 'bg-green-100 text-green-800';
    if (profit > baseNetProfit) return 'bg-green-50 text-green-700';
    if (profit > 0) return 'bg-yellow-50 text-yellow-700';
    if (profit > baseNetProfit * 0.8) return 'bg-orange-50 text-orange-700';
    return 'bg-red-100 text-red-800';
  };

  const isCurrentScenario = (priceChange: number, quantityChange: number): boolean => {
    return priceChange === 0 && quantityChange === 0;
  };

  // Debug logging (only in development)
  if (process.env.NODE_ENV === 'development') {
    console.log('What-If Matrix Debug:', {
      basePrice,
      baseQuantity,
      baseNetProfit,
      priceScenarios: priceScenarios.length,
      quantityScenarios: quantityScenarios.length,
      project: currentProject.projectName
    });
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-gray-900">What-If Scenario Matrix</h3>
        <div className="text-xs text-gray-600">
          Base: {formatCurrency(baseNetProfit, currentProject.currency)} | 
          Price: {formatCurrency(basePrice, currentProject.currency)} | 
          Qty: {baseQuantity}
        </div>
      </div>

      {/* Scaling Options */}
      <div className="flex items-center justify-center mb-4 text-sm text-gray-700">
        <span className="mr-3">Scale with quantity changes:</span>
        <label className="flex items-center mr-4 cursor-pointer">
          <input
            type="checkbox"
            checked={scaleLaborOverhead}
            onChange={(e) => setScaleLaborOverhead(e.target.checked)}
            className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          Labor & Overhead
        </label>
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={scaleMachineCost}
            onChange={(e) => setScaleMachineCost(e.target.checked)}
            className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          Machine Cost
        </label>
      </div>

      <div className="overflow-x-auto">
        <div className="grid gap-1 min-w-[700px]" style={{ gridTemplateColumns: `repeat(${priceScenarios.length + 1}, minmax(60px, 1fr))` }}>
          {/* Top-left corner */}
          <div className="col-span-1 flex flex-col items-center justify-center bg-white rounded shadow-sm p-2 border border-gray-200">
            <div className="text-xs font-semibold text-gray-600 text-center leading-tight">
              <div>Price →</div>
              <div>Qty ↓</div>
            </div>
          </div>

          {/* Price headers */}
          {priceScenarios.map((priceChange) => {
            const newPrice = basePrice < 10 && Math.abs(priceChange) <= 10 
              ? Math.max(0.01, basePrice + priceChange)
              : basePrice * (1 + priceChange / 100);
            
            return (
              <div 
                key={priceChange} 
                className="flex flex-col items-center justify-center bg-gray-100 text-gray-800 rounded shadow-sm p-2"
              >
                <div className="text-xs font-bold">
                  {formatCurrencyWholeNumbers(newPrice, currentProject.currency)}
                </div>
              </div>
            );
          })}

          {/* Matrix rows */}
          {quantityScenarios.map((quantityChange) => {
            const newQuantity = baseQuantity < 10 && Math.abs(quantityChange) <= 10
              ? Math.max(1, baseQuantity + quantityChange)
              : Math.max(1, Math.round(baseQuantity * (1 + quantityChange / 100)));
            
            return (
              <div key={quantityChange} className="contents">
                {/* Quantity header */}
                <div className="flex flex-col items-center justify-center bg-gray-100 text-gray-800 rounded shadow-sm p-2">
                  <div className="text-xs font-bold">
                    {newQuantity}
                  </div>
                </div>

              {/* Scenario cells */}
              {priceScenarios.map((priceChange) => {
                const profit = calculateScenario(priceChange, quantityChange);
                const isCurrent = isCurrentScenario(priceChange, quantityChange);
                const profitDelta = Math.round(profit - baseNetProfit);
                
                let cellStyle = '';
                if (isCurrent) {
                  cellStyle = 'bg-white text-gray-900 ring-2 ring-gray-300 shadow-lg';
                } else {
                  // Color based on profit improvement relative to base profit
                  const profitImprovement = profit - baseNetProfit;
                  
                  if (profit <= 0) {
                    // Loss scenarios - red shades
                    cellStyle = 'bg-red-500 text-white hover:shadow-md';
                  } else if (profitImprovement > baseNetProfit * 0.5) {
                    // Very strong improvement (>50% increase) - dark green
                    cellStyle = 'bg-green-500 text-white hover:shadow-lg';
                  } else if (profitImprovement > baseNetProfit * 0.2) {
                    // Good improvement (>20% increase) - medium green
                    cellStyle = 'bg-green-400 text-white hover:shadow-lg';
                  } else if (profitImprovement > 0) {
                    // Any improvement - light green
                    cellStyle = 'bg-green-300 text-green-900 hover:shadow-lg';
                  } else if (profitImprovement > -baseNetProfit * 0.2) {
                    // Minor decrease (<20% drop) - yellow
                    cellStyle = 'bg-yellow-300 text-yellow-900 hover:shadow-md';
                  } else if (profitImprovement > -baseNetProfit * 0.5) {
                    // Moderate decrease (20-50% drop) - orange
                    cellStyle = 'bg-orange-400 text-white hover:shadow-md';
                  } else {
                    // Major decrease (>50% drop) - red
                    cellStyle = 'bg-red-400 text-white hover:shadow-md';
                  }
                }
                
                return (
                  <div
                    key={`${priceChange}-${quantityChange}`}
                    className={`flex flex-col items-center justify-center rounded p-2 transition-all duration-200 cursor-pointer ${cellStyle}`}
                  >
                    {isCurrent ? (
                      <div className="text-center" title={`Current scenario: ${formatCurrency(profit, currentProject.currency)} profit`}>
                        <div className="text-xs font-bold">CURRENT</div>
                      </div>
                    ) : (
                      <div className="text-center" title={`Scenario profit: ${formatCurrency(profit, currentProject.currency)} (${profitDelta >= 0 ? '+' : ''}${formatCurrency(profitDelta, currentProject.currency)} vs current)`}>
                        <div className="text-xs font-bold">
                          {formatCurrencyWholeNumbers(profitDelta, currentProject.currency)}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Compact Legend */}
      <div className="mt-3">
        <div className="flex flex-wrap justify-center gap-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span className="text-gray-700">&lt;20%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-400 rounded"></div>
            <span className="text-gray-700">20-50%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-400 rounded"></div>
            <span className="text-gray-700">50-80%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-300 rounded"></div>
            <span className="text-gray-700">80-100%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-white border border-gray-300 rounded"></div>
            <span className="text-gray-700">Current</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-300 rounded"></div>
            <span className="text-gray-700">100-120%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-400 rounded"></div>
            <span className="text-gray-700">120-150%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-gray-700">150%+</span>
          </div>
        </div>
      </div>
    </div>
  );
}