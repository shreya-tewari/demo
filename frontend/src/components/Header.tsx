import { AtSign } from 'lucide-react';

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gray-900">
            <AtSign size={18} className="text-white" strokeWidth={2.2} />
          </div>
          <div>
            <h1 className="text-base font-semibold text-gray-900 leading-tight">
              Email Extractor
            </h1>
            <p className="text-xs text-gray-400 leading-tight">
              Extract and organize publicly available email addresses
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
