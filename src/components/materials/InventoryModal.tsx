'use client';

import { useState, useEffect } from 'react';
import { useShopStore } from '@/store/shop-store';
import { formatNumberForDisplay, parseFormattedNumber } from '@/lib/currency-utils';

interface InventoryModalProps {
  materialName: string;
  onSubmit: (inventoryQuantity: number) => void;
  onClose: () => void;
}

export default function InventoryModal({ materialName, onSubmit, onClose }: InventoryModalProps) {
  const { shopData } = useShopStore();
  const [inventoryQuantity, setInventoryQuantity] = useState<number>(100);
  const [minStockLevel, setMinStockLevel] = useState<number>(10);
  const [error, setError] = useState<string>('');

  // Auto-calculate minimum stock level as 10% of current stock
  useEffect(() => {
    const calculatedMinStock = Math.max(1, Math.floor(inventoryQuantity * 0.1));
    setMinStockLevel(calculatedMinStock);
  }, [inventoryQuantity]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (inventoryQuantity <= 0) {
      setError('Inventory quantity must be greater than 0');
      return;
    }
    
    onSubmit(inventoryQuantity);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Add to Inventory</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-4">
          <p className="text-gray-600 mb-2">
            You&apos;re about to add <strong>{materialName}</strong> to your material library.
          </p>
          <p className="text-sm text-gray-500">
            How much of this material do you currently have in stock?
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Initial Inventory Quantity
            </label>
            <input
              type="text"
              value={formatNumberForDisplay(inventoryQuantity)}
              onChange={(e) => {
                const numValue = parseFormattedNumber(e.target.value) || 0;
                setInventoryQuantity(numValue);
                setError('');
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="100"
              autoFocus
            />
            {error && (
              <p className="text-red-500 text-sm mt-1">{error}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              This will be your starting inventory amount. You can adjust it later.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Stock Level (Auto-calculated)
            </label>
            <input
              type="text"
              value={formatNumberForDisplay(minStockLevel)}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
            />
            <p className="text-xs text-gray-500 mt-1">
              Automatically set to 10% of initial inventory ({minStockLevel} units)
            </p>
          </div>

          <div className="bg-blue-50 rounded-lg p-3">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-blue-400 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="text-sm text-blue-700">
                <p className="font-medium">What happens next:</p>
                <ul className="mt-1 list-disc list-inside space-y-1">
                  <li>Material is added to your inventory</li>
                  <li>Cost and details are saved for future use</li>
                  <li>You can reuse this material in other projects</li>
                  <li>Inventory will be tracked automatically</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 cursor-pointer"
            >
              Add to Inventory
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}