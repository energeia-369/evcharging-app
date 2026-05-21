export type ApplicationStatus = 'pending' | 'approved' | 'rejected' | 'under-review';

export interface TerritoryInformation {
  region: string;
  area: string;
  populationCovered: number;
  competitorCount: number;
}

export interface FranchiseData {
  franchiseId: string;
  partnerName: string;
  city: string;
  revenue: number;
  territory: TerritoryInformation;
  showroomCount: number;
  vehiclesSoldYtd: number;
  customerSatisfactionScore: number;
}

export interface FranchiseApplication {
  applicationId: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  city: string;
  proposedInvestment: number;
  applicationStatus: ApplicationStatus;
  submittedDate: string;
  territory: TerritoryInformation;
}

export interface ApplyForFranchiseRequest {
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  city: string;
  proposedInvestment: number;
  experienceYears: number;
}

export interface RevenueReport {
  franchiseId: string;
  city: string;
  month: string;
  monthlyRevenue: number;
  unitsSold: number;
  servicesRevenue: number;
  totalCustomers: number;
}

export interface PartnerReport {
  franchiseId: string;
  partnerName: string;
  city: string;
  totalRevenue: number;
  quarterlyGrowth: number;
  activeShowrooms: number;
  teamSize: number;
  lastQuarterPerformance: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
}

const MOCK_DELAY_MS = 420;

const mockFranchises: FranchiseData[] = [
  {
    franchiseId: 'frc-001',
    partnerName: 'Energeia Motors Pune',
    city: 'Pune',
    revenue: 24500000,
    territory: {
      region: 'Pune Metropolitan',
      area: 'Pune Central & East',
      populationCovered: 3200000,
      competitorCount: 12,
    },
    showroomCount: 2,
    vehiclesSoldYtd: 186,
    customerSatisfactionScore: 4.7,
  },
  {
    franchiseId: 'frc-002',
    partnerName: 'Energeia Hyderabad Hub',
    city: 'Hyderabad',
    revenue: 31800000,
    territory: {
      region: 'Hyderabad Greater',
      area: 'Hyderabad West & South',
      populationCovered: 4100000,
      competitorCount: 15,
    },
    showroomCount: 3,
    vehiclesSoldYtd: 234,
    customerSatisfactionScore: 4.8,
  },
  {
    franchiseId: 'frc-003',
    partnerName: 'Energeia Bangalore North',
    city: 'Bangalore',
    revenue: 28700000,
    territory: {
      region: 'Bangalore Metropolitan',
      area: 'Bangalore North & Central',
      populationCovered: 3800000,
      competitorCount: 18,
    },
    showroomCount: 2,
    vehiclesSoldYtd: 209,
    customerSatisfactionScore: 4.6,
  },
];

const mockApplications: FranchiseApplication[] = [
  {
    applicationId: 'app-1001',
    applicantName: 'Rajesh Chopra',
    applicantEmail: 'rajesh.chopra@email.com',
    applicantPhone: '+91-9876543210',
    city: 'Mumbai',
    proposedInvestment: 15000000,
    applicationStatus: 'under-review',
    submittedDate: '2026-05-12T09:00:00.000Z',
    territory: {
      region: 'Mumbai Metropolitan',
      area: 'Mumbai West',
      populationCovered: 5200000,
      competitorCount: 22,
    },
  },
  {
    applicationId: 'app-1002',
    applicantName: 'Priya Desai',
    applicantEmail: 'priya.desai@email.com',
    applicantPhone: '+91-9876543211',
    city: 'Delhi',
    proposedInvestment: 18000000,
    applicationStatus: 'pending',
    submittedDate: '2026-05-13T14:30:00.000Z',
    territory: {
      region: 'Delhi NCR',
      area: 'Delhi South',
      populationCovered: 6800000,
      competitorCount: 28,
    },
  },
];

const mockRevenueReports: RevenueReport[] = [
  {
    franchiseId: 'frc-001',
    city: 'Pune',
    month: '2026-04',
    monthlyRevenue: 2150000,
    unitsSold: 18,
    servicesRevenue: 320000,
    totalCustomers: 145,
  },
  {
    franchiseId: 'frc-002',
    city: 'Hyderabad',
    month: '2026-04',
    monthlyRevenue: 2840000,
    unitsSold: 22,
    servicesRevenue: 420000,
    totalCustomers: 178,
  },
  {
    franchiseId: 'frc-003',
    city: 'Bangalore',
    month: '2026-04',
    monthlyRevenue: 2520000,
    unitsSold: 19,
    servicesRevenue: 380000,
    totalCustomers: 162,
  },
];

const mockPartnerReports: PartnerReport[] = [
  {
    franchiseId: 'frc-001',
    partnerName: 'Energeia Motors Pune',
    city: 'Pune',
    totalRevenue: 24500000,
    quarterlyGrowth: 12.5,
    activeShowrooms: 2,
    teamSize: 32,
    lastQuarterPerformance: 'Strong growth in city region with 15% YoY increase',
  },
  {
    franchiseId: 'frc-002',
    partnerName: 'Energeia Hyderabad Hub',
    city: 'Hyderabad',
    totalRevenue: 31800000,
    quarterlyGrowth: 18.3,
    activeShowrooms: 3,
    teamSize: 48,
    lastQuarterPerformance: 'Exceptional performance with record vehicle sales',
  },
];

const wait = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

async function buildResponse<T>(data: T, message: string): Promise<ApiResponse<T>> {
  await wait(MOCK_DELAY_MS);

  return {
    success: true,
    data,
    message,
    timestamp: new Date().toISOString(),
  };
}

export async function getFranchiseData(): Promise<ApiResponse<FranchiseData[]>> {
  return buildResponse(mockFranchises, 'Franchise data fetched successfully.');
}

export async function getApplications(): Promise<ApiResponse<FranchiseApplication[]>> {
  return buildResponse(mockApplications, 'Franchise applications fetched successfully.');
}

export async function applyForFranchise(
  request: ApplyForFranchiseRequest,
): Promise<
  ApiResponse<{
    applicationId: string;
    applicantName: string;
    city: string;
    applicationStatus: ApplicationStatus;
    submittedDate: string;
  }>
> {
  const newApplication = {
    applicationId: `app-${Date.now()}`,
    applicantName: request.applicantName,
    city: request.city,
    applicationStatus: 'pending' as ApplicationStatus,
    submittedDate: new Date().toISOString(),
  };

  mockApplications.unshift({
    ...newApplication,
    applicantEmail: request.applicantEmail,
    applicantPhone: request.applicantPhone,
    proposedInvestment: request.proposedInvestment,
    territory: {
      region: `${request.city} Region`,
      area: `${request.city} Area`,
      populationCovered: 3000000,
      competitorCount: 10,
    },
  });

  return buildResponse(
    newApplication,
    'Franchise application submitted successfully (mock).',
  );
}

export async function getRevenueReports(): Promise<ApiResponse<RevenueReport[]>> {
  return buildResponse(mockRevenueReports, 'Revenue reports fetched successfully.');
}
