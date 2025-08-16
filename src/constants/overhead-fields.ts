export const OVERHEAD_FIELDS = [
  {
    key: 'rentLease' as const,
    label: 'Rent / Lease',
    tooltip: 'Include not only base rent but also municipal taxes, building management fees, and any shared facility costs.',
    placeholder: '2500'
  },
  {
    key: 'utilities' as const,
    label: 'Utilities (Electricity, Water, Gas)',
    tooltip: 'Factor in all recurring utility bills, including seasonal peaks and any special equipment power usage.',
    placeholder: '350'
  },
  {
    key: 'digitalInfrastructure' as const,
    label: 'Digital (Internet, Software, Licenses)',
    tooltip: 'Cover internet service, cloud storage, website hosting, software subscriptions, and domain renewals.',
    placeholder: '200'
  },
  {
    key: 'insuranceProfessional' as const,
    label: 'Insurance & Professional Services',
    tooltip: 'Include business liability, property insurance, accountant fees, legal consultations, and business advisory services.',
    placeholder: '350'
  },
  {
    key: 'marketingAdvertising' as const,
    label: 'Marketing & Advertising',
    tooltip: 'Consider online ads, printed materials, event sponsorships, promotional products, and social media campaigns.',
    placeholder: '200'
  },
  {
    key: 'officeSupplies' as const,
    label: 'Office Supplies & Consumables',
    tooltip: 'Stationery, printer ink, packaging materials, and other regularly purchased small items.',
    placeholder: '100'
  },
  {
    key: 'transportationDelivery' as const,
    label: 'Transportation & Delivery Expenses',
    tooltip: 'Fuel, vehicle maintenance, public transport, or courier and shipping costs.',
    placeholder: '150'
  },
  {
    key: 'miscellaneousContingency' as const,
    label: 'Miscellaneous / Contingency Fund',
    tooltip: 'Unexpected expenses, small repairs, or one-off purchases not covered elsewhere.',
    placeholder: '150'
  },
] as const;