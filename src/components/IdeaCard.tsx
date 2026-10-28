import React, { useState } from "react";
import { Idea, UserProfile, CurrencyCode } from "../types";
import { 
  DollarSign, 
  Sparkles, 
  FileSignature, 
  CheckCircle2, 
  TrendingUp, 
  Briefcase, 
  Heart, 
  Share2, 
  AlertTriangle, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  ShieldAlert, 
  Users, 
  ExternalLink,
  MessageSquare,
  Bot,
  UserCheck,
  ShieldCheck,
  Scale,
  Camera,
  BarChart3
} from "lucide-react";
import { formatPrice, EXCHANGE_RATES } from "../utils/legalAndCurrency";

interface IdeaCardProps {
  idea: Idea;
  currentUser: UserProfile;
  preferredCurrency?: CurrencyCode;
  onOpenContract: (idea: Idea) => void;
  onOpenProduction: (idea: Idea) => void;
  onOpenTasks: (idea: Idea) => void;
  onOpenCopyrightCert?: (idea: Idea) => void;
  onOpenMatchedBuyers?: (idea: Idea) => void;
  onOpenSalesGraph?: (idea: Idea) => void;
  onRemoveIdea?: (ideaId: string, reason: string) => void;
  onToggleLike: (ideaId: string) => void;
  onClaimAiSeed?: (idea: Idea) => void;
  isLiked?: boolean;
}

export const IdeaCard: React.FC<IdeaCardProps> = ({
  idea,
  currentUser,
  preferredCurrency = "USD",
  onOpenContract,
  onOpenProduction,
  onOpenTasks,
  onOpenCopyrightCert,
  onOpenMatchedBuyers,
  onOpenSalesGraph,
  onRemoveIdea,
  onToggleLike,
  onClaimAiSeed,
  isLiked = false,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText?.(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isDangerous = idea.safetyAudit?.isDangerous;
  const isOwner = currentUser.isSiteOwner;
  const isMarketLaunched = idea.status === "market_launched";
  const isInProduction = idea.status === "in_production" || idea.status === "under_contract";
  const isFullBuyout = idea.saleModel === "full_buyout";
  const isFixedTermLicensed = idea.saleModel === "licensed_fixed_term";
  const matchedBuyersCount = idea.matchedBuyers?.length || 3;

  return (
    <article 
      id={`idea-card-${idea.id}`}
      className={`rounded-2xl border transition-all duration-200 ${
        isDangerous
          ? "border-red-900/60 bg-red-950/20"
          : idea.originType === "ai_seed"
          ? "border-violet-800/50 bg-neutral-900/70 hover:border-violet-700/70 hover:bg-neutral-900/90"
          : "border-neutral-800/90 bg-neutral-900/60 hover:border-neutral-700/80 hover:bg-neutral-900/80"
      } p-5 sm:p-6 shadow-lg shadow-black/40`}
    >
      {/* AI Seed Sunsetting Banner */}
      {idea.originType === "ai_seed" && (
        <div className="mb-3.5 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-violet-950/40 border border-violet-800/50 p-2.5 sm:px-3 sm:py-2 text-xs text-violet-200">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-violet-500/20 text-violet-300">
              <Bot className="h-3.5 w-3.5" />
            </div>
            <div>
              <span className="font-bold text-violet-200">
                AI Seed Idea (Posing as AI • Transparent Bot)
              </span>
              <span className="text-[11px] text-violet-400 hidden sm:inline ml-1.5">
                • Sunsets by 20% per real human post
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="rounded-md bg-violet-900/60 border border-violet-700/50 px-2 py-0.5 text-[10px] font-mono font-bold text-violet-300">
              AI Launch Seed #{((idea.aiSeedInfo?.decayIndex ?? 0) + 1)}
            </span>
            <span className="rounded-md bg-neutral-900/80 border border-neutral-800 px-2 py-0.5 text-[10px] text-neutral-400">
              1-to-1 Auto-Removed on Human Post
            </span>
          </div>
        </div>
      )}

      {/* Top Badges Ribbon: Real Human + Copyright Filed Badge + Sale Model */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          {idea.originType === "real_human" && (
            <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-[11px] font-bold text-emerald-300">
              <UserCheck className="h-3.5 w-3.5 text-emerald-400" />
              Verified Human Creator
            </span>
          )}

          {/* Official Copyright Certificate Quick-View Badge */}
          {onOpenCopyrightCert && (
            <button
              onClick={() => onOpenCopyrightCert(idea)}
              className="inline-flex items-center gap-1.5 rounded-md bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-2.5 py-0.5 text-[11px] font-bold text-amber-300 transition-colors"
              title="Click to view official WIPO & Nepal Copyright Act 2059 certificate"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
              <span>Official Copyright Filed</span>
            </button>
          )}

          {/* Matched Buyers Badge */}
          {onOpenMatchedBuyers && (
            <button
              onClick={() => onOpenMatchedBuyers(idea)}
              className="inline-flex items-center gap-1.5 rounded-md bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 px-2.5 py-0.5 text-[11px] font-bold text-sky-300 transition-colors"
            >
              <Users className="h-3.5 w-3.5 text-sky-400" />
              <span>{matchedBuyersCount} Buyers Matched</span>
            </button>
          )}
        </div>

        {/* Commercial Model Tag */}
        <span
          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
            isFullBuyout
              ? "bg-purple-500/15 border-purple-500/30 text-purple-300"
              : isFixedTermLicensed
              ? "bg-sky-500/15 border-sky-500/30 text-sky-300"
              : "bg-amber-500/15 border-amber-500/30 text-amber-300"
          }`}
        >
          {isFullBuyout
            ? "Sell Copyrights (0% Royalty)"
            : isFixedTermLicensed
            ? "3-Yr License • 1.5-Yr Max 15% Royalty Draft"
            : "Keep Copyright + 15% Royalty"}
        </span>
      </div>

      {/* Header: Creator details + Category */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <img
            src={idea.creator.avatar}
            alt={idea.creator.name}
            className="h-11 w-11 rounded-full object-cover ring-2 ring-neutral-800"
          />
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-neutral-100 text-sm sm:text-base">
                {idea.creator.name}
              </span>
              {idea.creator.verified && (
                <CheckCircle2 className="h-4 w-4 text-amber-400 fill-amber-400/20" />
              )}
              <span className="text-xs text-neutral-400">{idea.creator.handle}</span>
              <span className="text-xs text-neutral-600">• {idea.createdAt}</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap mt-0.5">
              <p className="text-xs text-neutral-400 font-medium">{idea.creator.role}</p>
              {idea.creator.country && (
                <span className="text-[11px] text-neutral-500">({idea.creator.country})</span>
              )}
              {idea.creator.isNonTech && (
                <span className="inline-flex items-center rounded-md bg-sky-500/10 border border-sky-500/30 px-1.5 py-0.2 text-[10px] font-semibold text-sky-300">
                  Everyday / Non-Tech Creator
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Category Badge */}
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-neutral-800 border border-neutral-700/80 px-2.5 py-1 text-[11px] font-semibold text-neutral-300">
            {idea.category}
          </span>
          {idea.matchScore && idea.matchScore > 80 && (
            <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[11px] font-bold text-amber-300">
              <Sparkles className="h-3 w-3 text-amber-400" />
              {idea.matchScore}% Match
            </span>
          )}
        </div>
      </div>

      {/* For You Rationale snippet if available */}
      {idea.matchReason && (
        <div className="mt-3 rounded-lg bg-amber-950/30 border border-amber-800/40 px-3 py-1.5 text-xs text-amber-200/90 flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-amber-400 shrink-0" />
          <span>{idea.matchReason}</span>
        </div>
      )}

      {/* Safety Alert Banner if flagged */}
      {isDangerous && (
        <div className="mt-3 flex items-start justify-between rounded-xl bg-red-900/30 border border-red-700/50 p-3 text-xs text-red-200">
          <div className="flex items-start gap-2">
            <ShieldAlert className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-red-300">Trust & Safety Audit Notice: </span>
              {idea.safetyAudit.dangerReason || "Flagged for administrative safety review."}
              <div className="mt-1 text-[11px] text-red-300/80">
                AI Hazard Index: {idea.safetyAudit.dangerScore}/100
              </div>
            </div>
          </div>
          {isOwner && onRemoveIdea && (
            <button
              onClick={() => onRemoveIdea(idea.id, "Violates marketplace public safety and dangerous products policy.")}
              className="ml-2 flex items-center gap-1 rounded-lg bg-red-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-red-700 shrink-0"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Remove Idea
            </button>
          )}
        </div>
      )}

      {/* Title & Core Content (Social Media Post Style) */}
      <div className="mt-3.5">
        <h3 className="text-lg sm:text-xl font-bold text-neutral-50 tracking-tight leading-snug">
          {idea.title}
        </h3>
        <p className="mt-2 text-sm text-neutral-300 leading-relaxed">
          {idea.summaryPitch}
        </p>

        {/* Expandable Concept & Technical Details */}
        {expanded && (
          <div className="mt-4 space-y-3 rounded-xl bg-neutral-950/60 p-4 border border-neutral-800 text-xs sm:text-sm text-neutral-300 animate-in fade-in">
            <div>
              <h4 className="font-semibold text-amber-300 uppercase tracking-wider text-[11px] mb-1">
                Full Concept & Market Proposition
              </h4>
              <p className="leading-relaxed">{idea.description}</p>
            </div>
            <div>
              <h4 className="font-semibold text-amber-300 uppercase tracking-wider text-[11px] mb-1">
                Technical Specifications & Prototyping Blueprint
              </h4>
              <p className="leading-relaxed text-neutral-300">{idea.details}</p>
            </div>
            {idea.productionNotes && idea.productionNotes.length > 0 && (
              <div>
                <h4 className="font-semibold text-emerald-400 uppercase tracking-wider text-[11px] mb-1 flex items-center gap-1.5">
                  <Camera className="h-3.5 w-3.5" />
                  <span>Procedure & Production Proof Ledger</span>
                </h4>
                <ul className="list-disc pl-4 space-y-1 text-neutral-400">
                  {idea.productionNotes.map((note, idx) => (
                    <li key={idx}>{note}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-2.5 flex items-center gap-1 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
        >
          <span>{expanded ? "Show less" : "Read full concept & specs"}</span>
          {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>
      </div>

      {/* Tags */}
      <div className="mt-3.5 flex flex-wrap gap-1.5">
        {idea.tags.map((tag, idx) => (
          <span
            key={idx}
            className="rounded-md bg-neutral-800/70 px-2 py-0.5 text-[11px] font-medium text-neutral-400"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* Commercial Value Box: Model + Multi-Currency Pricing + 3% Vault Wallet Wiring */}
      <div className="mt-4 rounded-xl bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 p-3.5 border border-neutral-800/80">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Sale Model Pill */}
          <div className="flex items-center gap-2.5">
            <div className={`flex h-9 w-9 items-center justify-center rounded-xl font-bold text-xs ${
              isFullBuyout 
                ? "bg-purple-500/20 text-purple-300 border border-purple-500/40" 
                : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
            }`}>
              {isFullBuyout ? "100%" : "15%"}
            </div>
            <div>
              <div className="text-xs font-bold text-neutral-100 flex items-center gap-2 flex-wrap">
                <span>
                  {isFullBuyout
                    ? "Sell Copyrights — 0% Royalty"
                    : isFixedTermLicensed
                    ? "3-Year Licensed Product (1.5-Yr Max 15% Royalty Law Draft)"
                    : "Keep Copyrights + 15% Royalty"}
                </span>
                <span className="text-[10px] font-normal text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
                  <span>3% Discovery Fee on Sale</span>
                </span>
              </div>
              <div className="text-[11px] text-neutral-400">
                {isFullBuyout
                  ? "Buyer owns 100% copyrights • 0% ongoing royalty to ideator"
                  : isFixedTermLicensed
                  ? "3-year product license • Official Law Draft caps 15% royalty strictly at 1.5 years (0% after Month 18)"
                  : "Ideator keeps 100% copyrights and earns 15% royalty on commercialized product sales"}
              </div>
            </div>
          </div>

          {/* Upfront Price in Viewer's Preferred Currency */}
          <div className="text-right">
            <div className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold">
              {isFullBuyout ? "Full Buyout Consideration" : "Upfront Reservation Stake"}
            </div>
            <div className="text-base sm:text-lg font-extrabold text-neutral-100 font-mono">
              {formatPrice(idea.upfrontPrice, preferredCurrency)}
              {preferredCurrency !== "USD" && (
                <span className="text-xs text-neutral-500 ml-1 font-normal">
                  (${idea.upfrontPrice} USD)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* If Market Launched: Real-world Sales & Royalties tally */}
        {isMarketLaunched && idea.marketSales && (
          <div className="mt-3 pt-3 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <TrendingUp className="h-4 w-4" />
              <span>Gross Product Sales: <strong>${idea.marketSales.totalProductSales.toLocaleString()}</strong></span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="rounded-lg bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 text-emerald-300 font-mono text-[11px] font-bold">
                Ideator ({isFullBuyout ? "0%" : "15%"}): +${idea.marketSales.commissionEarned.toLocaleString()}
              </div>
              {idea.marketSales.platformCommissionEarned && (
                <div className="rounded-lg bg-sky-950/40 border border-sky-500/30 px-2 py-0.5 text-sky-300 font-mono text-[11px] font-semibold">
                  Platform (3% Master Wallet): +${idea.marketSales.platformCommissionEarned.toLocaleString()}
                </div>
              )}
            </div>
          </div>
        )}

        {/* If In Production */}
        {isInProduction && !isMarketLaunched && (
          <div className="mt-3 pt-3 border-t border-neutral-800 flex items-center justify-between text-xs text-amber-300/90">
            <div className="flex items-center gap-1.5">
              <Briefcase className="h-4 w-4 text-amber-400" />
              <span>Contract Active: In Co-Production & Fabrication</span>
            </div>
            <span className="font-semibold text-neutral-400">Preparing Market Launch</span>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="mt-4 pt-3.5 border-t border-neutral-800/80 flex flex-wrap items-center justify-between gap-3">
        {/* Social metrics & Quick Tool Links */}
        <div className="flex items-center gap-3 sm:gap-4 text-xs text-neutral-400 flex-wrap">
          <button
            onClick={() => onToggleLike(idea.id)}
            className={`flex items-center gap-1.5 hover:text-red-400 transition-colors ${
              isLiked ? "text-red-400 font-semibold" : ""
            }`}
          >
            <Heart className={`h-4 w-4 ${isLiked ? "fill-red-400 text-red-400" : ""}`} />
            <span>{idea.likes + (isLiked ? 1 : 0)}</span>
          </button>

          {/* Sales & Profit Graph Button */}
          {onOpenSalesGraph && (
            <button
              onClick={() => onOpenSalesGraph(idea)}
              className="flex items-center gap-1 hover:text-emerald-400 transition-colors text-emerald-400/90 font-medium"
              title="Open interactive sales, profit & loss calculator graph"
            >
              <BarChart3 className="h-3.5 w-3.5" />
              <span>Sales Graph</span>
            </button>
          )}

          <button
            onClick={() => onOpenTasks(idea)}
            className="flex items-center gap-1.5 hover:text-amber-400 transition-colors"
          >
            <Briefcase className="h-4 w-4 text-amber-400" />
            <span>{idea.tasks.length} Tasks</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 hover:text-neutral-200 transition-colors"
          >
            <Share2 className="h-4 w-4" />
            <span>{copied ? "Copied!" : "Share"}</span>
          </button>
        </div>

        {/* Main CTA buttons */}
        <div className="flex items-center gap-2 flex-wrap justify-end">
          {/* Matched Buyers Button */}
          {onOpenMatchedBuyers && (
            <button
              onClick={() => onOpenMatchedBuyers(idea)}
              className="flex items-center gap-1.5 rounded-xl border border-neutral-700 bg-neutral-900 hover:bg-neutral-800 px-3 py-2 text-xs font-semibold text-neutral-200 transition-colors"
            >
              <Users className="h-3.5 w-3.5 text-sky-400" />
              <span>Matches ({matchedBuyersCount})</span>
            </button>
          )}

          {/* If already under contract / production: Open Production Room */}
          {(isInProduction || isMarketLaunched) ? (
            <button
              id={`btn-production-${idea.id}`}
              onClick={() => onOpenProduction(idea)}
              className="flex items-center gap-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 px-3.5 py-2 text-xs font-semibold text-neutral-100 border border-neutral-700 transition-all"
            >
              <Briefcase className="h-3.5 w-3.5 text-amber-400" />
              <span>Production Room & Sales</span>
            </button>
          ) : (
            /* If available: Buy / Sign Contract (Full Buyout or 15% Royalty) */
            <button
              id={`btn-acquire-${idea.id}`}
              disabled={isDangerous}
              onClick={() => onOpenContract(idea)}
              className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all shadow-md active:scale-95 ${
                isDangerous
                  ? "bg-neutral-800 text-neutral-500 cursor-not-allowed"
                  : isFullBuyout
                  ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:from-purple-400 hover:to-indigo-500 shadow-purple-500/20"
                  : "bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 hover:from-amber-400 hover:to-amber-500 shadow-amber-500/20"
              }`}
            >
              <FileSignature className="h-3.5 w-3.5" />
              <span>{isFullBuyout ? "Acquire 100% Full Buyout" : "Acquire & Sign 15% Deal"}</span>
            </button>
          )}

          {/* Owner Moderation Action if needed */}
          {isOwner && onRemoveIdea && !isDangerous && (
            <button
              onClick={() => onRemoveIdea(idea.id, "Site owner policy audit removal.")}
              className="p-2 rounded-xl text-neutral-500 hover:text-red-400 hover:bg-red-950/40 border border-transparent hover:border-red-800/40 transition-colors"
              title="Site Owner: Remove this idea"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </article>
  );
};
