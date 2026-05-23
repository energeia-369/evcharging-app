import { apiRequest, ApiResponse, BackendEnvelope, toApiResponse } from './apiClient';

export type UserRole = 'user' | 'admin' | 'fleet_manager' | 'dealer' | 'franchise_owner' | 'service_manager';

export interface AuthUser {
  id: string;
  fullName: string;
  name: string;
  email: string;
  mobile?: string;
  role: UserRole;
  profileImage?: string | null;
}

export interface AuthSuccess {
  token: string;
  user: AuthUser;
}

export async function registerAuth(body: {
  fullName: string;
  email: string;
  mobile: string;
  password: string;
  role?: UserRole;
  profileImage?: string;
}): Promise<ApiResponse<AuthSuccess>> {
  const payload = await apiRequest<BackendEnvelope<AuthUser> & { token?: string }>('/api/auth/register', {
    method: 'POST',
    body,
  });

  if (!payload.token || !payload.data) {
    throw new Error(payload.message || 'Registration failed');
  }

  return toApiResponse({ token: payload.token, user: payload.data }, payload.message || 'Registration successful');
}

export async function loginAuth(body: { email: string; password: string }): Promise<ApiResponse<AuthSuccess>> {
  const payload = await apiRequest<BackendEnvelope<AuthUser> & { token?: string }>('/api/auth/login', {
    method: 'POST',
    body,
  });

  if (!payload.token || !payload.data) {
    throw new Error(payload.message || 'Login failed');
  }

  return toApiResponse({ token: payload.token, user: payload.data }, payload.message || 'Login successful');
}

export async function getAuthProfile(token: string): Promise<ApiResponse<AuthUser>> {
  const payload = await apiRequest<BackendEnvelope<AuthUser>>('/api/auth/profile', { token });
  if (!payload.data) {
    throw new Error(payload.message || 'Unable to fetch profile');
  }
  return toApiResponse(payload.data, payload.message || 'Profile fetched successfully');
}

export async function requestOtp(email: string, purpose: 'registration' | 'forgot-password' = 'forgot-password'): Promise<ApiResponse<{ otp: string; expiresAt: string }>> {
  const payload = await apiRequest<BackendEnvelope<{ otp: string; expiresAt: string }>>('/api/auth/otp/request', {
    method: 'POST',
    body: { email, purpose },
  });
  return toApiResponse(payload.data || { otp: '', expiresAt: '' }, payload.message || 'OTP generated');
}

export async function verifyOtp(email: string, otp: string, purpose: 'registration' | 'forgot-password' = 'forgot-password'): Promise<ApiResponse<boolean>> {
  const payload = await apiRequest<BackendEnvelope<unknown>>('/api/auth/otp/verify', {
    method: 'POST',
    body: { email, otp, purpose },
  });
  return toApiResponse(Boolean(payload.success), payload.message || 'OTP verified');
}

export async function forgotPassword(email: string): Promise<ApiResponse<{ resetToken: string }>> {
  const payload = await apiRequest<BackendEnvelope<{ resetToken: string }>>('/api/auth/forgot-password', {
    method: 'POST',
    body: { email },
  });
  return toApiResponse(payload.data || { resetToken: '' }, payload.message || 'Reset token generated');
}

export async function resetPassword(token: string, password: string): Promise<ApiResponse<AuthSuccess>> {
  const payload = await apiRequest<BackendEnvelope<AuthUser> & { token?: string }>('/api/auth/reset-password', {
    method: 'POST',
    body: { token, password },
  });

  if (!payload.token || !payload.data) {
    throw new Error(payload.message || 'Reset password failed');
  }

  return toApiResponse({ token: payload.token, user: payload.data }, payload.message || 'Password reset successful');
}
