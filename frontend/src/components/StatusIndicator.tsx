import { Wifi, WifiOff, Loader2 } from 'lucide-react';
import type { ConnectionStatus } from '../types';

interface Props {
  status: ConnectionStatus;
}

const labels: Record<ConnectionStatus, string> = {
  checking: 'Checking connection…',
  connected: 'Backend connected',
  disconnected: 'Backend offline',
};

export default function StatusIndicator({ status }: Props) {
  return (
    <div className="flex items-center gap-2 text-xs font-medium">
      {status === 'checking' && (
        <Loader2 size={13} className="animate-spin text-gray-400" />
      )}
      {status === 'connected' && (
        <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
      )}
      {status === 'disconnected' && (
        <span className="inline-block w-2 h-2 rounded-full bg-red-400" />
      )}
      <span
        className={
          status === 'connected'
            ? 'text-green-600'
            : status === 'disconnected'
            ? 'text-red-500'
            : 'text-gray-400'
        }
      >
        {labels[status]}
      </span>
      {status === 'connected' ? (
        <Wifi size={13} className="text-green-500" />
      ) : status === 'disconnected' ? (
        <WifiOff size={13} className="text-red-400" />
      ) : null}
    </div>
  );
}
