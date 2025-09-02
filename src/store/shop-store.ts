import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Currency } from '@/types/pricing';

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
}

interface ShopState {
  shopData: ShopData;
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
  };
  calculateMonthlyOverhead: () => number;
  calculateHourlyOverhead: () => number;
}

// Migration function for legacy data
const migrateLegacyData = (legacyData: LegacyShopData & Partial<ShopData>): ShopData => {
  // If new format already exists, return as is
  if (legacyData.rentLease !== undefined) {
    // Ensure unitSystem and vatRate exist for existing data
    return {
      ...legacyData as ShopData,
      unitSystem: legacyData.unitSystem || 'metric', // Default to metric for existing users
      vatRate: (legacyData as ShopData).vatRate || 18 // Default VAT rate for existing users
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
    vatRate: 18, // New field - reasonable default
  };
};

const defaultShopData: ShopData = {
  name: 'My Workshop',
  address: '',
  phone: '',
  email: '',
  logo: null,
  slogan: '',
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
  vatRate: 18,
};

export const useShopStore = create<ShopState>()(
  persist(
    (set, get) => ({
      shopData: defaultShopData,

      updateShopData: (data: Partial<ShopData>) => {
        set((state) => {
          const updated = { ...state.shopData, ...data };
          
          // Always auto-update totalMonthlyHours to ensure consistency
          updated.totalMonthlyHours = updated.operatingHours * updated.operatingDays;
          
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
    }),
    {
      name: 'shop-store',
      version: 2,
      migrate: (persistedState: unknown, version: number) => {
        if (version < 2) {
          // Migrate from version 1 to 2 (old field names to new field names)
          const stateData = (persistedState as Record<string, unknown>)?.shopData || persistedState;
          const migratedData = migrateLegacyData(stateData as LegacyShopData & Partial<ShopData>);
          return { shopData: migratedData };
        }
        return persistedState as ShopState;
      },
    }
  )
);