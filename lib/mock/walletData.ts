export type CommissionRecord = {
  month: string
  amount: number
}

export type PendingPayout = {
  id: string
  amount: number
  dueDate: string
}

export type WalletSummary = {
  availableEarnings: number
  walletBalance: number
  totalEarningsYTD: number
  monthlyCommissions: CommissionRecord[]
  pendingPayouts: PendingPayout[]
  taxWithheld: number
}

const now = new Date()
const fmt = (d: Date) => d.toISOString().split('T')[0]

export const walletSummary: WalletSummary = {
  availableEarnings: 185000,
  walletBalance: 98500,
  totalEarningsYTD: 820000,
  monthlyCommissions: [
    { month: 'Jan', amount: 85000 },
    { month: 'Feb', amount: 92000 },
    { month: 'Mar', amount: 108000 },
    { month: 'Apr', amount: 112000 },
    { month: 'May', amount: 140000 },
  ],
  pendingPayouts: [
    { id: 'p-101', amount: 45000, dueDate: fmt(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3)) },
    { id: 'p-102', amount: 30000, dueDate: fmt(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 10)) },
  ],
  taxWithheld: 56000,
}

export function formatINR(amount: number) {
  return `₹${(amount / 100000).toFixed(1)}L`
}
