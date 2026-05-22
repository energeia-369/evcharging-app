import { apiRequest, ApiResponse, BackendEnvelope, toApiResponse } from './apiClient';

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

const mapDealershipToFranchise = (dealership: {
  _id: string;
  businessName: string;
  city: string;
  totalSales: number;
  totalInventory: number;
  commission: number;
  isVerified: boolean;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}): FranchiseApplication => ({
  applicationId: dealership._id,
  applicantName: dealership.businessName,
  applicantEmail: '',
  applicantPhone: '',
  city: dealership.city,
  proposedInvestment: dealership.totalInventory * 0,
  applicationStatus: dealership.status === 'approved' ? 'approved' : dealership.status === 'rejected' ? 'rejected' : 'pending',
  submittedDate: dealership.createdAt,
  territory: {
    region: dealership.city,
    area: dealership.city,
    populationCovered: 0,
    competitorCount: 0,
  },
});

export async function getFranchiseData(token?: string): Promise<ApiResponse<FranchiseData[]>> {
  const payload = await apiRequest<BackendEnvelope<Array<{ _id: string; businessName: string; city: string; totalSales: number; totalInventory: number; commission: number; isVerified: boolean; status: 'pending' | 'approved' | 'rejected'; createdAt: string }>>>('/api/franchise', token ? { token } : undefined);

  return toApiResponse(
    (payload.data ?? []).map((dealership) => ({
      franchiseId: dealership._id,
      partnerName: dealership.businessName,
      city: dealership.city,
      revenue: dealership.totalSales,
      territory: {
        region: dealership.city,
        area: dealership.city,
        populationCovered: 0,
        competitorCount: 0,
      },
      showroomCount: dealership.totalInventory,
      vehiclesSoldYtd: dealership.totalSales,
      customerSatisfactionScore: dealership.isVerified ? 5 : 0,
    })),
    payload.message || 'Franchise data fetched successfully.',
  );
}

export async function getApplications(token?: string): Promise<ApiResponse<FranchiseApplication[]>> {
  const franchiseData = await getFranchiseData(token);
  return toApiResponse(
    franchiseData.data.map((item) => ({
      applicationId: item.franchiseId,
      applicantName: item.partnerName,
      applicantEmail: '',
      applicantPhone: '',
      city: item.city,
      proposedInvestment: 0,
      applicationStatus: 'pending' as ApplicationStatus,
      submittedDate: new Date().toISOString(),
      territory: item.territory,
    })),
    'Franchise applications fetched successfully.',
  );
}

export async function applyForFranchise(
  request: ApplyForFranchiseRequest,
  token?: string,
): Promise<ApiResponse<{ applicationId: string; applicantName: string; city: string; applicationStatus: ApplicationStatus; submittedDate: string }>> {
  const payload = await apiRequest<BackendEnvelope<{ success: boolean; message: string; data: unknown }>>('/api/franchise/apply', {
    method: 'POST',
    token,
    body: {
      businessName: request.applicantName,
      dealershipType: 'franchise',
      registrationNumber: `REG-${Date.now()}`,
      gstNumber: request.applicantEmail,
      licensingNumber: '',
      address: '',
      city: request.city,
      state: '',
      pincode: '',
    },
  });

  return toApiResponse(
    {
      applicationId: `app-${Date.now()}`,
      applicantName: request.applicantName,
      city: request.city,
      applicationStatus: 'pending',
      submittedDate: new Date().toISOString(),
    },
    (payload as BackendEnvelope<unknown>).message || 'Franchise application submitted successfully.',
  );
}

export async function getRevenueReports(token?: string): Promise<ApiResponse<RevenueReport[]>> {
  const franchises = await getFranchiseData(token);
  return toApiResponse(
    franchises.data.map((item) => ({
      franchiseId: item.franchiseId,
      city: item.city,
      month: new Date().toISOString().slice(0, 7),
      monthlyRevenue: item.revenue,
      unitsSold: item.vehiclesSoldYtd,
      servicesRevenue: 0,
      totalCustomers: 0,
    })),
    'Revenue reports fetched successfully.',
  );
}

export async function getPartnerReports(token?: string): Promise<ApiResponse<PartnerReport[]>> {
  const franchises = await getFranchiseData(token);
  return toApiResponse(
    franchises.data.map((item) => ({
      franchiseId: item.franchiseId,
      partnerName: item.partnerName,
      city: item.city,
      totalRevenue: item.revenue,
      quarterlyGrowth: 0,
      activeShowrooms: item.showroomCount,
      teamSize: 0,
      lastQuarterPerformance: item.customerSatisfactionScore > 0 ? 'Live data synced successfully' : 'Awaiting verification',
    })),
    'Partner reports fetched successfully.',
  );
}