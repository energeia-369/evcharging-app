export type ShiftOption = {
  id: string
  title: string
  workingHours: string
  estimatedEarnings: string
  batteryUsage: string
  routeCoverage: string
}

export type KycUpload = {
  id: string
  label: string
  status: 'pending' | 'uploaded' | 'verified'
}

export const shiftOptions: ShiftOption[] = [
  {
    id: '6h',
    title: '6 Hours Shift',
    workingHours: '6:00 AM - 12:00 PM',
    estimatedEarnings: '₹2,800 - ₹4,000',
    batteryUsage: 'Low usage / fast turnaround',
    routeCoverage: 'City routes and short delivery hops',
  },
  {
    id: '8h',
    title: '8 Hours Shift',
    workingHours: '10:00 AM - 6:00 PM',
    estimatedEarnings: '₹4,500 - ₹6,200',
    batteryUsage: 'Medium usage / steady charging',
    routeCoverage: 'Mixed city and intercity corridors',
  },
]

export const vehicleKycUploads: KycUpload[] = [
  { id: 'rc', label: 'RC Book Upload', status: 'pending' },
  { id: 'insurance', label: 'Insurance Upload', status: 'uploaded' },
  { id: 'puc', label: 'Pollution Certificate Upload', status: 'pending' },
  { id: 'image', label: 'Vehicle Image Upload', status: 'uploaded' },
]

export const driverKycUploads: KycUpload[] = [
  { id: 'aadhaar', label: 'Aadhaar Card Upload', status: 'uploaded' },
  { id: 'pan', label: 'PAN Card Upload', status: 'pending' },
  { id: 'dl', label: 'Driving License Upload', status: 'verified' },
  { id: 'bank', label: 'Bank Passbook Upload', status: 'pending' },
  { id: 'photo', label: 'Driver Photo Upload', status: 'uploaded' },
]

export const verificationSteps = [
  { title: 'Registration Submitted', detail: 'Manager onboarding request is received.', icon: 'file-document' },
  { title: 'Vehicle KYC Verified', detail: 'Vehicle papers are validated.', icon: 'clipboard-check' },
  { title: 'Driver KYC Verified', detail: 'Driver identity and license are validated.', icon: 'account-tie' },
  { title: 'Bank Verification', detail: 'Wallet and payout account checks are in progress.', icon: 'bank' },
  { title: 'Fleet Approved', detail: 'Fleet onboarding is approved and ready.', icon: 'shield-check' },
]

export const fleetDashboardStats = {
  assignedVehicles: 18,
  shiftTimings: '6 AM - 8 PM',
  activeTrips: 7,
  earnings: 48200,
  vehicleStatus: '12 available / 4 charging / 2 in-trip',
  driverProfile: '24 drivers active',
  batteryAnalytics: '87% average battery health',
}

export const routeRecommendations = [
  'Route A: Airport to business district for peak earning window',
  'Route B: Charging hub loop for balanced battery health',
  'Route C: Intercity corridor for high-value trips',
]
