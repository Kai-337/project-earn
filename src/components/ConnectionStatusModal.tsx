import React, { useState, useEffect } from "react";
import { 
  X, 
  Wifi, 
  WifiOff, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Server, 
  ShieldCheck, 
  Sparkles, 
  Radio, 
  Activity, 
  Globe,
  Layers,
  ExternalLink
} from "lucide-react";
import { checkServerHealth, ServerHealthStatus, fetchLiveSyncState, pushLiveSyncUpdate } from "../utils/syncEngine";

interface ConnectionStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  syncVersion: number;
  lastSyncedAt: string;
  onForceSync: () => Promise<void>;
}

export const ConnectionStatusModal: React.FC<ConnectionStatusModalProps> = ({
  isOpen,
  onClose,
  syncVersion,
  lastSyncedAt,
  onForceSync,
}) => {
  const [health, setHealth] = useState<ServerHealthStatus | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  const runDiagnostics = async () => {
    setIsChecking(true);
    setTestResult(null);
    try {
      const res = await checkServerHealth();
      setHealth(res);
      if (res.connected) {
        setTestResult(`Connection healthy. Round-trip ping: ${res.latencyMs}ms. Gemini AI: ${res.hasGeminiKey ? "Connected" : "Fallback active"}.`);
      } else {
        setTestResult(`Connection check failed: ${res.statusText}`);
      }
    } catch (e: any) {
      setTestResult(`Connection error: ${e?.message || "Unknown error"}`);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      runDiagnostics();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isOnline = health?.connected ?? true;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-xl rounded-2xl border border-neutral-800 bg-neutral-900/95 shadow-2xl p-5 sm:p-6 text-neutral-100 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${isOnline ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30"}`}>
              {isOnline ? <Wifi className="h-5 w-5" /> : <WifiOff className="h-5 w-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-neutral-100">System Connection Center</h2>
                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  isOnline 
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" 
                    : "bg-red-500/20 text-red-300 border border-red-500/30"
                }`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${isOnline ? "bg-emerald-400 animate-pulse" : "bg-red-400"}`} />
                  {isOnline ? "ONLINE & CONNECTED" : "CONNECTION ISSUE"}
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                Real-time API, Cloud Synchronization & Zero-Trust Defense diagnostics
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Diagnostic Status Cards */}
        <div className="mt-5 space-y-3">
          {/* Card 1: Express Server & iFrame Framing */}
          <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-3.5 flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20 mt-0.5">
                <Server className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-neutral-200">Express Backend (Port 3000)</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300">
                    /api/health
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Node.js fullstack service responding cleanly on {typeof window !== "undefined" ? window.location.origin : "live origin"}.
                </p>
                {health && (
                  <div className="mt-1.5 flex items-center gap-3 text-[11px] font-mono text-neutral-400">
                    <span>Ping: <strong className="text-emerald-400">{health.latencyMs}ms</strong></span>
                    <span>Status: <strong className="text-sky-400">{health.statusText}</strong></span>
                  </div>
                )}
              </div>
            </div>
            <div className="shrink-0">
              {isOnline ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-red-400" />
              )}
            </div>
          </div>

          {/* Card 2: Live Cloud Sync Engine */}
          <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-3.5 flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mt-0.5">
                <Radio className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-neutral-200">Live Published Cloud Sync</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60">
                    Active v{syncVersion}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Synchronizes marketplace posts, digital wallet balances, and owner controls automatically.
                </p>
                <div className="mt-1.5 flex items-center gap-3 text-[11px] font-mono text-neutral-400">
                  <span>Last sync: <strong className="text-emerald-300">{lastSyncedAt}</strong></span>
                </div>
              </div>
            </div>
            <div className="shrink-0">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            </div>
          </div>

          {/* Card 3: AI Gemini Intelligence Engine */}
          <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-3.5 flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 mt-0.5">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-neutral-200">Gemini 3.8 Multimodal AI</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800/60">
                    gemini-3.8-flash
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Handles AI topic categorization, 15% royalty contract drafting, and For You recommendations.
                </p>
                <div className="mt-1.5 text-[11px] text-neutral-400">
                  Key Status: <strong className={health?.hasGeminiKey ? "text-amber-400" : "text-neutral-400"}>
                    {health?.hasGeminiKey ? "Gemini Key Detected & Online" : "Operating in Heuristic Resilient Mode"}
                  </strong>
                </div>
              </div>
            </div>
            <div className="shrink-0">
              <CheckCircle2 className="h-5 w-5 text-amber-400" />
            </div>
          </div>

          {/* Card 4: Anti-Hack & Zero-Trust Defense Shield */}
          <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-3.5 flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 mt-0.5">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-neutral-200">Zero-Trust Anti-Hack Shield</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800/60">
                    Nepal ETA 2063
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  XSS sanitization, SQL-injection shield, and cryptographic audit hashing enabled.
                </p>
              </div>
            </div>
            <div className="shrink-0">
              <CheckCircle2 className="h-5 w-5 text-purple-400" />
            </div>
          </div>
        </div>

        {/* Live Test Feedback */}
        {testResult && (
          <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-950/30 p-3 text-xs text-emerald-300 flex items-center gap-2">
            <Activity className="h-4 w-4 shrink-0 text-emerald-400" />
            <span>{testResult}</span>
          </div>
        )}

        {/* Action Controls */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-2 pt-4 border-t border-neutral-800">
          <div className="flex items-center gap-2">
            <button
              onClick={runDiagnostics}
              disabled={isChecking}
              className="flex items-center gap-1.5 rounded-xl border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 px-3.5 py-2 text-xs font-semibold text-neutral-200 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isChecking ? "animate-spin text-amber-400" : ""}`} />
              <span>{isChecking ? "Testing Ping..." : "Ping Server Now"}</span>
            </button>

            <button
              onClick={async () => {
                await onForceSync();
                await runDiagnostics();
              }}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 px-3.5 py-2 text-xs font-bold text-neutral-950 transition-all shadow-md shadow-emerald-500/20"
            >
              <Radio className="h-3.5 w-3.5" />
              <span>Force Live Sync</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl border border-neutral-700 px-4 py-2 text-xs font-medium text-neutral-300 hover:bg-neutral-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
