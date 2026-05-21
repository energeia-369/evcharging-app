export type MonthlyRevenue = { month: string; revenue: number }
export const monthlyRevenue: MonthlyRevenue[] = [
  { month: 'Jan', revenue: 3200000 },
  { month: 'Feb', revenue: 3600000 },
  { month: 'Mar', revenue: 4100000 },
  { month: 'Apr', revenue: 4700000 },
  { month: 'May', revenue: 5200000 },
  { month: 'Jun', revenue: 5800000 },
]

export const salesGrowth = {
  period: 'Last 6 months',
  percent: 18.4,
  trend: [8, 10, 12, 13, 15, 18.4],
}

export const topSellingVehicles = [
  { name: 'Energeia E1', units: 420 },
  { name: 'Voltura V2', units: 380 },
  { name: 'Nexa Volt X', units: 320 },
]

export const profitSummary = {
  grossProfit: 1250000,
  netProfit: 720000,
  marginPercent: 23.1,
}

export const customerGrowth = {
  months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  numbers: [1200, 1320, 1480, 1600, 1750, 1980],
}
