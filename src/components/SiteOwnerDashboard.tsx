import React, { useState } from "react";
import { Idea, UserProfile } from "../types";
import { 
  ShieldAlert, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  DollarSign, 
  FileText, 
  Users, 
  ShieldCheck,
  RefreshCw,
  Crown,
  Award,
  FileCheck
} from "lucide-react";

interface SiteOwnerDashboardProps {
  ideas: Idea[];
  currentUser: UserProfile;
  onRemoveIdea: (ideaId: string, reason: string) => void;
  onRestoreIdea: (ideaId: string) => void;
  onOpenCopyrightModal?: () => void;
  onOpenAdvancedControl?: () => void;
}

export const SiteOwnerDashboard: React.FC<SiteOwnerDashboardProps> = ({
  ideas,
  currentUser,
  onRemoveIdea,
  onRestoreIdea,
  onOpenCopyrightModal,
  onOpenAdvancedControl,
}) => {
  const [filterMode, setFilterMode] = useState<"flagged" | "all">("flagged");
  const [removalReason, setRemovalReason] = useState("Violation of marketplace safety policy regarding prohibited/dangerous items.");

  const flaggedIdeas = ideas.filter(
    (i) => i.safetyAudit?.isDangerous || i.status === "flagged_dangerous" || i.status === "removed_by_admin"
  );

  const displayedIdeas = filterMode === "flagged" ? flaggedIdeas : ideas;

  const totalRoyaltiesPaid = ideas.reduce(
    (sum, i) => sum + (i.marketSales?.commissionEarned || 0),
    0
  );
  const totalMarketSales = ideas.reduce(
    (sum, i) => sum + (i.marketSales?.totalProductSales || 0),
    0
  );
  const totalPlatformCommission = ideas.reduce(
    (sum, i) => sum + (i.marketSales?.platformCommissionEarned || (i.marketSales ? i.marketSales.totalProductSales * 0.03 : 0)),
    0
  );

  return (
    <div className="space-y-6">
      {/* Site Owner Authority Banner */}
      <div className="rounded-2xl border border-red-900/60 bg-gradient-to-r from-red-950/40 via-neutral-900 to-neutral-950 p-6 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-red-600/30 border border-red-500/50 px-2 py-0.5 text-xs font-extrabold text-red-300 uppercase tracking-wider">
                Site Owner Authority
              </span>
              <span className="text-xs text-neutral-400">Trust, Safety & Discovery Revenue</span>
            </div>
            <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-neutral-100 tracking-tight">
              Safety Moderation & Platform Economics
            </h1>
            <p className="mt-1 text-sm text-neutral-300 max-w-2xl leading-relaxed">
              As platform creator, you maintain unilateral moderation authority to remove dangerous ideas, while earning a <strong>3% perpetual commission</strong> for bridging real-world ideas (including non-technical creators) to tech commercializers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onOpenAdvancedControl && (
              <button
                onClick={onOpenAdvancedControl}
                className="flex items-center gap-1.5 rounded-xl border border-sky-500/50 bg-sky-950/60 hover:bg-sky-900/60 px-3 py-1.5 text-xs font-bold text-sky-300 shadow-md shadow-sky-500/20 transition-all"
              >
                <Crown className="h-4 w-4 text-amber-400" />
                <span>Owner Console & Anti-Hack</span>
              </button>
            )}

            {onOpenCopyrightModal && (
              <button
                onClick={onOpenCopyrightModal}
                className="flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-950/40 hover:bg-amber-900/50 px-3 py-1.5 text-xs font-bold text-amber-300 transition-colors"
              >
                <Award className="h-4 w-4" />
                <span>Site Copyright Registry</span>
              </button>
            )}

            <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 px-3 py-1 text-xs font-bold text-emerald-300">
              <ShieldCheck className="h-4 w-4" /> Active Defense Engine
            </span>
          </div>
        </div>

        {/* Global Platform Ledger Stats */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-5 gap-3 pt-4 border-t border-neutral-800">
          <div className="rounded-xl bg-neutral-950/80 p-3.5 border border-neutral-800">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
              Total Market Sales
            </div>
            <div className="text-lg sm:text-xl font-extrabold text-neutral-100 font-mono mt-0.5">
              ${totalMarketSales.toLocaleString()}
            </div>
          </div>

          <div className="rounded-xl bg-neutral-950/80 p-3.5 border border-amber-500/30">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-amber-400">
              Ideators 15% Royalties
            </div>
            <div className="text-lg sm:text-xl font-extrabold text-amber-400 font-mono mt-0.5">
              ${totalRoyaltiesPaid.toLocaleString()}
            </div>
          </div>

          <div className="rounded-xl bg-neutral-950/80 p-3.5 border border-sky-500/30">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-sky-400">
              Platform Creator 3%
            </div>
            <div className="text-lg sm:text-xl font-extrabold text-sky-400 font-mono mt-0.5">
              ${totalPlatformCommission.toLocaleString()}
            </div>
          </div>

          <div className="rounded-xl bg-neutral-950/80 p-3.5 border border-neutral-800">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
              Active Submissions
            </div>
            <div className="text-lg sm:text-xl font-extrabold text-neutral-200 font-mono mt-0.5">
              {ideas.length}
            </div>
          </div>

          <div className="rounded-xl bg-neutral-950/80 p-3.5 border border-red-500/30">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-red-400">
              Flagged for Safety
            </div>
            <div className="text-lg sm:text-xl font-extrabold text-red-400 font-mono mt-0.5">
              {flaggedIdeas.length}
            </div>
          </div>
        </div>
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilterMode("flagged")}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            filterMode === "flagged"
              ? "bg-red-600 text-white shadow-md shadow-red-600/20"
              : "bg-neutral-900 text-neutral-400 hover:text-neutral-200 border border-neutral-800"
          }`}
        >
          Flagged Dangerous Ideas ({flaggedIdeas.length})
        </button>
        <button
          onClick={() => setFilterMode("all")}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            filterMode === "all"
              ? "bg-neutral-800 text-neutral-100 border border-neutral-700"
              : "bg-neutral-900 text-neutral-400 hover:text-neutral-200 border border-neutral-800"
          }`}
        >
          All Platform Submissions ({ideas.length})
        </button>
      </div>

      {/* Ideas Moderation Queue */}
      <div className="space-y-4">
        {displayedIdeas.length === 0 ? (
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-12 text-center text-neutral-400">
            <ShieldCheck className="mx-auto h-10 w-10 text-emerald-400 mb-3" />
            <h3 className="font-bold text-neutral-200 text-lg">Moderation Queue Clean</h3>
            <p className="text-xs text-neutral-500 mt-1">
              No ideas are currently flagged as dangerous or violating marketplace policy.
            </p>
          </div>
        ) : (
          displayedIdeas.map((idea) => {
            const isFlagged = idea.safetyAudit?.isDangerous || idea.status === "flagged_dangerous";
            const isRemoved = idea.status === "removed_by_admin";

            return (
              <div
                key={idea.id}
                className={`rounded-2xl border p-5 sm:p-6 transition-all ${
                  isRemoved
                    ? "border-neutral-800 bg-neutral-950/60 opacity-60"
                    : isFlagged
                    ? "border-red-800/80 bg-red-950/25"
                    : "border-neutral-800 bg-neutral-900/60"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <img
                      src={idea.creator.avatar}
                      alt={idea.creator.name}
                      className="h-10 w-10 rounded-full object-cover ring-1 ring-neutral-700"
                    />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-neutral-100 text-sm">{idea.title}</span>
                        <span className="rounded-md bg-neutral-800 px-2 py-0.5 text-[11px] text-neutral-400">
                          {idea.category}
                        </span>
                        {isRemoved ? (
                          <span className="rounded-md bg-red-900/50 border border-red-700 px-2 py-0.5 text-[10px] font-extrabold text-red-300 uppercase">
                            REMOVED BY OWNER
                          </span>
                        ) : isFlagged ? (
                          <span className="rounded-md bg-red-600/30 border border-red-500/60 px-2 py-0.5 text-[10px] font-extrabold text-red-300 uppercase">
                            HAZARD SCORE: {idea.safetyAudit.dangerScore}/100
                          </span>
                        ) : (
                          <span className="rounded-md bg-emerald-950/50 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                            SAFE (Score: {idea.safetyAudit?.dangerScore || 2}/100)
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-neutral-400 mt-1">
                        Author: <span className="text-neutral-300">{idea.creator.name}</span> ({idea.creator.handle}) • Upfront: ${idea.upfrontPrice} • Royalty: 15%
                      </div>
                    </div>
                  </div>

                  {/* Moderation Actions */}
                  <div className="flex items-center gap-2">
                    {!isRemoved ? (
                      <button
                        onClick={() => onRemoveIdea(idea.id, removalReason)}
                        className="flex items-center gap-1.5 rounded-xl bg-red-600 hover:bg-red-700 px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-red-600/20 active:scale-95 transition-all"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Remove Idea from Platform</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => onRestoreIdea(idea.id)}
                        className="flex items-center gap-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 px-3.5 py-2 text-xs font-semibold text-neutral-200 transition-all"
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                        <span>Restore Idea</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Pitch and Details */}
                <p className="mt-3 text-xs sm:text-sm text-neutral-300 leading-relaxed">
                  {idea.summaryPitch}
                </p>

                {/* Audit notes */}
                {idea.safetyAudit?.dangerReason && (
                  <div className="mt-3 rounded-xl bg-neutral-950 p-3 border border-neutral-800 text-xs text-neutral-300 flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-amber-300">Safety Audit Finding: </span>
                      {idea.safetyAudit.dangerReason}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
