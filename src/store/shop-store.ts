import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Currency } from '@/types/pricing';
import { saveShopData, loadShopData, DatabaseError, validateShopData, sanitizeShopData } from '@/lib/database';

interface LegacyShopData {
  rent?: number;
  electricity?: number;
  software?: number;
  marketing?: number;
  accounting?: number;
  insurance?: number;
  internet?: number;
  otherExpenses?: number;
}

export type UnitSystem = 'metric' | 'imperial';

export interface ShopData {
  name: string;
  address: string;
  phone: string;
  email: string;
  logo: string | null;
  slogan: string;
  quoteComments: string;
  currency: Currency;
  unitSystem: UnitSystem;
  rentLease: number;
  utilities: number;
  digitalInfrastructure: number;
  insuranceProfessional: number;
  marketingAdvertising: number;
  officeSupplies: number;
  transportationDelivery: number;
  miscellaneousContingency: number;
  totalMonthlyHours: number;
  laborRate: number;
  operatingHours: number;
  operatingDays: number;
  powerCostPerKwh: number;
  vatRate: number;
  // Sync metadata
  lastModified?: string;
  syncVersion?: number;
}

interface ShopState {
  shopData: ShopData;
  loading: boolean;
  error: string | null;
  updateShopData: (data: Partial<ShopData>) => void;
  resetShopData: () => void;
  syncTotalHours: () => void;
  getShopDataForExport: () => {
    businessName: string;
    logoUrl: string | undefined;
    companyInfo: {
      name: string;
      address: string;
      phone: string;
      email: string;
    };
    customFooterText?: string;
    quoteComments: string;
  };
  calculateMonthlyOverhead: () => number;
  calculateHourlyOverhead: () => number;
  
  // Database operations
  saveToDatabase: () => Promise<void>;
  loadFromDatabase: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

// Migration function for legacy data
const migrateLegacyData = (legacyData: LegacyShopData & Partial<ShopData>): ShopData => {
  // If new format already exists, return as is
  if (legacyData.rentLease !== undefined) {
    // Ensure unitSystem, vatRate, and quoteComments exist for existing data
    return {
      ...legacyData as ShopData,
      unitSystem: legacyData.unitSystem || 'metric', // Default to metric for existing users
      vatRate: (legacyData as ShopData).vatRate || 8.875, // Default VAT rate for existing users
      quoteComments: (legacyData as ShopData).quoteComments || `Thank you for choosing our business. We look forward to bringing your project to life!

For any questions or modifications, please don't hesitate to contact us.

Quote valid for 5 days from date of issue.` // Default comments for existing users
    };
  }
  
  // Migrate from old format to new format
  return {
    name: legacyData.name || 'My Workshop',
    address: legacyData.address || '',
    phone: legacyData.phone || '',
    email: legacyData.email || '',
    logo: legacyData.logo || null,
    slogan: legacyData.slogan || '',
    quoteComments: `Thank you for choosing our business. We look forward to bringing your project to life!

For any questions or modifications, please don't hesitate to contact us.

Quote valid for 5 days from date of issue.`, // New field - default comments
    currency: ((legacyData as Record<string, unknown>).currency as Currency) || 'USD',
    unitSystem: 'metric', // New field - default to metric
    rentLease: legacyData.rent || 2500,
    utilities: legacyData.electricity || 350,
    digitalInfrastructure: (legacyData.software || 120) + (legacyData.internet || 80),
    insuranceProfessional: (legacyData.accounting || 150) + (legacyData.insurance || 200),
    marketingAdvertising: legacyData.marketing || 200,
    officeSupplies: 100, // New field - reasonable default
    transportationDelivery: 150, // New field - reasonable default  
    miscellaneousContingency: legacyData.otherExpenses || 150,
    totalMonthlyHours: legacyData.totalMonthlyHours || 160,
    laborRate: legacyData.laborRate || 45,
    operatingHours: legacyData.operatingHours || 8,
    operatingDays: legacyData.operatingDays || 22,
    powerCostPerKwh: 0.12, // New field - reasonable default
    vatRate: 8.875, // New field - reasonable default
  };
};

const defaultShopData: ShopData = {
  name: 'My Workshop',
  address: '',
  phone: '',
  email: '',
  logo: null,
  slogan: '',
  quoteComments: `Thank you for choosing our business. We look forward to bringing your project to life!

For any questions or modifications, please don't hesitate to contact us.

Quote valid for 5 days from date of issue.`,
  currency: 'USD',
  unitSystem: 'metric',
  rentLease: 2500,
  utilities: 350,
  digitalInfrastructure: 200, // software + internet
  insuranceProfessional: 350, // accounting + insurance
  marketingAdvertising: 200,
  officeSupplies: 100,
  transportationDelivery: 150,
  miscellaneousContingency: 150,
  totalMonthlyHours: 160,
  laborRate: 45,
  operatingHours: 8,
  operatingDays: 22,
  powerCostPerKwh: 0.12,
  vatRate: 8.875,
};

export const useShopStore = create<ShopState>()(
  persist(
    (set, get) => ({
      shopData: defaultShopData,
      loading: false,
      error: null,

      updateShopData: (data: Partial<ShopData>) => {
        set((state) => {
          // Sanitize and validate input data
          const sanitizedData = sanitizeShopData(data);
          
          const updated = { 
            ...state.shopData, 
            ...sanitizedData,
            lastModified: new Date().toISOString(),
            syncVersion: (state.shopData.syncVersion || 0) + 1
          };
          
          // Always auto-update totalMonthlyHours to ensure consistency
          updated.totalMonthlyHours = updated.operatingHours * updated.operatingDays;
          
          // Validate the complete data
          const validation = validateShopData(updated);
          if (!validation.isValid) {
            console.warn('Shop data validation warnings:', validation.errors);
            // Continue anyway - warnings don't prevent saving
          }
          
          return { shopData: updated };
        });
      },

      resetShopData: () => {
        set({ shopData: defaultShopData });
      },

      syncTotalHours: () => {
        set((state) => ({
          shopData: {
            ...state.shopData,
            totalMonthlyHours: state.shopData.operatingHours * state.shopData.operatingDays
          }
        }));
      },

      getShopDataForExport: () => {
        const { shopData } = get();
        const defaultFooterText = shopData.slogan 
          ? `${shopData.slogan}\n\nThank you for choosing ${shopData.name}. We look forward to bringing your project to life!\n\nFor any questions or modifications, please don't hesitate to contact us.`
          : `Thank you for choosing ${shopData.name}. We look forward to bringing your project to life!\n\nFor any questions or modifications, please don't hesitate to contact us.`;

        return {
          businessName: shopData.name,
          logoUrl: shopData.logo || undefined,
          companyInfo: {
            name: shopData.name,
            address: shopData.address,
            phone: shopData.phone,
            email: shopData.email,
          },
          customFooterText: defaultFooterText,
          quoteComments: shopData.quoteComments,
        };
      },

      calculateMonthlyOverhead: () => {
        const { shopData } = get();
        return shopData.rentLease + shopData.utilities + shopData.digitalInfrastructure + 
               shopData.insuranceProfessional + shopData.marketingAdvertising + shopData.officeSupplies + 
               shopData.transportationDelivery + shopData.miscellaneousContingency;
      },

      calculateHourlyOverhead: () => {
        const { shopData, calculateMonthlyOverhead } = get();
        const monthlyOverhead = calculateMonthlyOverhead();
        const monthlyHours = shopData.totalMonthlyHours;
        return monthlyHours > 0 ? monthlyOverhead / monthlyHours : 0;
      },

      // Database operations
      saveToDatabase: async () => {
        const { shopData } = get();
        set({ loading: true, error: null });
        
        try {
          await saveShopData(shopData);
          set({ loading: false });
        } catch (error) {
          const errorMessage = error instanceof DatabaseError && error.message.includes('not authenticated') 
            ? 'Shop data saved locally only (sign in to sync across devices)'
            : 'Failed to save shop data to cloud';
          
          set({ loading: false, error: errorMessage });
          
          // Don't throw error for offline usage
          if (!(error instanceof DatabaseError && error.message.includes('not authenticated'))) {
            console.error('Failed to save shop data:', error);
          }
        }
      },

      loadFromDatabase: async () => {
        set({ loading: true, error: null });
        
        try {
          const cloudShopData = await loadShopData();
          if (cloudShopData) {
            set({ shopData: cloudShopData, loading: false });
          } else {
            // No cloud data found, keep local data
            set({ loading: false });
          }
        } catch (error) {
          set({ loading: false });
          
          if (error instanceof DatabaseError && error.message.includes('not authenticated')) {
            // User not authenticated, use local data
            console.log('User not authenticated, using local shop data only');
          } else {
            const errorMessage = 'Failed to load shop data from cloud, using local data';
            set({ error: errorMessage });
            console.error('Failed to load shop data:', error);
          }
        }
      },

      setLoading: (loading: boolean) => set({ loading }),
      
      setError: (error: string | null) => set({ error }),
    }),
    {
      name: 'shop-store',
      version: 4,
      migrate: (persistedState: unknown, version: number) => {
        if (version < 2) {
          // Migrate from version 1 to 2 (old field names to new field names)
          const stateData = (persistedState as Record<string, unknown>)?.shopData || persistedState;
          const migratedData = migrateLegacyData(stateData as LegacyShopData & Partial<ShopData>);
          return { shopData: migratedData };
        }
        if (version < 3) {
          // Migrate to version 3 - update VAT rate to new default
          const state = persistedState as ShopState;
          return {
            shopData: {
              ...state.shopData,
              vatRate: 8.875, // Update to new default VAT rate
              currency: 'USD' // Ensure currency is USD by default
            }
          };
        }
        if (version < 4) {
          // Migrate to version 4 - add quoteComments field
          const state = persistedState as ShopState;
          return {
            shopData: {
              ...state.shopData,
              quoteComments: state.shopData.quoteComments || `Thank you for choosing our business. We look forward to bringing your project to life!

For any questions or modifications, please don't hesitate to contact us.

Quote valid for 5 days from date of issue.`
            }
          };
        }
        return persistedState as ShopState;
      },
    }
  )
);