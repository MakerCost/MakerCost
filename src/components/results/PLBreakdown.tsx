'use client';

import { useState } from 'react';
import { usePricingStore } from '@/store/pricing-store';
import { useQuoteStore } from '@/store/quote-store';
import { formatCurrencyWholeNumbers, formatPercentage, calculateVAT } from '@/lib/calculations';
import Tooltip from '@/components/ui/Tooltip';
import WhatIfMatrix from './WhatIfMatrix';

const getValueColor = (value: number, isExpense: boolean = false): string => {
  if (isExpense) return 'text-red-600 dark:text-red-400';
  if (value > 0) return 'text-green-600 dark:text-green-400';
  if (value < 0) return 'text-red-600 dark:text-red-400';
  return 'text-gray-600 dark:text-gray-300';
};

const getGrossProfitColor = (percentage: number): string => {
  if (percentage >= 60) return 'text-green-600 dark:text-green-400';
  if (percentage >= 40) return 'text-yellow-600 dark:text-yellow-400';
  return 'text-red-600 dark:text-red-400';
};

const getOperationalProfitColor = (percentage: number): string => {
  if (percentage >= 20) return 'text-green-600 dark:text-green-400';
  if (percentage >= 10) return 'text-yellow-600 dark:text-yellow-400';
  return 'text-red-600 dark:text-red-400';
};

export default function PLBreakdown() {
  const { currentProject } = usePricingStore();
  const { currentQuote } = useQuoteStore();
  const calculations = currentProject.calculations;
  const [showWhatIfMatrix, setShowWhatIfMatrix] = useState(false);
  
  // Get shipping information if we're in a quote context
  const shippingInfo = currentQuote?.shipping;
  
  // Calculate shipping amounts for P&L
  const getShippingAmounts = () => {
    if (!shippingInfo || shippingInfo.chargeToCustomer <= 0) {
      return { grossAmount: 0, netAmount: 0, vatAmount: 0 };
    }
    
    if (shippingInfo.includesVAT) {
      // If shipping includes VAT, calculate net and VAT amounts
      const vatSettings = { rate: currentProject.vatSettings.rate, isInclusive: true };
      const vatCalc = calculateVAT(shippingInfo.chargeToCustomer, vatSettings);
      return {
        grossAmount: shippingInfo.chargeToCustomer,
        netAmount: vatCalc.netAmount,
        vatAmount: vatCalc.vatAmount
      };
    } else {
      // If shipping excludes VAT, gross = net, no VAT
      return {
        grossAmount: shippingInfo.chargeToCustomer,
        netAmount: shippingInfo.chargeToCustomer,
        vatAmount: 0
      };
    }
  };
  
  const shippingAmounts = getShippingAmounts();
  
  // Calculate the new net sales total including shipping
  const netSalesWithShipping = (calculations?.netSalePrice || 0) + shippingAmounts.netAmount;

  if (!calculations) {
    return (
      <div className="sticky top-4 bg-white dark:bg-slate-800 rounded-lg shadow dark:shadow-slate-700/10 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">P&L Breakdown</h2>
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
    isEmpty = false,
    labelTooltip,
    percentageTooltip,
    isGrossProfit = false,
    isOperationalProfit = false
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
    labelTooltip?: string;
    percentageTooltip?: string;
    isGrossProfit?: boolean;
    isOperationalProfit?: boolean;
  }) => {
    const getPercentageColor = () => {
      if (isGrossProfit && percentage !== undefined) {
        return getGrossProfitColor(percentage);
      }
      if (isOperationalProfit && percentage !== undefined) {
        return getOperationalProfitColor(percentage);
      }
      return '';
    };

    return (
      <tr className={`${isSubtotal || isFinal ? 'border-t border-gray-300' : ''} ${isFinal ? 'font-bold text-lg bg-green-50 dark:bg-green-900/10' : ''}`}>
        <td className={`py-2 ${indent > 0 ? `pl-${indent * 4}` : ''} ${isFinal ? 'font-bold' : isSubtotal ? 'font-medium' : ''}`}>
          {labelTooltip ? (
            <Tooltip content={labelTooltip}>
              <span className="cursor-help border-b border-dotted border-gray-400">{label}</span>
            </Tooltip>
          ) : (
            label
          )}
        </td>
        <td className={`py-2 text-right ${isFinal ? 'font-bold' : isSubtotal ? 'font-medium' : ''} ${isEmpty ? '' : getValueColor(total, isExpense)}`}>
          {isEmpty ? '' : formatCurrencyWholeNumbers(total, currentProject.currency)}
        </td>
        <td className={`py-2 text-right ${isFinal ? 'font-bold' : isSubtotal ? 'font-medium' : ''} ${isEmpty ? '' : getValueColor(perUnit, isExpense)}`}>
          {isEmpty ? '' : formatCurrencyWholeNumbers(perUnit, currentProject.currency)}
        </td>
        <td className={`py-2 text-right ${isFinal ? 'font-bold' : isSubtotal ? 'font-medium' : ''}`}>
          {isEmpty ? '' : (percentage !== undefined ? (
            percentageTooltip ? (
              <Tooltip content={percentageTooltip}>
                <span className={`cursor-help ${getPercentageColor()}`}>
                  {percentage.toFixed(1)}%
                </span>
              </Tooltip>
            ) : (
              <span className={getPercentageColor()}>
                {percentage.toFixed(1)}%
              </span>
            )
          ) : '-')}
        </td>
      </tr>
    );
  };

  return (
    <div className="sticky top-4 bg-white dark:bg-slate-800 rounded-lg shadow dark:shadow-slate-700/10 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">P&L Breakdown</h2>
      </div>
      
      {/* Summary Info */}
      <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 text-sm">
          <div>
            <span className="text-gray-600 dark:text-gray-300">Currency:</span>
            <div className="font-medium text-gray-900 dark:text-white">{currentProject.currency}</div>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-300">Units:</span>
            <div className="font-medium text-gray-900 dark:text-white">{unitsCount}</div>
          </div>
          <div className="sm:col-span-2 lg:col-span-1">
            <span className="text-gray-600 dark:text-gray-300">VAT / Sales Tax:</span>
            <div className="font-medium text-gray-900 dark:text-white">
              {currentProject.vatSettings.rate}% ({currentProject.vatSettings.isInclusive ? 'Inclusive' : 'Exclusive'})
            </div>
          </div>
        </div>
      </div>

      {/* P&L Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-gray-300 dark:border-gray-600">
              <th className="text-left py-2 font-bold text-gray-900 dark:text-white w-[45%]">Item</th>
              <th className="text-right py-2 font-bold text-gray-900 dark:text-white w-[18%]">Total</th>
              <th className="text-right py-2 font-bold text-gray-900 dark:text-white w-[18%]">Per Unit</th>
              <th className="text-right py-2 font-bold text-gray-900 dark:text-white w-[19%]">% of Net Sales</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {/* Revenue Section */}
            <LineItem
              label="Total Sale Price"
              total={calculations.totalSalePrice + shippingAmounts.grossAmount}
              perUnit={(calculations.totalSalePrice + shippingAmounts.grossAmount) / unitsCount}
              percentage={(calculations.totalSalePrice + shippingAmounts.grossAmount) / netSalesWithShipping * 100}
            />
            <LineItem
              label="VAT / Sales Tax"
              total={-(calculations.vatAmount + shippingAmounts.vatAmount)}
              perUnit={-(calculations.vatAmount + shippingAmounts.vatAmount) / unitsCount}
              percentage={(calculations.vatAmount + shippingAmounts.vatAmount) / netSalesWithShipping * 100}
            />
            <LineItem
              label="Net Sales (Revenue)"
              total={calculations.netSalePrice + shippingAmounts.netAmount}
              perUnit={(calculations.netSalePrice + shippingAmounts.netAmount) / unitsCount}
              percentage={100}
              isSubtotal={true}
            />
            {calculations.fixedCharge > 0 && (
              <LineItem
                label="Fixed Charge (Setup/Design)"
                total={calculations.fixedChargeNet}
                perUnit={calculations.perUnit.fixedChargeNet}
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
              total={calculations.grossProfit + shippingAmounts.netAmount}
              perUnit={(calculations.grossProfit + shippingAmounts.netAmount) / unitsCount}
              percentage={((calculations.grossProfit + shippingAmounts.netAmount) / netSalesWithShipping) * 100}
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
            {shippingInfo && shippingInfo.cost > 0 && (
              <LineItem
                label="Shipping Expense"
                total={shippingInfo.cost}
                perUnit={shippingInfo.cost / unitsCount}
                percentage={(shippingInfo.cost / calculations.netSalePrice) * 100}
                indent={1}
                isExpense={true}
              />
            )}
            <LineItem
              label="Total Operating Expenses"
              total={calculations.operatingExpenses.total + (shippingInfo?.cost || 0)}
              perUnit={(calculations.operatingExpenses.total + (shippingInfo?.cost || 0)) / unitsCount}
              percentage={((calculations.operatingExpenses.total + (shippingInfo?.cost || 0)) / calculations.netSalePrice) * 100}
              isSubtotal={true}
              isExpense={true}
            />
            
            {/* Operational Profit */}
            <LineItem
              label="Operational Profit"
              total={calculations.netProfit + shippingAmounts.netAmount - (shippingInfo?.cost || 0)}
              perUnit={(calculations.netProfit + shippingAmounts.netAmount - (shippingInfo?.cost || 0)) / unitsCount}
              percentage={((calculations.netProfit + shippingAmounts.netAmount - (shippingInfo?.cost || 0)) / netSalesWithShipping) * 100}
              isFinal={true}
            />
          </tbody>
        </table>
      </div>

      {/* Key Metrics */}
      <div className="mt-6">
        <div className={`grid gap-4 ${calculations.operatingExpenses.total > 0 && calculations.perUnit.grossProfit > 0 ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">Gross Margin</h4>
            <div className="text-xl font-bold">
              <Tooltip content="Aim for 60% and above" maxWidth="max-w-2xl">
                <span className={`cursor-help ${getGrossProfitColor(((calculations.grossProfit + shippingAmounts.netAmount) / netSalesWithShipping) * 100)}`}>
                  {formatPercentage(((calculations.grossProfit + shippingAmounts.netAmount) / netSalesWithShipping) * 100)}
                </span>
              </Tooltip>
            </div>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
            <Tooltip content="Not including tax and financing expenses" maxWidth="max-w-2xl">
              <h4 className="text-sm font-medium text-green-900 dark:text-green-100 mb-1 cursor-help border-b border-dotted border-green-700 dark:border-green-300">Operational Margin</h4>
            </Tooltip>
            <div className="text-xl font-bold">
              <Tooltip content="Aim for 20% and above" maxWidth="max-w-2xl">
                <span className={`cursor-help ${getOperationalProfitColor(((calculations.netProfit + shippingAmounts.netAmount - (shippingInfo?.cost || 0)) / netSalesWithShipping) * 100)}`}>
                  {formatPercentage(((calculations.netProfit + shippingAmounts.netAmount - (shippingInfo?.cost || 0)) / netSalesWithShipping) * 100)}
                </span>
              </Tooltip>
            </div>
          </div>
          
          {/* Only show break-even when it can be calculated */}
          {calculations.operatingExpenses.total > 0 && calculations.perUnit.grossProfit > 0 && (
            <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
              <h4 className="text-sm font-medium text-purple-900 dark:text-purple-100 mb-1">Break-even Units</h4>
              <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
                {Math.ceil(calculations.operatingExpenses.total / calculations.perUnit.grossProfit)}
              </div>
            </div>
          )}
        </div>

        {/* What-If Matrix Button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => setShowWhatIfMatrix(true)}
            className="px-8 py-3 bg-purple-600 dark:bg-purple-500 text-white rounded-md hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors cursor-pointer font-medium"
          >
            What-If Matrix
          </button>
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