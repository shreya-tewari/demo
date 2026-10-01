import { FileText, Mail, AlertTriangle } from 'lucide-react';

interface Props {
  totalPages: number;
  processedPages: number;
  emailsFound: number;
  failedCount: number; // derived from errors array length
}

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  accent: 'default' | 'green' | 'red';
}

function StatCard({ label, value, icon, accent }: StatCardProps) {
  const accentClass =
    accent === 'green'
      ? 'text-green-600 bg-green-50'
      : accent === 'red'
      ? 'text-red-500 bg-red-50'
      : 'text-gray-600 bg-gray-100';

  return (
    <div className="card p-5 flex items-center gap-4">
      <div
        className={`flex items-center justify-center w-10 h-10 rounded-xl ${accentClass}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900 leading-none">{value}</p>
        <p className="text-xs text-gray-500 mt-0.5">{label}</p>
      </div>
    </div>
  );
}

export default function SummaryCards({
  totalPages,
  processedPages,
  emailsFound,
  failedCount,
}: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <StatCard
        label="Total Pages"
        value={totalPages}
        icon={<FileText size={18} />}
        accent="default"
      />
      <StatCard
        label="Processed"
        value={processedPages}
        icon={<FileText size={18} />}
        accent="default"
      />
      <StatCard
        label="Emails Found"
        value={emailsFound}
        icon={<Mail size={18} />}
        accent="green"
      />
      <StatCard
        label="Failed Pages"
        value={failedCount}
        icon={<AlertTriangle size={18} />}
        accent={failedCount > 0 ? 'red' : 'default'}
      />
    </div>
  );
}
