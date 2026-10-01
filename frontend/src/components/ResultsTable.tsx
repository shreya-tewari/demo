import { useState } from 'react';
import { Copy, Check, ExternalLink } from 'lucide-react';
import type { EmailRow, PageError } from '../types';

interface Props {
  rows: EmailRow[];
  errors: PageError[] | null;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <button
      onClick={handleCopy}
      title="Copy email"
      className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
    >
      {copied ? (
        <Check size={13} className="text-green-500" />
      ) : (
        <Copy size={13} />
      )}
    </button>
  );
}

function StatusBadge({ status }: { status: EmailRow['status'] }) {
  switch (status) {
    case 'success':
      return <span className="badge-green">Found</span>;
    case 'no_emails':
      return <span className="badge-gray">No emails</span>;
    case 'skipped':
      return <span className="badge-gray">Skipped</span>;
    case 'error':
    default:
      return <span className="badge-red">Error</span>;
  }
}

export default function ResultsTable({ rows, errors }: Props) {
  const hasResults = rows.length > 0;
  const hasErrors = errors && errors.length > 0;

  if (!hasResults && !hasErrors) {
    return (
      <div className="card p-6 text-center text-sm text-gray-400">
        No email addresses were extracted from the provided URLs.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Email results table */}
      {hasResults && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Email Address
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Source URL
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="px-5 py-3 w-10" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {rows.map((row, i) => (
                  <tr
                    key={`${row.email}-${i}`}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* Email */}
                    <td className="px-5 py-3 font-mono text-xs text-gray-800">
                      {row.email || (
                        <span className="text-gray-300 italic">—</span>
                      )}
                    </td>

                    {/* Source URL */}
                    <td className="px-5 py-3 max-w-xs">
                      <a
                        href={row.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900 transition-colors"
                      >
                        <span className="truncate max-w-[220px] block">
                          {row.source_url}
                        </span>
                        <ExternalLink size={10} className="flex-shrink-0" />
                      </a>
                    </td>

                    {/* Status badge */}
                    <td className="px-5 py-3">
                      <StatusBadge status={row.status} />
                    </td>

                    {/* Copy button */}
                    <td className="px-3 py-3">
                      {row.email && <CopyButton text={row.email} />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Failed pages section */}
      {hasErrors && (
        <div className="card overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 bg-red-50">
            <p className="text-xs font-semibold text-red-600 uppercase tracking-wide">
              Failed Pages ({errors.length})
            </p>
          </div>
          <div className="divide-y divide-gray-50">
            {errors.map((err, i) => (
              <div key={i} className="px-5 py-3 flex items-start gap-3">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-mono text-gray-700 truncate">
                    {err.url}
                  </p>
                  <p className="text-xs text-red-500 mt-0.5">{err.error}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
