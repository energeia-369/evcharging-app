export type DealerMetric = {
  label: string
  value: number
  suffix: string
  progress: number
  icon: string
}

export type DealerBadge = {
  label: string
  color: string
}

export type DealershipPerformance = {
  id: string
  name: string
  city: string
  score: number
  monthlyEvSales: number
  revenueGrowth: number
  satisfactionRating: number
  deliverySuccessRate: number
  monthlyTarget: number
  totalRevenue: number
  badges: DealerBadge[]
}

export type AiRecommendation = {
  title: string
  city: string
  demandPrediction: string
  businessGrowthInsight: string
  salesForecast: string
  marketTrend: string
  confidence: number
}

export type InventoryAlert = {
  title: string
  detail: string
  level: 'critical' | 'warning' | 'info'
  badge: string
  icon: string
  color: string
}

export type RestockRecommendation = {
  city: string
  item: string
  reason: string
  priority: string
}

export type ApprovalTimelineStep = {
  title: string
  detail: string
  icon: string
}

export const dealerMetrics: DealerMetric[] = [
  { label: 'Monthly EV Sales', value: 186, suffix: 'units', progress: 0.78, icon: 'car-electric' },
  { label: 'Revenue Growth', value: 18, suffix: '%', progress: 0.68, icon: 'trending-up' },
  { label: 'Customer Satisfaction', value: 4.8, suffix: '/5', progress: 0.96, icon: 'star-circle' },
  { label: 'Delivery Success', value: 97, suffix: '%', progress: 0.97, icon: 'clipboard-check' },
]

export const dealershipPerformances: DealershipPerformance[] = [
  {
    id: 'dlr-01',
    name: 'Energeia Motors Pune',
    city: 'Pune',
    score: 92,
    monthlyEvSales: 186,
    revenueGrowth: 18.2,
    satisfactionRating: 4.8,
    deliverySuccessRate: 97,
    monthlyTarget: 200,
    totalRevenue: 24500000,
    badges: [
      { label: 'Top Seller', color: '#10B981' },
      { label: 'Fast Delivery', color: '#059669' },
      { label: 'High CSAT', color: '#16A34A' },
    ],
  },
  {
    id: 'dlr-02',
    name: 'Energeia Hyderabad Hub',
    city: 'Hyderabad',
    score: 89,
    monthlyEvSales: 172,
    revenueGrowth: 15.7,
    satisfactionRating: 4.7,
    deliverySuccessRate: 95,
    monthlyTarget: 180,
    totalRevenue: 31800000,
    badges: [
      { label: 'Consistent Growth', color: '#34D399' },
      { label: 'Customer Favorite', color: '#10B981' },
    ],
  },
  {
    id: 'dlr-03',
    name: 'Energeia Bangalore North',
    city: 'Bangalore',
    score: 86,
    monthlyEvSales: 159,
    revenueGrowth: 13.4,
    satisfactionRating: 4.6,
    deliverySuccessRate: 94,
    monthlyTarget: 175,
    totalRevenue: 28700000,
    badges: [
      { label: 'Reliable Ops', color: '#22C55E' },
      { label: 'Premium Service', color: '#059669' },
    ],
  },
]

export const aiRecommendations: AiRecommendation[] = [
  {
    title: 'High EV demand detected in Pune',
    city: 'Pune',
    demandPrediction: '94% predicted showroom capture rate over the next 90 days.',
    businessGrowthInsight: 'Premium test-drive traffic is rising near IT corridors and residential hubs.',
    salesForecast: 'Forecast: 215 EV units next month with a 14% uplift.',
    marketTrend: 'Fast-growing premium EV adoption',
    confidence: 96,
  },
  {
    title: 'Open premium EV showroom in Mumbai',
    city: 'Mumbai',
    demandPrediction: '87% demand intensity across South Mumbai and Western suburbs.',
    businessGrowthInsight: 'Luxury EV buyers are responding well to finance and delivery guarantees.',
    salesForecast: 'Forecast: 240 EV units in the first quarter after launch.',
    marketTrend: 'Luxury EV market expansion',
    confidence: 92,
  },
  {
    title: 'Scale franchise operations in Hyderabad',
    city: 'Hyderabad',
    demandPrediction: 'Strong suburban growth with a high repeat booking rate.',
    businessGrowthInsight: 'Conversion is strongest in weekend demo sessions and service-linked upsells.',
    salesForecast: 'Forecast: 198 EV units with premium accessories attach rate of 31%.',
    marketTrend: 'Balanced growth with stable CSAT',
    confidence: 89,
  },
]

export const inventoryAlerts: InventoryAlert[] = [
  {
    title: 'Nexa Volt X stock low',
    detail: 'Only 4 units available at the Pune showroom. Demand is outpacing current allocations.',
    level: 'critical',
    badge: 'Critical',
    icon: 'alert-circle',
    color: '#DC2626',
  },
  {
    title: 'Battery inventory running low',
    detail: 'Fast-charge battery packs are below the safety threshold in Hyderabad and Bangalore.',
    level: 'warning',
    badge: 'Warning',
    icon: 'battery-alert',
    color: '#D97706',
  },
  {
    title: 'Midnight Black stock healthy',
    detail: 'Color availability remains stable across all active franchise locations.',
    level: 'info',
    badge: 'Healthy',
    icon: 'check-decagram',
    color: '#059669',
  },
]

export const inventoryHealthSummary = [
  { label: 'Critical', value: 2, color: '#DC2626' },
  { label: 'Warning', value: 3, color: '#D97706' },
  { label: 'Healthy', value: 11, color: '#059669' },
]

export const restockRecommendations: RestockRecommendation[] = [
  {
    city: 'Pune',
    item: 'Nexa Volt X',
    reason: 'High showroom demand and low available stock suggest an immediate restock.',
    priority: 'Urgent',
  },
  {
    city: 'Mumbai',
    item: 'Battery packs',
    reason: 'Premium EV delivery pipeline needs an additional battery buffer for the next cycle.',
    priority: 'High',
  },
  {
    city: 'Hyderabad',
    item: 'Arctic White units',
    reason: 'Booking requests are increasing faster than the current lot replenishment rate.',
    priority: 'Medium',
  },
]

export const approvalTimelineSteps: ApprovalTimelineStep[] = [
  {
    title: 'Application Submitted',
    detail: 'Franchise application received and added to the review queue.',
    icon: 'file-document-outline',
  },
  {
    title: 'Documents Verified',
    detail: 'Business documents and identity proofs are cross-checked.',
    icon: 'badge-account-horizontal-outline',
  },
  {
    title: 'Business Review',
    detail: 'Market fit, location quality, and showroom readiness are reviewed.',
    icon: 'clipboard-text-outline',
  },
  {
    title: 'Financial Approval',
    detail: 'Capital, liquidity, and franchise investment capacity are validated.',
    icon: 'cash-check',
  },
  {
    title: 'Franchise Approved',
    detail: 'Approval completed and onboarding is ready to begin.',
    icon: 'check-decagram',
  },
]

export const approvalEstimatedTime = '3-5 business days'

export function formatCurrency(amount: number) {
  return `₹${(amount / 100000).toFixed(1)}L`
}
