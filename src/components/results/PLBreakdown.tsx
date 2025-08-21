'use client';

import { useState } from 'react';
import { usePricingStore } from '@/store/pricing-store';
import { formatCurrencyWholeNumbers, formatPercentage } from '@/lib/calculations';
import WhatIfMatrix from './WhatIfMatrix';

const getValueColor = (value: number, isExpense: boolean = false): string => {
  if (isExpense) return 'text-red-600 dark:text-red-400';
  if (value > 0) return 'text-green-600 dark:text-green-400';
  if (value < 0) return 'text-red-600 dark:text-red-400';
  return 'text-gray-600 dark:text-gray-300';
};

export default function PLBreakdown() {
  const { currentProject } = usePricingStore();
  const calculations = currentProject.calculations;
  const [showWhatIfMatrix, setShowWhatIfMatrix] = useState(false);

  if (!calculations) {
    return (
      <div className="sticky top-4 bg-white dark:bg-slate-800 rounded-lg shadow dark:shadow-slate-700/10 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">P&L Statement</h2>
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>Add sale price and materials to see the P&L breakdown.</p>
        </div>
      </div>
    );
  }

  const unitsCount = currentProject.salePrice.unitsCount;

  const LineItem = ({ 
    label, 
    total, 
    perUnit, 
    percentage, 
    isSubtotal = false, 
    isFinal = false,
    isExpense = false,
    indent = 0,
    isEmpty = false
  }: {
    label: string;
    total: number;
    perUnit: number;
    percentage?: number;
    isSubtotal?: boolean;
    isFinal?: boolean;
    isExpense?: boolean;
    indent?: number;
    isEmpty?: boolean;
  }) => (
    <tr className={`${isSubtotal || isFinal ? 'border-t border-gray-300' : ''} ${isFinal ? 'font-bold text-lg bg-green-50' : ''}`}>
      <td className={`py-2 ${indent > 0 ? `pl-${indent * 4}` : ''} ${isFinal ? 'font-bold' : isSubtotal ? 'font-medium' : ''}`}>
        {label}
      </td>
      <td className={`py-2 text-right ${isFinal ? 'font-bold' : isSubtotal ? 'font-medium' : ''} ${isEmpty ? '' : getValueColor(total, isExpense)}`}>
        {isEmpty ? '' : formatCurrencyWholeNumbers(total, currentProject.currency)}
      </td>
      <td className={`py-2 text-right ${isFinal ? 'font-bold' : isSubtotal ? 'font-medium' : ''} ${isEmpty ? '' : getValueColor(perUnit, isExpense)}`}>
        {isEmpty ? '' : formatCurrencyWholeNumbers(perUnit, currentProject.currency)}
      </td>
      <td className={`py-2 text-right ${isFinal ? 'font-bold' : isSubtotal ? 'font-medium' : ''}`}>
        {isEmpty ? '' : (percentage !== undefined ? `${percentage.toFixed(1)}%` : '-')}
      </td>
    </tr>
  );

  return (
    <div className="sticky top-4 space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">P&L Statement</h2>
      
      {/* Summary Info */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Currency:</span>
            <div className="font-medium">{currentProject.currency}</div>
          </div>
          <div>
            <span className="text-gray-600">Units:</span>
            <div className="font-medium">{unitsCount}</div>
          </div>
          <div>
            <span className="text-gray-600">VAT Rate:</span>
            <div className="font-medium">{currentProject.vatSettings.rate}% ({currentProject.vatSettings.isInclusive ? 'Inclusive' : 'Exclusive'})</div>
          </div>
        </div>
      </div>

      {/* P&L Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th className="text-left py-3 font-bold">Item</th>
              <th className="text-right py-3 font-bold">Total</th>
              <th className="text-right py-3 font-bold">Per Unit</th>
              <th className="text-right py-3 font-bold">% of Net Sales</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {/* Revenue Section */}
            <LineItem
              label="Total Sale Price"
              total={calculations.totalSalePrice}
              perUnit={calculations.perUnit.salePrice}
              percentage={calculations.totalSalePrice / calculations.netSalePrice * 100}
            />
            <LineItem
              label="VAT"
              total={-calculations.vatAmount}
              perUnit={-calculations.perUnit.vatAmount}
              percentage={calculations.vatAmount / calculations.netSalePrice * 100}
            />
            <LineItem
              label="Net Sales (Revenue)"
              total={calculations.netSalePrice}
              perUnit={calculations.perUnit.netSalePrice}
              percentage={100}
              isSubtotal={true}
            />
            {calculations.fixedCharge > 0 && (
              <LineItem
                label="Fixed Charge (Setup/Design)"
                total={calculations.fixedCharge}
                perUnit={calculations.perUnit.fixedCharge}
                percentage={calculations.percentOfNetSales.fixedCharge}
              />
            )}
            
            {/* COGS Section */}
            <tr><td colSpan={4} className="py-2"></td></tr>
            <LineItem
              label="Cost of Goods Sold (COGS):"
              total={0}
              perUnit={0}
              isSubtotal={true}
              isEmpty={true}
            />
            <LineItem
              label="Main Materials"
              total={calculations.cogs.mainMaterials}
              perUnit={calculations.cogs.mainMaterials / unitsCount}
              percentage={calculations.percentOfNetSales.cogs * (calculations.cogs.mainMaterials / calculations.cogs.total)}
              indent={1}
              isExpense={true}
            />
            <LineItem
              label="Packaging"
              total={calculations.cogs.packaging}
              perUnit={calculations.cogs.packaging / unitsCount}
              percentage={calculations.percentOfNetSales.cogs * (calculations.cogs.packaging / calculations.cogs.total)}
              indent={1}
              isExpense={true}
            />
            <LineItem
              label="Decorations"
              total={calculations.cogs.decorations}
              perUnit={calculations.cogs.decorations / unitsCount}
              percentage={calculations.percentOfNetSales.cogs * (calculations.cogs.decorations / calculations.cogs.total)}
              indent={1}
              isExpense={true}
            />
            <LineItem
              label="Total COGS"
              total={calculations.cogs.total}
              perUnit={calculations.perUnit.cogs}
              percentage={calculations.percentOfNetSales.cogs}
              isSubtotal={true}
              isExpense={true}
            />
            
            {/* Gross Profit */}
            <LineItem
              label="Gross Profit"
              total={calculations.grossProfit}
              perUnit={calculations.perUnit.grossProfit}
              percentage={calculations.percentOfNetSales.grossProfit}
              isSubtotal={true}
            />
            
            {/* Operating Expenses */}
            <tr><td colSpan={4} className="py-2"></td></tr>
            <LineItem
              label="Operating Expenses:"
              total={0}
              perUnit={0}
              isSubtotal={true}
              isEmpty={true}
            />
            <LineItem
              label="Machine Costs"
              total={calculations.operatingExpenses.machineCosts}
              perUnit={calculations.operatingExpenses.machineCosts / unitsCount}
              percentage={calculations.percentOfNetSales.machineCosts}
              indent={1}
              isExpense={true}
            />
            <LineItem
              label="Labor Costs"
              total={calculations.operatingExpenses.laborCosts}
              perUnit={calculations.operatingExpenses.laborCosts / unitsCount}
              percentage={calculations.percentOfNetSales.laborCosts}
              indent={1}
              isExpense={true}
            />
            <LineItem
              label="Overhead"
              total={calculations.operatingExpenses.overhead}
              perUnit={calculations.operatingExpenses.overhead / unitsCount}
              percentage={calculations.percentOfNetSales.overhead}
              indent={1}
              isExpense={true}
            />
            <LineItem
              label="Total Operating Expenses"
              total={calculations.operatingExpenses.total}
              perUnit={calculations.perUnit.operatingExpenses}
              percentage={calculations.percentOfNetSales.machineCosts + calculations.percentOfNetSales.laborCosts + calculations.percentOfNetSales.overhead}
              isSubtotal={true}
              isExpense={true}
            />
            
            {/* Net Profit */}
            <LineItem
              label="Net Profit"
              total={calculations.netProfit}
              perUnit={calculations.perUnit.netProfit}
              percentage={calculations.percentOfNetSales.netProfit}
              isFinal={true}
            />
          </tbody>
        </table>
      </div>

      {/* Key Metrics */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Gross Margin</h4>
          <div className="text-2xl font-bold text-blue-600">
            {formatPercentage(calculations.percentOfNetSales.grossProfit)}
          </div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-medium text-green-900 mb-2">Net Margin</h4>
          <div className="text-2xl font-bold text-green-600">
            {formatPercentage(calculations.percentOfNetSales.netProfit)}
          </div>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg">
          <h4 className="font-medium text-purple-900 mb-2">Break-even Units</h4>
          <div className="text-2xl font-bold text-purple-600">
            {calculations.operatingExpenses.total > 0 && calculations.perUnit.grossProfit > 0
              ? Math.ceil(calculations.operatingExpenses.total / calculations.perUnit.grossProfit)
              : 'N/A'
            }
          </div>
        </div>

        {/* What-If Matrix Button */}
        <div className="mt-6 text-center">
          <button
            onClick={() => setShowWhatIfMatrix(true)}
            className="px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors cursor-pointer"
          >
            Show What-If Matrix
          </button>
        </div>
      </div>
      </div>
      
      {/* What-If Matrix Modal */}
      {showWhatIfMatrix && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">What-If Scenario Matrix</h2>
              <button
                onClick={() => setShowWhatIfMatrix(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl cursor-pointer"
              >
                ×
              </button>
            </div>
            <div className="p-4">
              <WhatIfMatrix />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}