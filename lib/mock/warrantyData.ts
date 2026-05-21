export type Warranty = {
  id: string
  vehicleName: string
  vin?: string
  purchaseDate: string
  expiryDate: string
  coveredServices: string[]
  batteryWarrantyYears: number
  extendedOptions?: { id: string; name: string; price: number; termYears: number }[]
}

export type WarrantyAlert = {
  warrantyId: string
  daysUntilExpiry: number
  message: string
}

const today = new Date()
const fmt = (d: Date) => d.toISOString().split('T')[0]

const addYears = (y: number) => {
  const d = new Date(today)
  d.setFullYear(d.getFullYear() + y)
  return fmt(d)
}

export const warranties: Warranty[] = [
  {
    id: 'w-01',
    vehicleName: 'Energeia E1',
    vin: 'ENR-E1-2024-001',
    purchaseDate: fmt(new Date(today.getFullYear(), 1, 12)),
    expiryDate: addYears(3),
    coveredServices: ['Battery', 'Powertrain', 'Charging Module'],
    batteryWarrantyYears: 8,
    extendedOptions: [{ id: 'ext-1', name: 'Extended Care 2yrs', price: 49999, termYears: 2 }],
  },
  {
    id: 'w-02',
    vehicleName: 'Voltura V2',
    vin: 'VLT-V2-2024-045',
    purchaseDate: fmt(new Date(today.getFullYear(), 3, 5)),
    expiryDate: addYears(2),
    coveredServices: ['Powertrain', 'Charging Module'],
    batteryWarrantyYears: 5,
    extendedOptions: [{ id: 'ext-2', name: 'Battery Cover 3yrs', price: 74999, termYears: 3 }],
  },
  {
    id: 'w-03',
    vehicleName: 'Nexa Volt X',
    vin: 'NXV-X-2023-112',
    purchaseDate: fmt(new Date(today.getFullYear() - 1, 8, 22)),
    expiryDate: addYears(1),
    coveredServices: ['Battery'],
    batteryWarrantyYears: 6,
  },
]

export function daysUntil(dateISO: string) {
  const diff = new Date(dateISO).getTime() - today.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export const warrantyAlerts: WarrantyAlert[] = warranties.map((w) => ({ warrantyId: w.id, daysUntilExpiry: daysUntil(w.expiryDate), message: daysUntil(w.expiryDate) < 30 ? 'Expiry soon' : 'Active' }))

export function formatINR(amount: number) {
  return `₹${(amount / 100000).toFixed(1)}L`
}
