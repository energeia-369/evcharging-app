export type CompareVehicle = {
  id: string
  name: string
  price: number // INR
  rangeKm: number
  chargingKw: number
  topSpeedKmh: number
  features: string[]
  safetyRating: number // out of 5
}

export const compareVehicles: CompareVehicle[] = [
  {
    id: 'cmp-01',
    name: 'Energeia E1',
    price: 2499000,
    rangeKm: 420,
    chargingKw: 150,
    topSpeedKmh: 180,
    features: ['Adaptive Cruise', 'Lane Assist', 'Panoramic Sunroof', 'Wireless Charging'],
    safetyRating: 4.8,
  },
  {
    id: 'cmp-02',
    name: 'Voltura V2',
    price: 2199000,
    rangeKm: 380,
    chargingKw: 120,
    topSpeedKmh: 170,
    features: ['Lane Assist', 'Heated Seats', 'Wireless Charging'],
    safetyRating: 4.6,
  },
  {
    id: 'cmp-03',
    name: 'Nexa Volt X',
    price: 1999000,
    rangeKm: 340,
    chargingKw: 100,
    topSpeedKmh: 160,
    features: ['Heated Seats', '360 Camera', 'Wireless Charging'],
    safetyRating: 4.4,
  },
  {
    id: 'cmp-04',
    name: 'Orion Prime',
    price: 2799000,
    rangeKm: 460,
    chargingKw: 200,
    topSpeedKmh: 200,
    features: ['Adaptive Cruise', 'Lane Assist', '360 Camera', 'Panoramic Sunroof', 'Premium Audio'],
    safetyRating: 4.9,
  },
]

export function formatINR(amount: number) {
  return `₹${(amount / 100000).toFixed(1)}L`
}
