'use client';

import { Material, Currency } from '@/types/pricing';
import { calculateMaterialCost, formatCurrency } from '@/lib/calculations';
import { formatUnitDisplay } from '@/lib/unit-system';

interface MaterialCardProps {
  material: Material;
  currency: Currency;
  onUpdate: (updates: Partial<Material>) => void;
  onRemove: () => void;
  onEdit: () => void;
}

export default function MaterialCard({ material, currency, onUpdate, onRemove, onEdit }: MaterialCardProps) {
  return (
    <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50">
      <div className="flex-1">
        <div className="flex items-center space-x-4">
          <h4 className="font-medium text-gray-900 dark:text-white">{material.name}</h4>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {material.quantity} {material.customUnit || formatUnitDisplay(material.unit)}
          </span>
          <span className="text-xs bg-gray-100 dark:bg-slate-600 px-2 py-1 rounded text-gray-700 dark:text-gray-300">
            {material.costType === 'per-unit' ? 'Per Unit' : 'Total Cost'}
          </span>
        </div>
        
        <div className="flex items-center space-x-4 mt-1">
          {material.costType === 'per-unit' ? (
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {formatCurrency(material.unitCost || 0, currency)} per {material.customUnit || formatUnitDisplay(material.unit)}
            </span>
          ) : (
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Total: {formatCurrency(material.totalCost || 0, currency)}
            </span>
          )}
          <span className="text-sm font-medium text-green-600 dark:text-green-400">
            Cost: {formatCurrency(calculateMaterialCost(material), currency)}
          </span>
        </div>
        
        {material.description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{material.description}</p>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={onEdit}
          className="px-2 py-1 text-xs text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer"
        >
          Edit
        </button>
        <button
          onClick={onRemove}
          className="px-2 py-1 text-xs text-red-600 dark:text-red-400 border border-red-600 dark:border-red-400 rounded hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer"
        >
          Remove
        </button>
      </div>
    </div>
  );
}