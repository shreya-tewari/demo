import { useState } from 'react';
import { Link2, ArrowRight, Loader2 } from 'lucide-react';

// Backend hard-cap is 3 per batch
const MAX_URLS = 3;

interface Props {
  onSubmit: (urls: string[]) => void;
  isLoading: boolean;
}

export default function UrlInput({ onSubmit, isLoading }: Props) {
  const [raw, setRaw] = useState('');
  const [error, setError] = useState('');

  const urlCount = raw
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean).length;

  function validate(lines: string[]): string | null {
    if (lines.length === 0) return 'Please enter at least one URL.';
    if (lines.length > MAX_URLS)
      return `Maximum ${MAX_URLS} URLs per batch (backend limit). You entered ${lines.length}.`;
    for (const url of lines) {
      try {
        new URL(url);
      } catch {
        return `Invalid URL: "${url}"`;
      }
    }
    return null;
  }

  function handleSubmit() {
    const lines = raw
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);
    const err = validate(lines);
    if (err) {
      setError(err);
      return;
    }
    setError('');
    onSubmit(lines);
  }

  return (
    <div className="card p-6 space-y-5">
      {/* Heading */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Extract Email Addresses
        </h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Enter company page URLs to collect publicly available email addresses.
        </p>
      </div>

      {/* Textarea */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label
            htmlFor="url-input"
            className="text-xs font-medium text-gray-600 flex items-center gap-1.5"
          >
            <Link2 size={12} />
            URLs — one per line
          </label>
          <span
            className={`text-xs ${urlCount > MAX_URLS ? 'text-red-500 font-medium' : 'text-gray-400'}`}
          >
            {urlCount}/{MAX_URLS} URLs
          </span>
        </div>

        <textarea
          id="url-input"
          className="input-area h-36 font-mono text-xs leading-relaxed"
          placeholder={`https://company.com/contact\nhttps://startup.io/about\nhttps://example.org/team`}
          value={raw}
          onChange={(e) => {
            setRaw(e.target.value);
            if (error) setError('');
          }}
          disabled={isLoading}
          spellCheck={false}
        />

        {error && (
          <p className="text-xs text-red-500 flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-400" />
            {error}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <span className="text-xs text-gray-400">
          Max {MAX_URLS} URLs per batch
        </span>
        <button
          id="start-extraction-btn"
          type="button"
          onClick={handleSubmit}
          disabled={isLoading || urlCount === 0}
          className="btn-primary"
        >
          {isLoading ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Extracting…
            </>
          ) : (
            <>
              Start Extraction
              <ArrowRight size={14} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
