import React, { useState } from "react";
import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  X, 
  Scale, 
  ShieldCheck, 
  FileWarning, 
  ExternalLink,
  Lock,
  Eye,
  RefreshCw
} from "lucide-react";
import { ScamFraudAlert } from "../types";

interface ScamFraudAlertBannerProps {
  alerts: ScamFraudAlert[];
  onDismissAlert?: (id: string) => void;
  onOpenLegalCrossCheck: () => void;
  onSimulateScamAttempt: () => void;
}

export const ScamFraudAlertBanner: React.FC<ScamFraudAlertBannerProps> = ({
  alerts,
  onDismissAlert,
  onOpenLegalCrossCheck,
  onSimulateScamAttempt,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const activeAlerts = alerts.filter((a) => !a.isResolved);
  const hasCritical = activeAlerts.some((a) => a.threatLevel === "critical");
  const latestAlert = activeAlerts[0];

  return (
    <div className="w-full">
      {/* Real-time Alert Notification if Scam Attempted */}
      {latestAlert && (
        <div 
          id="alert-scam-fraud-active"
          className={`rounded-2xl border p-4 mb-4 shadow-xl transition-all animate-in slide-in-from-top duration-300 ${
            latestAlert.threatLevel === "critical"
              ? "border-red-500/60 bg-gradient-to-r from-red-950/80 via-neutral-900 to-red-950/80 text-red-200"
              : "border-amber-500/60 bg-gradient-to-r from-amber-950/80 via-neutral-900 to-amber-950/80 text-amber-200"
          }`}
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div 
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
                  latestAlert.threatLevel === "critical"
                    ? "bg-red-500/20 border-red-500/40 text-red-400 animate-pulse"
                    : "bg-amber-500/20 border-amber-500/40 text-amber-400"
                }`}
              >
                <ShieldAlert className="h-5 w-5" />
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="rounded-full bg-red-500/20 border border-red-500/40 px-2 py-0.5 text-[10px] font-bold text-red-300 uppercase tracking-wide">
                    REAL-TIME SCAM ALERT: ATTEMPT BLOCKED
                  </span>
                  <span className="text-[11px] text-neutral-400">
                    Timestamp: {latestAlert.timestamp}
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-neutral-100 mt-1">
                  {latestAlert.title}
                </h3>

                <p className="text-xs text-neutral-300 mt-0.5 max-w-3xl leading-relaxed">
                  {latestAlert.description}
                </p>

                {/* Statutes Violated */}
                <div className="mt-2 flex items-center gap-1.5 flex-wrap text-[11px]">
                  <span className="font-semibold text-neutral-400">Statutory Cross-Check:</span>
                  {latestAlert.violatedStatutes.map((statute, i) => (
                    <span 
                      key={i}
                      className="rounded bg-neutral-950/80 border border-red-500/30 px-2 py-0.5 text-[10px] font-mono text-red-300"
                    >
                      {statute}
                    </span>
                  ))}
                </div>

                <div className="mt-2 text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Protective Action: {latestAlert.actionTaken}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onOpenLegalCrossCheck}
                className="flex items-center gap-1 rounded-xl bg-neutral-900 border border-neutral-700 px-3 py-1.5 text-xs font-semibold text-neutral-200 hover:bg-neutral-800 transition-colors"
              >
                <Scale className="h-3.5 w-3.5 text-amber-400" />
                <span>View Legal Laws</span>
              </button>

              {onDismissAlert && (
                <button
                  type="button"
                  onClick={() => onDismissAlert(latestAlert.id)}
                  className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200"
                  title="Dismiss alert"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Persistent Legal Cross-Check & Fraud-Free Monitor Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-neutral-800/90 bg-neutral-900/60 backdrop-blur-sm px-4 py-2.5 text-xs text-neutral-300">
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shrink-0">
            <ShieldCheck className="h-3.5 w-3.5" />
          </div>
          <div>
            <span className="font-bold text-neutral-100 mr-2">
              Fraud-Free Platform Guarantee:
            </span>
            <span className="text-[11px] text-neutral-400">
              Cross-checked against <strong>Nepal Penal Code 2074 (Section 249)</strong>, 
              <strong> ETA 2063</strong>, and <strong>UNCITRAL Model Law on E-Commerce</strong>.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onSimulateScamAttempt}
            className="flex items-center gap-1 rounded-lg border border-red-500/30 bg-red-950/20 hover:bg-red-950/50 px-2.5 py-1 text-[11px] font-semibold text-red-300 transition-colors"
            title="Simulate a scam/fraud detection alert to verify active enforcement"
          >
            <AlertTriangle className="h-3 w-3 text-red-400" />
            <span>Test Scam Detection</span>
          </button>

          <button
            type="button"
            onClick={onOpenLegalCrossCheck}
            className="flex items-center gap-1 rounded-lg border border-amber-500/30 bg-amber-950/20 hover:bg-amber-950/50 px-2.5 py-1 text-[11px] font-semibold text-amber-300 transition-colors"
          >
            <Scale className="h-3 w-3 text-amber-400" />
            <span>Legal Cross-Check Matrix</span>
          </button>
        </div>
      </div>
    </div>
  );
};
