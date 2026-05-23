'use client';

import { useState, useEffect } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Signal,
  Activity,
  Cpu,
  Database,
  MapPin,
  Zap,
} from 'lucide-react';

interface NodeData {
  did: string;
  status: 'PENDING' | 'ACTIVE' | 'SUSPENDED';
  hardwareOnline: boolean;
  reputation?: number | null;
  firstReading?: string | null;
  uptime30d?: number | null;
  recentReadings?: any[];
  malamaEarnedToday?: number | null;
  malamaEarnedTotal?: number | null;
  marketsSettled?: number | null;
  lat?: number | null;
  lng?: number | null;
  region?: string | null;
}

interface NodeStatusProps {
  initialDid: string;
}

export default function NodeStatus({ initialDid }: NodeStatusProps) {
  const [node, setNode] = useState<NodeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNode = async () => {
      try {
        setLoading(true);
        setError(null);

        // Mock data — replace with real API call when available
        await new Promise((r) => setTimeout(r, 600));

        const mockNode: NodeData = {
          did: initialDid,
          status: 'ACTIVE',
          hardwareOnline: true,
          reputation: 94,
          firstReading: '2024-11-03T08:22:11Z',
          uptime30d: 98.4,
          recentReadings: [
            { ts: Date.now() - 60000, value: 412, unit: 'ppm' },
            { ts: Date.now() - 120000, value: 408, unit: 'ppm' },
            { ts: Date.now() - 180000, value: 415, unit: 'ppm' },
          ],
          malamaEarnedToday: 3.2,
          malamaEarnedTotal: 847.5,
          marketsSettled: 12,
          lat: 21.3069,
          lng: -157.8583,
          region: 'Oʻahu, Hawaiʻi',
        };

        setNode(mockNode);
      } catch (err: any) {
        setError(err?.message ?? 'Failed to load node data');
      } finally {
        setLoading(false);
      }
    };

    fetchNode();
    const interval = setInterval(fetchNode, 30000);
    return () => clearInterval(interval);
  }, [initialDid]);

  const health = node
    ? node.status === 'ACTIVE' && node.hardwareOnline
      ? 'healthy'
      : node.status === 'SUSPENDED'
      ? 'suspended'
      : 'degraded'
    : 'unknown';

  if (loading) {
    return (
      <div className="w-full rounded-3xl border border-gray-800 bg-gray-900/60 backdrop-blur-md p-10 flex items-center justify-center gap-4 text-gray-400">
        <Loader2 className="w-6 h-6 animate-spin text-malama-teal" />
        <span className="text-lg font-medium">Loading node data…</span>
      </div>
    );
  }

  if (error || !node) {
    return (
      <div className="w-full rounded-3xl border border-red-900/50 bg-red-950/20 p-10 flex items-center gap-4 text-red-400">
        <AlertTriangle className="w-6 h-6" />
        <span className="text-lg font-medium">{error ?? 'Node not found'}</span>
      </div>
    );
  }

  const healthColors: Record<string, string> = {
    healthy: 'text-malama-teal',
    degraded: 'text-yellow-400',
    suspended: 'text-red-400',
    unknown: 'text-gray-500',
  };

  const healthBg: Record<string, string> = {
    healthy: 'bg-malama-teal/10 border-malama-teal/30',
    degraded: 'bg-yellow-400/10 border-yellow-400/30',
    suspended: 'bg-red-400/10 border-red-400/30',
    unknown: 'bg-gray-800 border-gray-700',
  };

  return (
    <div className="w-full rounded-3xl border border-gray-800 bg-gray-900/50 backdrop-blur-md overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between px-8 py-6 border-b border-gray-800 gap-4">
        <div className="flex items-center gap-4">
          <div className={`w-3 h-3 rounded-full shadow-lg ${health === 'healthy' ? 'bg-malama-teal shadow-malama-teal/50 animate-pulse' : health === 'degraded' ? 'bg-yellow-400' : 'bg-red-400'}`} />
          <div>
            <p className="text-xs font-mono text-gray-500 mb-1">Node DID</p>
            <p className="text-sm font-mono text-gray-300 break-all">{node.did}</p>
          </div>
        </div>
        <div className={`px-4 py-2 rounded-xl border text-sm font-bold uppercase tracking-widest ${healthBg[health]} ${healthColors[health]}`}>
          {health === 'healthy' ? '● Online' : health === 'degraded' ? '⚠ Degraded' : health === 'suspended' ? '✕ Suspended' : '? Unknown'}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 divide-x divide-y md:divide-y-0 divide-gray-800">
        {/* Reputation */}
        <div className="flex flex-col items-center justify-center px-6 py-8 gap-2">
          <CheckCircle2 className={`w-5 h-5 ${healthColors[health]}`} />
          <p className="text-2xl font-black text-white">{node.reputation ?? '-'}%</p>
          <p className="text-xs text-gray-500 uppercase tracking-widest text-center">Reputation</p>
        </div>

        {/* Uptime */}
        <div className="flex flex-col items-center justify-center px-6 py-8 gap-2">
          <Activity className="w-5 h-5 text-blue-400" />
          <p className="text-2xl font-black text-white">{node.uptime30d != null ? `${node.uptime30d}%` : '-'}</p>
          <p className="text-xs text-gray-500 uppercase tracking-widest text-center">Uptime 30d</p>
        </div>

        {/* Markets Settled */}
        <div className="flex flex-col items-center justify-center px-6 py-8 gap-2">
          <Database className="w-5 h-5 text-purple-400" />
          <p className="text-2xl font-black text-white">{node.marketsSettled ?? 0}</p>
          <p className="text-xs text-gray-500 uppercase tracking-widest text-center">Mkts Settled</p>
        </div>

        {/* Malama Today */}
        <div className="flex flex-col items-center justify-center px-6 py-8 gap-2">
          <Zap className="w-5 h-5 text-yellow-400" />
          <p className="text-2xl font-black text-white">{node.malamaEarnedToday?.toFixed(2) ?? '-'}</p>
          <p className="text-xs text-gray-500 uppercase tracking-widest text-center">MALAMA Today</p>
        </div>

        {/* Malama Total */}
        <div className="flex flex-col items-center justify-center px-6 py-8 gap-2">
          <Signal className="w-5 h-5 text-malama-teal" />
          <p className="text-2xl font-black text-white">{node.malamaEarnedTotal?.toFixed(1) ?? '-'}</p>
          <p className="text-xs text-gray-500 uppercase tracking-widest text-center">MALAMA Total</p>
        </div>

        {/* Location */}
        <div className="flex flex-col items-center justify-center px-6 py-8 gap-2">
          <MapPin className="w-5 h-5 text-orange-400" />
          <p className="text-sm font-bold text-white text-center leading-tight">{node.region ?? 'Unknown'}</p>
          <p className="text-xs text-gray-500 uppercase tracking-widest text-center">Region</p>
        </div>
      </div>

      {/* Health Status Bar */}
      <div className="px-8 py-4 border-t border-gray-800 flex flex-col md:flex-row items-start md:items-center gap-3">
        <Cpu className={`w-4 h-4 flex-shrink-0 ${health === 'healthy' ? 'text-malama-teal' : health === 'degraded' ? 'text-yellow-400' : 'text-red-400'}`} />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-500 uppercase tracking-widest">System Health</span>
            <span className={`text-xs font-bold uppercase ${healthColors[health]}`}>{health}</span>
          </div>
          <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${health === 'healthy' ? 'bg-malama-teal w-full' : health === 'degraded' ? 'bg-yellow-400 w-2/3' : health === 'suspended' ? 'bg-red-400 w-1/4' : 'bg-gray-700 w-0'}`}
            />
          </div>
        </div>
        {node.firstReading && (
          <span className="text-xs text-gray-600 font-mono flex-shrink-0">
            Since {new Date(node.firstReading).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
}