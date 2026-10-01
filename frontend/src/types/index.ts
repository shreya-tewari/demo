// ─── Backend API Request / Response Types ─────────────────────────────────────

/** Status values returned by the backend for each email result */
export type ExtractionStatus = 'success' | 'no_emails' | 'error' | 'skipped';

/** A single email result in the flat results array */
export interface EmailResult {
  email: string;
  source_url: string;
  status: ExtractionStatus;
}

/** Details of a page that could not be processed */
export interface PageError {
  url: string;
  error: string;
}

/** Request body for POST /api/scraper/extract */
export interface ExtractionRequest {
  urls: string[];
}

/** Top-level response from POST /api/scraper/extract */
export interface ExtractionSummary {
  total_pages: number;
  processed_pages: number;
  total_emails: number;
  results: EmailResult[];
  errors: PageError[] | null;
}

/** Request body for POST /api/scraper/export */
export interface ExportRequest {
  results: EmailResult[];
}

/** Response from GET /api/scraper/health */
export interface HealthResponse {
  status: string;
  message: string;
  version: string;
}

// ─── UI State Types ───────────────────────────────────────────────────────────

export type ConnectionStatus = 'checking' | 'connected' | 'disconnected';

export type UIExtractionStatus = 'idle' | 'loading' | 'success' | 'error';

export interface ExtractionState {
  status: UIExtractionStatus;
  data: ExtractionSummary | null;
  error: string | null;
}

// ─── Alias for table rows (same shape as EmailResult, just for clarity) ───────
export type EmailRow = EmailResult;
