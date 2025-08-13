'use client';

import { usePricingStore } from '@/store/pricing-store';
import { calculatePricing, formatCurrency, formatCurrencyWholeNumbers } from '@/lib/calculations';

export default function WhatIfMatrix() {
  const { currentProject } = usePricingStore();
  const calculations = currentProject.calculations;

  if (!calculations || !currentProject.salePrice.amount) {
    return null;
  }

  const basePrice = currentProject.salePrice.amount;
  const baseQuantity = currentProject.production.unitsProduced || currentProject.salePrice.unitsCount || 1;
  const baseNetProfit = calculations.netProfit;

  const priceScenarios = [-25, -20, -15, -10, -5, 0, 5, 10, 15, 20, 25];
  const quantityScenarios = [-50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50];

  const calculateScenario = (priceChange: number, quantityChange: number): number => {
    const newPrice = basePrice * (1 + priceChange / 100);
    const newQuantity = Math.max(1, Math.round(baseQuantity * (1 + quantityChange / 100)));
    const quantityMultiplier = newQuantity / baseQuantity;

    // Scale all variable costs by quantity change
    const scaledMaterials = currentProject.materials.map(material => ({
      ...material,
      quantity: material.quantity * quantityMultiplier,
      unitCost: material.unitCost ? material.unitCost * quantityMultiplier : undefined,
      totalCost: material.totalCost ? material.totalCost * quantityMultiplier : undefined
    }));

    const scaledCostParameters = {
      ...currentProject.costParameters,
      labor: {
        ...currentProject.costParameters.labor,
        hours: currentProject.costParameters.labor.hours * quantityMultiplier
      },
      machines: currentProject.costParameters.machines.map(machine => ({
        ...machine,
        usageHours: machine.usageHours * quantityMultiplier
      }))
    };

    const scenarioSalePrice = {
      ...currentProject.salePrice,
      amount: newPrice,
      unitsCount: newQuantity
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

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-gray-900">What-If Scenario Matrix</h3>
        <div className="text-xs text-gray-600">
          Base: {formatCurrency(baseNetProfit, currentProject.currency)}
        </div>
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
          {priceScenarios.map((priceChange) => (
            <div 
              key={priceChange} 
              className="flex flex-col items-center justify-center bg-gray-100 text-gray-800 rounded shadow-sm p-2"
            >
              <div className="text-xs font-bold">
                {formatCurrencyWholeNumbers(basePrice * (1 + priceChange / 100), currentProject.currency)}
              </div>
            </div>
          ))}

          {/* Matrix rows */}
          {quantityScenarios.map((quantityChange) => (
            <div key={quantityChange} className="contents">
              {/* Quantity header */}
              <div className="flex flex-col items-center justify-center bg-gray-100 text-gray-800 rounded shadow-sm p-2">
                <div className="text-xs font-bold">
                  {Math.max(1, Math.round(baseQuantity * (1 + quantityChange / 100)))}
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
                  // Green to red gradient based on profit performance
                  const profitRatio = baseNetProfit > 0 ? profit / baseNetProfit : (profit > 0 ? 1 : 0);
                  if (profitRatio >= 1.5) {
                    cellStyle = 'bg-green-500 text-white hover:shadow-lg';
                  } else if (profitRatio >= 1.2) {
                    cellStyle = 'bg-green-400 text-white hover:shadow-lg';
                  } else if (profitRatio >= 1.0) {
                    cellStyle = 'bg-green-300 text-green-900 hover:shadow-lg';
                  } else if (profitRatio >= 0.8) {
                    cellStyle = 'bg-yellow-300 text-yellow-900 hover:shadow-md';
                  } else if (profitRatio >= 0.5) {
                    cellStyle = 'bg-orange-400 text-white hover:shadow-md';
                  } else if (profitRatio >= 0.2) {
                    cellStyle = 'bg-red-400 text-white hover:shadow-md';
                  } else {
                    cellStyle = 'bg-red-500 text-white hover:shadow-md';
                  }
                }
                
                return (
                  <div
                    key={`${priceChange}-${quantityChange}`}
                    className={`flex flex-col items-center justify-center rounded p-2 transition-all duration-200 cursor-pointer ${cellStyle}`}
                  >
                    {isCurrent ? (
                      <div className="text-center">
                        <div className="text-xs font-bold">CURRENT</div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="text-xs font-bold">
                          {formatCurrencyWholeNumbers(profitDelta, currentProject.currency)}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
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