import { useState, useCallback } from 'react';
import {
  Download,
  Inbox,
  Loader2,
  AlertCircle,
  FlaskConical,
} from 'lucide-react';

import Header from './components/Header';
import UrlInput from './components/UrlInput';
import SummaryCards from './components/SummaryCards';
import ResultsTable from './components/ResultsTable';

import { extractEmails, exportCsv } from './services/api';
import type {
  UIExtractionStatus,
  ExtractionSummary,
} from './types';

// ─── component ───────────────────────────────────────────────────────────────

export default function App() {
  const [extractionStatus, setExtractionStatus] =
    useState<UIExtractionStatus>('idle');
  const [data, setData] = useState<ExtractionSummary | null>(null);
  const [extractionError, setExtractionError] = useState<string | null>(null);
  const [isMock, setIsMock] = useState(false);


  const handleExtract = useCallback(async (urls: string[]) => {
    setIsMock(false);
    setData(null);
    setExtractionError(null);
    setExtractionStatus('loading');

    try {
      const result = await extractEmails({ urls });
      setIsMock('isMock' in result && result.isMock === true);
      setData(result);
      setExtractionStatus('success');
    } catch (err) {
      setExtractionError(
        err instanceof Error ? err.message : 'Unknown error occurred.',
      );
      setExtractionStatus('error');
    }
  }, []);

  // ── CSV export ───────────────────────────────────────────────────────────
  async function handleDownloadCsv() {
    if (!data) return;
    const blob = await exportCsv(data.results);
    const href = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = href;
    a.download = 'email_extraction_results.csv';
    a.click();
    URL.revokeObjectURL(href);
  }

  const isLoading = extractionStatus === 'loading';

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 mx-auto w-full max-w-5xl px-6 py-8 space-y-6">
        {/* Input card */}
        <UrlInput onSubmit={handleExtract} isLoading={isLoading} />

        {/* Loading state */}
        {isLoading && (
          <div className="card p-8 flex flex-col items-center gap-3 text-center">
            <Loader2 size={28} className="animate-spin text-gray-400" />
            <p className="text-sm font-medium text-gray-700">
              Fetching pages and extracting emails…
            </p>
            <p className="text-xs text-gray-400">
              Each page takes a moment. The backend processes URLs sequentially
              with a polite delay.
            </p>
          </div>
        )}

        {/* Error state */}
        {extractionStatus === 'error' && (
          <div className="card p-6 flex items-start gap-4 border-red-100 bg-red-50">
            <AlertCircle
              size={18}
              className="text-red-500 flex-shrink-0 mt-0.5"
            />
            <div>
              <p className="text-sm font-semibold text-red-700">
                Extraction failed
              </p>
              <p className="text-xs text-red-500 mt-0.5">{extractionError}</p>
            </div>
          </div>
        )}

        {/* Success: results */}
        {extractionStatus === 'success' && data && (
          <div className="space-y-5">
            {/* Mock data banner */}
            {isMock && (
              <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-amber-50 border border-amber-100 text-amber-700 text-xs font-medium">
                <FlaskConical size={14} className="flex-shrink-0" />
                <span>
                  <strong>Demo data</strong> — backend was unreachable. Showing
                  sample results for demonstration purposes.
                </span>
              </div>
            )}

            {/* Summary cards */}
            <SummaryCards
              totalPages={data.total_pages}
              processedPages={data.processed_pages}
              emailsFound={data.total_emails}
              failedCount={data.errors?.length ?? 0}
            />

            {/* Results heading + download */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  Extraction Results
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {data.processed_pages} of {data.total_pages} page
                  {data.total_pages !== 1 ? 's' : ''} processed —{' '}
                  {data.total_emails} email
                  {data.total_emails !== 1 ? 's' : ''} found
                </p>
              </div>
              <button
                id="download-csv-btn"
                type="button"
                onClick={handleDownloadCsv}
                disabled={data.results.length === 0}
                className="btn-secondary"
              >
                <Download size={14} />
                Download CSV
              </button>
            </div>

            {/* Table + error list */}
            <ResultsTable rows={data.results} errors={data.errors} />
          </div>
        )}

        {/* Idle / empty state */}
        {extractionStatus === 'idle' && (
          <div className="card p-12 flex flex-col items-center gap-4 text-center">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gray-100">
              <Inbox size={24} className="text-gray-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                No extraction yet
              </p>
              <p className="text-xs text-gray-400 mt-1 max-w-xs">
                Enter up to 3 company page URLs above and click{' '}
                <strong className="font-medium text-gray-600">
                  Start Extraction
                </strong>{' '}
                to collect publicly available email addresses.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-4 text-center text-xs text-gray-300">
        Email Extractor — extracts publicly available contact information
      </footer>
    </div>
  );
}
