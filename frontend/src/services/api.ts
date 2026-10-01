import axios, { AxiosError } from 'axios';
import type {
  ExtractionRequest,
  ExtractionSummary,
  ExportRequest,
  HealthResponse,
} from '../types';

const BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'http://localhost:8000';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 120_000,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Mock fallback (used ONLY when backend is completely unreachable) ─────────

export const MOCK_RESPONSE: ExtractionSummary & { isMock: true } = {
  isMock: true,
  total_pages: 3,
  processed_pages: 2,
  total_emails: 4,
  results: [
    { email: 'hello@example.com', source_url: 'https://example.com/contact', status: 'success' },
    { email: 'support@example.com', source_url: 'https://example.com/contact', status: 'success' },
    { email: 'jane@acme.io', source_url: 'https://acme.io/about', status: 'success' },
    { email: 'john@acme.io', source_url: 'https://acme.io/about', status: 'success' },
  ],
  errors: [
    { url: 'https://unavailable-site.xyz', error: 'Connection refused (demo)' },
  ],
};

// ─── Health check ─────────────────────────────────────────────────────────────

export async function checkHealth(): Promise<HealthResponse> {
  const res = await apiClient.get<HealthResponse>('/api/scraper/health');
  return res.data;
}

// ─── Extract emails ───────────────────────────────────────────────────────────

export async function extractEmails(
  payload: ExtractionRequest,
): Promise<ExtractionSummary & { isMock?: boolean }> {
  try {
    const res = await apiClient.post<ExtractionSummary>('/api/scraper/extract', payload);
    return res.data;
  } catch (err) {
    const axiosErr = err as AxiosError<{ detail?: string | { message?: string } }>;

    // Network / connection error → backend unreachable → return labelled mock data
    if (!axiosErr.response) {
      console.warn('[api] Backend unreachable – returning mock data');
      return MOCK_RESPONSE;
    }

    // Structured 422 validation error from FastAPI
    const detail = axiosErr.response.data?.detail;
    if (typeof detail === 'string') throw new Error(detail);
    if (detail && typeof detail === 'object' && 'message' in detail) {
      throw new Error(detail.message as string);
    }

    throw new Error(
      `Server error ${axiosErr.response.status}: ${axiosErr.response.statusText}`,
    );
  }
}

// ─── Export CSV ───────────────────────────────────────────────────────────────

/**
 * Send flat email results to the backend export endpoint.
 * Falls back to client-side CSV generation if the backend is unreachable.
 */
export async function exportCsv(results: ExtractionSummary['results']): Promise<Blob> {
  try {
    const payload: ExportRequest = { results };
    const res = await apiClient.post('/api/scraper/export', payload, {
      responseType: 'blob',
    });
    return res.data as Blob;
  } catch {
    // Client-side fallback
    const header = 'email,source_url,status\n';
    const rows = results
      .map((r) => `${r.email},${r.source_url},${r.status}`)
      .join('\n');
    return new Blob([header + rows], { type: 'text/csv' });
  }
}
