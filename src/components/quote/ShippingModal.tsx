'use client';

import { useState } from 'react';
import { ShippingInfo } from '@/types/pricing';

interface ShippingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (shipping: ShippingInfo) => void;
  currency: string;
}

export default function ShippingModal({ isOpen, onClose, onSubmit, currency }: ShippingModalProps) {
  const [cost, setCost] = useState<string>('');
  const [chargeToCustomer, setChargeToCustomer] = useState<string>('');
  const [includesVAT, setIncludesVAT] = useState<boolean>(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const costValue = parseFloat(cost) || 0;
    const chargeValue = parseFloat(chargeToCustomer) || 0;

    const shipping: ShippingInfo = {
      cost: costValue,
      chargeToCustomer: chargeValue,
      isFreeShipping: chargeValue === 0 && costValue > 0,
      includesVAT
    };

    onSubmit(shipping);
    
    // Reset form
    setCost('');
    setChargeToCustomer('');
    setIncludesVAT(true);
  };

  const handleClose = () => {
    setCost('');
    setChargeToCustomer('');
    setIncludesVAT(true);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-xl font-bold mb-4">Add Shipping</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Shipping Cost ({currency})
            </label>
            <input
              type="number"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              step="0.01"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
              required
            />
            <p className="text-xs text-gray-500 mt-1">The actual cost of shipping</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Price to Charge Customer ({currency})
            </label>
            <input
              type="number"
              value={chargeToCustomer}
              onChange={(e) => setChargeToCustomer(e.target.value)}
              step="0.01"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00 (leave empty for free shipping)"
            />
            <p className="text-xs text-gray-500 mt-1">
              Leave empty to offer free shipping to customer
            </p>
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={includesVAT}
                onChange={(e) => setIncludesVAT(e.target.checked)}
                className="mr-2 cursor-pointer"
              />
              <span className="text-sm font-medium">Shipping costs include VAT</span>
            </label>
            <p className="text-xs text-gray-500 mt-1">
              Check if both shipping cost and customer charge already include VAT
            </p>
          </div>

          {parseFloat(chargeToCustomer) === 0 && parseFloat(cost) > 0 && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-800 text-sm">
                🎉 Free shipping will be offered to the customer
              </p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
            >
              Add Shipping
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}