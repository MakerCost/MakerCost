'use client';

import { useState } from 'react';
import LogoUpload from './LogoUpload';
import { ExportSettings as ExportSettingsType } from '@/types/pricing';

interface ExportSettingsProps {
  settings: ExportSettingsType;
  onSettingsChange: (settings: ExportSettingsType) => void;
  isOpen: boolean;
  onClose: () => void;
}

const DEFAULT_FOOTER_TEXT = `Thank you for choosing [Business Name]. We look forward to bringing your project to life!

For any questions or modifications, please don't hesitate to contact us.`;

export default function ExportSettings({ settings, onSettingsChange, isOpen, onClose }: ExportSettingsProps) {
  const [localSettings, setLocalSettings] = useState<ExportSettingsType>(settings);
  const [error, setError] = useState<string>('');

  if (!isOpen) return null;

  const handleSave = () => {
    onSettingsChange(localSettings);
    onClose();
  };

  const handleCancel = () => {
    setLocalSettings(settings); // Reset to original settings
    setError('');
    onClose();
  };

  const handleLogoChange = (logoData: string | null) => {
    setLocalSettings(prev => ({
      ...prev,
      logoUrl: logoData || undefined
    }));
    setError('');
  };

  const handleBusinessNameChange = (businessName: string) => {
    setLocalSettings(prev => ({
      ...prev,
      businessName: businessName || undefined
    }));
  };

  const handleFooterTextChange = (footerText: string) => {
    setLocalSettings(prev => ({
      ...prev,
      customFooterText: footerText.trim() || undefined
    }));
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 rounded-t-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">PDF Export Settings</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Customize how your quotes appear in PDF exports
          </p>
        </div>

        <div className="px-6 py-4 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <svg className="w-5 h-5 text-red-400 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          )}

          {/* Header Customization */}
          <div className="space-y-3">
            <h3 className="text-base font-medium text-gray-900 border-b border-gray-200 pb-1">
              Header Customization
            </h3>
            
            {/* Business Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Name
              </label>
              <input
                type="text"
                value={localSettings.businessName || ''}
                onChange={(e) => handleBusinessNameChange(e.target.value)}
                placeholder="Enter your business name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                This will appear in the header of your PDF quotes
              </p>
            </div>

            {/* Logo Upload */}
            <LogoUpload
              currentLogo={localSettings.logoUrl}
              onLogoChange={handleLogoChange}
              onError={handleError}
            />
          </div>

          {/* Export Options */}
          <div className="space-y-3">
            <h3 className="text-base font-medium text-gray-900 border-b border-gray-200 pb-1">
              Export Options
            </h3>
            
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={localSettings.includeBreakdown ?? true}
                  onChange={(e) => setLocalSettings(prev => ({
                    ...prev,
                    includeBreakdown: e.target.checked
                  }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Include detailed cost breakdown in PDF</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={localSettings.showPerUnitCosts ?? false}
                  onChange={(e) => setLocalSettings(prev => ({
                    ...prev,
                    showPerUnitCosts: e.target.checked
                  }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Show individual unit cost calculations</span>
              </label>
            </div>
          </div>

          {/* Footer Customization */}
          <div className="space-y-3">
            <h3 className="text-base font-medium text-gray-900 border-b border-gray-200 pb-1">
              Footer Customization
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Custom Footer Text
              </label>
              <textarea
                value={localSettings.customFooterText || ''}
                onChange={(e) => handleFooterTextChange(e.target.value)}
                placeholder={`${DEFAULT_FOOTER_TEXT}\n\nQuote valid for 5 days from date of issue.`}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                Use [Business Name] as a placeholder that will be replaced with your business name.
                Leave empty to use the default text with validity period below.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quote Validity (Days)
              </label>
              <input
                type="number"
                value={localSettings.validityDays || 5}
                onChange={(e) => setLocalSettings(prev => ({
                  ...prev,
                  validityDays: parseInt(e.target.value) || 5
                }))}
                min="1"
                max="365"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Number of days the quote remains valid from the issue date.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200 rounded-b-lg">
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}