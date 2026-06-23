// Shared fetch client for the Expo app's API layer.
import { config, getApiUrl } from './config';

// Get base URL from configuration (environment variables)
const API_BASE_URL = getApiUrl();

export const BASE_URL = API_BASE_URL;

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
}

export interface BackendEnvelope<T> {
  success: boolean;
  message: string;
  data?: T;
  token?: string;
}

export interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  token?: string;
  query?: Record<string, string | number | boolean | undefined | null>;
  headers?: Record<string, string>;
}

export class ApiRequestError extends Error {
  status?: number;
  response?: {
    status: number;
    data: unknown;
  };

  constructor(message: string, status?: number, data?: unknown) {
    super(message);
    this.name = 'ApiRequestError';
    this.status = status;
    this.response = status !== undefined ? { status, data } : undefined;
  }
}

const buildUrl = (path: string, query?: RequestOptions['query']) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = new URL(`${BASE_URL}${normalizedPath}`);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, String(value));
      }
    });
  }

  return url.toString();
};

export const apiRequest = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
  const method = options.method || 'GET';
  const requestUrl = buildUrl(path, options.query);
  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...options.headers,
  };

  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  const hasBody = options.body !== undefined && method !== 'GET';

  if (hasBody) {
    headers['Content-Type'] = 'application/json';
  }

  console.log('[API] Request', { method, url: requestUrl, hasBody, query: options.query });

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), config.api.timeout);

  let response: Response;

  try {
    response = await fetch(requestUrl, {
      method,
      headers,
      body: hasBody ? JSON.stringify(options.body) : undefined,
      signal: controller.signal,
    });
  } catch (error) {
    console.error('[API] Network request failed', {
      method,
      url: requestUrl,
      error: error instanceof Error ? error.message : String(error),
    });

    throw new ApiRequestError(error instanceof Error ? error.message : 'Network request failed');
  } finally {
    clearTimeout(timeoutId);
  }

  const contentType = response.headers.get('content-type') || '';
  let payload: T;

  try {
    payload = contentType.includes('application/json')
      ? ((await response.json()) as T)
      : ((await response.text()) as unknown as T);
  } catch (error) {
    console.error('[API] Failed to parse response payload', {
      method,
      url: requestUrl,
      status: response.status,
      error: error instanceof Error ? error.message : String(error),
    });

    throw new ApiRequestError('Unable to read server response.', response.status);
  }

  console.log('[API] Response', {
    method,
    url: requestUrl,
    status: response.status,
    ok: response.ok,
    payload,
  });

  if (!response.ok) {
    const errorMessage =
      typeof payload === 'object' && payload !== null && 'message' in payload
        ? String((payload as { message?: unknown }).message)
        : `Request failed with status ${response.status}`;

    console.warn('[API] Request failed', {
      method,
      url: requestUrl,
      status: response.status,
      payload,
      errorMessage,
    });

    throw new ApiRequestError(errorMessage, response.status, payload);
  }

  return payload;
};

export const toApiResponse = <T>(data: T, message: string, success = true): ApiResponse<T> => ({
  success,
  data,
  message,
  timestamp: new Date().toISOString(),
});