import { MachineType } from '@/types/pricing';

export const MACHINE_DEFAULTS: Record<MachineType, { lifetimeHours: number }> = {
  'CO2 Laser': { lifetimeHours: 8000 },
  'Fiber Laser': { lifetimeHours: 10000 },
  'UV Printer': { lifetimeHours: 5000 },
  'Sublimation Press': { lifetimeHours: 6000 },
  'FDM 3D Printer': { lifetimeHours: 3000 },
  'Resin Printer': { lifetimeHours: 2000 },
  'CNC Router': { lifetimeHours: 12000 },
  'Vinyl Cutter': { lifetimeHours: 4000 },
  'Injection Molding': { lifetimeHours: 50000 },
  'Die Cutting': { lifetimeHours: 15000 },
  'Heat Press': { lifetimeHours: 3000 },
  'Embroidery Machine': { lifetimeHours: 8000 },
  'Screen Printer': { lifetimeHours: 10000 },
  'Pad Printer': { lifetimeHours: 7000 },
  'Rotary Engraver': { lifetimeHours: 6000 },
  'Plasma Cutter': { lifetimeHours: 8000 },
  'Waterjet Cutter': { lifetimeHours: 15000 },
  'Bandsaw': { lifetimeHours: 10000 },
  'Table Saw': { lifetimeHours: 12000 },
  'Router Table': { lifetimeHours: 8000 },
  'Drill Press': { lifetimeHours: 15000 },
  'Lathe': { lifetimeHours: 20000 },
  'Milling Machine': { lifetimeHours: 25000 },
  'Welding Equipment': { lifetimeHours: 5000 },
  'Powder Coating Oven': { lifetimeHours: 8000 },
  'Kiln': { lifetimeHours: 10000 },
  'Vacuum Former': { lifetimeHours: 4000 },
  'Airbrush Setup': { lifetimeHours: 2000 },
  'Sewing Machine': { lifetimeHours: 5000 },
  'Other': { lifetimeHours: 5000 },
};

export const getMachineDefault = (machineType: MachineType) => {
  return MACHINE_DEFAULTS[machineType];
};